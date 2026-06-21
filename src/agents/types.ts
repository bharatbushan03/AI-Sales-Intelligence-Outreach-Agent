export type AgentCapability = 'research' | 'opportunity-analysis' | 'outreach' | 'crm' | 'proposal';

export interface AgentMetadata {
  name: string;
  description: string;
  capabilities: readonly AgentCapability[];
}

export interface IAgent extends AgentMetadata {
  execute(context: AgentContext, options?: Record<string, unknown>): Promise<AgentStepResult>;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'workflow_start' | 'agent_start' | 'agent_end' | 'agent_error' | 'workflow_end';
  message: string;
  agentName?: string;
  durationMs?: number;
}

export interface AgentTrace {
  agentName: string;
  status: 'success' | 'failed';
  startTime: string;
  endTime: string;
  durationMs: number;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
}

export interface AgentContext {
  workflowId: string;
  userId: string;
  userGoal: string;
  sharedMemory: Record<string, unknown>;
  executionHistory: AgentTrace[];
  timeline: TimelineEvent[];
  createdAt: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface WorkflowStep {
  id: string;
  agentCapability: AgentCapability;
  dependsOn?: string[]; // IDs of preceding steps required
  inputMapping: (context: AgentContext) => Record<string, unknown>;
  retryLimit?: number;
  timeoutMs?: number;
}

export interface WorkflowPlan {
  steps: WorkflowStep[];
  goal: string;
}

export interface AgentStepResult {
  success: boolean;
  output: Record<string, unknown>;
  error?: string;
}

export interface FinalWorkflowResult {
  workflowId: string;
  agentsInvoked: string[];
  executionTime: number;
  status: 'completed' | 'failed';
  results: Record<string, unknown>;
  recommendations: string[];
}
