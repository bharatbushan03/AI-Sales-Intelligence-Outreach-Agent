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
import {
  WorkflowMemory,
  AgentMemory,
  CompanyMemory,
  UserMemory,
  KnowledgeGraph,
  AgentMessage,
} from '../agents/memory/types';
import {
  PromptDefinition,
  PromptVersion,
  EvaluationResult,
  QualityScorecard,
  TokenUsage,
  ResponseCache,
  HallucinationReport,
} from '../agents/platform/types';

const prodOpts = {
  enableMultiTenancy: true,
  enableSoftDelete: true,
  enableVersioning: true,
  enableAuditing: true,
  enableEventSourcing: true,
};

export const reportsRepository = new FirestoreRepository<ResearchReport>('research_reports', prodOpts);
export const jobsRepository = new FirestoreRepository<ResearchJob>('research_jobs', { enableMultiTenancy: true });

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
>('company_profiles', { enableMultiTenancy: true, enableSoftDelete: true });

export const competitorProfilesRepository = new FirestoreRepository<
  CompetitorProfile & {
    id?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
    sourceCompany?: string;
    reportId?: string;
  }
>('competitor_profiles', { enableMultiTenancy: true, enableSoftDelete: true });

export const opportunityReportsRepository = new FirestoreRepository<OpportunityReport>(
  'opportunity_reports',
  prodOpts,
);

export const opportunityScoresRepository = new FirestoreRepository<
  OpportunityScore & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('opportunity_scores', { enableMultiTenancy: true });

export const salesTriggersRepository = new FirestoreRepository<
  SalesTrigger & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('sales_triggers', { enableMultiTenancy: true });

export const strategicRecommendationsRepository = new FirestoreRepository<
  StrategicRecommendation & {
    id?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
    reportId?: string;
  }
>('strategic_recommendations', { enableMultiTenancy: true });

// Outreach Agent Repositories
export const outreachCampaignsRepository = new FirestoreRepository<OutreachPackage>(
  'outreach_campaigns',
  prodOpts,
);

export const emailTemplatesRepository = new FirestoreRepository<
  ColdEmailVariant & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('email_templates', { enableMultiTenancy: true, enableSoftDelete: true });

export const callPreparationRepository = new FirestoreRepository<
  DiscoveryCallPlan & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('call_preparation', { enableMultiTenancy: true, enableSoftDelete: true });

export const objectionLibraryRepository = new FirestoreRepository<
  ObjectionResponse & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('objection_library', { enableMultiTenancy: true, enableSoftDelete: true });

export const generatedMessagesRepository = new FirestoreRepository<
  LinkedInMessage & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('generated_messages', { enableMultiTenancy: true, enableSoftDelete: true });

// CRM Agent Repositories
export const leadsRepository = new FirestoreRepository<LeadRecord>('leads', prodOpts);
export const accountsRepository = new FirestoreRepository<AccountRecord>('accounts', { enableMultiTenancy: true, enableSoftDelete: true });
export const contactsRepository = new FirestoreRepository<ContactRecord>('contacts', { enableMultiTenancy: true, enableSoftDelete: true });
export const activitiesRepository = new FirestoreRepository<ActivityRecord>('activities', { enableMultiTenancy: true });
export const meetingsRepository = new FirestoreRepository<MeetingRecord>('meetings', { enableMultiTenancy: true, enableSoftDelete: true });
export const opportunitiesRepository = new FirestoreRepository<OpportunityRecord>('opportunities', { enableMultiTenancy: true, enableSoftDelete: true });
export const followupsRepository = new FirestoreRepository<FollowUpTask>('followups', { enableMultiTenancy: true });
export const pipelineReportsRepository = new FirestoreRepository<PipelineReport>('pipeline_reports', { enableMultiTenancy: true });
export const relationshipScoresRepository = new FirestoreRepository<RelationshipScore>('relationship_scores', { enableMultiTenancy: true });

// Proposal Agent Repositories
export const proposalsRepository = new FirestoreRepository<ProposalPackage>('proposals', prodOpts);
export const businessCasesRepository = new FirestoreRepository<
  BusinessCase & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('business_cases', { enableMultiTenancy: true, enableSoftDelete: true });
export const roiReportsRepository = new FirestoreRepository<
  RoiAnalysis & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('roi_reports', { enableMultiTenancy: true });
export const executiveBriefsRepository = new FirestoreRepository<
  ExecutiveSummary & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('executive_briefs', { enableMultiTenancy: true });
export const presentationsRepository = new FirestoreRepository<
  SlideOutline & { id?: string; createdAt?: unknown; updatedAt?: unknown; reportId?: string }
>('presentations', { enableMultiTenancy: true });

// Memory Layer Repositories
export const workflowMemoryRepository = new FirestoreRepository<WorkflowMemory>('workflow_memory', { enableMultiTenancy: true, enableSoftDelete: true });
export const agentMemoryRepository = new FirestoreRepository<AgentMemory>('agent_memory');
export const companyMemoryRepository = new FirestoreRepository<CompanyMemory>('company_memory', { enableMultiTenancy: true });
export const userMemoryRepository = new FirestoreRepository<UserMemory>('user_memory', { enableMultiTenancy: true });
export const knowledgeGraphRepository = new FirestoreRepository<KnowledgeGraph>('knowledge_graph');
export const agentMessagesRepository = new FirestoreRepository<AgentMessage>('agent_messages');

// Platform Layer Repositories
export const promptRegistryRepository = new FirestoreRepository<
  PromptDefinition & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('prompt_registry');
export const promptVersionsRepository = new FirestoreRepository<
  PromptVersion & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('prompt_versions');
export const evaluationResultsRepository = new FirestoreRepository<
  EvaluationResult & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('evaluation_results');
export const qualityScoresRepository = new FirestoreRepository<
  QualityScorecard & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('quality_scores');
export const tokenUsageRepository = new FirestoreRepository<
  TokenUsage & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('token_usage');
export const responseCacheRepository = new FirestoreRepository<
  ResponseCache & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('response_cache');
export const hallucinationReportsRepository = new FirestoreRepository<
  HallucinationReport & { id?: string; createdAt?: unknown; updatedAt?: unknown }
>('hallucination_reports');

// Production Architecture Collections
export const workflowsRepository = new FirestoreRepository<any>('workflows', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
  enableVersioning: true,
  enableAuditing: true,
  enableEventSourcing: true,
});

export const workflowStepsRepository = new FirestoreRepository<any>('workflow_steps', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
});

export const usersRepository = new FirestoreRepository<any>('users', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
});

export const organizationsRepository = new FirestoreRepository<any>('organizations');

export const notificationsRepository = new FirestoreRepository<any>('notifications', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
});

export const workspacesRepository = new FirestoreRepository<any>('workspaces', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
});

export const invitationsRepository = new FirestoreRepository<any>('invitations', {
  enableMultiTenancy: true,
});

export const activityFeedRepository = new FirestoreRepository<any>('activity_feed', {
  enableMultiTenancy: true,
});

export const commentsRepository = new FirestoreRepository<any>('comments', {
  enableMultiTenancy: true,
  enableSoftDelete: true,
});

