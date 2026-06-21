import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PainPoint } from './types';
import { ProductService, CompetitorProfile } from '../research/types';
import { PAIN_POINT_DETECTOR_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class PainPointDetector {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async detect(
    profile: CompanyProfile,
    products: ProductService[],
    competitors: CompetitorProfile[],
  ): Promise<PainPoint[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nProducts:\n${JSON.stringify(
          products,
        )}\nCompetitors:\n${JSON.stringify(competitors)}\n\nAnalyze and detect pain points.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: PAIN_POINT_DETECTOR_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.painPoints || [];
      } catch (error) {
        logger.error(`PainPointDetector live analysis failed for ${profile.name}. Falling back to mock.`, error);
      }
    }

    return this.getMockPainPoints(profile.name);
  }

  private getMockPainPoints(companyName: string): PainPoint[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          title: 'High localized payment drop-offs in Europe',
          explanation: 'Foreign exchange and routing inefficiencies leading to card decline rates up to 5% higher in localized merchant networks.',
          evidence: 'Active recruiting for EU payments compliance officer and localized solutions support teams.',
          confidenceScore: 88,
          businessImpact: 'high',
        },
        {
          title: 'Complex enterprise integration cycle bottlenecks',
          explanation: 'Stripe\'s premium APIs require specialized developer onboarding, causing sales cycles for larger accounts to exceed 6 months.',
          evidence: 'High volume of community forum queries relating to advanced Connect and Tax API integrations.',
          confidenceScore: 82,
          businessImpact: 'medium',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          title: 'Enterprise market share churn pressure',
          explanation: 'Upmarket buyers migrating to Salesforce due to custom object constraints and advanced reporting capabilities in large datasets.',
          evidence: 'Increasing product feature release velocity for Sales Hub Enterprise to match Salesforce parity.',
          confidenceScore: 85,
          businessImpact: 'high',
        },
        {
          title: 'Channel partner onboarding friction',
          explanation: 'SaaS agencies reporting difficulty in scaling customer setups through the partner portal under complex multi-portal configurations.',
          evidence: 'Recent redesign of partner directories and certifications schemes.',
          confidenceScore: 78,
          businessImpact: 'medium',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          title: 'Prohibitive cost of ownership and custom maintenance',
          explanation: 'Mid-market customers experiencing high integration costs and reliance on expensive Salesforce administrators.',
          evidence: 'Rising popularity of nimbler competitor platforms like HubSpot and Pipedrive in the SMB segment.',
          confidenceScore: 92,
          businessImpact: 'high',
        },
        {
          title: 'Legacy system performance latency with large scale tables',
          explanation: 'Custom Apex code and older CRM data structures causing dashboards and database queries to experience lag during peak cycles.',
          evidence: 'Recent heavy marketing push on Einstein 1 Platform and Data Cloud real-time integrations.',
          confidenceScore: 84,
          businessImpact: 'medium',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          title: 'Data fragmentation and structural wiki maintenance overhead',
          explanation: 'Workspace databases losing structural integrity over time as non-technical employees add unsynced tables and documents.',
          evidence: 'High churn rates in teams exceeding 150 employees due to wiki clutter and search query failures.',
          confidenceScore: 86,
          businessImpact: 'high',
        },
        {
          title: 'Friction in enterprise administration and permission inheritance',
          explanation: 'Large organisations reporting difficulties in managing workspace compliance rules and granular database permission inheritance.',
          evidence: 'Introduction of new security controls and administrative audits in Enterprise packages.',
          confidenceScore: 80,
          businessImpact: 'medium',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          title: 'High reliance on external app stores for core functions',
          explanation: 'Merchants experiencing compounding costs and performance bottlenecks from combining multiple third-party apps for standard subscription and marketing functions.',
          evidence: 'Shopify systematically acquiring or building in-house alternatives for subscriptions, flow automation, and emails.',
          confidenceScore: 89,
          businessImpact: 'high',
        },
        {
          title: 'Wholesale B2B commerce transaction friction',
          explanation: 'Legacy retail merchants reporting that Shopify Plus B2B portals do not easily support custom credit terms and complex net-payment processes.',
          evidence: 'Active development and release logs focusing on headless B2B APIs and ERP connections.',
          confidenceScore: 83,
          businessImpact: 'medium',
        },
      ];
    }

    // Generic mock pain points
    return [
      {
        title: 'Operational scaling bottlenecks',
        explanation: 'Increasing administrative and coordination overhead as headcount expands without integrated workflows.',
        evidence: 'General growth indicators showing rising organizational complexity.',
        confidenceScore: 75,
        businessImpact: 'medium',
      },
      {
        title: 'Customer acquisition cost efficiency caps',
        explanation: 'Standard inbound sales funnels reaching maturity, creating pressure to build highly personalized outbound pipeline motions.',
        evidence: 'Static organic website traffic metrics coupled with competitive market entrance.',
        confidenceScore: 70,
        businessImpact: 'medium',
      },
    ];
  }
}
export default PainPointDetector;
