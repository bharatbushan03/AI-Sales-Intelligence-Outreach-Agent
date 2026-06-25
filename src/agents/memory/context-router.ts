import { GoogleGenerativeAI } from '@google/generative-ai';
import { SharedMemoryModel, WorkflowMemory, CompanyMemory } from './types';
import { MemoryRetrievalEngine } from './retrieval-engine';
import { CONTEXT_SUMMARIZATION_PROMPT } from '../prompts/memory-prompts';
import { workflowMemoryRepository, companyMemoryRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class ContextRouter {
  private retrievalEngine: MemoryRetrievalEngine;

  constructor(private genAI: GoogleGenerativeAI | null) {
    this.retrievalEngine = new MemoryRetrievalEngine(this.genAI);
  }

  /**
   * Evaluates current goals and coordinates retrieval of the most relevant context blocks.
   */
  public async routeContext(
    userId: string,
    userGoal: string,
    companyName: string,
  ): Promise<SharedMemoryModel> {
    logger.info(`ContextRouter routing memory blocks for target "${companyName}"`);

    // 1. Fetch Company memory if it exists
    let companyContext: CompanyMemory | undefined;
    try {
      const companyRecords = await companyMemoryRepository.list([
        { field: 'companyName', operator: '==' as const, value: companyName },
      ]);
      if (companyRecords.length > 0) {
        companyContext = companyRecords[0];
        logger.info(`ContextRouter retrieved company profile memory for "${companyName}"`);
      }
    } catch (err) {
      logger.error('Failed to load company memory from Firestore', err);
    }

    // 2. Fetch history workflows of this user
    let priorOutputs: Record<string, unknown> = {};
    try {
      const priorWorkflows = await workflowMemoryRepository.list([
        { field: 'userId', operator: '==' as const, value: userId },
      ]);

      if (priorWorkflows.length > 0) {
        // Rank and fetch most relevant memories matching current goal
        const rankedWorkflows = await this.retrievalEngine.retrieve(userGoal, priorWorkflows, 3);

        if (rankedWorkflows.length > 0) {
          logger.info(
            `ContextRouter found ${rankedWorkflows.length} relevant historical workflows`,
          );

          if (this.genAI) {
            // Compress prior workflows into concise context block using Gemini
            const textToCompress = rankedWorkflows
              .map((w) => `Goal: ${w.userGoal}, Results: ${JSON.stringify(w.agentOutputs)}`)
              .join('\n\n');

            priorOutputs = await this.compressHistory(textToCompress);
          } else {
            // Heuristic fallback compression
            priorOutputs = {
              historicalSummary: `Previously analyzed goals matching keywords. Discovered details: ${rankedWorkflows
                .map((w) => w.userGoal)
                .join(', ')}`,
              historicalFriction: 'Common scaling bottlenecks tracked across CRM sub-ledgers.',
            };
          }
        }
      }
    } catch (err) {
      logger.error('Failed to load workflow memory history', err);
    }

    // 3. Compile sharedcontext package
    return {
      workflowId: `wf_${Math.random().toString(36).substring(2, 9)}`,
      userGoal,
      companyName,
      research: (companyContext?.profile || undefined) as any,
      opportunityAnalysis: (companyContext?.opportunities?.[0] || undefined) as any,
      outreach: (companyContext?.outreachPlans?.[0] || undefined) as any,
      crm: (companyContext?.crmData || undefined) as any,
      proposal: (companyContext?.proposals?.[0] || undefined) as any,
      memoryReferences: {
        companyMemoryId: companyContext?.id,
        priorWorkflowIds: [],
      },
    };
  }

  /**
   * Persists workflow execution records inside Firestore.
   */
  public async saveWorkflowRun(
    workflowId: string,
    userId: string,
    userGoal: string,
    memory: SharedMemoryModel,
  ): Promise<void> {
    const timestamp = new Date().toISOString();

    const workflowRecord: WorkflowMemory = {
      workflowId,
      userId,
      userGoal,
      agentOutputs: {
        research: memory.research || null,
        opportunity: memory.opportunityAnalysis || null,
        outreach: memory.outreach || null,
        crm: memory.crm || null,
        proposal: memory.proposal || null,
      },
      intermediateResults: {},
      status: 'completed',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      // 1. Save workflow memory
      await workflowMemoryRepository.add(workflowRecord);

      // 2. Save or update company memory
      if (memory.companyName) {
        const companyName = memory.companyName;
        const companyRecords = await companyMemoryRepository.list([
          { field: 'companyName', operator: '==' as const, value: companyName },
        ]);

        const companyRecord: CompanyMemory = {
          companyName,
          domain: companyName.toLowerCase().replace(/\s+/g, '') + '.com',
          profile: (memory.research as any) || null,
          opportunities: memory.opportunityAnalysis ? [memory.opportunityAnalysis as any] : [],
          outreachPlans: memory.outreach ? [memory.outreach as any] : [],
          crmData: (memory.crm as any) || null,
          proposals: memory.proposal ? [memory.proposal as any] : [],
          lastUpdated: timestamp,
        };

        if (companyRecords.length > 0 && companyRecords[0].id) {
          await companyMemoryRepository.update(companyRecords[0].id, {
            profile: companyRecord.profile,
            opportunities: companyRecord.opportunities,
            outreachPlans: companyRecord.outreachPlans,
            crmData: companyRecord.crmData,
            proposals: companyRecord.proposals,
            lastUpdated: timestamp,
          });
          logger.info(`ContextRouter updated company memory for: "${companyName}"`);
        } else {
          await companyMemoryRepository.add(companyRecord);
          logger.info(`ContextRouter created new company memory for: "${companyName}"`);
        }
      }
    } catch (err) {
      logger.error('ContextRouter failed to save workflow history run', err);
    }
  }

  /**
   * Uses Gemini to distill history context into compressed memo block.
   */
  private async compressHistory(historyContext: string): Promise<Record<string, unknown>> {
    if (!this.genAI) return {};

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `Compress this history:\n${historyContext}`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: CONTEXT_SUMMARIZATION_PROMPT,
      });

      return JSON.parse(result.response.text());
    } catch (err) {
      logger.error('Gemini context compression failed', err);
      return {};
    }
  }
}
export default ContextRouter;
