import { AIPlatformGenerativeAI } from '../platform/wrapper';
import { env } from '../../lib/env';
import {
  AgentContext,
  WorkflowPlan,
  WorkflowStep,
  FinalWorkflowResult,
  AgentCapability,
} from '../types';
import { WorkflowEngine } from '../engine';
import { createAgentContext, logTimelineEvent } from '../context';
import { generateObservabilityReport } from '../observability';
import { logger } from '../../utils/logger';
import { ContextRouter } from '../memory/context-router';
import { KnowledgeGraphManager } from '../memory/knowledge-graph';
import { SharedMemoryModel, AgentMemory } from '../memory/types';
import {
  agentMemoryRepository,
  workflowsRepository,
  workflowStepsRepository,
  usersRepository,
} from '../../lib/repositories';
import { AuditActor } from '../../lib/audit-trail';


const PLANNING_SYSTEM_PROMPT = `
You are the Manager Agent for a B2B Sales multi-agent system.
Your job is to parse the user's sales goal and decompose it into a workflow plan.
You have the following registered agent capabilities:
- 'research': Gather company intelligence.
- 'opportunity-analysis': Analyze pain points. Requires 'research' outputs.
- 'outreach': Generate personalized messages. Requires 'opportunity-analysis' outputs.
- 'crm': Log details, sync updates, schedule tasks. Can run after other steps.
- 'proposal': Draft custom proposal documents. Requires 'opportunity-analysis' outputs.

Decompose the request into steps with unique IDs. Use the 'dependsOn' array to specify sequential order. If steps do not depend on each other, omit the dependsOn or leave it empty so they execute in parallel.

Respond ONLY with a JSON object of this structure:
{
  "intent": "A short summary of the detected user intent",
  "steps": [
    {
      "id": "step_id",
      "agentCapability": "research" | "opportunity-analysis" | "outreach" | "crm" | "proposal",
      "dependsOn": ["dependent_step_id"]
    }
  ]
}
`;

const SYNTHESIS_SYSTEM_PROMPT = `
You are the Manager Agent. You have successfully executed a B2B Sales workflow.
Review the user goal and the outputs of the specialist agents from the shared memory.
Create a final structured response containing a summary of the accomplishments and recommendations.

Respond ONLY with a JSON object of this structure:
{
  "summary": "Cohesive client-facing summary of findings, outreaches, and/or proposals generated",
  "recommendations": ["Recommended next step 1", "Recommended next step 2"]
}
`;

export class ManagerAgent {
  private genAI: any = null;
  private engine = new WorkflowEngine();

  constructor(private forceMock = false) {
    const key = env.GEMINI_API_KEY;
    if (!this.forceMock && key && key !== 'mock-gemini-key') {
      this.genAI = new AIPlatformGenerativeAI(key) as any;
    } else {
      logger.info(
        'Manager Agent initialized in Mock mode (either forced or missing Gemini API key).',
      );
    }
  }

