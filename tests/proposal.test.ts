import { describe, it, expect, beforeEach } from 'vitest';
import { SolutionDesigner } from '../src/agents/specialists/proposal/solution-designer';
import { BusinessCaseGenerator } from '../src/agents/specialists/proposal/business-case-generator';
import { ROIEngine } from '../src/agents/specialists/proposal/roi-engine';
import { ProposalWriter } from '../src/agents/specialists/proposal/proposal-writer';
import { ExecutiveSummaryGenerator } from '../src/agents/specialists/proposal/executive-summary-generator';
import { PresentationGenerator } from '../src/agents/specialists/proposal/presentation-generator';
import { ProposalAgent } from '../src/agents/specialists/proposal-agent';
import { createAgentContext } from '../src/agents/context';
import { ProposalPackage } from '../src/agents/specialists/proposal/types';
import { ManagerAgent } from '../src/agents/manager-agent';
import { AgentRegistry } from '../src/agents/registry';
import { ResearchAgent } from '../src/agents/specialists/research-agent';
import { OpportunityAgent } from '../src/agents/specialists/opportunity-agent';
import { OutreachAgent } from '../src/agents/specialists/outreach-agent';
import { CrmAgent } from '../src/agents/specialists/crm-agent';

describe('Proposal Agent Pipeline & Submodules', () => {
  const registry = AgentRegistry.getInstance();

  beforeEach(() => {
    registry.clear();
    registry.register(new ResearchAgent());
    registry.register(new OpportunityAgent());
    registry.register(new OutreachAgent());
    registry.register(new CrmAgent());
    registry.register(new ProposalAgent());
  });

  const solutionDesigner = new SolutionDesigner(null);
  const businessCaseGenerator = new BusinessCaseGenerator(null);
  const roiEngine = new ROIEngine(null);
  const proposalWriter = new ProposalWriter(null);
  const summaryGenerator = new ExecutiveSummaryGenerator(null);
  const presentationGenerator = new PresentationGenerator(null);

  describe('SolutionDesigner Submodule', () => {
    it('should generate solutions with objectives and outcomes for Stripe', async () => {
      const design = await solutionDesigner.design('Stripe', {}, {});
      expect(design.solutionName).toContain('Stripe');
      expect(design.objectives.length).toBeGreaterThan(0);
      expect(design.expectedOutcomes.length).toBeGreaterThan(0);
    });

    it('should fall back to general scaling suite for unknown companies', async () => {
      const design = await solutionDesigner.design('Unknown Corp', {}, {});
      expect(design.solutionName).toContain('B2B Operations');
    });
  });

  describe('BusinessCaseGenerator Submodule', () => {
    it('should formulate McKinsey-tier current and future states for HubSpot', async () => {
      const design = await solutionDesigner.design('HubSpot', {}, {});
      const caseDoc = await businessCaseGenerator.generate('HubSpot', {}, {}, design);
      expect(caseDoc.currentState).toContain('HubSpot');
      expect(caseDoc.challenges.length).toBeGreaterThan(0);
      expect(caseDoc.strategicBenefits.length).toBeGreaterThan(0);
    });
  });

  describe('ROIEngine Submodule', () => {
    it('should project estimated savings, investments, and payback percentages', async () => {
      const design = await solutionDesigner.design('Salesforce', {}, {});
      const roi = await roiEngine.calculate('Salesforce', {}, design);
      expect(roi.estimatedInvestment).toBeGreaterThan(0);
      expect(roi.roiPercentage).toBeGreaterThan(0);
      expect(roi.assumptions.length).toBeGreaterThan(0);
    });
  });

  describe('ProposalWriter Submodule', () => {
    it('should compile complete cover page and details structure for Shopify', async () => {
      const design = await solutionDesigner.design('Shopify', {}, {});
      const roi = await roiEngine.calculate('Shopify', {}, design);
      const doc = await proposalWriter.write('Shopify', {}, {}, design, roi);
      expect(doc.coverPage.title).toContain('Shopify');
      expect(doc.executiveSummary).toBeDefined();
      expect(doc.risksMitigation.length).toBeGreaterThan(0);
    });
  });

  describe('ExecutiveSummaryGenerator Submodule', () => {
    it('should distill executive C-level summaries', async () => {
      const design = await solutionDesigner.design('Notion', {}, {});
      const roi = await roiEngine.calculate('Notion', {}, design);
      const doc = await proposalWriter.write('Notion', {}, {}, design, roi);
      const summary = await summaryGenerator.summarize('Notion', doc);
      expect(summary.summaryText).toContain('Notion');
      expect(summary.businessValue).toBeDefined();
    });
  });

  describe('PresentationGenerator Submodule', () => {
    it('should structure Slide outlines and speaker scripts', async () => {
      const design = await solutionDesigner.design('Stripe', {}, {});
      const roi = await roiEngine.calculate('Stripe', {}, design);
      const doc = await proposalWriter.write('Stripe', {}, {}, design, roi);
      const slides = await presentationGenerator.generate('Stripe', doc, design, roi);
      expect(slides.length).toBe(8);
      expect(slides[0].slideTitle).toContain('Stripe');
      expect(slides[0].speakerNotes).toBeDefined();
    });
  });

  describe('End-to-End Proposal Agent coordinator pipeline', () => {
    it('should execute full agent pipeline successfully using fallback mocks', async () => {
      const agent = new ProposalAgent();
      const context = createAgentContext('user_456', 'Draft strategic B2B proposal for HubSpot');
      
      const result = await agent.execute(context, { companyName: 'HubSpot' });
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();

      const pkg = result.output as unknown as ProposalPackage;
      expect(pkg.proposal.coverPage.title).toContain('HubSpot');
      expect(pkg.businessCase.currentState).toBeDefined();
      expect(pkg.roiAnalysis.roiPercentage).toBeGreaterThan(0);
      expect(pkg.executiveSummary.summaryText).toBeDefined();
      expect(pkg.implementationRoadmap.length).toBe(4);
      expect(pkg.presentationOutline.length).toBe(8);
      expect(pkg.qualityScore).toBeGreaterThan(80);
      expect(pkg.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Manager Agent Integration', () => {
    it('should parse proposal intent, plan, and route sequential pipeline successfully', async () => {
      const manager = new ManagerAgent(true); // force mock planner mode
      const result = await manager.orchestrate(
        'user_456',
        'Analyze Shopify and prepare a custom proposal document',
      );

      expect(result.status).toBe('completed');
      expect(result.agentsInvoked).toContain('ResearchAgent');
      expect(result.agentsInvoked).toContain('OpportunityAgent');
      expect(result.agentsInvoked).toContain('CrmAgent');
      expect(result.agentsInvoked).toContain('ProposalAgent');
      expect(result.results.summary).toBeDefined();
    });
  });
});
