import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { createAgentContext } from '@/agents/context';
import { CrmAgent } from '@/agents/specialists/crm-agent';
import {
  leadsRepository,
  accountsRepository,
  activitiesRepository,
  opportunitiesRepository,
  followupsRepository,
  pipelineReportsRepository,
  relationshipScoresRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';

/**
 * GET /api/crm
 * Retrieves records from CRM collections.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';

    if (type === 'leads') {
      const leads = await leadsRepository.list(undefined, 'updatedAt', 'desc');
      return ApiResponse.success(leads);
    }
    if (type === 'opportunities') {
      const opps = await opportunitiesRepository.list();
      return ApiResponse.success(opps);
    }
    if (type === 'activities') {
      const activities = await activitiesRepository.list(undefined, 'timestamp', 'desc');
      return ApiResponse.success(activities);
    }
    if (type === 'pipeline') {
      const reports = await pipelineReportsRepository.list(undefined, 'date', 'desc');
      return ApiResponse.success(reports);
    }

    // Default: Return aggregated statistics for Dashboard
    const [leads, accounts, opportunities, activities, followups, relationships] = await Promise.all([
      leadsRepository.list(undefined, 'updatedAt', 'desc'),
      accountsRepository.list(undefined, 'updatedAt', 'desc'),
      opportunitiesRepository.list(),
      activitiesRepository.list(undefined, 'timestamp', 'desc'),
      followupsRepository.list(undefined, 'dueDate', 'asc'),
      relationshipScoresRepository.list(undefined, 'updatedAt', 'desc'),
    ]);

    return ApiResponse.success({
      leads,
      accounts,
      opportunities,
      activities,
      followups,
      relationships,
    });
  } catch (error) {
    logger.error('Failed to fetch CRM records', error);
    return ApiResponse.error('Failed to fetch history', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/crm
 * Executes CRMAgent actions directly.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'LOG_WORKFLOW_RUN';
    const userId = req.headers.get('x-user-id') || 'mock-user-123';

    logger.info(`CRM API trigger: action="${action}"`);

    const crmAgent = new CrmAgent();
    const context = createAgentContext(userId, `CRM Action trigger: ${action}`);

    // If workflow completed, compile other agents sharedMemory from request payload
    if (action === 'LOG_WORKFLOW_RUN') {
      context.sharedMemory.research = body.research || null;
      context.sharedMemory.opportunityAnalysis = body.opportunityAnalysis || null;
      context.sharedMemory.outreach = body.outreach || null;
    }

    const result = await crmAgent.execute(context, {
      action,
      ...body,
    });

    if (!result.success || !result.output) {
      throw new Error(result.error || `Failed to execute CRM agent action: ${action}`);
    }

    return ApiResponse.success(result.output, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`CRM API execution failed: ${errorMsg}`, error);
    return ApiResponse.error(errorMsg, 'INTERNAL_ERROR', 500);
  }
}
