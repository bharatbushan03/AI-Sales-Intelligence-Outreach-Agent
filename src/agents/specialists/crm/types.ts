import { CompanyProfile } from '../research/types';
export type { CompanyProfile };

export type LeadStatus =
  | 'New Lead'
  | 'Researching'
  | 'Contacted'
  | 'Engaged'
  | 'Discovery'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export interface LeadRecord {
  id?: string;
  leadId: string;
  company: string;
  contact: {
    name: string;
    email: string;
    role: string;
  };
  status: LeadStatus;
  score: number; // 0-100 score
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export type AccountHealthClassification = 'Healthy' | 'At Risk' | 'High Potential' | 'Dormant';

export interface AccountRecord {
  id?: string;
  accountId: string;
  companyName: string;
  domain: string;
  profile: CompanyProfile;
  healthScore: number; // 0-100
  classification: AccountHealthClassification;
  updatedAt: string;
}

export interface ContactRecord {
  id?: string;
  contactId: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  accountId: string;
  createdAt: string;
}

export type ActivityType = 'Email' | 'Meeting' | 'Call' | 'LinkedIn' | 'Note';

export interface ActivityRecord {
  id?: string;
  activityId: string;
  timestamp: string;
  activityType: ActivityType;
  description: string;
  actor: string;
  referenceId: string; // references leadId or accountId
}

export interface MeetingRecord {
  id?: string;
  meetingId: string;
  title: string;
  date: string;
  summary: string;
  actionItems: string[];
  risks: string[];
  followUps: string[];
  referenceId: string; // references leadId or accountId
}

export interface OpportunityRecord {
  id?: string;
  opportunityId: string;
  name: string;
  stage: 'Discovery' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost' | string;
  value: number; // USD value
  probability: number; // 0-100 percentage
  rationale: string;
  closeDate: string;
  accountId: string;
}

export interface FollowUpTask {
  id?: string;
  taskId: string;
  taskName: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  rationale: string;
  completed: boolean;
  referenceId: string; // references leadId or accountId
}

export interface PipelineReport {
  id?: string;
  totalPipelineValue: number;
  pipelineHealth: 'Healthy' | 'Moderate Risk' | 'Critical Risk';
  risks: string[];
  recommendations: string[];
  date: string;
}

export type RelationshipClassification =
  | 'Strong Relationship'
  | 'Moderate Relationship'
  | 'Weak Relationship'
  | 'At Risk';

export interface RelationshipScore {
  id?: string;
  relationshipId: string;
  accountId: string;
  score: number; // 0-100
  classification: RelationshipClassification;
  rationale: string;
  updatedAt: string;
}

export interface CrmPackage {
  leads: LeadRecord[];
  accounts: AccountRecord[];
  contacts: ContactRecord[];
  activities: ActivityRecord[];
  meetings: MeetingRecord[];
  opportunities: OpportunityRecord[];
  followups: FollowUpTask[];
  pipelineReport?: PipelineReport;
  relationshipScores: RelationshipScore[];
  metadata: {
    workflowId?: string;
    timestamp: string;
  };
}
