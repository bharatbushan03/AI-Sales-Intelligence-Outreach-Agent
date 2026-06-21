import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { createAgentContext } from '@/agents/context';
import { ResearchAgent } from '@/agents/specialists/research-agent';
import { OpportunityAgent } from '@/agents/specialists/opportunity-agent';
import { OutreachAgent } from '@/agents/specialists/outreach-agent';
import {
  outreachCampaignsRepository,
  emailTemplatesRepository,
  callPreparationRepository,
  objectionLibraryRepository,
  generatedMessagesRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';
import { OutreachPackage } from '@/agents/specialists/outreach/types';

/**
 * GET /api/outreach
 * Lists historical outreach packages.
 */
export async function GET() {
  try {
    const packages = await outreachCampaignsRepository.list(
      undefined,
      'metadata.timestamp',
      'desc',
    );
    return ApiResponse.success(packages);
  } catch (error) {
    logger.error('Failed to fetch outreach packages history', error);
    return ApiResponse.error('Failed to fetch history', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/outreach
 * Runs Research, Opportunity, and Outreach Agents sequentially and stores output.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || '';

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return ApiResponse.error('Query/Domain name is required', 'VALIDATION_ERROR', 400);
    }

    const userId = req.headers.get('x-user-id') || 'mock-user-123';

    // 1. Run Research Agent
    logger.info(`Outreach route triggering research for: "${query}"`);
    const researchAgent = new ResearchAgent();
    const researchCtx = createAgentContext(userId, `Gather research dossier for "${query}"`);
    const researchResult = await researchAgent.execute(researchCtx, { websiteUrl: query });

    if (!researchResult.success || !researchResult.output) {
      throw new Error(researchResult.error || 'Failed to generate company research data.');
    }
    const researchData = researchResult.output;

    // 2. Run Opportunity Agent
    logger.info(`Outreach route triggering opportunity analysis for: "${query}"`);
    const opportunityAgent = new OpportunityAgent();
    const opportunityCtx = createAgentContext(
      userId,
      `Analyze strategic triggers and opportunities for "${query}"`,
    );
    opportunityCtx.sharedMemory.research = researchData;
    const opportunityResult = await opportunityAgent.execute(opportunityCtx, { researchData });

    if (!opportunityResult.success || !opportunityResult.output) {
      throw new Error(opportunityResult.error || 'Failed to calculate opportunity analysis metrics.');
    }
    const opportunityData = opportunityResult.output;

    // 3. Run Outreach Agent
    logger.info(`Outreach route triggering outreach strategy for: "${query}"`);
    const outreachAgent = new OutreachAgent();
    const outreachCtx = createAgentContext(
      userId,
      `Generate outreach and campaigns for "${query}"`,
    );
    outreachCtx.sharedMemory.research = researchData;
    outreachCtx.sharedMemory.opportunityAnalysis = opportunityData;
    const outreachResult = await outreachAgent.execute(outreachCtx, {
      research: researchData,
      opportunityAnalysis: opportunityData,
    });

    if (!outreachResult.success || !outreachResult.output) {
      throw new Error(outreachResult.error || 'Failed to construct sales outreach strategy.');
    }

    const outreachPackage = outreachResult.output as unknown as OutreachPackage;

    // 4. Save to main outreach_campaigns collection
    const savedPackage = await outreachCampaignsRepository.add(outreachPackage);

    // 5. Cache sub-collections
    if (outreachPackage.coldEmails && Array.isArray(outreachPackage.coldEmails)) {
      for (const email of outreachPackage.coldEmails) {
        await emailTemplatesRepository.add({
          ...email,
          reportId: savedPackage.id,
        });
      }
    }

    if (outreachPackage.discoveryCallPlan) {
      await callPreparationRepository.add({
        ...outreachPackage.discoveryCallPlan,
        reportId: savedPackage.id,
      });
    }

    if (outreachPackage.objections && Array.isArray(outreachPackage.objections)) {
      for (const obj of outreachPackage.objections) {
        await objectionLibraryRepository.add({
          ...obj,
          reportId: savedPackage.id,
        });
      }
    }

    if (outreachPackage.linkedInMessages && Array.isArray(outreachPackage.linkedInMessages)) {
      for (const msg of outreachPackage.linkedInMessages) {
        await generatedMessagesRepository.add({
          ...msg,
          reportId: savedPackage.id,
        });
      }
    }

    logger.info(`Successfully generated and cached outreach package ${savedPackage.id} for "${query}"`);
    return ApiResponse.success(savedPackage, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Outreach pipeline execution failed: ${errorMsg}`, error);
    return ApiResponse.error(errorMsg, 'OUTREACH_PIPELINE_ERROR', 500);
  }
}
