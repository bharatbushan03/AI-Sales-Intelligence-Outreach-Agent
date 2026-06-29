import { ResearchReport } from '../specialists/research/types';
import { OpportunityReport } from '../specialists/opportunity/types';
import { OutreachPackage } from '../specialists/outreach/types';
import { CrmPackage } from '../specialists/crm/types';
import { ProposalPackage } from '../specialists/proposal/types';

export interface WorkflowMemory {
  id?: string;
  workflowId: string;
  userId: string;
  userGoal: string;
  agentOutputs: Record<string, unknown>;
  intermediateResults: Record<string, unknown>;
  finalResults?: Record<string, unknown>;
  status: 'idle' | 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface AgentMemory {
  id?: string;
  agentName: string;
  executionsCount: number;
  discoveredCompetitors: string[];
  analyzedCompanies: string[];
  performanceMetrics: {
    averageLatencyMs: number;
    successRate: number;
    lastExecutedAt: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyMemory {
  id?: string;
  companyName: string;
  domain: string;
  profile?: Record<string, unknown>;
  opportunities?: Record<string, unknown>[];
  outreachPlans?: Record<string, unknown>[];
  crmData?: Record<string, unknown>;
  proposals?: Record<string, unknown>[];
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserMemory {
  id?: string;
  userId: string;
  preferredWorkflows: string[];
  analyzedIndustries: string[];
  savedReports: Array<{ reportId: string; type: string; companyName: string }>;
  favoriteOutputs: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
}

export interface ConversationMemory {
  id?: string;
  conversationId: string;
  userId: string;
  messages: ConversationMessage[];
  lastMessageAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type:
    'company' | 'competitor' | 'industry' | 'pain-point' | 'opportunity' | 'campaign' | 'proposal';
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  relationship: string; // e.g. "competes_with", "belongs_to", "has_pain_point"
}

export interface KnowledgeGraph {
  id?: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentMessage {
  id?: string;
  timestamp: string;
  sender: string;
  topic: string; // e.g. "market_insight", "crm_alert"
  payload: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SharedMemoryModel {
  workflowId: string;
  userGoal: string;
  companyName?: string;
  research?: ResearchReport;
  opportunityAnalysis?: OpportunityReport;
  outreach?: OutreachPackage;
  crm?: CrmPackage;
  proposal?: ProposalPackage;
  memoryReferences?: {
    companyMemoryId?: string;
    priorWorkflowIds?: string[];
    relatedCompetitorIds?: string[];
  };
}
