import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, ScoredInsight } from './types';
import { INSIGHT_GENERATOR_PROMPT } from '../../prompts/research-prompts';
import { logger } from '../../../utils/logger';

export class InsightGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Generates a synthesized executive summary and action items.
   */
  public async generate(
    profile: CompanyProfile,
    opportunities: ScoredInsight[],
  ): Promise<{ summary: string; recommendations: string[] }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Profile: ${JSON.stringify(profile)}\nOpportunities: ${JSON.stringify(
          opportunities,
        )}\nGenerate synthesis and recommendations.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: INSIGHT_GENERATOR_PROMPT,
        });

        const text = result.response.text();
        const json = JSON.parse(text);
        return {
          summary: json.summary || '',
          recommendations: json.recommendations || [],
        };
      } catch (error) {
        logger.error(
          `InsightGenerator live synthesis failed for company "${profile.name}". Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockSynthesis(profile.name);
  }

  private getMockSynthesis(companyName: string): { summary: string; recommendations: string[] } {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        summary:
          'Stripe is a market-leading payment processing infrastructure platform generating custom API billing suites. As Stripe scales its global merchant acquisitions following recent funding, high-value opportunities exist to pitch them specialized automated tax plugins and localized acquiring logic tools to optimize transaction routing in emerging regions.',
        recommendations: [
          'Pitch the Smart-Route SDK as a tool to reduce cross-border checkout failures for Stripe Connect platforms.',
          'Highlight our automated tax-compliance sync modules during calls, matching their Stripe Tax feature release gaps.',
          'Connect with Solutions Engineering leads in New York to discuss payment terminal latency improvements.',
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        summary:
          'HubSpot is an industry-leading B2B CRM and marketing automation software suite focusing on SMB and mid-market growth. To combat enterprise customer churn to platforms like Salesforce, HubSpot is actively expanding Service Hub options and AI automation tools, creating opportunities to pitch custom messaging APIs and legacy database migration connectors.',
        recommendations: [
          'Approach sales enablement leads with a demonstration of customized workflow automation plugins matching Salesforce capabilities.',
          'Suggest integration of WhatsApp business communications inside Customer Service templates to target European customer segments.',
          'Target channel partner directors with a pitch to automate agency commission tracking pipelines.',
        ],
      };
    }

    // Default generic mock fallback
    return {
      summary: `${companyName} is an enterprise technology provider operating in the cloud software space. By optimizing operational integrations and expanding compliance capabilities, the company is positioned to scale its market footprint, presenting sales hooks centered around automated workflow tools.`,
      recommendations: [
        `Present workflow automation integrations to IT managers to reduce system lag.`,
        `Propose localized compliance modules to support expansion in international markets.`,
      ],
    };
  }
}
export default InsightGenerator;
