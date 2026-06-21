import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, CompetitorProfile, ProductService, ScoredInsight } from './types';
import { OPPORTUNITY_DISCOVERY_PROMPT } from '../../prompts/research-prompts';
import { logger } from '../../../utils/logger';

export class OpportunityDiscoveryEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Identifies growth opportunities and operational risks with confidence scores.
   */
  public async discover(
    profile: CompanyProfile,
    products: ProductService[],
    competitors: CompetitorProfile[],
  ): Promise<{ opportunities: ScoredInsight[]; risks: ScoredInsight[] }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Profile: ${JSON.stringify(profile)}\nProducts: ${JSON.stringify(
          products,
        )}\nCompetitors: ${JSON.stringify(competitors)}\nIdentify opportunities and risks.`;
        
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: OPPORTUNITY_DISCOVERY_PROMPT,
        });

        const text = result.response.text();
        const json = JSON.parse(text);
        return {
          opportunities: json.opportunities || [],
          risks: json.risks || [],
        };
      } catch (error) {
        logger.error(
          `OpportunityDiscoveryEngine live run failed for company "${profile.name}". Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockOpportunities(profile.name);
  }

  private getMockOpportunities(companyName: string): {
    opportunities: ScoredInsight[];
    risks: ScoredInsight[];
  } {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        opportunities: [
          {
            insight:
              'Integrate an automated tax-compliance sync submodule mapping transaction records to QuickBooks for marketplace customers.',
            confidence: 90,
            source: 'Product catalog analysis & tech stack gaps',
            type: 'technology',
          },
          {
            insight:
              'Offer localized acquiring routing layers for growing Series B marketplaces expanding in Latin American regions.',
            confidence: 85,
            source: 'Hiring signals for local partners',
            type: 'expansion',
          },
          {
            insight:
              'Optimize checkout conversion by deploying localized billing tools tailored specifically for B2B SaaS usage parameters.',
            confidence: 78,
            source: 'Competitor comparison with Adyen',
            type: 'operational',
          },
        ],
        risks: [
          {
            insight:
              'Potential transaction volume churn as high-growth customers transition acquiring volumes directly to specialized terminals (like Adyen).',
            confidence: 80,
            source: 'Market share intelligence logs',
          },
          {
            insight:
              'Elevated chargeback rates in rapidly scaling marketplace segments leading to regulatory card network fines.',
            confidence: 65,
            source: 'Industry regulatory reports',
          },
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        opportunities: [
          {
            insight:
              'Promote advanced CRM customizations and automated sales sequences directly matching Salesforce enterprise capabilities for mid-market clients.',
            confidence: 92,
            source: 'Competitor comparison with Salesforce',
            type: 'challenge',
          },
          {
            insight:
              'Integrate real-time WhatsApp business API communications directly inside Service Hub templates for European customer teams.',
            confidence: 80,
            source: 'Hiring focus on international customer experience roles',
            type: 'technology',
          },
          {
            insight:
              'Launch customized agency co-marketing workflows to automate commission tracking and partner asset deployments.',
            confidence: 75,
            source: 'Agency channel partner reviews',
            type: 'expansion',
          },
        ],
        risks: [
          {
            insight:
              'Customer lifecycle contraction or downgrades during economic corrections as SMB businesses switch to low-cost alternatives (like Pipedrive).',
            confidence: 85,
            source: 'Churn reports in SMB segments',
          },
          {
            insight:
              'CRM data synchronization lag with custom legacy databases resulting in user friction during migrations.',
            confidence: 70,
            source: 'Technical developer forum reports',
          },
        ],
      };
    }

    // Default generic mock fallback
    return {
      opportunities: [
        {
          insight: `Introduce structured cloud workflow automation tools to increase developer efficiency at ${companyName}.`,
          confidence: 85,
          source: 'Generic business profile analysis',
          type: 'technology',
        },
        {
          insight: `Deploy localized compliance tracking protocols to expand sales capabilities in European verticals.`,
          confidence: 70,
          source: 'Competitor advantage analysis',
          type: 'expansion',
        },
      ],
      risks: [
        {
          insight: 'Slow adoption of GenAI tooling leading to competitor efficiency advantages.',
          confidence: 75,
          source: 'Technical stack evaluation',
        },
      ],
    };
  }
}
export default OpportunityDiscoveryEngine;
