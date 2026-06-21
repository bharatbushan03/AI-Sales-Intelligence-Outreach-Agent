import { CompanyProfile } from '../research/types';
export type { CompanyProfile };

export interface PainPoint {
  title: string;
  explanation: string;
  evidence: string;
  confidenceScore: number; // 0-100 score
  businessImpact: 'high' | 'medium' | 'low';
}

export interface GrowthSignal {
  signal: string;
  significance: string;
  confidence: number; // 0-100 score
  recommendedApproach: string;
}

export interface SalesTrigger {
  trigger: string;
  urgency: 'high' | 'medium' | 'low';
  opportunityLevel: 'critical' | 'high' | 'medium' | 'low';
  suggestedOutreachAngle: string;
}

export interface OpportunityScore {
  opportunityName: string;
  score: number; // 0-100 weighted score
  rationale: string;
}

export interface StrategicRecommendation {
  solution: string;
  messagingThemes: string[];
  valueProps: string[];
  talkingPoints: string[];
  discoveryQuestions: string[];
  objectionPrep: Array<{ objection: string; response: string }>;
}

export interface ExecutiveInsight {
  insight: string;
  confidence: number; // 0-100 score
  evidence: string;
  implication: string;
}

export interface OpportunityReport {
  id?: string;
  company: CompanyProfile;
  painPoints: PainPoint[];
  growthSignals: GrowthSignal[];
  salesTriggers: SalesTrigger[];
  opportunities: OpportunityScore[];
  recommendations: StrategicRecommendation[];
  executiveInsights: ExecutiveInsight[];
  executiveSummary: string;
  overallOpportunityScore: number;
  opportunityScore?: number; // Legacy alias field
  metadata: {
    workflowId?: string;
    timestamp: string;
  };
}
