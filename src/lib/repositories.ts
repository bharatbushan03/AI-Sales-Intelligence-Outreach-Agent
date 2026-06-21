import { FirestoreRepository } from './repository';
import {
  ResearchReport,
  ResearchJob,
  CompanyProfile,
  CompetitorProfile,
} from '../agents/specialists/research/types';

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
