import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PainPoint, SalesTrigger, OpportunityScore } from './types';
import { OPPORTUNITY_SCORER_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class OpportunityScorer {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async score(
    profile: CompanyProfile,
    painPoints: PainPoint[],
    salesTriggers: SalesTrigger[],
  ): Promise<{
    opportunities: OpportunityScore[];
    overallOpportunityScore: number;
  }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints,
        )}\nSales Triggers:\n${JSON.stringify(salesTriggers)}\n\nAnalyze and score opportunities.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: OPPORTUNITY_SCORER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        const opportunities: OpportunityScore[] = json.opportunities || [];
        
        let overallScore = 0;
        if (opportunities.length > 0) {
          const sum = opportunities.reduce((acc, curr) => acc + curr.score, 0);
          overallScore = Math.round(sum / opportunities.length);
        }

        return {
          opportunities,
          overallOpportunityScore: overallScore,
        };
      } catch (error) {
        logger.error(`OpportunityScorer live analysis failed for ${profile.name}. Falling back to mock.`, error);
      }
    }

    return this.getMockScores(profile.name);
  }

  private getMockScores(companyName: string): {
    opportunities: OpportunityScore[];
    overallOpportunityScore: number;
  } {
    const name = companyName.toLowerCase();
    let opportunities: OpportunityScore[] = [];

    if (name.includes('stripe')) {
      opportunities = [
        {
          opportunityName: 'Localized Transaction Routing Optimization',
          score: 90,
          rationale: 'Stripe experiences transaction decline peaks in localized European card networks. Strategic fit is critical since payment stability is their core selling hook.',
        },
        {
          opportunityName: 'API Integration Delivery Acceleration',
          score: 86,
          rationale: 'Long upmarket onboarding cycles create sales friction. Standard developer tool optimizations can directly cut time-to-value for Stripe Connect accounts.',
        },
      ];
    } else if (name.includes('hubspot')) {
      opportunities = [
        {
          opportunityName: 'Upmarket Enterprise Database Sync Pipelines',
          score: 88,
          rationale: 'As HubSpot actively acquires upmarket enterprise customers, syncing bulk CRM tables cleanly without latency becomes a high-priority retention vector.',
        },
        {
          opportunityName: 'Generative AI Content Governance Solutions',
          score: 80,
          rationale: 'Integrating content writing aids creates a strategic need for automated style guides to secure enterprise compliance.',
        },
      ];
    } else if (name.includes('salesforce')) {
      opportunities = [
        {
          opportunityName: 'Real-Time Einstein Agent Data Grounding Connectors',
          score: 92,
          rationale: 'Autonomous AI agents need clean data. Providing pre-built connectors to external databases leverages their massive new Agentforce product rollout.',
        },
        {
          opportunityName: 'Total Cost of Ownership reduction systems',
          score: 84,
          rationale: 'Mid-market accounts are searching for ways to decrease administrative overhead. Outbound CRM sync features address this pain point directly.',
        },
      ];
    } else if (name.includes('notion')) {
      opportunities = [
        {
          opportunityName: 'Enterprise Wiki Data-Clutter Auditing Tools',
          score: 86,
          rationale: 'Organizations with over 150 employees suffer from doc sprawl. Automatic indexing and permission cleanup directly improve employee wiki adoption.',
        },
        {
          opportunityName: 'Notion Sites publishing layout optimization',
          score: 78,
          rationale: 'Accelerating page rendering times on Notion Sites helps users deploy professional CMS layouts without external platforms.',
        },
      ];
    } else if (name.includes('shopify')) {
      opportunities = [
        {
          opportunityName: 'Multi-Merchant Inventory Sync Ledger',
          score: 89,
          rationale: 'Shopify Collective requires real-time sync across independent storefronts to avoid order reconciliation support backlogs.',
        },
        {
          opportunityName: 'Audiences network transaction feedback loops',
          score: 83,
          rationale: 'Connecting customer ad spend indicators directly to merchant order values helps justify premium Shopify Plus subscription fees.',
        },
      ];
    } else {
      opportunities = [
        {
          opportunityName: 'Integrated Workflow automation',
          score: 75,
          rationale: 'Basic operational coordination gaps are forming as headcount expands, creating a standard fit for automation tools.',
        },
        {
          opportunityName: 'Advanced Outbound customer engagement CRM updates',
          score: 70,
          rationale: 'Organic inbound traffic plateauing suggests that optimizing sales speed will help build pipeline volume.',
        },
      ];
    }

    const sum = opportunities.reduce((acc, curr) => acc + curr.score, 0);
    const overallOpportunityScore = opportunities.length > 0 ? Math.round(sum / opportunities.length) : 0;

    return {
      opportunities,
      overallOpportunityScore,
    };
  }
}
export default OpportunityScorer;
