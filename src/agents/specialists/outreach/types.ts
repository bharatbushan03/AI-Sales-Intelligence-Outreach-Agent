import { CompanyProfile } from '../research/types';
export type { CompanyProfile };

export interface PersonaInfo {
  role: string;
  priorities: string[];
  likelyChallenges: string[];
  preferredMessaging: string;
  decisionInfluence: 'high' | 'medium' | 'low' | string;
}

export interface MessagingTheme {
  audience: string;
  messageTheme: string;
  businessValue: string;
  callToAction: string;
}

export interface ColdEmailVariant {
  variantName: string;
  subject: string;
  opening: string;
  valueProposition: string;
  socialProofPlaceholder: string;
  cta: string;
  fullBody: string;
}

export interface FollowUpStep {
  day: number;
  objective: string;
  message: string;
  cta: string;
}

export interface LinkedInMessage {
  type:
    'Connection Request' | 'First Message' | 'Follow-Up Message' | 'Engagement Message' | string;
  message: string;
}

export interface DiscoveryCallPlan {
  callObjective: string;
  agenda: string[];
  discoveryQuestions: string[];
  qualificationQuestions: string[];
  painPointQuestions: string[];
}

export interface ObjectionResponse {
  objection: string;
  recommendedResponse: string;
  rationale: string;
}

export interface CampaignEvent {
  timeline: string;
  channel: 'Email' | 'LinkedIn' | 'Phone' | 'Follow-up' | string;
  objective: string;
  messageTheme: string;
  cta: string;
}

export interface OutreachPackage {
  id?: string;
  company: CompanyProfile;
  targetPersonas: PersonaInfo[];
  messagingStrategy: MessagingTheme[];
  coldEmails: ColdEmailVariant[];
  followUpSequence: FollowUpStep[];
  linkedInMessages: LinkedInMessage[];
  discoveryCallPlan: DiscoveryCallPlan;
  objections: ObjectionResponse[];
  campaigns: CampaignEvent[];
  outreachScore: number;
  executiveSummary: string;
  metadata: {
    workflowId?: string;
    timestamp: string;
  };
}
