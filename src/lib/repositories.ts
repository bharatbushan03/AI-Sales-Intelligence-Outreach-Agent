import { FirestoreRepository } from './repository';
import {
  ResearchReport,
  ResearchJob,
  CompanyProfile,
  CompetitorProfile,
} from '../agents/specialists/research/types';
import {
  OpportunityReport,
  OpportunityScore,
  SalesTrigger,
  StrategicRecommendation,
} from '../agents/specialists/opportunity/types';

export const reportsRepository = new FirestoreRepository<ResearchReport>('research_reports');
export const jobsRepository = new FirestoreRepository<ResearchJob>('research_jobs');

export const companyProfilesRepository = new FirestoreRepository<
  CompanyProfile & {
    id?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
    industry?: {
      classification: string;
      vertical: string;
      tags: string[];
    };
    reportId?: string;
  }
>('company_profiles');

export const competitorProfilesRepository = new FirestoreRepository<
  CompetitorProfile & {
    id?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
    sourceCompany?: string;
    reportId?: string;
  }
>('competitor_profiles');

export const opportunityReportsRepository = new FirestoreRepository<OpportunityReport>(
  'opportunity_reports',
);

export const opportunityScoresRepository = new FirestoreRepository<
  OpportunityScore & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('opportunity_scores');

export const salesTriggersRepository = new FirestoreRepository<
  SalesTrigger & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('sales_triggers');

export const strategicRecommendationsRepository = new FirestoreRepository<
  StrategicRecommendation & {
    id?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
    reportId?: string;
  }
>('strategic_recommendations');
