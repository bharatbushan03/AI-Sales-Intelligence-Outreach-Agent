import { GoogleGenerativeAI } from '@google/generative-ai';
import { MeetingRecord } from './types';
import { MEETING_INTELLIGENCE_PROMPT } from '../../prompts/crm-prompts';
import { logger } from '../../../utils/logger';

export class MeetingIntelligenceEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async summarize(
    title: string,
    transcript: string,
    referenceId: string,
  ): Promise<MeetingRecord> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Meeting Title: ${title}\nTranscript:\n${transcript}\n\nSummarize and analyze.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: MEETING_INTELLIGENCE_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return {
          meetingId: json.meetingId || `meet_${Math.random().toString(36).substring(2, 9)}`,
          title: json.title || title,
          date: new Date().toISOString(),
          summary: json.summary || 'Summary generated.',
          actionItems: json.actionItems || [],
          risks: json.risks || [],
          followUps: json.followUps || [],
          referenceId,
        };
      } catch (error) {
        logger.error(`MeetingIntelligenceEngine live analysis failed. Falling back to mock.`, error);
      }
    }

    return this.getMockMeeting(title, referenceId);
  }

  private getMockMeeting(title: string, referenceId: string): MeetingRecord {
    const timestamp = new Date().toISOString();
    const query = title.toLowerCase();

    if (query.includes('stripe')) {
      return {
        meetingId: 'meet_stripe_001',
        title: 'Stripe EU payment routing alignment call',
        date: timestamp,
        summary: 'Reviewed EU-localized decline metrics. The client expressed severe concern about localized SCA compliance rules causing drop-offs in Germany and France.',
        actionItems: [
          'Prepare localized routing card logs simulation (Bharat/Sales Engineering)',
          'Send merchant onboarding API setup instructions (Sales Ops)',
        ],
        risks: [
          'Developer bandwidth is constrained due to active Connect billing release cycle.',
        ],
        followUps: [
          'Follow up next Monday with SDK routing mock setup.',
        ],
        referenceId,
      };
    }

    if (query.includes('hubspot')) {
      return {
        meetingId: 'meet_hubspot_001',
        title: 'HubSpot custom relational object review',
        date: timestamp,
        summary: 'Met with HubSpot RevOps team. Walked through current data limit ceilings and portal setup bottlenecks.',
        actionItems: [
          'Draft database sync custom middleware API reference ( Bharat )',
          'Coordinate a 15-minute developer sandbox overview call',
        ],
        risks: [
          ' GRANULAR permission policy review could extend sales cycles by 2-3 weeks.',
        ],
        followUps: [
          'Send CRM schema indexing template tomorrow morning.',
        ],
        referenceId,
      };
    }

    return {
      meetingId: 'meet_generic_001',
      title: title || 'B2B Sales Discovery Meeting',
      date: timestamp,
      summary: 'Initial discovery call to align on operational scalability and outbound pipeline bottlenecks.',
      actionItems: [
        'Send custom case studies of matching vertical integrations.',
        'Schedule follow-up discussion with sales director next week.',
      ],
      risks: [
        'Internal champion might not have final budget sign-off authority.',
      ],
      followUps: [
        'Send custom follow-up brief in 48 hours.',
      ],
      referenceId,
    };
  }
}
export default MeetingIntelligenceEngine;
