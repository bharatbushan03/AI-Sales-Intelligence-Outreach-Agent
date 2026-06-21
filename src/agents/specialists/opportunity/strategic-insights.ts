import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PainPoint, OpportunityScore, ExecutiveInsight } from './types';
import { STRATEGIC_INSIGHT_GENERATOR_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class StrategicInsightGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    profile: CompanyProfile,
    painPoints: PainPoint[],
    opportunities: OpportunityScore[],
  ): Promise<{
    executiveSummary: string;
    executiveInsights: ExecutiveInsight[];
  }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints,
        )}\nOpportunities:\n${JSON.stringify(opportunities)}\n\nAnalyze and generate strategic executive insights.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: STRATEGIC_INSIGHT_GENERATOR_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return {
          executiveSummary: json.executiveSummary || '',
          executiveInsights: json.executiveInsights || [],
        };
      } catch (error) {
        logger.error(`StrategicInsightGenerator live analysis failed for ${profile.name}. Falling back to mock.`, error);
      }
    }

    return this.getMockInsights(profile.name);
  }

  private getMockInsights(companyName: string): {
    executiveSummary: string;
    executiveInsights: ExecutiveInsight[];
  } {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        executiveSummary: 'Stripe is experiencing localized decline rates in its European networks, coupled with long upmarket enterprise onboarding cycles. Implementing smart transaction routing and API delivery frameworks will recover transaction leakage and speed up Connect onboarding pipelines.',
        executiveInsights: [
          {
            insight: 'European transactions suffer from higher localized decline rates compared to domestic networks.',
            confidence: 88,
            evidence: 'Active recruiting logs for compliance and payment support infrastructure teams in regional offices.',
            implication: 'Unoptimized payment routes create silent conversion leakage that limits customer expansion metrics.',
          },
          {
            insight: 'Advanced API complexities prolong enterprise Connect integration pipelines past 6 months.',
            confidence: 82,
            evidence: 'High levels of support ticket backlogs relating to custom taxing and billing integrations.',
            implication: 'Slower time-to-value cycles delay the recognition of transaction processing fee revenue.',
          },
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        executiveSummary: 'HubSpot is expanding into the upmarket enterprise CRM segment, creating data sync bottlenecks and agency onboarding friction. Standardized bulk sync managers and AI governance tools will enhance adoption rates among enterprise sales administrators.',
        executiveInsights: [
          {
            insight: 'Upmarket enterprise customers require custom schemas and high data capacity reporting dashboards.',
            confidence: 90,
            evidence: 'Aggressive release iterations focusing on custom CRM objects and enterprise Sales Hub parity.',
            implication: 'Without low-latency data sync pipelines, HubSpot faces migration barriers from large enterprise Salesforce accounts.',
          },
          {
            insight: 'SaaS partner agency setup friction slows content marketing and portal onboarding pipelines.',
            confidence: 80,
            evidence: 'Redesign logs for partner directory portals and certification templates.',
            implication: 'Friction in the channel program restricts indirect SMB client acquisition speed.',
          },
        ],
      };
    }

    if (name.includes('salesforce')) {
      return {
        executiveSummary: 'Salesforce has launched Einstein 1 and autonomous Agentforce agents, creating integration opportunities for external data sync. Outbound CRM sync features address mid-market cost concerns by decreasing specialized administrative expenses.',
        executiveInsights: [
          {
            insight: 'Autonomous AI agents need clean, low-latency data feeds from external ledgers to execute actions.',
            confidence: 93,
            evidence: 'Marketing launch logs focusing on Einstein 1 Platform and Agentforce workflows.',
            implication: 'Data fragmentation outside Salesforce databases restricts the capabilities of Einstein agents.',
          },
          {
            insight: 'High custom maintenance costs pressure mid-market accounts toward nimbler competitors.',
            confidence: 85,
            evidence: 'Increased customer churn rates in the SMB segment to platforms like HubSpot.',
            implication: 'Simplifying CRM administration workflows is a core defense strategy for retaining customers.',
          },
        ],
      };
    }

    if (name.includes('notion')) {
      return {
        executiveSummary: 'Notion is expanding collaborative workspace features, but large organizations face wiki clutter and permission leaks. Automated directory auditing tools and SOC compliance frameworks will support Notion in securing upmarket enterprise accounts.',
        executiveInsights: [
          {
            insight: 'Workspace database clutter causes employees to lose information search efficiency in larger organizations.',
            confidence: 86,
            evidence: 'High churn rates in scaling organizations exceeding 150 employees.',
            implication: 'Unstructured doc sprawl degrades wiki usefulness, leading to employee churn.',
          },
          {
            insight: 'Inherited permissions inside nested page structures create sensitive database leaks.',
            confidence: 84,
            evidence: 'Spike in recruiting for security and compliance audits.',
            implication: 'granular security leaks prevent adoption in highly regulated sectors.',
          },
        ],
      };
    }

    if (name.includes('shopify')) {
      return {
        executiveSummary: 'Shopify is launching dropshipping inventory sharing via Shopify Collective, creating sync challenges across storefronts. Integrating real-time inventory ledger systems ensures order reconciliation accuracy and merchant partner network trust.',
        executiveInsights: [
          {
            insight: 'Dropship stores face inventory discrepancies when partner sellers do not sync stock levels instantly.',
            confidence: 89,
            evidence: 'Customer support tickets relating to out-of-stock orders in collective merchant networks.',
            implication: 'Sync inconsistencies degrade buyer trust and increase customer support overhead.',
          },
          {
            insight: 'Ad network updates (Audiences v2) require transparent conversion attribution tools to prove value.',
            confidence: 85,
            evidence: 'Release updates focusing on Shopify Audiences custom tracking pixels.',
            implication: 'Transparent return-on-ad-spend dashboards justify premium merchant subscription fees.',
          },
        ],
      };
    }

    // Generic mock insights
    return {
      executiveSummary: 'The company exhibits standard operational scaling bottlenecks as headcount increases. Implementing integrated workflow managers and CRM automation tools will simplify collaboration and improve pipeline conversion velocity.',
      executiveInsights: [
        {
          insight: 'Expanding headcount increases collaboration complexity across departments.',
          confidence: 75,
          evidence: 'General organizational growth indicators showing rising complexity.',
          implication: 'Manual coordination tasks consume engineering and administration hours.',
        },
        {
          insight: 'Traditional inbound lead pipelines are reaching saturation, requiring outbound transition structures.',
          confidence: 70,
          evidence: 'Static organic website traffic metrics coupled with competitive market entrance.',
          implication: 'Developing outbound workflows is key to maintaining pipeline volume.',
        },
      ],
    };
  }
}
export default StrategicInsightGenerator;