  /**
   * Orchestrates the multi-agent execution pipeline.
   */
  public async orchestrate(userId: string, userGoal: string): Promise<FinalWorkflowResult> {
    const context = createAgentContext(userId, userGoal);
    const startTimestamp = Date.now();

    let organizationId = 'org_default';
    const actor: AuditActor = {
      uid: userId,
      email: userId === 'user_123' || userId.includes('user') ? `${userId}@example.com` : userId,
      role: 'Sales Rep',
    };

    try {
      const userDoc = await usersRepository.get(userId);
      if (userDoc) {
        if (userDoc.organizationId) organizationId = userDoc.organizationId;
        if (userDoc.email) actor.email = userDoc.email;
        if (userDoc.role) actor.role = userDoc.role;
      }
    } catch (err) {
      // Fallback if not configured
    }

    try {
      // 0. Extract target company name and query Context Router for pre-execution memory loading
      const companyName = this.extractCompanyName(userGoal);
      const contextRouter = new ContextRouter(this.genAI);
      
      logTimelineEvent(context, 'workflow_start', `Routing prior memory for "${companyName}"...`);
      const priorMemory = await contextRouter.routeContext(userId, userGoal, companyName);
      
      // Seed context.sharedMemory with retrieved context
      if (priorMemory.research) context.sharedMemory.research = priorMemory.research;
      if (priorMemory.opportunityAnalysis) context.sharedMemory.opportunityAnalysis = priorMemory.opportunityAnalysis;
      if (priorMemory.outreach) context.sharedMemory.outreach = priorMemory.outreach;
      if (priorMemory.crm) context.sharedMemory.crm = priorMemory.crm;
      if (priorMemory.proposal) context.sharedMemory.proposal = priorMemory.proposal;
      if (priorMemory.memoryReferences) context.sharedMemory.memoryReferences = priorMemory.memoryReferences;

      // 1. Generate Workflow Plan
      logTimelineEvent(context, 'workflow_start', 'Decomposing user goal into execution plan...');
      const plan = await this.generatePlan(userGoal);

      // 2. Execute Workflow Engine
      const updatedContext = await this.engine.execute(context, plan);

      if (updatedContext.status === 'failed') {
        throw new Error('Workflow execution failed during specialist agent runs.');
      }

      // 3. Synthesize Final Outcome
      logTimelineEvent(context, 'workflow_start', 'Synthesizing final outputs...');
      const synthesis = await this.synthesizeOutputs(userGoal, updatedContext.sharedMemory);

      const duration = Date.now() - startTimestamp;
      logTimelineEvent(
        context,
        'workflow_end',
        'Workflow completed successfully.',
        undefined,
        duration,
      );

      // 4. Context Router post-execution storage (Save completed run context)
      const finalSharedMemory: SharedMemoryModel = {
        workflowId: context.workflowId,
        userGoal,
        companyName,
        research: updatedContext.sharedMemory.research as any,
        opportunityAnalysis: updatedContext.sharedMemory.opportunityAnalysis as any,
        outreach: updatedContext.sharedMemory.outreach as any,
        crm: updatedContext.sharedMemory.crm as any,
        proposal: updatedContext.sharedMemory.proposal as any,
        memoryReferences: updatedContext.sharedMemory.memoryReferences as any,
      };

      await contextRouter.saveWorkflowRun(
        context.workflowId,
        userId,
        userGoal,
        finalSharedMemory
      );

      // 5. Update Knowledge Graph
      await this.updateKnowledgeGraph(updatedContext, companyName);

      // 6. Update Agent Memories performance and metrics
      await this.updateAgentMemories(updatedContext, companyName);

      // Collect observability trace
      const report = generateObservabilityReport(updatedContext);
      logger.info(`Workflow complete. Traces: ${JSON.stringify(report.timelineSummary)}`);

      const finalOutputs = {
        ...updatedContext.sharedMemory,
        summary: synthesis.summary,
      };

      // 7. Persist completed state to Firestore
      await this.persistWorkflowRunState(
        updatedContext,
        organizationId,
        actor,
        duration,
        'completed',
        finalOutputs,
      );

      return {
        workflowId: context.workflowId,
        agentsInvoked: report.agentsInvoked,
        executionTime: duration,
        status: 'completed',
        results: finalOutputs,
        recommendations: synthesis.recommendations,
      };
    } catch (error) {
      const duration = Date.now() - startTimestamp;
      const errorMsg = error instanceof Error ? error.message : String(error);
      logTimelineEvent(
        context,
        'workflow_end',
        `Workflow execution failed: ${errorMsg}`,
        undefined,
        duration,
      );

      // Persist failed state to Firestore
      await this.persistWorkflowRunState(
        context,
        organizationId,
        actor,
        duration,
        'failed',
        { error: errorMsg },
        errorMsg,
      );

      return {
        workflowId: context.workflowId,
        agentsInvoked: context.executionHistory.map((h) => h.agentName),
        executionTime: duration,
        status: 'failed',
        results: {
          error: errorMsg,
        },
        recommendations: [
          'Check system integrations and logs.',
          'Retry workflow with structured goal parameters.',
        ],
      };
    }
  }

