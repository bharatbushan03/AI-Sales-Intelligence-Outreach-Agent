import { describe, it, expect } from 'vitest';
import { CompanyProfiler } from '../src/agents/specialists/research/profiler';
import { WebsiteAnalyzer } from '../src/agents/specialists/research/web-analyzer';
import { CompetitorAnalyzer } from '../src/agents/specialists/research/competitor-analyzer';
import { OpportunityDiscoveryEngine } from '../src/agents/specialists/research/opportunity-engine';
import { InsightGenerator } from '../src/agents/specialists/research/insight-generator';
import { ResearchAgent } from '../src/agents/specialists/research-agent';
import { createAgentContext } from '../src/agents/context';
import { ResearchReport } from '../src/agents/specialists/research/types';

describe('Research Agent Pipeline & Submodules', () => {
  // Use null genAI client to trigger mock/offline fallbacks
  const profiler = new CompanyProfiler(null);
  const webAnalyzer = new WebsiteAnalyzer(null);
  const competitorAnalyzer = new CompetitorAnalyzer(null);
  const opportunityEngine = new OpportunityDiscoveryEngine(null);
  const insightGenerator = new InsightGenerator(null);

  describe('CompanyProfiler Submodule', () => {
    it('should extract correct profile mock details for Stripe', async () => {
      const result = await profiler.profile('stripe.com');
      expect(result.company.name).toBe('Stripe');
      expect(result.company.location).toBe('San Francisco, CA');
      expect(result.industry.classification).toBe('FinTech');
      expect(result.industry.tags).toContain('Payments');
    });

    it('should extract correct profile mock details for HubSpot', async () => {
      const result = await profiler.profile('HubSpot');
      expect(result.company.name).toBe('HubSpot');
      expect(result.company.employeeCount).toBe(7600);
      expect(result.industry.classification).toBe('SaaS');
    });

    it('should handle generic domain names dynamically', async () => {
      const result = await profiler.profile('google.com');
      expect(result.company.name).toBe('GOOGLE');
      expect(result.company.website).toBe('google.com');
      expect(result.company.businessModel).toBe('B2B SaaS');
      expect(result.industry.classification).toBe('Technology');
    });
  });

  describe('WebsiteAnalyzer Submodule', () => {
    it('should identify product offering catalog and signals for Stripe', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const result = await webAnalyzer.analyze(profile);
      
      expect(result.products.length).toBeGreaterThan(0);
      expect(result.products[0].name).toBe('Stripe Payments');
      expect(result.signals.hiringSignal).toContain('Enterprise Account Executives');
      expect(result.signals.growthIndicator).toContain('Stripe Tax');
    });

    it('should extract generic product placeholders for other targets', async () => {
      const profile = { name: 'Acme Corp', website: 'acme.com', description: 'desc' };
      const result = await webAnalyzer.analyze(profile);
      
      expect(result.products[0].name).toBe('Core Solution Suite');
      expect(result.products[0].pricing).toBe('Contact Sales');
    });
  });

  describe('CompetitorAnalyzer Submodule', () => {
    it('should discover relevant competitors with relative advantages for HubSpot', async () => {
      const profile = { name: 'HubSpot', website: 'hubspot.com', description: 'desc' };
      const competitors = await competitorAnalyzer.analyze(profile);

      expect(competitors.length).toBe(3);
      expect(competitors[0].name).toBe('Salesforce CRM');
      expect(competitors[0].relationship).toBe('direct');
      expect(competitors[0].advantage).toContain('unified codebase');
      expect(competitors[0].disadvantage).toContain('enterprise');
    });
  });

  describe('OpportunityDiscoveryEngine Submodule', () => {
    it('should identify growth opportunities with validation confidence scores', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const products = [{ name: 'Stripe Payments', description: 'desc' }];
      const competitors = [{ name: 'Adyen', website: 'adyen.com', relationship: 'direct' as const, advantage: 'adv', disadvantage: 'dis' }];
      
      const result = await opportunityEngine.discover(profile, products, competitors);

      expect(result.opportunities.length).toBeGreaterThan(0);
      expect(result.opportunities[0].type).toBe('technology');
      expect(result.opportunities[0].confidence).toBeGreaterThan(0);
      expect(result.opportunities[0].confidence).toBeLessThanOrEqual(100);
      expect(result.opportunities[0].source).toBeDefined();

      expect(result.risks.length).toBeGreaterThan(0);
      expect(result.risks[0].confidence).toBeGreaterThan(0);
    });
  });

  describe('InsightGenerator Submodule', () => {
    it('should generate executive synthesis summaries and sales rep recommendations', async () => {
      const profile = { name: 'Stripe', website: 'stripe.com', description: 'desc' };
      const opportunities = [{ insight: 'integration tax', confidence: 90, source: 'gap', type: 'technology' as const }];
      
      const result = await insightGenerator.generate(profile, opportunities);

      expect(result.summary).toContain('Stripe');
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0]).toContain('Smart-Route');
    });
  });

  describe('End-to-End Research Agent Pipeline', () => {
    it('should coordinate all submodules sequentially and output final ResearchReport', async () => {
      const agent = new ResearchAgent();
      const context = createAgentContext('user_999', 'Research HubSpot');
      
      const result = await agent.execute(context, { websiteUrl: 'hubspot.com' });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      const report = result.output as unknown as ResearchReport;

      expect(report.company.name).toBe('HubSpot');
      expect(report.industry.classification).toBe('SaaS');
      expect(report.products.length).toBeGreaterThan(0);
      expect(report.competitors.length).toBeGreaterThan(0);
      expect(report.opportunities.length).toBeGreaterThan(0);
      expect(report.risks.length).toBeGreaterThan(0);
      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.summary).toBeDefined();
      expect(report.signals).toBeDefined();
      expect(report.metadata.timestamp).toBeDefined();
    });
  });
});
