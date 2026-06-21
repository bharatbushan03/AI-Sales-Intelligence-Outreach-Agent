import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, DiscoveryCallPlan } from './types';
import { CALL_PREPARATION_ENGINE_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class CallPreparationEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async prepare(
    profile: CompanyProfile,
    painPoints?: unknown[],
    recommendations?: unknown[],
  ): Promise<DiscoveryCallPlan> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints || [],
        )}\nRecommendations:\n${JSON.stringify(recommendations || [])}\n\nPrepare a discovery call plan.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: CALL_PREPARATION_ENGINE_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.discoveryCallPlan || {};
      } catch (error) {
        logger.error(
          `CallPreparationEngine live generation failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockCallPlan(profile.name);
  }

  private getMockCallPlan(companyName: string): DiscoveryCallPlan {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        callObjective: 'Identify transaction drop-off patterns in European merchant accounts and determine developer bandwidth for API optimization.',
        agenda: [
          'Introductions & alignment on European expansion goals',
          'Review of current checkout payment decline benchmarks in EU',
          'Mapping out Stripe Connect/Tax integration bottleneck areas',
          'Discussion of custom transaction routing solutions & next steps',
        ],
        discoveryQuestions: [
          'What localized payment methods are currently seeing the lowest check-out conversion rates in Europe?',
          'How does your engineering team manage billing reconciliation and regional tax rules across multi-party Connect accounts?',
        ],
        qualificationQuestions: [
          'Who on the engineering or product side owns localized transaction routing decisions?',
          'Is optimizing EU checkout decline rates budgeted as a priority for this fiscal quarter?',
        ],
        painPointQuestions: [
          'How much revenue is currently lost due to payment decline rates in secondary European corridors?',
          'How long does the typical client onboarding integration cycle take, and where does the development team spend the most hours?',
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        callObjective: 'Understand custom object schema scaling bottlenecks and identify onboarding friction points in the agency partner portal.',
        agenda: [
          'Introductions & overview of enterprise upmarket expansion targets',
          'Review of CRM custom object limitation challenges',
          'Analysis of multi-portal onboarding friction for agency partners',
          'Discussion of automated synchronization and database partitioning templates',
        ],
        discoveryQuestions: [
          'How often do your enterprise CRM accounts hit custom object limits, and how do reps work around those limits?',
          'What are the main friction points agency partners face when scaling client setups through the partner portal?',
        ],
        qualificationQuestions: [
          'Who in Revenue Operations is responsible for CRM architecture and data hygiene policies?',
          'Do you have an active project or allocated budget this quarter to automate partner portal onboarding?',
        ],
        painPointQuestions: [
          'Does custom object configuration friction cause sales pipeline tracking delays or reporting data silos?',
          'How many admin hours are spent manually configuring CRM objects for new agency clients each month?',
        ],
      };
    }

    // Generic fallback
    return {
      callObjective: 'Understand current sales operations bottlenecks and identify opportunities to automate prospect research and personalization.',
      agenda: [
        'Introductions & alignment on outbound sales pipeline targets',
        'Review of current account research and email customization workflows',
        'Demonstration of autonomous sales intelligence research agent integration',
        'Discussion of pilot setup, pricing, and onboarding timelines',
      ],
      discoveryQuestions: [
        'How many hours per day do your SDRs spend researching target accounts and writing personalized emails?',
        'What metrics do you currently track to measure the personalization quality of your outbound campaigns?',
      ],
      qualificationQuestions: [
        'Who in sales operations or enablement is the final decision maker for outbound email automation tools?',
        'What timeline are you working against to select a sales intelligence and outreach solution?',
      ],
      painPointQuestions: [
        'Are generic outbound outreach campaigns leading to lower reply rates or domain reputation risks?',
        'How does manual research overhead affect your reps\' daily target call and email volumes?',
      ],
    };
  }
}
export default CallPreparationEngine;
