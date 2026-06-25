import { AIPlatformGenerativeAI } from '../platform/wrapper';
import { env } from '../../lib/env';
import { IAgent, AgentContext, AgentStepResult } from '../types';
import { LeadManager } from './crm/lead-manager';
import { OpportunityManager } from './crm/opportunity-manager';
import { ActivityTracker } from './crm/activity-tracker';
import { MeetingIntelligenceEngine } from './crm/meeting-intelligence';
import { FollowUpEngine } from './crm/follow-up-engine';
import { PipelineAnalyzer } from './crm/pipeline-analyzer';
import { RelationshipScoringEngine } from './crm/relationship-scorer';
import { logger } from '../../utils/logger';
import { CrmPackage, AccountRecord } from './crm/types';
import { ResearchReport } from './research/types';
import { OpportunityReport } from './opportunity/types';
import {
  leadsRepository,
  accountsRepository,
  contactsRepository,
  activitiesRepository,
  meetingsRepository,
  opportunitiesRepository,
  followupsRepository,
  pipelineReportsRepository,
  relationshipScoresRepository,
} from '../../lib/repositories';

export class CrmAgent implements IAgent {
  public name = 'CrmAgent';
  public description =
    'Maintains CRM integrity by writing meeting summaries, creating tracking links, and scheduling followups.';
  public capabilities = ['crm'] as const;

  private leadManager: LeadManager;
  private opportunityManager: OpportunityManager;
  private activityTracker: ActivityTracker;
  private meetingEngine: MeetingIntelligenceEngine;
  private followUpEngine: FollowUpEngine;
  private pipelineAnalyzer: PipelineAnalyzer;
  private relationshipScorer: RelationshipScoringEngine;
  private genAI: any = null;

  constructor() {
    const key = env.GEMINI_API_KEY;
    this.genAI = key && key !== 'mock-gemini-key' ? (new AIPlatformGenerativeAI(key) as any) : null;

    this.leadManager = new LeadManager();
    this.opportunityManager = new OpportunityManager();
    this.activityTracker = new ActivityTracker();
    this.meetingEngine = new MeetingIntelligenceEngine(this.genAI);
    this.followUpEngine = new FollowUpEngine(this.genAI);
    this.pipelineAnalyzer = new PipelineAnalyzer(this.genAI);
    this.relationshipScorer = new RelationshipScoringEngine(this.genAI);
  }

