import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExecutiveSummary, ProposalDocument } from './types';
import { EXECUTIVE_SUMMARY_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class ExecutiveSummaryGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async summarize(
    companyName: string,
    proposalDoc: ProposalDocument,
  ): Promise<ExecutiveSummary> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Proposal Document:\n${JSON.stringify(proposalDoc)}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: EXECUTIVE_SUMMARY_PROMPT,
        });

        return JSON.parse(result.response.text()) as ExecutiveSummary;
      } catch (error) {
        logger.error(
          `ExecutiveSummaryGenerator summary compilation failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockSummary(companyName, proposalDoc);
  }

  private getMockSummary(companyName: string, proposal: ProposalDocument): ExecutiveSummary {
    return {
      summaryText: `This executive summary provides a high-level briefing of the B2B agreement proposed for ${companyName}. The proposed implementation addresses performance bottlenecks and manual administrative tasks within customer workflows, delivering an automated solution that secures operational stability and unlocks upmarket conversion pathways.`,
      businessValue: `Quantifiable benefits include significant direct savings and indirect revenue gains. These improvements will directly expand operating margins, with an estimated setup payback period of under 12 months.`,
      strategicImpact: `The solution strengthens ${companyName}'s core value proposition by securing data compliance and shortening integration onboarding times, position the brand as a key strategic partner to upmarket enterprises.`,
      expectedOutcomes: proposal.expectedOutcomes.slice(0, 3),
    };
  }
}
export default ExecutiveSummaryGenerator;
