import { describe, it, expect } from 'vitest';
import { LeadManager } from '../src/agents/specialists/crm/lead-manager';
import { OpportunityManager } from '../src/agents/specialists/crm/opportunity-manager';
import { ActivityTracker } from '../src/agents/specialists/crm/activity-tracker';
import { MeetingIntelligenceEngine } from '../src/agents/specialists/crm/meeting-intelligence';
import { FollowUpEngine } from '../src/agents/specialists/crm/follow-up-engine';
import { PipelineAnalyzer } from '../src/agents/specialists/crm/pipeline-analyzer';
import { RelationshipScoringEngine } from '../src/agents/specialists/crm/relationship-scorer';
import { CrmAgent } from '../src/agents/specialists/crm-agent';
import { createAgentContext } from '../src/agents/context';
import { CrmPackage } from '../src/agents/specialists/crm/types';

describe('CRM Agent Pipeline & Submodules', () => {
  // Use null genAI to trigger fallback mock structures
  const leadManager = new LeadManager();
  const opportunityManager = new OpportunityManager();
  const activityTracker = new ActivityTracker();
  const meetingEngine = new MeetingIntelligenceEngine(null);
  const followUpEngine = new FollowUpEngine(null);
  const pipelineAnalyzer = new PipelineAnalyzer(null);
  const relationshipScorer = new RelationshipScoringEngine(null);

  describe('LeadManager Submodule', () => {
    it('should create lead records with New Lead status and appropriate score', async () => {
      const lead = await leadManager.createLead('Stripe', 'John', 'john@stripe.com', 'CTO', 70);
      expect(lead.company).toBe('Stripe');
      expect(lead.contact.name).toBe('John');
      expect(lead.status).toBe('New Lead');
      expect(lead.score).toBe(70);
    });

    it('should calculate lead score with correct modifiers', () => {
      const score = leadManager.calculateLeadScore(70, 3, true); // 70 + (3 * 5) + 15 = 100
      expect(score).toBe(100);

      const score2 = leadManager.calculateLeadScore(50, 0, false);
      expect(score2).toBe(50);
    });
  });

  describe('OpportunityManager Submodule', () => {
    it('should calculate close date and maintain deal value', async () => {
      const opp = await opportunityManager.createOpportunity('Stripe integration Deal', 'Discovery', 20000, 30, 'rat', 'acc_stripe');
      expect(opp.name).toBe('Stripe integration Deal');
      expect(opp.value).toBe(20000);
      expect(opp.probability).toBe(30);
      expect(opp.closeDate).toBeDefined();
    });
  });

  describe('ActivityTracker Submodule', () => {
    it('should log activity timeline events', async () => {
      const act = await activityTracker.logActivity('Email', 'Sent cold template', 'user_123', 'lead_999');
      expect(act.activityType).toBe('Email');
      expect(act.description).toBe('Sent cold template');
      expect(act.actor).toBe('user_123');
      expect(act.timestamp).toBeDefined();
    });
  });

  describe('MeetingIntelligenceEngine Submodule', () => {
    it('should summarize transcripts and extract risks and actions for Stripe', async () => {
      const brief = await meetingEngine.summarize('Stripe alignment call', 'decline rates are bad', 'lead_stripe');
      expect(brief.title).toContain('Stripe');
      expect(brief.actionItems.length).toBeGreaterThan(0);
      expect(brief.risks.length).toBeGreaterThan(0);
      expect(brief.summary).toContain('decline');
    });
  });

  describe('FollowUpEngine Submodule', () => {
    it('should structure follow-up tasks and due dates', async () => {
      const tasks = await followUpEngine.generateTasks('HubSpot', [], 'lead_hubspot');
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0].taskName).toContain('sandbox');
      expect(tasks[0].priority).toBe('high');
    });
  });

  describe('PipelineAnalyzer Submodule', () => {
    it('should sum values and calculate pipeline health', async () => {
      const mockOpps = [
        { opportunityId: 'o1', name: 'Deal 1', stage: 'Discovery', value: 15000, probability: 30, rationale: 'r', closeDate: 'd', accountId: 'a' },
        { opportunityId: 'o2', name: 'Deal 2', stage: 'Negotiation', value: 35000, probability: 80, rationale: 'r', closeDate: 'd', accountId: 'a' },
      ];
      const report = await pipelineAnalyzer.analyzePipeline(mockOpps);
      expect(report.totalPipelineValue).toBe(50000);
      expect(report.pipelineHealth).toBe('Healthy');
      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('RelationshipScoringEngine Submodule', () => {
    it('should classify relationship strength based on activities', async () => {
      const rel = await relationshipScorer.scoreRelationship('Notion', [], 'acc_notion');
      expect(rel.score).toBe(55);
      expect(rel.classification).toBe('Moderate Relationship');
    });
  });

  describe('End-to-End CRM Agent Pipeline', () => {
    it('should execute complete pipeline logging workflow run successfully', async () => {
      const agent = new CrmAgent();
      const context = createAgentContext('user_777', 'Log CRM status for HubSpot');

      const mockResearchData = {
        company: { name: 'HubSpot', website: 'hubspot.com', description: 'CRM SaaS platform' },
      };
      const mockOpportunityData = {
        company: { name: 'HubSpot', website: 'hubspot.com', description: 'CRM SaaS platform' },
        painPoints: [{ title: 'relational object caps', explanation: 'exp', evidence: 'evid', confidenceScore: 80, businessImpact: 'high' as const }],
        opportunities: [{ opportunityName: 'Custom schemas sync', score: 85, rationale: 'rat' }],
        overallOpportunityScore: 85,
      };

      context.sharedMemory.research = mockResearchData;
      context.sharedMemory.opportunityAnalysis = mockOpportunityData;

      const result = await agent.execute(context, { action: 'LOG_WORKFLOW_RUN' });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();

      const pkg = result.output as unknown as CrmPackage;
      expect(pkg.leads.length).toBeGreaterThan(0);
      expect(pkg.accounts.length).toBeGreaterThan(0);
      expect(pkg.contacts.length).toBeGreaterThan(0);
      expect(pkg.activities.length).toBeGreaterThan(0);
      expect(pkg.opportunities.length).toBeGreaterThan(0);
      expect(pkg.followups.length).toBeGreaterThan(0);
      expect(pkg.relationshipScores.length).toBeGreaterThan(0);
      expect(pkg.pipelineReport).toBeDefined();
    });
  });
});
