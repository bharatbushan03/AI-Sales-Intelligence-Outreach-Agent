import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { createAgentContext } from '@/agents/context';
import { ResearchAgent } from '@/agents/specialists/research-agent';
import { OpportunityAgent } from '@/agents/specialists/opportunity-agent';
import { OutreachAgent } from '@/agents/specialists/outreach-agent';
import { CrmAgent } from '@/agents/specialists/crm-agent';
import { ProposalAgent } from '@/agents/specialists/proposal-agent';
import {
  proposalsRepository,
  businessCasesRepository,
  roiReportsRepository,
  executiveBriefsRepository,
  presentationsRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';
import { ProposalPackage } from '@/agents/specialists/proposal/types';

/**
 * GET /api/proposals
 * Lists historical generated B2B proposals.
 */
export async function GET() {
  try {
    const list = await proposalsRepository.list(
      undefined,
      'metadata.timestamp',
      'desc',
    );
    return ApiResponse.success(list);
  } catch (error) {
    logger.error('Failed to fetch B2B proposals history', error);
    return ApiResponse.error('Failed to fetch history', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/proposals
 * Runs the full multi-agent sequential pipeline:
 * Research -> Opportunity -> Outreach -> CRM -> Proposal
 * and caches results in Firestore.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || '';

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return ApiResponse.error('Query domain/company name is required', 'VALIDATION_ERROR', 400);
    }

    const userId = req.headers.get('x-user-id') || 'mock-user-123';
    logger.info(`Proposal route triggering sequential pipeline for: "${query}"`);

    // 1. Run Research Agent
    const researchAgent = new ResearchAgent();
    const researchCtx = createAgentContext(userId, `Collect research dossiers for "${query}"`);
    const researchResult = await researchAgent.execute(researchCtx, { websiteUrl: query });
    if (!researchResult.success || !researchResult.output) {
      throw new Error(researchResult.error || 'Failed to generate company research data.');
    }
    const researchData = researchResult.output;

    // 2. Run Opportunity Agent
    const opportunityAgent = new OpportunityAgent();
    const opportunityCtx = createAgentContext(userId, `Analyze opportunities for "${query}"`);
    opportunityCtx.sharedMemory.research = researchData;
    const opportunityResult = await opportunityAgent.execute(opportunityCtx, { researchData });
    if (!opportunityResult.success || !opportunityResult.output) {
      throw new Error(opportunityResult.error || 'Failed to compile opportunity details.');
    }
    const opportunityData = opportunityResult.output;

    // 3. Run Outreach Agent
    const outreachAgent = new OutreachAgent();
    const outreachCtx = createAgentContext(userId, `Create outreach targets for "${query}"`);
    outreachCtx.sharedMemory.research = researchData;
    outreachCtx.sharedMemory.opportunityAnalysis = opportunityData;
    const outreachResult = await outreachAgent.execute(outreachCtx, {
      research: researchData,
      opportunityAnalysis: opportunityData,
    });
    if (!outreachResult.success || !outreachResult.output) {
      throw new Error(outreachResult.error || 'Failed to draft outreach templates.');
    }
    const outreachData = outreachResult.output;

    // 4. Run CRM Agent
    const crmAgent = new CrmAgent();
    const crmCtx = createAgentContext(userId, `Sync CRM logs for "${query}"`);
    crmCtx.sharedMemory.research = researchData;
    crmCtx.sharedMemory.opportunityAnalysis = opportunityData;
    crmCtx.sharedMemory.outreach = outreachData;
    const crmResult = await crmAgent.execute(crmCtx, {
      action: 'LOG_WORKFLOW_RUN',
      research: researchData,
      opportunityAnalysis: opportunityData,
      outreach: outreachData,
    });
    if (!crmResult.success || !crmResult.output) {
      throw new Error(crmResult.error || 'Failed to update CRM ledger entries.');
    }
    const crmData = crmResult.output;

    // 5. Run Proposal Agent
    const proposalAgent = new ProposalAgent();
    const proposalCtx = createAgentContext(userId, `Generate complete B2B proposals for "${query}"`);
    proposalCtx.sharedMemory.research = researchData;
    proposalCtx.sharedMemory.opportunityAnalysis = opportunityData;
    proposalCtx.sharedMemory.crm = crmData;
    const proposalResult = await proposalAgent.execute(proposalCtx, {
      companyName: query,
    });
    if (!proposalResult.success || !proposalResult.output) {
      throw new Error(proposalResult.error || 'Failed to compile final proposal package.');
    }

    const proposalPackage = proposalResult.output as unknown as ProposalPackage;

    // 6. Save package to main Firestore collection
    const savedProposal = await proposalsRepository.add(proposalPackage);

    // 7. Save detail sections in sub-repositories for index and search optimization
    if (proposalPackage.businessCase) {
      await businessCasesRepository.add({
        ...proposalPackage.businessCase,
        reportId: savedProposal.id,
      });
    }

    if (proposalPackage.roiAnalysis) {
      await roiReportsRepository.add({
        ...proposalPackage.roiAnalysis,
        reportId: savedProposal.id,
      });
    }

    if (proposalPackage.executiveSummary) {
      await executiveBriefsRepository.add({
        ...proposalPackage.executiveSummary,
        reportId: savedProposal.id,
      });
    }

    if (proposalPackage.presentationOutline && Array.isArray(proposalPackage.presentationOutline)) {
      for (const slide of proposalPackage.presentationOutline) {
        await presentationsRepository.add({
          ...slide,
          reportId: savedProposal.id,
        });
      }
    }

    logger.info(`Successfully generated and cached proposals package ${savedProposal.id} for "${query}"`);
    return ApiResponse.success(savedProposal, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Proposal pipeline execution failed: ${errorMsg}`, error);
    return ApiResponse.error(errorMsg, 'PROPOSAL_PIPELINE_ERROR', 500);
  }
}
