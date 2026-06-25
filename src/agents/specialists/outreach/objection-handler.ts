import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, ObjectionResponse } from './types';
import { OBJECTION_HANDLING_ENGINE_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class ObjectionHandlingEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    profile: CompanyProfile,
    painPoints?: unknown[],
  ): Promise<ObjectionResponse[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nPain Points:\n${JSON.stringify(
          painPoints || [],
        )}\n\nGenerate responses for the 6 core objections.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: OBJECTION_HANDLING_ENGINE_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.objections || [];
      } catch (error) {
        logger.error(
          `ObjectionHandlingEngine live generation failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockObjections(profile.name);
  }

  private getMockObjections(companyName: string): ObjectionResponse[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          objection: 'Too expensive',
          recommendedResponse:
            'Our optimization framework operates on a performance-share or fixed low-tier model. If we do not capture payment declines, there is no cost. We typically see a 5x to 10x ROI in under 30 days.',
          rationale:
            'Shifts focus from direct software cost to risk-free transaction revenue recovery.',
        },
        {
          objection: 'No budget',
          recommendedResponse:
            'Since this addresses transaction routing drops directly in the flow, we can pay for ourselves using recovered payment declines. We can set up a proof-of-concept to identify payment leaks before you allocate any budget.',
          rationale: 'Demonstrates immediate revenue generation to offset budget constraints.',
        },
        {
          objection: 'Already have a solution',
          recommendedResponse:
            'Stripe’s native tools are great for default checkouts. We work alongside Stripe to optimize localized routing rules and issuer compliance specifically for complex European merchant channels.',
          rationale:
            'Positions the solution as a complementary enhancement rather than a disruptive replacement.',
        },
        {
          objection: 'Not interested',
          recommendedResponse:
            'I understand. I can share our local payments compliance report for EU card issuers. Feel free to use the benchmarks for your internal routing reviews.',
          rationale: 'Low-friction approach that drops value without pushy selling.',
        },
        {
          objection: 'Bad timing',
          recommendedResponse:
            'I completely understand you are focused on core product sprints right now. We can connect next quarter, or we can share our open-source Connect templates that your team can review asynchronously.',
          rationale:
            'Offers self-serve, low-effort assets to remain helpful while respecting schedules.',
        },
        {
          objection: 'Need approval',
          recommendedResponse:
            'I can provide an executive payment routing brief summarizing the volume analysis and ROI calculations, which you can easily present to your VP of Payments or CFO.',
          rationale:
            'Arm the prospect with executive-friendly materials to streamline internal sell-in.',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          objection: 'Too expensive',
          recommendedResponse:
            'Our solution reduces custom object admin hours and prevents upmarket licensing cost spikes, making HubSpot Enterprise more cost-effective to scale.',
          rationale: 'Highlights long-term CRM TCO savings compared to CRM tier upgrades.',
        },
        {
          objection: 'No budget',
          recommendedResponse:
            'We can run a free diagnostic on your database custom tables to show exactly where duplicate records and limits are building up, requiring no budget to get started.',
          rationale: 'Low-friction entry point that reveals immediate organizational value.',
        },
        {
          objection: 'Already have a solution',
          recommendedResponse:
            'Many teams use HubSpot default custom tables. We provide advanced partitioning and external syncing middleware that takes over when you exceed native portal limitations.',
          rationale:
            'Focuses on the breaking point of the native solution, which is their exact pain.',
        },
        {
          objection: 'Not interested',
          recommendedResponse:
            'Understood. I will send over our CRM scalability checklist. It highlights common database architecture mistakes that scaling enterprise companies face.',
          rationale: 'Positions the salesperson as an expert advisor rather than a product seller.',
        },
        {
          objection: 'Bad timing',
          recommendedResponse:
            'No worries. We can touch base when you start your next CRM migration or major schema redesign. In the meantime, I can share our migration checklists for your resource library.',
          rationale: 'Maintains long-term relevance without applying immediate pressure.',
        },
        {
          objection: 'Need approval',
          recommendedResponse:
            'I can prepare a custom proof-of-concept summary explaining how we reduce database sync times, which you can share with your Head of RevOps or CTO.',
          rationale: "Simplifies the internal champion's path to getting management buy-in.",
        },
      ];
    }

    // Generic fallback
    return [
      {
        objection: 'Too expensive',
        recommendedResponse:
          "Our tool automates research tasks that currently consume up to 40% of your reps' day. By automating these tasks, we typically increase positive response rates by 2x, covering the cost in under 60 days.",
        rationale: 'Directly links cost to recovered sales hours and increased pipeline output.',
      },
      {
        objection: 'No budget',
        recommendedResponse:
          'We can set up a trial with a limited set of accounts to demonstrate the personalization and response improvements first, giving you concrete data before requesting budget approval.',
        rationale: 'Minimizes financial risk by using a performance-driven proof of concept.',
      },
      {
        objection: 'Already have a solution',
        recommendedResponse:
          'Most standard platforms generate generic email campaigns. We focus on deep, autonomous research to customize each message individually, bypassing spam filters and improving positive engagement.',
        rationale:
          'Differentiates based on personalization depth and delivery rates compared to legacy tools.',
      },
      {
        objection: 'Not interested',
        recommendedResponse:
          'I understand. I can share our B2B sales personalization benchmarks report. You can use these trends to review your current outbound campaigns.',
        rationale: 'Shares industry insights to build rapport without demanding sales commitment.',
      },
      {
        objection: 'Bad timing',
        recommendedResponse:
          'I know your team has active goals this quarter. I can send you some pre-configured email outreach templates that you can run on your current stack when the timing is better.',
        rationale: 'Remains helpful and keeps the line of communication open.',
      },
      {
        objection: 'Need approval',
        recommendedResponse:
          'I can write a brief 1-page business case outlining the ROI, research time saved, and response rate benchmarks, which you can share with your VP of Sales or CRO.',
        rationale: 'Provides structured, numbers-focused collateral to speed up decision-making.',
      },
    ];
  }
}
export default ObjectionHandlingEngine;
