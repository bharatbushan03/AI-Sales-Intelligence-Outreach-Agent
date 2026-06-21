import { describe, it, expect } from 'vitest';
import { PersonaAnalyzer } from '../src/agents/specialists/outreach/persona-analyzer';
import { MessagingStrategist } from '../src/agents/specialists/outreach/messaging-strategist';
import { EmailGenerator } from '../src/agents/specialists/outreach/email-generator';
import { LinkedInGenerator } from '../src/agents/specialists/outreach/linkedin-generator';
import { CallPreparationEngine } from '../src/agents/specialists/outreach/call-prep';
import { ObjectionHandlingEngine } from '../src/agents/specialists/outreach/objection-handler';
import { CampaignPlanner } from '../src/agents/specialists/outreach/campaign-planner';
import { OutreachAgent } from '../src/agents/specialists/outreach-agent';
import { createAgentContext } from '../src/agents/context';
import { OutreachPackage } from '../src/agents/specialists/outreach/types';

describe('Outreach Agent Pipeline & Submodules', () => {
  // Pass null genAI to trigger dynamic mock/offline fallbacks
  const personaAnalyzer = new PersonaAnalyzer(null);
  const messagingStrategist = new MessagingStrategist(null);
  const emailGenerator = new EmailGenerator(null);
  const linkedinGenerator = new LinkedInGenerator(null);
  const callPrepEngine = new CallPreparationEngine(null);
  const objectionEngine = new ObjectionHandlingEngine(null);
  const campaignPlanner = new CampaignPlanner(null);

  describe('PersonaAnalyzer Submodule', () => {
    it('should map target personas for Stripe', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await personaAnalyzer.analyze(profile);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].role).toContain('CTO');
      expect(result[0].priorities).toContain('Maintain 99.999% uptime');
      expect(result[0].decisionInfluence).toBe('high');
    });

    it('should map target personas for Notion', async () => {
      const profile = { name: 'Notion', website: 'notion.so', description: 'desc' };
      const result = await personaAnalyzer.analyze(profile);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].role).toContain('Operations');
      expect(result[0].likelyChallenges).toContain('Granular permission leaks');
    });
  });

  describe('MessagingStrategist Submodule', () => {
    it('should create messaging themes for Salesforce', async () => {
      const profile = { name: 'Salesforce', website: 'salesforce.com', description: 'desc' };
      const result = await messagingStrategist.strategize(profile);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].audience).toContain('Admin');
      expect(result[0].messageTheme).toContain('TCO');
      expect(result[0].businessValue).toBeDefined();
    });
  });

  describe('EmailGenerator Submodule', () => {
    it('should generate cold email variants and sequences for Shopify', async () => {
      const profile = { name: 'Shopify', website: 'shopify.com', description: 'desc' };
      const result = await emailGenerator.generate(profile, []);

      expect(result.coldEmails.length).toBeGreaterThan(0);
      expect(result.coldEmails[0].variantName).toBe('Executive Version');
      expect(result.coldEmails[0].subject).toContain('outbound');
      expect(result.followUpSequence.length).toBe(5);
      expect(result.followUpSequence[0].day).toBe(1);
    });
  });

  describe('LinkedInGenerator Submodule', () => {
    it('should generate exactly 4 connection and follow-up templates for Stripe', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await linkedinGenerator.generate(profile, []);

      expect(result.length).toBe(4);
      expect(result[0].type).toBe('Connection Request');
      expect(result[0].message).toContain('Stripe');
    });
  });

  describe('CallPreparationEngine Submodule', () => {
    it('should draft discovery and qualification checklist questions for HubSpot', async () => {
      const profile = { name: 'HubSpot', website: 'hubspot.com', description: 'desc' };
      const result = await callPrepEngine.prepare(profile);

      expect(result.callObjective).toContain('custom object');
      expect(result.agenda.length).toBeGreaterThan(0);
      expect(result.discoveryQuestions.length).toBeGreaterThan(0);
      expect(result.qualificationQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('ObjectionHandlingEngine Submodule', () => {
    it('should map responses for the 6 core objections', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await objectionEngine.generate(profile);

      expect(result.length).toBe(6);
      expect(result.some((o) => o.objection === 'Too expensive')).toBe(true);
      expect(result.some((o) => o.objection === 'No budget')).toBe(true);
    });
  });

  describe('CampaignPlanner Submodule', () => {
    it('should create multi-channel outreach schedule touchpoints', async () => {
      const profile = { name: 'Shopify', website: 'shopify.com', description: 'desc' };
      const result = await campaignPlanner.plan(profile);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].timeline).toBe('Day 1');
      expect(result[0].channel).toBeDefined();
    });
  });

  describe('End-to-End Outreach Agent Pipeline', () => {
    it('should coordinate all submodules sequentially and output final OutreachPackage', async () => {
      const agent = new OutreachAgent();
      const context = createAgentContext('user_789', 'Generate campaign for Stripe');

      // Setup mock data in sharedMemory
      const mockResearchData = {
        company: { name: 'Stripe', website: 'stripe.com', description: 'Fintech platform' },
      };
      const mockOpportunityData = {
        company: { name: 'Stripe', website: 'stripe.com', description: 'Fintech platform' },
        painPoints: [
          {
            title: 'High decline rates',
            explanation: 'exp',
            evidence: 'evid',
            confidenceScore: 90,
            businessImpact: 'high' as const,
          },
        ],
        opportunities: [{ opportunityName: 'Localized routing', score: 90, rationale: 'rat' }],
        overallOpportunityScore: 90,
      };

      context.sharedMemory.research = mockResearchData;
      context.sharedMemory.opportunityAnalysis = mockOpportunityData;

      const result = await agent.execute(context, {
        research: mockResearchData,
        opportunityAnalysis: mockOpportunityData,
      });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();

      const report = result.output as unknown as OutreachPackage;
      expect(report.company.name).toBe('Stripe');
      expect(report.targetPersonas.length).toBeGreaterThan(0);
      expect(report.messagingStrategy.length).toBeGreaterThan(0);
      expect(report.coldEmails.length).toBeGreaterThan(0);
      expect(report.followUpSequence.length).toBeGreaterThan(0);
      expect(report.linkedInMessages.length).toBeGreaterThan(0);
      expect(report.discoveryCallPlan).toBeDefined();
      expect(report.objections.length).toBeGreaterThan(0);
      expect(report.campaigns.length).toBeGreaterThan(0);
      expect(report.outreachScore).toBeGreaterThan(0);
      expect(report.executiveSummary).toBeDefined();
    });
  });
});
