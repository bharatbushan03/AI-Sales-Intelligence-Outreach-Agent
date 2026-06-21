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
import {
  OutreachPackage,
  ColdEmailVariant,
  DiscoveryCallPlan,
  ObjectionResponse,
  LinkedInMessage,
} from '../agents/specialists/outreach/types';
import {
  LeadRecord,
  AccountRecord,
  ContactRecord,
  ActivityRecord,
  MeetingRecord,
  OpportunityRecord,
  FollowUpTask,
  PipelineReport,
  RelationshipScore,
} from '../agents/specialists/crm/types';
import {
  ProposalPackage,
  BusinessCase,
  RoiAnalysis,
  ExecutiveSummary,
  SlideOutline,
} from '../agents/specialists/proposal/types';

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

// Outreach Agent Repositories
export const outreachCampaignsRepository = new FirestoreRepository<OutreachPackage>(
  'outreach_campaigns',
);

export const emailTemplatesRepository = new FirestoreRepository<
  ColdEmailVariant & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('email_templates');

export const callPreparationRepository = new FirestoreRepository<
  DiscoveryCallPlan & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('call_preparation');

export const objectionLibraryRepository = new FirestoreRepository<
  ObjectionResponse & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('objection_library');

export const generatedMessagesRepository = new FirestoreRepository<
  LinkedInMessage & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('generated_messages');

// CRM Agent Repositories
export const leadsRepository = new FirestoreRepository<LeadRecord>('leads');
export const accountsRepository = new FirestoreRepository<AccountRecord>('accounts');
export const contactsRepository = new FirestoreRepository<ContactRecord>('contacts');
export const activitiesRepository = new FirestoreRepository<ActivityRecord>('activities');
export const meetingsRepository = new FirestoreRepository<MeetingRecord>('meetings');
export const opportunitiesRepository = new FirestoreRepository<OpportunityRecord>('opportunities');
export const followupsRepository = new FirestoreRepository<FollowUpTask>('followups');
export const pipelineReportsRepository = new FirestoreRepository<PipelineReport>('pipeline_reports');
export const relationshipScoresRepository = new FirestoreRepository<RelationshipScore>('relationship_scores');

// Proposal Agent Repositories
export const proposalsRepository = new FirestoreRepository<ProposalPackage>('proposals');
export const businessCasesRepository = new FirestoreRepository<
  BusinessCase & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('business_cases');
export const roiReportsRepository = new FirestoreRepository<
  RoiAnalysis & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('roi_reports');
export const executiveBriefsRepository = new FirestoreRepository<
  ExecutiveSummary & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('executive_briefs');
export const presentationsRepository = new FirestoreRepository<
  SlideOutline & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('presentations');
