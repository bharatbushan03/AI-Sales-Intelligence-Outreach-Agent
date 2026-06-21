export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type InsightType = 'challenge' | 'expansion' | 'operational' | 'technology';

export type CompetitorRelationship = 'direct' | 'indirect' | 'alternative';

export interface ScoredInsight {
  insight: string;
  confidence: number; // 0-100 score
  source: string;
  type?: InsightType;
}

export interface CompanyProfile {
  name: string;
  website: string;
  description: string;
  logo?: string;
  employeeCount?: number;
  estimatedRevenue?: string;
  founded?: string;
  location?: string;
  businessModel?: string;
  targetCustomers?: string[];
  marketPosition?: string;
}

export interface ProductService {
  name: string;
  description: string;
  pricing?: string;
}

export interface CompetitorProfile {
  name: string;
  website: string;
  relationship: CompetitorRelationship;
  advantage: string;
  disadvantage: string;
}

export interface ResearchReport {
  id?: string;
  company: CompanyProfile;
  industry: {
    classification: string;
    vertical: string;
    tags: string[];
  };
  products: ProductService[];
  competitors: CompetitorProfile[];
  opportunities: ScoredInsight[];
  risks: ScoredInsight[];
  recommendations: string[];
  summary: string;
  signals?: {
    hiringSignal: string;
    growthIndicator: string;
  };
  metadata: {
    workflowId?: string;
    timestamp: string;
  };
}

export interface ResearchJob {
  id?: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  reportId?: string;
  createdAt: string;
  updatedAt: string;
}
