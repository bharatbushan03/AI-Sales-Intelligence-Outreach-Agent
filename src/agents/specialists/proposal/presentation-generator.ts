import { GoogleGenerativeAI } from '@google/generative-ai';
import { SlideOutline, ProposalDocument, RoiAnalysis, SolutionDesign } from './types';
import { PRESENTATION_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class PresentationGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    companyName: string,
    proposalDoc: ProposalDocument,
    solutionDesign: SolutionDesign,
    roiAnalysis: RoiAnalysis,
  ): Promise<SlideOutline[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Proposal Document:\n${JSON.stringify(
          proposalDoc,
        )}\nSolution Design:\n${JSON.stringify(solutionDesign)}\nROI:\n${JSON.stringify(
          roiAnalysis,
        )}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: PRESENTATION_PROMPT,
        });

        return JSON.parse(result.response.text()) as SlideOutline[];
      } catch (error) {
        logger.error(
          `PresentationGenerator slide creation failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockSlides(companyName, proposalDoc, solutionDesign, roiAnalysis);
  }

  private getMockSlides(
    companyName: string,
    proposal: ProposalDocument,
    solution: SolutionDesign,
    roi: RoiAnalysis,
  ): SlideOutline[] {
    return [
      {
        slideTitle: `Enterprise Agreement Proposal: ${companyName}`,
        keyPoints: [
          `Prepared for: ${companyName} Executive Stakeholders`,
          `Prepared by: B2B Autonomous outreach solution team`,
          `Focus: Deploying ${solution.solutionName} for operational growth`,
        ],
        speakerNotes:
          'Welcome everyone to our partnership alignment briefing. Today, we will walk through a customized proposal designed to eliminate existing operational friction points, optimize data integrity, and accelerate B2B transaction growth.',
      },
      {
        slideTitle: 'Executive Summary',
        keyPoints: [
          'Strategic partnership targeting bottleneck automation',
          'Deploying customized, compliance-secured middleware layers',
          `Projected ROI of ${roi.roiPercentage}% with a payback window of ${roi.paybackPeriod}`,
        ],
        speakerNotes:
          'In summary, our proposal addresses core inefficiencies by introducing automated, scalable routing and document-matching systems, delivering rapid ROI within a few months of deployment.',
      },
      {
        slideTitle: 'Current Challenges',
        keyPoints: proposal.challengesIdentified,
        speakerNotes:
          'We have conducted deep-dive analyses on your operational workloads and identified these core friction areas that delay scaling and increase administrative developer workloads.',
      },
      {
        slideTitle: 'Strategic Opportunities',
        keyPoints: solution.objectives,
        speakerNotes:
          'By addressing these inefficiencies, we can capture high-value transaction volumes, shorten sub-merchant onboarding timelines, and optimize brand styling safeguards.',
      },
      {
        slideTitle: 'Proposed Solution Architecture',
        keyPoints: [
          solution.solutionName,
          'Dynamic regional card network optimization checks',
          'Automated, low-latency metadata sync queues',
        ],
        speakerNotes:
          'Our proposed solution leverages high-performance queues and real-time middleware routing API hooks to guarantee security and sub-second propagation rates without changing your core codebase.',
      },
      {
        slideTitle: 'ROI & Financial Justification',
        keyPoints: [
          `Estimated Setup Investment: $${roi.estimatedInvestment.toLocaleString()}`,
          `Projected 12-Month Operational Savings: $${roi.projectedSavings.toLocaleString()}`,
          `Projected 12-Month Revenue Impact: $${roi.projectedRevenueImpact.toLocaleString()}`,
          `Estimated Payback Window: ${roi.paybackPeriod}`,
        ],
        speakerNotes:
          'From a financial standpoint, this initiative yields a high ROI. The initial investment will be offset within the first year of operation, backed by these conservative assumptions.',
      },
      {
        slideTitle: 'Implementation Roadmap',
        keyPoints: proposal.implementationRoadmap,
        speakerNotes:
          'Our implementation schedule is structured across 4 phases to ensure systematic testing, compliance grounding, and zero disruption to active customer operations.',
      },
      {
        slideTitle: 'Next Steps & Q&A',
        keyPoints: proposal.nextSteps,
        speakerNotes:
          'To move forward, we suggest reviewing the formal SOW and designating your technical point-of-contacts. Let open the floor to any strategic or technical questions.',
      },
    ];
  }
}
export default PresentationGenerator;