  public async execute(
    context: AgentContext,
    options?: Record<string, unknown>,
  ): Promise<AgentStepResult> {
    const action = (options?.action || 'LOG_WORKFLOW_RUN') as string;
    const userGoal = context.userGoal;

    logger.info(`CrmAgent executing action: "${action}" for goal: "${userGoal}"`);

    try {
      if (action === 'CREATE_LEAD') {
        const company = (options?.company as string) || 'Prospect Company';
        const contactName = (options?.contactName as string) || 'John Doe';
        const contactEmail = (options?.contactEmail as string) || 'john@prospect.com';
        const contactRole = (options?.contactRole as string) || 'Decision Maker';
        const score = (options?.score as number) || 70;

        const lead = await this.leadManager.createLead(
          company,
          contactName,
          contactEmail,
          contactRole,
          score,
        );
        await leadsRepository.add(lead);

        return {
          success: true,
          output: { lead },
        };
      }

      if (action === 'SUMMARIZE_MEETING') {
        const title = (options?.title as string) || 'Sales Sync Call';
        const transcript = (options?.transcript as string) || 'No transcript provided.';
        const referenceId = (options?.referenceId as string) || 'lead_general_001';

        const meeting = await this.meetingEngine.summarize(title, transcript, referenceId);
        await meetingsRepository.add(meeting);

        return {
          success: true,
          output: { meeting },
        };
      }

      if (action === 'ANALYZE_PIPELINE') {
        const company = this.extractCompanyName(userGoal) || 'Stripe';
        const mockOpps = this.opportunityManager.getMockOpportunities(company);
        const report = await this.pipelineAnalyzer.analyzePipeline(mockOpps);
        await pipelineReportsRepository.add(report);

        return {
          success: true,
          output: { report },
        };
      }

      // Default: LOG_WORKFLOW_RUN
      // Synthesize full CRM mapping from pipeline memory
      const researchData = context.sharedMemory.research as ResearchReport | undefined;
      const opportunityData = context.sharedMemory.opportunityAnalysis as
        | OpportunityReport
        | undefined;

      const companyName =
        researchData?.company?.name ||
        opportunityData?.company?.name ||
        this.extractCompanyName(userGoal) ||
        'Stripe';

      // 1. Get or create Leads
      const leads = this.leadManager.getMockLeads(companyName);
      for (const lead of leads) {
        await leadsRepository.add(lead);
      }

      // 2. Create Opportunities
      const opportunities = this.opportunityManager.getMockOpportunities(companyName);
      for (const opp of opportunities) {
        await opportunitiesRepository.add(opp);
      }

      // 3. Create Accounts
      const accountId = `acc_${companyName.toLowerCase().replace(/\s+/g, '')}`;
      const account: AccountRecord = {
        accountId,
        companyName,
        domain: researchData?.company?.website || 'prospect.com',
        profile: researchData?.company || {
          name: companyName,
          website: 'prospect.com',
          description: 'CRM tracked customer account.',
        },
        healthScore: 80,
        classification: 'Healthy',
        updatedAt: new Date().toISOString(),
      };
      await accountsRepository.add(account);

      // 4. Create Contacts
      const contact = {
        contactId: `con_${companyName.toLowerCase().replace(/\s+/g, '')}`,
        name: researchData?.company?.name ? `${companyName} Contact` : 'Lead Contact',
        email: `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        role: 'Primary Stakeholder',
        accountId,
        createdAt: new Date().toISOString(),
      };
      await contactsRepository.add(contact);

      // 5. Create Activities
      const activities = this.activityTracker.getMockActivities(companyName);
      for (const act of activities) {
        await activitiesRepository.add(act);
      }

      // 6. Relationship scores
      const relScore = await this.relationshipScorer.scoreRelationship(
        companyName,
        activities,
        accountId,
      );
      await relationshipScoresRepository.add(relScore);

      // 7. Follow-ups
      const followups = await this.followUpEngine.generateTasks(
        companyName,
        activities,
        leads[0]?.leadId || 'lead_generic_001',
      );
      for (const fup of followups) {
        await followupsRepository.add(fup);
      }

      // 8. Pipeline Report
      const pipelineReport = await this.pipelineAnalyzer.analyzePipeline(opportunities);
      await pipelineReportsRepository.add(pipelineReport);

      const payload: CrmPackage = {
        leads,
        accounts: [account],
        contacts: [contact],
        activities,
        meetings: [],
        opportunities,
        followups,
        pipelineReport,
        relationshipScores: [relScore],
        metadata: {
          workflowId: context.workflowId,
          timestamp: new Date().toISOString(),
        },
      };

      logger.info(`CrmAgent logged workflow run successfully for: "${companyName}"`);

      return {
        success: true,
        output: payload as unknown as Record<string, unknown>,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`CrmAgent action "${action}" failed: ${errorMsg}`, error);
      return {
        success: false,
        output: {},
        error: errorMsg,
      };
    }
  }

  private extractCompanyName(text: string): string | null {
    const query = text.toLowerCase();
    if (query.includes('stripe')) return 'Stripe';
    if (query.includes('hubspot')) return 'HubSpot';
    if (query.includes('salesforce')) return 'Salesforce';
    if (query.includes('notion')) return 'Notion';
    if (query.includes('shopify')) return 'Shopify';

    const match = text.match(/([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}/);
    if (match) return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    return null;
  }
}
export default CrmAgent;
