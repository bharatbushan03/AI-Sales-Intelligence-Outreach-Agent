import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile } from './types';
import { COMPANY_PROFILER_PROMPT } from '../../prompts/research-prompts';
import { logger } from '../../../utils/logger';

export class CompanyProfiler {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Profiles a target company based on query input.
   */
  public async profile(query: string): Promise<{
    company: CompanyProfile;
    industry: { classification: string; vertical: string; tags: string[] };
  }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Query: "${query}"\nExtract core profile details.`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: COMPANY_PROFILER_PROMPT,
        });

        const text = result.response.text();
        const json = JSON.parse(text);
        return {
          company: {
            name: json.name,
            website: json.website,
            description: json.description,
            employeeCount: json.profile?.employeeCount,
            estimatedRevenue: json.profile?.estimatedRevenue,
            founded: json.profile?.founded,
            location: json.profile?.location,
            businessModel: json.profile?.businessModel,
            targetCustomers: json.profile?.targetCustomers,
            marketPosition: json.profile?.marketPosition,
          },
          industry: json.industry,
        };
      } catch (error) {
        logger.error(
          `CompanyProfiler live query failed for query "${query}". Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockProfile(query);
  }

  private getMockProfile(query: string): {
    company: CompanyProfile;
    industry: { classification: string; vertical: string; tags: string[] };
  } {
    const q = query.toLowerCase();

    if (q.includes('stripe')) {
      return {
        company: {
          name: 'Stripe',
          website: 'stripe.com',
          description:
            'Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes.',
          employeeCount: 8500,
          estimatedRevenue: '$14.3B',
          founded: '2010',
          location: 'San Francisco, CA',
          businessModel: 'Transaction-based fees (Pay-as-you-go)',
          targetCustomers: ['SaaS Platforms', 'E-commerce Businesses', 'Marketplaces'],
          marketPosition: 'Market Leader in Online Payments',
        },
        industry: {
          classification: 'FinTech',
          vertical: 'Payment Processing Gateway',
          tags: ['Payments', 'API', 'Commerce', 'Financial Infrastructure'],
        },
      };
    }

    if (q.includes('hubspot')) {
      return {
        company: {
          name: 'HubSpot',
          website: 'hubspot.com',
          description:
            'HubSpot is a leading customer relationship management (CRM) platform that provides software for marketing, sales, service, and operations.',
          employeeCount: 7600,
          estimatedRevenue: '$2.2B',
          founded: '2006',
          location: 'Cambridge, MA',
          businessModel: 'B2B SaaS Tiered Subscriptions',
          targetCustomers: ['SMBs', 'Mid-Market Sales Teams', 'Marketing Agencies'],
          marketPosition: 'Market Leader in Inbound Marketing & CRM',
        },
        industry: {
          classification: 'SaaS',
          vertical: 'CRM & Marketing Automation',
          tags: ['CRM', 'Inbound Marketing', 'Sales Enablement', 'Customer Support'],
        },
      };
    }

    // Standard default mock mapping
    const domainName = query.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0] || 'prospect.com';
    const name = domainName.split('.')[0].toUpperCase();

    return {
      company: {
        name,
        website: domainName,
        description: `${name} is an innovative enterprise solutions provider focusing on operational scalability and digital services.`,
        employeeCount: 250,
        estimatedRevenue: '$15M',
        founded: '2018',
        location: 'New York, NY',
        businessModel: 'B2B SaaS',
        targetCustomers: ['Enterprise Teams', 'IT Managers'],
        marketPosition: 'Niche Player',
      },
      industry: {
        classification: 'Technology',
        vertical: 'Enterprise IT Services',
        tags: ['Cloud Software', 'Productivity', 'B2B Solutions'],
      },
    };
  }
}
export default CompanyProfiler;