  /**
   * Persists the workflow context and individual executed step traces to Firestore.
   */
  private async persistWorkflowRunState(
    context: AgentContext,
    organizationId: string,
    actor: AuditActor,
    durationMs: number,
    status: 'completed' | 'failed',
    outputs: Record<string, any>,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const agentsExecuted = Array.from(new Set(context.executionHistory.map((h) => h.agentName)));
      
      await workflowsRepository.create(
        context.workflowId,
        {
          workflowId: context.workflowId,
          userId: context.userId,
          organizationId,
          goal: context.userGoal,
          status,
          createdAt: context.createdAt,
          updatedAt: new Date().toISOString(),
          agentsExecuted,
          executionTimeline: context.timeline,
          outputs,
          metadata: {
            durationMs,
            totalHistoryCount: context.executionHistory.length,
            error: errorMessage || null,
          },
        },
        actor,
        `Workflow run completed with status: ${status}`,
      );

      for (const trace of context.executionHistory) {
        const stepId = `${context.workflowId}_${trace.agentName}`;
        await workflowStepsRepository.create(
          stepId,
          {
            workflowId: context.workflowId,
            agentName: trace.agentName,
            status: trace.status,
            startTime: trace.startTime,
            endTime: trace.endTime,
            durationMs: trace.durationMs,
            input: trace.input,
            output: trace.output || null,
            error: trace.error || null,
            createdAt: trace.startTime,
            updatedAt: trace.endTime,
            organizationId,
          }
        );
      }
    } catch (err) {
      logger.error('Failed to persist workflow execution details to Firestore', err);
    }
  }


  /**
   * Generates a workflow plan dynamically using Gemini.
   */
  public async generatePlan(userGoal: string): Promise<WorkflowPlan> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `User Goal: "${userGoal}"\n\nDecompose this goal according to system parameters.`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: PLANNING_SYSTEM_PROMPT,
        });

        const text = result.response.text();
        const responseJson = JSON.parse(text);

        return this.mapJsonToWorkflowPlan(userGoal, responseJson);
      } catch (error) {
        logger.error('Gemini planning failed. Falling back to rule-based planner.', error);
      }
    }

    return this.fallbackPlan(userGoal);
  }

  /**
   * Synthesizes agent outputs using Gemini.
   */
  private async synthesizeOutputs(
    userGoal: string,
    memory: Record<string, unknown>,
  ): Promise<{ summary: string; recommendations: string[] }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `User Goal: "${userGoal}"\nShared Memory: ${JSON.stringify(memory)}`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: SYNTHESIS_SYSTEM_PROMPT,
        });

        const text = result.response.text();
        return JSON.parse(text);
      } catch (error) {
        logger.error('Gemini synthesis failed. Falling back to standard synthesis.', error);
      }
    }

    return this.fallbackSynthesis(userGoal, memory);
  }

  /**
   * Map LLM JSON output to typed WorkflowPlan.
   */
  private mapJsonToWorkflowPlan(
    goal: string,
    rawJson: { steps?: Array<{ id: string; agentCapability: string; dependsOn?: string[] }> },
  ): WorkflowPlan {
    const steps: WorkflowStep[] = (rawJson.steps || []).map((step) => {
      const capability = step.agentCapability as AgentCapability;
      return {
        id: step.id,
        agentCapability: capability,
        dependsOn: step.dependsOn,
        inputMapping: (ctx: AgentContext) => this.getInputMappingForCapability(capability, ctx),
      };
    });

    return {
      goal,
      steps,
    };
  }

  /**
   * Fallback rule-based planner for unit testing and offline development.
   */
  private fallbackPlan(goal: string): WorkflowPlan {
    const query = goal.toLowerCase();
    const steps: WorkflowStep[] = [];

    // All paths require research
    steps.push({
      id: 'step_research',
      agentCapability: 'research',
      inputMapping: (ctx) => ({
        websiteUrl: this.extractWebsite(ctx.userGoal) || 'prospect.com',
      }),
    });

    const needsOpportunity =
      query.includes('opportunities') ||
      query.includes('opportunity') ||
      query.includes('analysis') ||
      query.includes('analyze') ||
      query.includes('strategy') ||
      query.includes('market');

    if (needsOpportunity && !steps.some((s) => s.id === 'step_opportunity')) {
      steps.push({
        id: 'step_opportunity',
        agentCapability: 'opportunity-analysis',
        dependsOn: ['step_research'],
        inputMapping: (ctx) => ({
          researchData: ctx.sharedMemory.research,
        }),
      });
    }

    if (
      query.includes('outreach') ||
      query.includes('campaign') ||
      query.includes('email') ||
      query.includes('messaging') ||
      query.includes('engagement')
    ) {
      if (!steps.some((s) => s.id === 'step_opportunity')) {
        steps.push({
          id: 'step_opportunity',
          agentCapability: 'opportunity-analysis',
          dependsOn: ['step_research'],
          inputMapping: (ctx) => ({
            researchData: ctx.sharedMemory.research,
          }),
        });
      }

      steps.push({
        id: 'step_outreach',
        agentCapability: 'outreach',
        dependsOn: ['step_opportunity'],
        inputMapping: (ctx) => ({
          research: ctx.sharedMemory.research,
          opportunityAnalysis: ctx.sharedMemory.opportunityAnalysis,
        }),
      });
    }

    const needsProposal = query.includes('proposal') || query.includes('quote') || query.includes('pricing');

    // Always append CRM update
    const crmDepends = [];
    if (steps.some((s) => s.id === 'step_outreach')) {
      crmDepends.push('step_outreach');
    } else if (steps.some((s) => s.id === 'step_opportunity')) {
      crmDepends.push('step_opportunity');
    } else {
      crmDepends.push('step_research');
    }

    steps.push({
      id: 'step_crm',
      agentCapability: 'crm',
      dependsOn: crmDepends,
      inputMapping: (ctx) => {
        const goal = ctx.userGoal.toLowerCase();
        let action = 'LOG_WORKFLOW_RUN';
        if (goal.includes('create lead')) action = 'CREATE_LEAD';
        else if (goal.includes('summarize meeting')) action = 'SUMMARIZE_MEETING';
        else if (goal.includes('pipeline analysis') || goal.includes('analyze pipeline')) action = 'ANALYZE_PIPELINE';
        return {
          action,
          summary: `Workflow completed. Goal: ${ctx.userGoal}`,
        };
      },
    });

    if (needsProposal) {
      // Ensure opportunity runs if not already added
      if (!steps.some((s) => s.id === 'step_opportunity')) {
        steps.push({
          id: 'step_opportunity',
          agentCapability: 'opportunity-analysis',
          dependsOn: ['step_research'],
          inputMapping: (ctx) => ({
            researchData: ctx.sharedMemory.research,
          }),
        });
      }

      steps.push({
        id: 'step_proposal',
        agentCapability: 'proposal',
        dependsOn: ['step_crm'],
        inputMapping: (ctx) => ({
          research: ctx.sharedMemory.research,
          opportunityAnalysis: ctx.sharedMemory.opportunityAnalysis,
          crm: ctx.sharedMemory.crm,
        }),
      });
    }

    return {
      goal,
      steps,
    };
  }

  private fallbackSynthesis(goal: string, memory: Record<string, unknown>) {
    const research = memory.research as Record<string, unknown> | undefined;
    const company = (research?.companyName as string) || 'Target Company';
    return {
      summary: `Successfully completed analysis for ${company}. Researched company profile, mapped pain points, and drafted campaign outreach assets.`,
      recommendations: [
        'Review the personalized email sequence drafts in the outreach hub.',
        'Schedule an introduction call and present the customized proposal document.',
      ],
    };
  }

  private getInputMappingForCapability(
    capability: AgentCapability,
    ctx: AgentContext,
  ): Record<string, unknown> {
    switch (capability) {
      case 'research':
        return { websiteUrl: this.extractWebsite(ctx.userGoal) || 'prospect.com' };
      case 'opportunity-analysis':
        return { researchData: ctx.sharedMemory.research };
      case 'outreach':
        return {
          research: ctx.sharedMemory.research,
          opportunityAnalysis: ctx.sharedMemory.opportunityAnalysis,
        };
      case 'proposal':
        return {
          research: ctx.sharedMemory.research,
          opportunityAnalysis: ctx.sharedMemory.opportunityAnalysis,
          crm: ctx.sharedMemory.crm,
        };
      case 'crm':
        return {
          action: 'LOG_WORKFLOW_RUN',
          sharedMemory: ctx.sharedMemory,
        };
      default:
        return {};
    }
  }

  private extractWebsite(text: string): string | null {
    const match = text.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    return match ? match[1] : null;
  }

  private extractCompanyName(text: string): string {
    const query = text.toLowerCase();
    if (query.includes('stripe')) return 'Stripe';
    if (query.includes('hubspot')) return 'HubSpot';
    if (query.includes('salesforce')) return 'Salesforce';
    
    // Parse from URL if present
    const website = this.extractWebsite(text);
    if (website) {
      const parts = website.split('.');
      if (parts.length > 0 && parts[0] !== 'www') {
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    }
    
    // Fallback: extract first capitalized word, or return a sensible name
    const words = text.match(/[A-Z][a-zA-Z]*/g);
    if (words && words.length > 0) {
      const stopWords = ['I', 'B2B', 'CRM', 'SaaS', 'AI', 'Sales', 'Research', 'Analyze'];
      const filtered = words.filter(w => !stopWords.includes(w));
      if (filtered.length > 0) return filtered[0];
    }
    
    // Fallback: strip standard prompts like "Research ", "Analyze "
    let clean = text.replace(/^(research|analyze|find|get info on|about)\s+/i, '');
    clean = clean.split(/\s+/)[0]; // get first word
    if (clean) {
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    
    return 'Prospect';
  }

  private async updateKnowledgeGraph(context: AgentContext, companyName: string): Promise<void> {
    const nodes: any[] = [
      { id: companyName.toLowerCase(), label: companyName, type: 'company' }
    ];
    const edges: any[] = [];

    const research = context.sharedMemory.research as any;
    if (research) {
      // Industry
      if (research.industry && research.industry.classification) {
        const indId = research.industry.classification.toLowerCase().replace(/\s+/g, '_');
        nodes.push({ id: indId, label: research.industry.classification, type: 'industry' });
        edges.push({ source: companyName.toLowerCase(), target: indId, relationship: 'belongs_to' });
      }

      // Competitors
      if (Array.isArray(research.competitors)) {
        research.competitors.forEach((c: any) => {
          if (c && c.name) {
            const compId = c.name.toLowerCase().replace(/\s+/g, '_');
            nodes.push({ id: compId, label: c.name, type: 'competitor' });
            edges.push({ source: companyName.toLowerCase(), target: compId, relationship: 'competes_with' });
          }
        });
      }

      // Risks/Pain Points
      if (Array.isArray(research.risks)) {
        research.risks.forEach((r: any) => {
          if (r && r.title) {
            const painId = r.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
            nodes.push({ id: painId, label: r.title, type: 'pain-point' });
            edges.push({ source: companyName.toLowerCase(), target: painId, relationship: 'experiences_pain' });
          }
        });
      }

      // Opportunities
      if (Array.isArray(research.opportunities)) {
        research.opportunities.forEach((o: any) => {
          if (o && o.title) {
            const oppId = o.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
            nodes.push({ id: oppId, label: o.title, type: 'opportunity' });
            edges.push({ source: companyName.toLowerCase(), target: oppId, relationship: 'has_opportunity' });
          }
        });
      }
    }

    try {
      const graphManager = KnowledgeGraphManager.getInstance();
      await graphManager.updateGraph(nodes, edges);
      logger.info(`Knowledge graph successfully updated for company: ${companyName}`);
    } catch (err) {
      logger.error('Failed to update knowledge graph post-execution', err);
    }
  }

  private async updateAgentMemories(context: AgentContext, companyName: string): Promise<void> {
    for (const trace of context.executionHistory) {
      try {
        const existingList = await agentMemoryRepository.list([
          { field: 'agentName', operator: '==' as const, value: trace.agentName }
        ]);

        const timestamp = new Date().toISOString();
        let record: AgentMemory;

        let competitors: string[] = [];
        if (trace.agentName === 'ResearchAgent' && trace.output && Array.isArray(trace.output.competitors)) {
          competitors = trace.output.competitors
            .map((c: any) => c.name)
            .filter((name: any) => typeof name === 'string');
        }

        if (existingList.length > 0) {
          const existing = existingList[0];
          const newCount = existing.executionsCount + 1;
          const prevLatency = existing.performanceMetrics.averageLatencyMs;
          const newLatency = (prevLatency * existing.executionsCount + trace.durationMs) / newCount;
          
          const prevSuccesses = existing.performanceMetrics.successRate * existing.executionsCount;
          const currentSuccess = trace.status === 'success' ? 1 : 0;
          const newSuccessRate = (prevSuccesses + currentSuccess) / newCount;

          const companiesSet = new Set(existing.analyzedCompanies);
          companiesSet.add(companyName);
          const competitorsSet = new Set(existing.discoveredCompetitors);
          competitors.forEach(c => competitorsSet.add(c));

          record = {
            id: existing.id,
            agentName: trace.agentName,
            executionsCount: newCount,
            analyzedCompanies: Array.from(companiesSet),
            discoveredCompetitors: Array.from(competitorsSet),
            performanceMetrics: {
              averageLatencyMs: Math.round(newLatency),
              successRate: Math.round(newSuccessRate * 100) / 100,
              lastExecutedAt: timestamp,
            },
            updatedAt: timestamp,
          };

          if (record.id) {
            await agentMemoryRepository.update(record.id, {
              executionsCount: record.executionsCount,
              analyzedCompanies: record.analyzedCompanies,
              discoveredCompetitors: record.discoveredCompetitors,
              performanceMetrics: record.performanceMetrics,
            });
          }
        } else {
          record = {
            agentName: trace.agentName,
            executionsCount: 1,
            analyzedCompanies: [companyName],
            discoveredCompetitors: competitors,
            performanceMetrics: {
              averageLatencyMs: trace.durationMs,
              successRate: trace.status === 'success' ? 1 : 0,
              lastExecutedAt: timestamp,
            },
            createdAt: timestamp,
            updatedAt: timestamp,
          };
          await agentMemoryRepository.add(record);
        }
      } catch (err) {
        logger.error(`Failed to update agent memory for "${trace.agentName}":`, err);
      }
    }
  }
}
export default ManagerAgent;
