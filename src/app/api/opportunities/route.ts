import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { createAgentContext } from '@/agents/context';
import { ResearchAgent } from '@/agents/specialists/research-agent';
import { OpportunityAgent } from '@/agents/specialists/opportunity-agent';
import {
  opportunityReportsRepository,
  opportunityScoresRepository,
  salesTriggersRepository,
  strategicRecommendationsRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';
import { OpportunityReport } from '@/agents/specialists/opportunity/types';

/**
 * GET /api/opportunities
 * Lists historical opportunity reports.
 */
export async function GET() {
  try {
    const reports = await opportunityReportsRepository.list(undefined, 'metadata.timestamp', 'desc');
    return ApiResponse.success(reports);
  } catch (error) {
    logger.error('Failed to fetch opportunity reports history', error);
    return ApiResponse.error('Failed to fetch history', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/opportunities
 * Runs Research and Opportunity Agents sequentially and stores output.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || '';

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return ApiResponse.error('Query is required', 'VALIDATION_ERROR', 400);
    }

    const userId = req.headers.get('x-user-id') || 'mock-user-123';

    // 1. Execute Research Agent first to collect profile, products, competitors, signals
    const researchAgent = new ResearchAgent();
    const researchCtx = createAgentContext(userId, `Collect research dossiers for "${query}"`);
    const researchResult = await researchAgent.execute(researchCtx, { websiteUrl: query });

    if (!researchResult.success || !researchResult.output) {
      throw new Error(researchResult.error || 'Failed to generate company research metadata.');
    }

    const researchData = researchResult.output;

    // 2. Execute Opportunity Agent passing the research data
    const opportunityAgent = new OpportunityAgent();
    const opportunityCtx = createAgentContext(userId, `Analyze strategic triggers and opportunities for "${query}"`);
    opportunityCtx.sharedMemory.research = researchData;

    const opportunityResult = await opportunityAgent.execute(opportunityCtx, { researchData });

    if (!opportunityResult.success || !opportunityResult.output) {
      throw new Error(opportunityResult.error || 'Failed to calculate strategic opportunity metrics.');
    }

    const reportData = opportunityResult.output as unknown as OpportunityReport;

    // 3. Save aggregated report to Firestore
    const savedReport = await opportunityReportsRepository.add(reportData);

    // 4. Cache details in sub-tables
    if (reportData.opportunities && Array.isArray(reportData.opportunities)) {
      for (const opp of reportData.opportunities) {
        await opportunityScoresRepository.add({
          ...opp,
          reportId: savedReport.id,
        });
      }
    }

    if (reportData.salesTriggers && Array.isArray(reportData.salesTriggers)) {
      for (const trg of reportData.salesTriggers) {
        await salesTriggersRepository.add({
          ...trg,
          reportId: savedReport.id,
        });
      }
    }

    if (reportData.recommendations && Array.isArray(reportData.recommendations)) {
      for (const rec of reportData.recommendations) {
        await strategicRecommendationsRepository.add({
          ...rec,
          reportId: savedReport.id,
        });
      }
    }

    logger.info(`Generated and stored opportunity report ${savedReport.id} for "${query}"`);
    return ApiResponse.success(savedReport, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Opportunity pipeline execution failed: ${errorMsg}`, error);
    return ApiResponse.error(errorMsg, 'OPPORTUNITY_PIPELINE_ERROR', 500);
  }
}
