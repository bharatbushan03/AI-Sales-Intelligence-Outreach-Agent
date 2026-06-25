import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import {
  workflowMemoryRepository,
  companyMemoryRepository,
  agentMemoryRepository,
} from '@/lib/repositories';
import { KnowledgeGraphManager } from '@/agents/memory/knowledge-graph';
import { AgentMessagingBus } from '@/agents/memory/message-bus';
import { logger } from '@/utils/logger';

/**
 * GET /api/memory
 * Retrieves aggregated or specific memory states from Firestore.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';

    if (type === 'workflow') {
      const workflows = await workflowMemoryRepository.list(undefined, 'createdAt', 'desc');
      return ApiResponse.success(workflows);
    }
    if (type === 'company') {
      const companies = await companyMemoryRepository.list(undefined, 'lastUpdated', 'desc');
      return ApiResponse.success(companies);
    }
    if (type === 'agent') {
      const agents = await agentMemoryRepository.list(undefined, 'agentName', 'asc');
      return ApiResponse.success(agents);
    }
    if (type === 'graph') {
      const companyName = searchParams.get('companyName');
      let graph;
      if (companyName) {
        const mgr = KnowledgeGraphManager.getInstance();
        const fullGraph = await mgr.getGraph();
        if (fullGraph.nodes.length === 0) {
          graph = mgr.getMockGraph(companyName);
        } else {
          graph = await mgr.queryConnections(companyName.toLowerCase());
        }
      } else {
        const mgr = KnowledgeGraphManager.getInstance();
        graph = await mgr.getGraph();
        if (graph.nodes.length === 0) {
          graph = mgr.getMockGraph('Stripe');
        }
      }
      return ApiResponse.success(graph);
    }
    if (type === 'messages') {
      const topic = searchParams.get('topic') || undefined;
      const history = await AgentMessagingBus.getInstance().getHistory(topic);
      return ApiResponse.success(history);
    }

    // Default: Return combined context for Dashboard
    const [workflows, companies, agents, messages] = await Promise.all([
      workflowMemoryRepository.list(undefined, 'createdAt', 'desc', 15),
      companyMemoryRepository.list(undefined, 'lastUpdated', 'desc', 15),
      agentMemoryRepository.list(undefined, 'agentName', 'asc'),
      AgentMessagingBus.getInstance().getHistory(undefined, 30),
    ]);

    const mgr = KnowledgeGraphManager.getInstance();
    let graph = await mgr.getGraph();
    if (graph.nodes.length === 0) {
      graph = mgr.getMockGraph('Stripe');
    }

    return ApiResponse.success({
      workflows,
      companies,
      agents,
      graph,
      messages,
    });
  } catch (error) {
    logger.error('Failed to query Memory layer records', error);
    return ApiResponse.error('Failed to query memory records', 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/memory
 * Publishes a messaging bus event or forces graph/agent updates.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sender, topic, payload } = body;

    if (!sender || !topic || !payload) {
      return ApiResponse.error(
        'Missing required fields: sender, topic, payload',
        'BAD_REQUEST',
        400,
      );
    }

    const bus = AgentMessagingBus.getInstance();
    const msg = await bus.publish(sender, topic, payload);
    return ApiResponse.success(msg, 201);
  } catch (error) {
    logger.error('Failed to publish memory message via API', error);
    return ApiResponse.error('Failed to publish message', 'INTERNAL_ERROR', 500);
  }
}
