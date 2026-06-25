import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { createAgentContext } from '@/agents/context';
import { ResearchAgent } from '@/agents/specialists/research-agent';
import {
  reportsRepository,
  jobsRepository,
  companyProfilesRepository,
  competitorProfilesRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';
import { ResearchReport } from '@/agents/specialists/research/types';

/**
 * GET /api/research
 * Returns all historical research reports, sorted by execution date.
 */
export async function GET() {
  try {
    const reports = await reportsRepository.list(undefined, 'metadata.timestamp', 'desc');
    return ApiResponse.success(reports);
  } catch (error) {
    logger.error('Failed to fetch research reports history', error);
    return ApiResponse.error('Failed to fetch history', 'FETCH_ERROR', 500);
  }
}

/**
 * POST /api/research
 * Starts a new research job, executes the Research Agent, and saves results.
 */
export const POST = withAuth(async (req: NextRequest, { user }) => {
  let jobId: string | undefined;
  try {
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const userId = user.uid;
    const query = body.query || '';

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return ApiResponse.error('Query is required', 'VALIDATION_ERROR', 400);
    }

    // 1. Create a ResearchJob tracking state
    const job = await jobsRepository.add({
      query,
      status: 'processing',
    });
    jobId = job.id!;

    // 2. Instantiate and execute the ResearchAgent
    const agent = new ResearchAgent();
    const agentContext = createAgentContext(userId, `Research company details for: "${query}"`);

    const result = await agent.execute(agentContext, { websiteUrl: query });

    if (!result.success || !result.output || Object.keys(result.output).length === 0) {
      throw new Error(result.error || 'Research pipeline returned an empty or invalid output.');
    }

    const reportData = result.output as unknown as ResearchReport;

    // 3. Save Research Report
    const report = await reportsRepository.add(reportData);

    // 4. Update Research Job to completed
    await jobsRepository.update(jobId, {
      status: 'completed',
      reportId: report.id,
    });

    // 5. Populate and cache Company Profile
    if (reportData.company) {
      await companyProfilesRepository.add({
        ...reportData.company,
        industry: reportData.industry,
        reportId: report.id,
      });
    }

    // 6. Populate and cache Competitor Profiles
    if (reportData.competitors && Array.isArray(reportData.competitors)) {
      for (const comp of reportData.competitors) {
        await competitorProfilesRepository.add({
          ...comp,
          sourceCompany: reportData.company?.name || query,
          reportId: report.id,
        });
      }
    }

    logger.info(`Research job ${jobId} finished. Report generated: ${report.id}`);
    return ApiResponse.success(report, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Research job execution failed for job ${jobId}: ${errorMsg}`, error);

    if (jobId) {
      try {
        await jobsRepository.update(jobId, {
          status: 'failed',
          error: errorMsg,
        });
      } catch (dbError) {
        logger.error('Failed to log job failure to database', dbError);
      }
    }

    return ApiResponse.error(errorMsg, 'RESEARCH_PIPELINE_ERROR', 500);
  }
});
