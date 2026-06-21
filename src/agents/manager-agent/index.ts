import { GoogleGenerativeAI } from '@google/generative-ai';
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
  private genAI: GoogleGenerativeAI | null = null;
  private engine = new WorkflowEngine();

  constructor(private forceMock = false) {
    const key = env.GEMINI_API_KEY;
    if (!this.forceMock && key && key !== 'mock-gemini-key') {
      this.genAI = new GoogleGenerativeAI(key);
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

    try {
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

      // Collect observability trace
      const report = generateObservabilityReport(updatedContext);
      logger.info(`Workflow complete. Traces: ${JSON.stringify(report.timelineSummary)}`);

      return {
        workflowId: context.workflowId,
        agentsInvoked: report.agentsInvoked,
        executionTime: duration,
        status: 'completed',
        results: {
          ...updatedContext.sharedMemory,
          summary: synthesis.summary,
        },
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
}
export default ManagerAgent;
