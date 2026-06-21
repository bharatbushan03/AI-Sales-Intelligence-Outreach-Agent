import { describe, it, expect } from 'vitest';
import { PainPointDetector } from '../src/agents/specialists/opportunity/pain-point-detector';
import { GrowthSignalAnalyzer } from '../src/agents/specialists/opportunity/growth-analyzer';
import { SalesTriggerDetector } from '../src/agents/specialists/opportunity/trigger-detector';
import { OpportunityScorer } from '../src/agents/specialists/opportunity/scorer';
import { RecommendationEngine } from '../src/agents/specialists/opportunity/recommendation-engine';
import { StrategicInsightGenerator } from '../src/agents/specialists/opportunity/strategic-insights';
import { OpportunityAgent } from '../src/agents/specialists/opportunity-agent';
import { createAgentContext } from '../src/agents/context';
import { OpportunityReport } from '../src/agents/specialists/opportunity/types';

describe('Opportunity Analysis Agent Pipeline & Submodules', () => {
  // Pass null genAI to trigger dynamic mock/offline fallbacks
  const painDetector = new PainPointDetector(null);
  const growthAnalyzer = new GrowthSignalAnalyzer(null);
  const triggerDetector = new SalesTriggerDetector(null);
  const scorer = new OpportunityScorer(null);
  const recommendationEngine = new RecommendationEngine(null);
  const insightGenerator = new StrategicInsightGenerator(null);

  describe('PainPointDetector Submodule', () => {
    it('should extract correct mock pain points for Stripe', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await painDetector.detect(profile, [], []);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('payment drop-offs');
      expect(result[0].businessImpact).toBe('high');
      expect(result[0].confidenceScore).toBe(88);
    });

    it('should extract correct mock pain points for Notion', async () => {
      const profile = { name: 'Notion', website: 'notion.so', description: 'desc' };
      const result = await painDetector.detect(profile, [], []);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toContain('Data fragmentation');
      expect(result[0].businessImpact).toBe('high');
    });
  });

  describe('GrowthSignalAnalyzer Submodule', () => {
    it('should analyze correct mock growth indicators for HubSpot', async () => {
      const profile = { name: 'HubSpot', website: 'hubspot.com', description: 'desc' };
      const result = await growthAnalyzer.analyze(profile, null);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].signal).toContain('headcount increase');
      expect(result[0].confidence).toBeDefined();
    });
  });

  describe('SalesTriggerDetector Submodule', () => {
    it('should map active buying sales triggers for Shopify', async () => {
      const profile = { name: 'Shopify', website: 'shopify.com', description: 'desc' };
      const result = await triggerDetector.detect(profile, [], []);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].trigger).toContain('Shopify collective');
      expect(result[0].urgency).toBe('high');
      expect(result[0].opportunityLevel).toBe('critical');
    });
  });

  describe('OpportunityScorer Submodule', () => {
    it('should calculate weighted scores and return overall opportunity metrics for Salesforce', async () => {
      const profile = { name: 'Salesforce', website: 'salesforce.com', description: 'desc' };
      const result = await scorer.score(profile, [], []);

      expect(result.opportunities.length).toBeGreaterThan(0);
      expect(result.opportunities[0].opportunityName).toContain('Einstein Agent');
      expect(result.opportunities[0].score).toBe(92);
      expect(result.overallOpportunityScore).toBeGreaterThan(0);
    });
  });

  describe('RecommendationEngine Submodule', () => {
    it('should generate value propositions and objection preparations for Stripe', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await recommendationEngine.recommend(profile, [], []);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].solution).toContain('routing and dynamic currency');
      expect(result[0].messagingThemes).toContain(
        'Minimize friction inside European banking networks',
      );
      expect(result[0].objectionPrep.length).toBeGreaterThan(0);
      expect(result[0].objectionPrep[0].objection).toContain('Stripe Radar');
    });
  });

  describe('StrategicInsightGenerator Submodule', () => {
    it('should generate consulting executive summary briefs for Notion', async () => {
      const profile = { name: 'Notion', website: 'notion.so', description: 'desc' };
      const result = await insightGenerator.generate(profile, [], []);

      expect(result.executiveSummary.toLowerCase()).toContain('wiki');
      expect(result.executiveInsights.length).toBeGreaterThan(0);
      expect(result.executiveInsights[0].insight).toContain('search efficiency');
    });
  });

  describe('End-to-End Opportunity Agent Pipeline', () => {
    it('should execute the full 6-stage opportunity analysis pipeline and aggregate details successfully', async () => {
      const agent = new OpportunityAgent();
      const context = createAgentContext('user_456', 'Analyze Shopify.com sales opportunities');

      // Setup mock research data inside context sharedMemory
      const mockResearchData = {
        company: {
          name: 'Shopify',
          website: 'shopify.com',
          description: 'E-commerce platform',
        },
        products: [
          { name: 'Core Shopify Suite', description: 'Core shopping card checkout solutions' },
        ],
        competitors: [
          {
            name: 'WooCommerce',
            website: 'woocommerce.com',
            relationship: 'direct',
            advantage: 'open-source',
            disadvantage: 'maintenance',
          },
        ],
        signals: {
          hiringSignal: 'Active B2B hiring spike',
          growthIndicator: 'Shopify collective releases',
        },
      };

      context.sharedMemory.research = mockResearchData;

      const result = await agent.execute(context, { researchData: mockResearchData });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();

      const report = result.output as unknown as OpportunityReport;
      expect(report.company.name).toBe('Shopify');
      expect(report.painPoints.length).toBeGreaterThan(0);
      expect(report.growthSignals.length).toBeGreaterThan(0);
      expect(report.salesTriggers.length).toBeGreaterThan(0);
      expect(report.opportunities.length).toBeGreaterThan(0);
      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.executiveInsights.length).toBeGreaterThan(0);
      expect(report.executiveSummary).toBeDefined();
      expect(report.overallOpportunityScore).toBeGreaterThan(0);
      expect(report.opportunityScore).toBe(report.overallOpportunityScore); // Check alias compat
      expect(report.metadata.timestamp).toBeDefined();
    });
  });
});
