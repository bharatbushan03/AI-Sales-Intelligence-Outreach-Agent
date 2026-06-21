import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, GrowthSignal } from './types';
import { GROWTH_SIGNAL_ANALYZER_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class GrowthSignalAnalyzer {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async analyze(
    profile: CompanyProfile,
    researchSignals?: unknown,
  ): Promise<GrowthSignal[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nResearch Signals:\n${JSON.stringify(
          researchSignals,
        )}\n\nAnalyze and identify growth signals.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: GROWTH_SIGNAL_ANALYZER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.growthSignals || [];
      } catch (error) {
        logger.error(`GrowthSignalAnalyzer live analysis failed for ${profile.name}. Falling back to mock.`, error);
      }
    }

    return this.getMockGrowthSignals(profile.name);
  }

  private getMockGrowthSignals(companyName: string): GrowthSignal[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          signal: 'Active hiring growth in localized support engineering groups',
          significance: 'Indicates high customer ticket backlogs in non-US networks, suggesting operational overhead.',
          confidence: 90,
          recommendedApproach: 'Pitch automated onboarding workflow solutions to help integration engineers focus on core APIs.',
        },
        {
          signal: 'Expansion of Stripe Tax and revenue compliance modules',
          significance: 'Stripe is targeting complex multinational companies facing intricate global vat and compliance frameworks.',
          confidence: 85,
          recommendedApproach: 'Introduce automated tax ledger integrations that bridge Stripe data directly with enterprise ERP databases.',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          signal: '14% Year-over-Year headcount increase with heavy focus on upmarket Enterprise Sales EAs',
          significance: 'Confirms HubSpot is actively pushing out of its traditional SMB base into mid-market and enterprise domains.',
          confidence: 92,
          recommendedApproach: 'Offer advanced data-cleansing and sync solutions that help new enterprise sales reps keep pipelines pristine.',
        },
        {
          signal: 'Integration of generative AI tools into Content Hub',
          significance: 'Highlights corporate priority on making content creation and marketing automations accessible to non-technical creators.',
          confidence: 88,
          recommendedApproach: 'Suggest custom model tuning tools that lock brand identity standards into their AI workspaces.',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          signal: 'Massive investment and rollout of Einstein 1 autonomous agents',
          significance: 'Highlights corporate transition from passive CRM systems into autonomous enterprise workflows.',
          confidence: 94,
          recommendedApproach: 'Present custom external API routing tools that allow Einstein agents to call third-party services securely.',
        },
        {
          signal: 'Aggressive data center partnerships in EU and Japan',
          significance: 'Addresses strict localized data sovereignty compliance rules for enterprise government and finance accounts.',
          confidence: 86,
          recommendedApproach: 'Pitch compliance monitoring tools that audit transaction logging layouts across multiple geographic regions.',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          signal: 'Launch of Notion Sites and collaborative publishing tools',
          significance: 'Notion is positioning itself as a hybrid CMS and wiki, expanding its user footprint into marketing and content creators.',
          confidence: 87,
          recommendedApproach: 'Offer digital asset management integrations that pull and sync image catalogs directly to wiki pages.',
        },
        {
          signal: 'Hiring spike for Security Compliance Engineers',
          significance: 'Indicates preparations for SOC2 Type II or upmarket enterprise federal procurement bids.',
          confidence: 89,
          recommendedApproach: 'Highlight SOC-compliant document vaulting systems that integrate with databases.',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          signal: 'Rapid expansion of Shopify Collective dropshipping network',
          significance: 'Aims to reduce inventory risks for merchants by facilitating direct store-to-store product transfers.',
          confidence: 91,
          recommendedApproach: 'Suggest cross-store order reconciliation and inventory management tools that sync in real-time.',
        },
        {
          signal: 'Release of Shopify Audiences v2 advertising network updates',
          significance: 'Focuses on improving localized ad attribution and custom targeting using collective merchant data networks.',
          confidence: 85,
          recommendedApproach: 'Highlight analytical dashboard packages that map ad-spend ROI directly against core transactions.',
        },
      ];
    }

    // Generic mock signals
    return [
      {
        signal: 'Gradual increase in engineering department headcount',
        significance: 'Shows investment in technical capabilities, indicating a solid foundation for product development.',
        confidence: 75,
        recommendedApproach: 'Offer system stability and monitoring tools designed for scaling engineering organizations.',
      },
      {
        signal: 'Expanding market footprint via localized agency partner channels',
        significance: 'Indicates search for indirect customer acquisition to offset digital marketing spend caps.',
        confidence: 70,
        recommendedApproach: 'Pitch partner relation management dashboards to track channel margins.',
      },
    ];
  }
}
export default GrowthSignalAnalyzer;
