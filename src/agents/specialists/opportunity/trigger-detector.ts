import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PainPoint, GrowthSignal, SalesTrigger } from './types';
import { SALES_TRIGGER_DETECTOR_PROMPT } from '../../prompts/opportunity-prompts';
import { logger } from '../../../utils/logger';

export class SalesTriggerDetector {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async detect(
    profile: CompanyProfile,
    painPoints: PainPoint[],
    growthSignals: GrowthSignal[],
  ): Promise<SalesTrigger[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Profile:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints,
        )}\nGrowth Signals:\n${JSON.stringify(growthSignals)}\n\nAnalyze and detect sales triggers.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: SALES_TRIGGER_DETECTOR_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.salesTriggers || [];
      } catch (error) {
        logger.error(
          `SalesTriggerDetector live analysis failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockSalesTriggers(profile.name);
  }

  private getMockSalesTriggers(companyName: string): SalesTrigger[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          trigger: 'Europe expansion of Stripe Billing and compliance offerings',
          urgency: 'high',
          opportunityLevel: 'critical',
          suggestedOutreachAngle:
            'Address localized decline rates in Europe with frictionless routing solutions to recover lost subscriber volumes.',
        },
        {
          trigger: 'Stripe API updates requiring migration of older Connect frameworks',
          urgency: 'medium',
          opportunityLevel: 'high',
          suggestedOutreachAngle:
            'Offer specialized API audit services to guarantee zero downtime during version transitions.',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          trigger: 'New focus on Enterprise Sales Hub EAs upmarket',
          urgency: 'high',
          opportunityLevel: 'critical',
          suggestedOutreachAngle:
            'Introduce advanced enterprise integration dashboards that sync Salesforce data cleanly without custom admin costs.',
        },
        {
          trigger: 'Adoption of Generative AI inside content editors',
          urgency: 'low',
          opportunityLevel: 'medium',
          suggestedOutreachAngle:
            'Position tools that automate editor formatting workflows to accelerate content scaling.',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          trigger: 'Einstein 1 Platform rollouts and Salesforce Agentforce launch',
          urgency: 'high',
          opportunityLevel: 'critical',
          suggestedOutreachAngle:
            'Offer pre-built database sync connectors that feed Einstein agents clean, real-time telemetry from external databases.',
        },
        {
          trigger: 'Rising cost concerns and mid-market customer drop-off',
          urgency: 'medium',
          opportunityLevel: 'high',
          suggestedOutreachAngle:
            'Present automation workflows that reduce admin expenses, helping them retain mid-market accounts.',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          trigger: 'Notion Sites publishing feature release',
          urgency: 'medium',
          opportunityLevel: 'high',
          suggestedOutreachAngle:
            'Position dynamic page widgets and image hosting optimizations to enhance Notion Site load speeds.',
        },
        {
          trigger: 'Organization-wide wiki scaling clutter problems',
          urgency: 'high',
          opportunityLevel: 'critical',
          suggestedOutreachAngle:
            'Introduce database templates and automated permission auditing tools to prevent doc sprawl and compliance risks.',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          trigger: 'Shopify collective drop-ship inventory integration',
          urgency: 'high',
          opportunityLevel: 'critical',
          suggestedOutreachAngle:
            'Pitch real-time multi-merchant inventory trackers to avoid stock inconsistencies and customer support backlogs.',
        },
        {
          trigger: 'Audiences network v2 rollout for custom ads tracking',
          urgency: 'medium',
          opportunityLevel: 'high',
          suggestedOutreachAngle:
            'Introduce ad spend allocation trackers that map sales return metrics directly inside their shop layout.',
        },
      ];
    }

    // Generic mock triggers
    return [
      {
        trigger: 'Headcount expansion exceeding standard tool parameters',
        urgency: 'medium',
        opportunityLevel: 'medium',
        suggestedOutreachAngle:
          'Highlight custom workflow software that integrates tools to simplify employee onboarding.',
      },
      {
        trigger: 'Rising competitive entry into core business segment',
        urgency: 'medium',
        opportunityLevel: 'high',
        suggestedOutreachAngle:
          'Focus on scaling customer engagement speed through real-time CRM updates.',
      },
    ];
  }
}
export default SalesTriggerDetector;
