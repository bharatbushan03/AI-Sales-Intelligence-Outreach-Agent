import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PainPoint, OpportunityScore, StrategicRecommendation } from './types';
import { RECOMMENDATION_ENGINE_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class RecommendationEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async recommend(
    profile: CompanyProfile,
    painPoints: PainPoint[],
    opportunities: OpportunityScore[],
  ): Promise<StrategicRecommendation[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints,
        )}\nOpportunities:\n${JSON.stringify(opportunities)}\n\nAnalyze and generate strategic recommendations.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: RECOMMENDATION_ENGINE_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.recommendations || [];
      } catch (error) {
        logger.error(
          `RecommendationEngine live analysis failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockRecommendations(profile.name);
  }

  private getMockRecommendations(companyName: string): StrategicRecommendation[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          solution: 'Localized routing and dynamic currency configuration suite',
          messagingThemes: [
            'Minimize friction inside European banking networks',
            'Sovereign transactions optimization',
          ],
          valueProps: [
            'Recover up to 3-5% of previously declined localized EU transactions',
            'Instantly enable localized merchant terminals through simple code configuration updates',
          ],
          talkingPoints: [
            'Localized decline rates are silent conversion leakage metrics.',
            'Our dynamic routing suite matches transaction endpoints to the highest-performing regional bank.',
          ],
          discoveryQuestions: [
            'How are localized decline rates currently tracked inside EU and APAC regions?',
            'What is the current engineering backlog for onboarding custom localized payment gateways?',
          ],
          objectionPrep: [
            {
              objection: 'We already use Stripe Radar and smart retries for decline recovery.',
              response:
                'Smart retries run after the initial fail; our dynamic routing selects the correct gateway before execution to prevent triggers.',
            },
          ],
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          solution: 'Enterprise Bulk Data Sync and Schema Cleaner API',
          messagingThemes: [
            'Scaling upmarket database limits securely',
            'Zero latency dashboards for enterprise admins',
          ],
          valueProps: [
            'Reduce standard custom database latency by 45%',
            'Cut the reliance on specialized Salesforce administrators by simplifying migrations to Sales Hub Enterprise',
          ],
          talkingPoints: [
            'Enterprise CRM adoption suffers when page loading takes longer than 2 seconds.',
            'A clean database structure ensures pipeline dashboards are always real-time ready.',
          ],
          discoveryQuestions: [
            'How many custom database rules are currently active on Salesforce before migration?',
            'What latency issues do sales representatives experience when pulling reports during peak hours?',
          ],
          objectionPrep: [
            {
              objection: 'Our existing database setup is too deeply customized to migrate.',
              response:
                'Our API dynamically maps Salesforce objects, allowing a parallel sync to test latency before committing to cutoff.',
            },
          ],
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          solution: 'Einstein 1 Data Grounding Ledger Connector',
          messagingThemes: [
            'Feed autonomous AI agents with clean telemetry',
            'Zero latency sync to Einstein Data Cloud',
          ],
          valueProps: [
            'Enable autonomous Agentforce actions to execute 30% faster',
            'Eliminate compliance risks by checking permissions before data hits Einstein models',
          ],
          talkingPoints: [
            'AI CRM outputs are only as reliable as the telemetry feeding them.',
            'Our ledger connector synchronizes external database tables directly into Salesforce.',
          ],
          discoveryQuestions: [
            'What is the current latency of sync jobs going into Einstein Data Cloud?',
            'How are data privacy rules enforced when Einstein agents query external APIs?',
          ],
          objectionPrep: [
            {
              objection: 'We already build custom API endpoints for Einstein agents.',
              response:
                'Custom endpoints require code updates on every schema change; our ledger adapts automatically.',
            },
          ],
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          solution: 'Enterprise Wiki Permission Auditor and index engine',
          messagingThemes: [
            'Clean wiki clutter automatically',
            ' granulated document permission controls',
          ],
          valueProps: [
            'Improve information search efficiency by 50%',
            'Prevent compliance risks by flagging inherited permissions that leak sensitive documents',
          ],
          talkingPoints: [
            'Wiki directories deteriorate when scaling teams add pages without catalog rules.',
            'Automatic permission checking helps guarantee compliance standards inside workspace databases.',
          ],
          discoveryQuestions: [
            'How often are permission audits manually performed on internal wikis?',
            'What is the search success rate for employees looking for onboarding templates?',
          ],
          objectionPrep: [
            {
              objection: 'Our employees manage their own workspace permissions.',
              response:
                'Our auditor runs silently in the background, alerting administrators to leaks without changing user workflows.',
            },
          ],
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          solution: 'Multi-Merchant Collective inventory reconciliation engine',
          messagingThemes: [
            'Frictionless merchant dropshipping pipelines',
            'Automatic stock updates across storefront networks',
          ],
          valueProps: [
            'Reduce inventory discrepancies to 0% across partner channels',
            'Decrease order reconciliation support tickets by 40%',
          ],
          talkingPoints: [
            'Dropship networks lose brand loyalty if out-of-stock items can still be ordered.',
            'Real-time inventory mapping builds seller network trust.',
          ],
          discoveryQuestions: [
            'How are seller partner inventories currently synchronized on Shopify Collective?',
            'What is the average overhead cost of manual order reconciliation errors?',
          ],
          objectionPrep: [
            {
              objection: 'We already sync using third-party CSV automation tools.',
              response:
                'CSV runs on schedules and creates data gaps; our ledger uses webhooks to sync stock instantly.',
            },
          ],
        },
      ];
    }

    // Generic mock recommendations
    return [
      {
        solution: 'Workflow Integration Suite',
        messagingThemes: ['De-duplicate operations', 'Bridge administrative silos'],
        valueProps: [
          'Cut weekly task coordination overhead by 5 hours per manager',
          'Consolidate data visibility into a single dashboard',
        ],
        talkingPoints: [
          'Siloed systems slow down customer acquisition speed.',
          'Unified workflows let managers focus on value.',
        ],
        discoveryQuestions: [
          'What are the primary operational bottlenecks in your team right now?',
          'How many systems must a rep log into to execute a standard transaction?',
        ],
        objectionPrep: [
          {
            objection: 'We are satisfied with our current manual processes.',
            response:
              'Manual tasks limit team growth potential; our software automates updates to save time.',
          },
        ],
      },
    ];
  }
}
export default RecommendationEngine;
