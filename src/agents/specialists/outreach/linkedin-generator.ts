import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, LinkedInMessage, MessagingTheme } from './types';
import { LINKEDIN_GENERATOR_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class LinkedInGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    profile: CompanyProfile,
    messagingThemes: MessagingTheme[],
  ): Promise<LinkedInMessage[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nMessaging Themes:\n${JSON.stringify(
          messagingThemes,
        )}\n\nGenerate exactly 4 LinkedIn messages.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: LINKEDIN_GENERATOR_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.linkedInMessages || [];
      } catch (error) {
        logger.error(
          `LinkedInGenerator live generation failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockMessages(profile.name);
  }

  private getMockMessages(companyName: string): LinkedInMessage[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          type: 'Connection Request',
          message:
            'Hi! Noticed Stripe is expanding regional support teams in Europe. I follow payments compliance and local routing optimization closely. Let’s connect!',
        },
        {
          type: 'First Message',
          message:
            'Thanks for connecting! I saw Stripe recently launched updates for localized merchant setups. Many platforms see drop-offs of 3-5% from issuer friction in EU. We developed a local-routing benchmark brief analyzing these patterns. Let me know if you would like me to share it here.',
        },
        {
          type: 'Follow-Up Message',
          message:
            'Hi, just following up. I know developer resources are busy scaling core APIs. Our routing SDK is light and connects via webhooks to automate decline mapping. Let me know if this sounds relevant.',
        },
        {
          type: 'Engagement Message',
          message:
            'Congrats on the Series B expansion! Real-time local routing is a game changer for transaction conversion rates in complex European payment corridors.',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          type: 'Connection Request',
          message:
            'Hi! I saw HubSpot is expanding Sales Hub Enterprise. I study CRM database performance and object relational structures. Let’s connect!',
        },
        {
          type: 'First Message',
          message:
            'Thanks for connecting. As Sales Hub expands upmarket, mapping enterprise schemas often hits the default custom object limits. We built database connectors that bypass these limits. Let me know if you’d like to see how it integrates.',
        },
        {
          type: 'Follow-Up Message',
          message:
            'Hi there, following up. We recently published a guide on CRM scalability and custom object partitioning. Let me know if you’d like a copy!',
        },
        {
          type: 'Engagement Message',
          message:
            'Excellent release on Sales Hub Enterprise! Relational database scaling and custom object options are crucial for larger enterprise clients.',
        },
      ];
    }

    // Generic fallback
    return [
      {
        type: 'Connection Request',
        message: `Hi! I saw your team is focused on growing sales operations at ${companyName}. I follow outbound efficiency and research automation. Let's connect!`,
      },
      {
        type: 'First Message',
        message:
          'Thanks for connecting. Most B2B sales teams spend up to 40% of their day on manual research. We developed an autonomous agent that automates this to craft custom messaging hooks instantly. Let me know if you’d like to take a look.',
      },
      {
        type: 'Follow-Up Message',
        message:
          'Hi there, following up. I know you are focused on pipeline growth. I have a 2-minute video demonstrating how we automate account research for outbound reps. Let me know if I should drop it here.',
      },
      {
        type: 'Engagement Message',
        message:
          'Great to see the company scaling. Automating manual research is highly critical for sales efficiency as outbound volume increases.',
      },
    ];
  }
}
export default LinkedInGenerator;
