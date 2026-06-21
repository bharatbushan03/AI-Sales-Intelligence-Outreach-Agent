import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, ProductService } from './types';
import { WEBSITE_ANALYZER_PROMPT } from '../../prompts/research-prompts';
import { logger } from '../../../utils/logger';

export class WebsiteAnalyzer {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Analyzes a company's website products and signals based on its profile.
   */
  public async analyze(
    profile: CompanyProfile,
  ): Promise<{
    products: ProductService[];
    signals: { hiringSignal: string; growthIndicator: string };
  }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nAnalyze website details.`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: WEBSITE_ANALYZER_PROMPT,
        });

        const text = result.response.text();
        const json = JSON.parse(text);
        return {
          products: json.products || [],
          signals: json.signals || { hiringSignal: '', growthIndicator: '' },
        };
      } catch (error) {
        logger.error(
          `WebsiteAnalyzer live analysis failed for company "${profile.name}". Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockAnalysis(profile.name);
  }

  private getMockAnalysis(companyName: string): {
    products: ProductService[];
    signals: { hiringSignal: string; growthIndicator: string };
  } {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        products: [
          {
            name: 'Stripe Payments',
            description:
              'Global payment processing platform supporting credit cards, wallets, local payment methods, and currency conversions.',
            pricing: '2.9% + 30¢ per successful card charge',
          },
          {
            name: 'Stripe Billing',
            description:
              'Subscription management and billing engine allowing companies to design custom recurring models, trials, and invoices.',
            pricing: 'Starting at 0.5% on recurring volume',
          },
          {
            name: 'Stripe Connect',
            description:
              'API routing toolkit and payment compliance engine designed specifically for marketplaces and platforms.',
            pricing: 'Custom volume pricing',
          },
        ],
        signals: {
          hiringSignal:
            'Active openings for Enterprise Account Executives in London and Solutions Engineers in New York.',
          growthIndicator:
            'Recently launched Stripe Tax support in 40+ countries and integrated Apple Pay order tracking.',
        },
      };
    }

    if (name.includes('hubspot')) {
      return {
        products: [
          {
            name: 'Marketing Hub',
            description:
              'Inbound marketing automation software including lead generation forms, email marketing lists, social posting, and ad tracking.',
            pricing: 'Starts at $800/mo (Professional)',
          },
          {
            name: 'Sales Hub',
            description:
              'Enterprise-ready sales CRM featuring contact trackers, automated emails, call recorders, and deal stage analytics.',
            pricing: 'Starts at $450/mo (Professional)',
          },
          {
            name: 'Service Hub',
            description:
              'Customer support platform providing service desk tickets, knowledge bases, customer feedback surveys, and live chat queues.',
            pricing: 'Starts at $360/mo (Professional)',
          },
        ],
        signals: {
          hiringSignal:
            'Active hiring for Customer Success Managers and Devops Lead in Cambridge headquarters.',
          growthIndicator:
            'Headcount increased by 14% year-over-year. Introduced new generative AI assistants inside content editors.',
        },
      };
    }

    // Default generic mock fallback
    return {
      products: [
        {
          name: 'Core Solution Suite',
          description: `Enterprise standard cloud tools and integration systems designed to optimize operational outputs at ${companyName}.`,
          pricing: 'Contact Sales',
        },
        {
          name: 'Professional Consulting Services',
          description: 'Tailored strategic onboarding and system integration consultancy sessions.',
          pricing: 'Custom Quote',
        },
      ],
      signals: {
        hiringSignal: 'No high-priority hiring patterns detected.',
        growthIndicator: 'Expanding local market footprint with recurring software updates.',
      },
    };
  }
}
export default WebsiteAnalyzer;
