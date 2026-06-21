import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, CompetitorProfile } from './types';
import { COMPETITOR_ANALYZER_PROMPT } from '../../prompts/research-prompts';
import { logger } from '../../../utils/logger';

export class CompetitorAnalyzer {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Discovers and compares competitors for a company based on its profile.
   */
  public async analyze(profile: CompanyProfile): Promise<CompetitorProfile[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nIdentify key competitors.`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: COMPETITOR_ANALYZER_PROMPT,
        });

        const text = result.response.text();
        const json = JSON.parse(text);
        return json.competitors || [];
      } catch (error) {
        logger.error(
          `CompetitorAnalyzer live query failed for company "${profile.name}". Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockCompetitors(profile.name);
  }

  private getMockCompetitors(companyName: string): CompetitorProfile[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          name: 'Adyen',
          website: 'adyen.com',
          relationship: 'direct',
          advantage:
            'Stripe offers cleaner, developer-first documentation, faster sandboxing, and simpler self-service onboarding for small-to-medium businesses.',
          disadvantage:
            'Adyen maintains direct relationships with global acquiring banks, offering slightly lower card interchange fees for high-volume enterprise transactions.',
        },
        {
          name: 'PayPal (Braintree)',
          website: 'braintreepayments.com',
          relationship: 'direct',
          advantage:
            'Stripe supports a much larger index of modern localized payment methods and offers superior billing/tax automation sub-products.',
          disadvantage:
            'Braintree supports native PayPal checkout flows out of the box, which has extremely high consumer trust and conversions.',
        },
        {
          name: 'Checkout.com',
          website: 'checkout.com',
          relationship: 'direct',
          advantage:
            'Stripe features a wider ecosystem of integrations (CRMs, accounting modules) and faster feature releases.',
          disadvantage:
            'Checkout.com has specialized processing strengths in Europe and the Middle East, with granular routing controls.',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          name: 'Salesforce CRM',
          website: 'salesforce.com',
          relationship: 'direct',
          advantage:
            'HubSpot is significantly easier to learn, configure, and manage, with all hubs built on a single, unified codebase.',
          disadvantage:
            'Salesforce is the industry standard for large enterprise teams, offering highly customizable layouts, object rules, and massive third-party app exchanges.',
        },
        {
          name: 'ActiveCampaign',
          website: 'activecampaign.com',
          relationship: 'indirect',
          advantage:
            'HubSpot provides a complete, unified database matching customer support, CMS, and sales tools directly under one login.',
          disadvantage:
            'ActiveCampaign offers advanced email automation builders and behavioral triggers at a significantly lower entry price point.',
        },
        {
          name: 'Pipedrive',
          website: 'pipedrive.com',
          relationship: 'alternative',
          advantage:
            'HubSpot scales seamlessly from small startups up to mid-market corporations, offering extensive marketing tools.',
          disadvantage:
            'Pipedrive is highly focused on visual sales pipelines, keeping setup simple and cost-efficient for small sales teams.',
        },
      ];
    }

    // Default generic mock fallback
    return [
      {
        name: 'Competitor Alpha',
        website: 'competitor-alpha.com',
        relationship: 'direct',
        advantage: `Cleaner API endpoints and faster onboarding times compared to Competitor Alpha.`,
        disadvantage: 'Competitor Alpha has a larger physical distribution presence in European markets.',
      },
      {
        name: 'Competitor Beta',
        website: 'competitor-beta.com',
        relationship: 'indirect',
        advantage: `More competitive pricing schemes and modular contracts than Competitor Beta.`,
        disadvantage: 'Competitor Beta maintains longer historical contract relationships in this space.',
      },
    ];
  }
}
export default CompetitorAnalyzer;
