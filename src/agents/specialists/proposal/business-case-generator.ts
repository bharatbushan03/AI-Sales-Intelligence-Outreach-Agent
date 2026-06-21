import { GoogleGenerativeAI } from '@google/generative-ai';
import { BusinessCase, SolutionDesign } from './types';
import { BUSINESS_CASE_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class BusinessCaseGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    companyName: string,
    researchData: Record<string, unknown>,
    opportunityData: Record<string, unknown>,
    solutionDesign: SolutionDesign,
  ): Promise<BusinessCase> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Name: ${companyName}\nResearch:\n${JSON.stringify(
          researchData,
        )}\nOpportunity:\n${JSON.stringify(opportunityData)}\nSolution Design:\n${JSON.stringify(
          solutionDesign,
        )}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: BUSINESS_CASE_PROMPT,
        });

        return JSON.parse(result.response.text()) as BusinessCase;
      } catch (error) {
        logger.error(
          `BusinessCaseGenerator analysis failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockBusinessCase(companyName);
  }

  private getMockBusinessCase(companyName: string): BusinessCase {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        currentState:
          'Stripe currently faces isolated card decline spikes and merchant Connect onboarding delays. Payment checkout pages lack dynamic regional routing optimizations, leading to checkout failures on European localized networks. Developers complain about complex, manual sub-merchant validation pipelines.',
        futureState:
          'A centralized payment routing intelligence broker automatically routes checkout packets based on regional card indicators. Connect onboarding is automated via instant document parsing middleware, cutting onboarding time-to-value by 80%.',
        challenges: [
          'High credit card decline rates on localized European merchant networks',
          'Sales onboarding friction for Connect accounts due to manual document review pipelines',
          'Increased developer time spent debugging custom checkout integrations',
        ],
        businessImpact:
          'Optimizing checkout conversions directly drives increased processing volume yield, expanding overall EBITDA margins. Connect automation boosts sub-merchant retention rates and decreases manual support volumes.',
        strategicBenefits: [
          'Capture of up to $4.5M in lost checkout sales volume',
          'Strengthened position as the developer-preferred platform for multi-national marketplaces',
          'Reduction in merchant support operational costs by 35%',
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        currentState:
          'HubSpot suffers from database sync delays on high-volume enterprise objects. Enterprise clients experience up to 30 minutes of lag between systems, which stalls sales team outbound flows. Additionally, the lack of styling controls in AI content blocks creates compliance risks.',
        futureState:
          'Real-time CRM schema syncing with sub-5-second data propagation. Marketers use built-in semantic style checkers that instantly check compliance with company guidelines before publication.',
        challenges: [
          'CRM data sync lag on high-volume custom objects',
          'Compliance risks associated with unmoderated AI copy-writing blocks',
        ],
        businessImpact:
          'Fast data synchronization enables sales teams to execute outreach workflows immediately, raising outreach success rate. Automated style checkers prevent public brand compliance errors and save legal verification time.',
        strategicBenefits: [
          'Faster enterprise market deal cycles',
          'Guaranteed legal and brand compliance for enterprise marketing hubs',
        ],
      };
    }

    if (name.includes('salesforce')) {
      return {
        currentState:
          'Salesforce Einstein AI Agents operate with limited localized grounding data. Out-of-the-box setups require extensive custom developer coding to fetch external inventory or transaction histories securely, delaying Agentforce rollout schedules.',
        futureState:
          'Secure metadata connectors stream live operational database context directly to Einstein workflows, enabling instant support grounding with zero manual code.',
        challenges: [
          ' Einstein AI agent grounding limitations without custom data integration',
          'High Salesforce administrator and custom development costs',
        ],
        businessImpact:
          'Enabling autonomous AI agents with instant contextual intelligence drives lower support ticket resolution times, freeing up customer success engineers.',
        strategicBenefits: [
          'Sub-second context grounding for customer support automation',
          'Lower custom development overhead and faster time-to-market for AI agents',
        ],
      };
    }

    if (name.includes('notion')) {
      return {
        currentState:
          'Notion workspaces accumulate duplicate pages, outdated guidelines, and permission leaks as organizations expand past 150 employees. Notion-hosted sites suffer from slower loading benchmarks compared to dedicated CMS backends.',
        futureState:
          'Workspace admins run automated structural audits that suggest archives for redundant pages and clean up permission leaks, while public-facing pages load with sub-second latency.',
        challenges: [
          'Enterprise wiki page sprawl and doc duplications',
          'Page load speed constraints on public-facing Notion Sites',
        ],
        businessImpact:
          'Cleaner wikis raise internal employee search efficiency, saving hours of developer time. Faster page load speeds directly increase marketing page SEO and lead signups.',
        strategicBenefits: [
          '30% search efficiency gain for internal documents',
          'Higher conversion rates and improved search rankings on Notion public sites',
        ],
      };
    }

    if (name.includes('shopify')) {
      return {
        currentState:
          'Shopify Collective lacks real-time inventory synchronization ledger checks across vendor channels, leading to refunds for out-of-stock items. Ad network campaigns do not map conversions back to merchant purchase data, muddying ROAS proof.',
        futureState:
          'Webhooks update inventory status within a shared stock availability pool immediately, while direct checkout attributes connect conversion actions to merchant ad feedback dashboards.',
        challenges: [
          'Out-of-stock orders and customer refunds in partner networks',
          'Lack of ROAS metrics linking ad campaigns directly to purchase checkouts',
        ],
        businessImpact:
          'Eliminating out-of-stock checkouts prevents customer churn and support tickets, protecting brand reputation. Direct attribution metrics prove ad yield, reducing customer churn for premium Shopify Plus plans.',
        strategicBenefits: [
          '98% reduction in out-of-stock order backlogs',
          'Increase in overall GMV across vendor partner networks',
        ],
      };
    }

    return {
      currentState:
        'The client has manual entry points and disjointed data pipeline systems that lead to operational inefficiencies and reporting delays.',
      futureState:
        'Automated workflows and consolidated reporting dashboards connect disparate operations, providing real-time visibility to executive teams.',
      challenges: [
        'Manual processes causing bottleneck delays',
        'Reporting fragmentation across business units',
      ],
      businessImpact:
        'Standardizing operations helps scale the organization without linear headcount increases, optimizing margins.',
      strategicBenefits: [
        '25% operational efficiency improvements',
        'Accurate dashboards for real-time strategic decisions',
      ],
    };
  }
}
export default BusinessCaseGenerator;
