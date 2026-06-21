import { AgentContext } from './types';

export interface LatencyBreakdown {
  agentName: string;
  durationMs: number;
  percentage: number;
}

export interface ObservabilityReport {
  workflowId: string;
  totalDurationMs: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
  agentsInvoked: string[];
  latencyBreakdown: LatencyBreakdown[];
  timelineSummary: string[];
  errors: Array<{ agentName: string; error: string }>;
}

/**
 * Generates telemetry metrics, latency details, and traces of sub-agent executions.
 */
export function generateObservabilityReport(context: AgentContext): ObservabilityReport {
  const startEvent = context.timeline.find((t) => t.type === 'workflow_start');
  const endEvent = context.timeline.find((t) => t.type === 'workflow_end' || t.type === 'agent_error');
  
  const startTime = startEvent ? new Date(startEvent.timestamp).getTime() : new Date(context.createdAt).getTime();
  const endTime = endEvent ? new Date(endEvent.timestamp).getTime() : Date.now();
  const totalDurationMs = endTime - startTime;

  const agentsInvoked = context.executionHistory.map((h) => h.agentName);
  
  // Latency breakdown per agent
  const totalAgentDuration = context.executionHistory.reduce((sum, h) => sum + h.durationMs, 0);
  const latencyBreakdown: LatencyBreakdown[] = context.executionHistory.map((h) => ({
    agentName: h.agentName,
    durationMs: h.durationMs,
    percentage: totalAgentDuration > 0 ? Math.round((h.durationMs / totalAgentDuration) * 100) : 0,
  }));

  // Timeline events as clean formatted string messages
  const timelineSummary = context.timeline.map((event) => {
    const elapsed = new Date(event.timestamp).getTime() - startTime;
    const elapsedSec = (elapsed / 1000).toFixed(2);
    const durationSuffix = event.durationMs ? ` (took ${event.durationMs}ms)` : '';
    return `[+${elapsedSec}s] ${event.message}${durationSuffix}`;
  });

  // Extract failures
  const errors = context.executionHistory
    .filter((h) => h.status === 'failed' && h.error)
    .map((h) => ({
      agentName: h.agentName,
      error: h.error || 'Unknown execution failure',
    }));

  return {
    workflowId: context.workflowId,
    totalDurationMs,
    status: context.status,
    agentsInvoked,
    latencyBreakdown,
    timelineSummary,
    errors,
  };
}
