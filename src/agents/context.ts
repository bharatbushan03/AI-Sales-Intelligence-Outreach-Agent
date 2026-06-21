import { AgentContext, AgentTrace, TimelineEvent } from './types';

/**
 * Initializes a fresh Agent Context object for a new workflow.
 */
export function createAgentContext(userId: string, userGoal: string): AgentContext {
  const workflowId = `wf_${Math.random().toString(36).substring(2, 11)}`;
  const timestamp = new Date().toISOString();

  return {
    workflowId,
    userId,
    userGoal,
    sharedMemory: {},
    executionHistory: [],
    timeline: [
      {
        id: `ev_${Math.random().toString(36).substring(2, 11)}`,
        timestamp,
        type: 'workflow_start',
        message: `Workflow initialized with goal: "${userGoal}"`,
      },
    ],
    createdAt: timestamp,
    status: 'idle',
  };
}

/**
 * Appends a timeline event to the context.
 */
export function logTimelineEvent(
  context: AgentContext,
  type: TimelineEvent['type'],
  message: string,
  agentName?: string,
  durationMs?: number,
): void {
  const event: TimelineEvent = {
    id: `ev_${Math.random().toString(36).substring(2, 11)}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    agentName,
    durationMs,
  };
  context.timeline.push(event);
}

/**
 * Commits a completed agent trace to history and updates shared memory.
 */
export function recordAgentTrace(context: AgentContext, trace: AgentTrace): void {
  context.executionHistory.push(trace);

  if (trace.status === 'success' && trace.output) {
    // Map capability indicators or names into memory namespace
    const memoryKey = mapAgentNameToMemoryKey(trace.agentName);
    context.sharedMemory[memoryKey] = trace.output;
  }
}

/**
 * Helper mapping to standard namespaces in memory
 */
function mapAgentNameToMemoryKey(name: string): string {
  switch (name) {
    case 'ResearchAgent':
      return 'research';
    case 'OpportunityAgent':
      return 'opportunityAnalysis';
    case 'OutreachAgent':
      return 'outreach';
    case 'CrmAgent':
      return 'crm';
    case 'ProposalAgent':
      return 'proposal';
    default:
      return name.toLowerCase().replace('agent', '');
  }
}
