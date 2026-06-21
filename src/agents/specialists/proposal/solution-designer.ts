import { GoogleGenerativeAI } from '@google/generative-ai';
import { SolutionDesign } from './types';
import { SOLUTION_DESIGN_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class SolutionDesigner {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async design(
    companyName: string,
    researchData: Record<string, unknown>,
    opportunityData: Record<string, unknown>,
  ): Promise<SolutionDesign> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Name: ${companyName}\nResearch:\n${JSON.stringify(
          researchData,
        )}\nOpportunity Analysis:\n${JSON.stringify(opportunityData)}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: SOLUTION_DESIGN_PROMPT,
        });

        return JSON.parse(result.response.text()) as SolutionDesign;
      } catch (error) {
        logger.error(
          `SolutionDesigner live design failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockSolution(companyName);
  }

  private getMockSolution(companyName: string): SolutionDesign {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        solutionName: 'Stripe Unified Payment Routing & connect Onboarding Suite',
        objectives: [
          'Reduce card checkout transaction decline rates in the European region by 15%',
          'Decrease time-to-value for Stripe Connect sub-accounts from 14 days to 3 days',
          'Automate developer onboarding documentation verification using custom AI middleware',
        ],
        businessBenefits: [
          'Capture up to $4.5M in previously lost transactions annually',
          'Increase Connect merchant conversion and satisfaction rating by 28%',
          'Lower administrative solution engineering overhead by 35%',
        ],
        implementationApproach:
          'We propose deploying a lightweight routing middleware layer that integrates with Stripe APIs, dynamically checking card network indicators and optimizing localized transaction flows prior to transaction initiation.',
        expectedOutcomes: [
          'Decline rate cuts across EU networks',
          'Streamlined Connect onboarding developer dashboards',
          'Zero-latency automated KYC validation helper connect triggers',
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        solutionName: 'HubSpot Upmarket Data Sync Sync & Content Governance Engine',
        objectives: [
          'Achieve zero-lag data sync pipelines for upmarket enterprise bulk CRM tables',
          'Enforce strict style guides and compliance guardrails across generative AI content features',
        ],
        businessBenefits: [
          'Accelerate enterprise deal size expansions by 22%',
          'Secure content compliance across regulated marketing and customer operations',
          'Decrease third-party middleware licensing dependency costs by $40K/year',
        ],
        implementationApproach:
          'Deploying pre-packaged data streaming connectors built on high-performance queues directly feeding CRM relational schemas, alongside a custom semantic linting model to check generated text in real time.',
        expectedOutcomes: [
          'Sync latency under 5 seconds for enterprise CRM objects',
          '100% style compliance for drafts and templates before customer delivery',
        ],
      };
    }

    if (name.includes('salesforce')) {
      return {
        solutionName: 'Einstein Agent Data Grounding Connector Suite',
        objectives: [
          'Provide secure, low-latency connectors to ground Einstein AI Agents with external ERP data',
          'Reduce custom Salesforce developer maintenance hours by automating data layer syncing',
        ],
        businessBenefits: [
          'Unlock the full potential of Agentforce deployments with real-time operational context',
          'Cut total cost of ownership (TCO) for Salesforce administration by 20%',
          'Deliver automated, context-grounded AI support interactions with zero security leakage',
        ],
        implementationApproach:
          'Integrate secure metadata brokers between Salesforce Data Cloud and enterprise backend databases, exposing secure REST endpoints natively recognized by Einstein Agent workflows.',
        expectedOutcomes: [
          'Sub-second context grounding for Einstein queries',
          'Minimized API custom developer integration backlogs',
        ],
      };
    }

    if (name.includes('notion')) {
      return {
        solutionName: 'Enterprise Wiki Governance and Notion Sites Optimizer',
        objectives: [
          'Identify and auto-archive duplicate or outdated wiki pages across team workspaces',
          'Optimize Notion Sites page load times to match premium standard headless CMS formats',
        ],
        businessBenefits: [
          'Raise workspace doc accuracy and user search speeds by 30%',
          'Retain premium enterprise plans by offering built-in data compliance checks',
          'Attract corporate marketing teams utilizing Notion as a public web publishing hub',
        ],
        implementationApproach:
          'A background crawler that indexes workspace block metadata, applies heuristic duplication filters, and integrates with CDN endpoints to cache static static page assets.',
        expectedOutcomes: [
          'De-duplication of up to 40% of dormant documentation pages',
          '95+ Google PageSpeed Score rating on Notion-hosted company sites',
        ],
      };
    }

    if (name.includes('shopify')) {
      return {
        solutionName: 'Shopify Collective Sync Ledger & Audience Feedback Pipeline',
        objectives: [
          'Synchronize real-time inventory ledger pools across merchant network partners',
          'Track transaction values directly to ad network feedback loops to verify ROAS metrics',
        ],
        businessBenefits: [
          'Eliminate customer refund backlogs caused by out-of-stock orders by 98%',
          'Retain Shopify Plus merchant contracts by proving ad conversion yield uplifts',
          'Drive merchant collaboration GMV (Gross Merchandise Volume) growth by 15%',
        ],
        implementationApproach:
          'Connecting decentralized merchant stores through webhook subscription clusters, updating shared stock availability in an in-memory ledger database with sub-second synchronization.',
        expectedOutcomes: [
          'Zero discrepancies between vendor catalog listings and merchant orders',
          'Accurate transaction valuation triggers in Shopify Audiences dashboards',
        ],
      };
    }

    return {
      solutionName: `${companyName} B2B Operations Scaling suite`,
      objectives: [
        'Streamline B2B workflows and cut manual operational entry points',
        'Modernize data pipeline reporting tools across business units',
      ],
      businessBenefits: [
        'Improve operational execution speeds by 25%',
        'Deliver accurate dashboards to executive stakeholders',
      ],
      implementationApproach:
        'Standardizing system integration nodes using low-code API automation pipelines and clean dashboard dashboards.',
      expectedOutcomes: [
        'Automation of manual workflows',
        'Consolidated operational report databases',
      ],
    };
  }
}
export default SolutionDesigner;
