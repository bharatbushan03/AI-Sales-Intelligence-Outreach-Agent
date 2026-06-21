import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, CampaignEvent, ColdEmailVariant } from './types';
import { CAMPAIGN_PLANNER_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class CampaignPlanner {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async plan(
    profile: CompanyProfile,
    emails?: ColdEmailVariant[],
  ): Promise<CampaignEvent[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nEmails:\n${JSON.stringify(
          emails || [],
        )}\n\nPlan a multi-channel outreach campaign.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: CAMPAIGN_PLANNER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.campaigns || [];
      } catch (error) {
        logger.error(
          `CampaignPlanner live planning failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockCampaign(profile.name);
  }

  private getMockCampaign(companyName: string): CampaignEvent[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          timeline: 'Day 1',
          channel: 'LinkedIn',
          objective: 'Establish connection and research alignment',
          messageTheme: 'Noticing regional compliance hiring spikes and Connect integration growth',
          cta: 'Send connection request with brief compliance hook',
        },
        {
          timeline: 'Day 3',
          channel: 'Email',
          objective: 'Introduce localized checkout payment decline benchmarks',
          messageTheme: 'Highlighting 3-5% decline rates in EU card issuer networks',
          cta: 'Ask if they are open to receiving the benchmark report',
        },
        {
          timeline: 'Day 5',
          channel: 'Phone',
          objective: 'Direct follow-up on benchmark report and connect stakeholder',
          messageTheme: 'Reducing developer integration backlogs for Connect and Tax',
          cta: 'Offer a 10-minute introduction call to discuss routing checklists',
        },
        {
          timeline: 'Day 8',
          channel: 'LinkedIn',
          objective: 'Nudge connection with case study resource',
          messageTheme: 'How a Tier-1 merchant captured €4.2M by optimizing localized routing',
          cta: 'Drop link to localized routing case study in direct message',
        },
        {
          timeline: 'Day 12',
          channel: 'Email',
          objective: 'Address resource constraints with SDK pre-integration value',
          messageTheme: 'No core codebase downtime with pre-configured webhook SDKs',
          cta: 'Provide link to API reference guide and request callback',
        },
        {
          timeline: 'Day 15',
          channel: 'Phone',
          objective: 'Final follow-up on integration resources',
          messageTheme: 'Identifying secondary-market payment decline points',
          cta: 'Suggest a short check-in call next quarter if timing is bad',
        },
        {
          timeline: 'Day 20',
          channel: 'Follow-up',
          objective: 'Alternative contact query',
          messageTheme: 'Identify if payment operations or engineering leadership is better to contact',
          cta: 'Request reference or referral to the correct lead',
        },
        {
          timeline: 'Day 25',
          channel: 'Email',
          objective: 'Break-up and preserve relationship',
          messageTheme: 'Acknowledge timing constraints and leave self-serve resources',
          cta: 'Final check-in for payment routing optimization support',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          timeline: 'Day 1',
          channel: 'LinkedIn',
          objective: 'Establish contact with RevOps lead',
          messageTheme: 'Focus on Sales Hub Enterprise database schema scaling',
          cta: 'Send connection request with focus on custom objects',
        },
        {
          timeline: 'Day 3',
          channel: 'Email',
          objective: 'Deliver CRM custom object limit brief',
          messageTheme: 'Mapping custom relational tables in HubSpot without CRM limitations',
          cta: 'Ask if database scaling is a challenge for their upmarket accounts',
        },
        {
          timeline: 'Day 5',
          channel: 'Phone',
          objective: 'Follow up on custom object limits',
          messageTheme: 'Automating partner portal onboarding and access configurations',
          cta: 'Suggest a short introduction call to discuss portal automation',
        },
        {
          timeline: 'Day 8',
          channel: 'LinkedIn',
          objective: 'Value drop on LinkedIn direct message',
          messageTheme: 'How we saved a partner agency 20+ hours of custom setup per client',
          cta: 'Share case study showing portal sync setup improvements',
        },
        {
          timeline: 'Day 12',
          channel: 'Email',
          objective: 'Address migration and implementation complexity concerns',
          messageTheme: 'No downtime CRM sync using webhooks and standard object matching',
          cta: 'Request a quick video call to demonstrate live synchronization',
        },
        {
          timeline: 'Day 15',
          channel: 'Follow-up',
          objective: 'Alternative contact query',
          messageTheme: 'Check if CS Operations or RevOps lead is the correct project contact',
          cta: 'Request introduction to the database administrator',
        },
        {
          timeline: 'Day 20',
          channel: 'Email',
          objective: 'Break-up and wrap up thread',
          messageTheme: 'Acknowledge timing and leave database scaling checklists',
          cta: 'All the best with their upmarket expansion goals',
        },
      ];
    }

    // Generic fallback
    return [
      {
        timeline: 'Day 1',
        channel: 'LinkedIn',
        objective: 'Connect with sales leadership',
        messageTheme: 'Focus on outbound efficiency and research automation',
        cta: 'Send connection request with research automation hook',
      },
      {
        timeline: 'Day 3',
        channel: 'Email',
        objective: 'Introduce prospect research automation',
        messageTheme: 'Saving sales reps 2+ hours of manual admin research daily',
        cta: 'Ask if they are open to receiving a personalization guide',
      },
      {
        timeline: 'Day 6',
        channel: 'Phone',
        objective: 'Direct follow-up on research productivity',
        messageTheme: 'Improving positive reply rates by custom personalization hooks',
        cta: 'Offer a 10-minute call to demonstrate autonomous research agents',
      },
      {
        timeline: 'Day 10',
        channel: 'LinkedIn',
        objective: 'Drop video walk-through in direct message',
        messageTheme: '2-minute video demo of outbound research automation',
        cta: 'Share video link and check relevance',
      },
      {
        timeline: 'Day 14',
        channel: 'Email',
        objective: 'Address implementation overhead concerns',
        messageTheme: '15-minute setup time and seamless integration with existing CRM',
        cta: 'Request callback or pilot overview',
      },
      {
        timeline: 'Day 18',
        channel: 'Follow-up',
        objective: 'Alternative contact check',
        messageTheme: 'Identify Sales Ops or Enablement stakeholder',
        cta: 'Request referral to the correct program manager',
      },
      {
        timeline: 'Day 22',
        channel: 'Email',
        objective: 'Break-up message',
        messageTheme: 'Respect timing, leave outreach templates and close sequence',
        cta: 'Final check-in for sales personalization support',
      },
    ];
  }
}
export default CampaignPlanner;
