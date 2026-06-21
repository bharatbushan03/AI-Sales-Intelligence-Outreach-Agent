import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProposalDocument, SolutionDesign, RoiAnalysis } from './types';
import { PROPOSAL_WRITER_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class ProposalWriter {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async write(
    companyName: string,
    researchData: Record<string, unknown>,
    opportunityData: Record<string, unknown>,
    solutionDesign: SolutionDesign,
    roiAnalysis: RoiAnalysis,
  ): Promise<ProposalDocument> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Name: ${companyName}\nResearch:\n${JSON.stringify(
          researchData,
        )}\nOpportunity:\n${JSON.stringify(opportunityData)}\nSolution:\n${JSON.stringify(
          solutionDesign,
        )}\nROI:\n${JSON.stringify(roiAnalysis)}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: PROPOSAL_WRITER_PROMPT,
        });

        return JSON.parse(result.response.text()) as ProposalDocument;
      } catch (error) {
        logger.error(
          `ProposalWriter proposal compilation failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockProposal(companyName, solutionDesign, roiAnalysis);
  }

  private getMockProposal(
    companyName: string,
    solution: SolutionDesign,
    roi: RoiAnalysis,
  ): ProposalDocument {
    return {
      coverPage: {
        title: `Enterprise Agreement Proposal for ${companyName}`,
        subtitle: `Custom Implementation of ${solution.solutionName} to Drive Scalable Efficiencies`,
        preparedFor: companyName,
        preparedBy: 'Autonomous Sales Outreach Agent',
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      },
      executiveSummary: `This proposal outlines our strategic partnership to deploy ${solution.solutionName} inside ${companyName}'s system operations. Our primary goal is to address identified operational bottlenecks, automate key integration steps, and capture lost transaction opportunities. By optimizing these workloads, we model a projected ROI of ${roi.roiPercentage}% with a payback period of approximately ${roi.paybackPeriod}.`,
      companyUnderstanding: `${companyName} is an industry leader recognized for delivering state-of-the-art SaaS and operational platforms. However, fast scaling has created localized bottlenecks in data synchronization, customer onboarding, and transaction verification, which limit overall upmarket expansion potential.`,
      challengesIdentified: [
        'Isolated performance bottlenecks and operational inefficiencies',
        'Manual intervention requirements in critical onboarding and data management flows',
        'Lack of real-time visibility and unified reporting systems across business units',
      ],
      proposedSolution: solution.implementationApproach,
      expectedOutcomes: solution.expectedOutcomes,
      roiAnalysisSummary: `Our financial model projects a total estimated setup investment of $${roi.estimatedInvestment.toLocaleString()}. Following implementation, we forecast direct operational savings of $${roi.projectedSavings.toLocaleString()} and indirect revenue gains of $${roi.projectedRevenueImpact.toLocaleString()} within the first 12 months, achieving a payback period of ${roi.paybackPeriod}.`,
      implementationRoadmap: [
        'Phase 1: Discovery & Workspace Mapping (Weeks 1-2)',
        'Phase 2: Core Middleware Integration & API Configurations (Weeks 3-6)',
        'Phase 3: Quality Testing, Pilot Launch, and Dashboard Grounding (Weeks 7-8)',
        'Phase 4: Global Handover, Compliance Audits, and Scaling Support (Weeks 9-10)',
      ],
      risksMitigation: [
        {
          risk: 'Integration dependencies causing timeline delays',
          mitigation: 'Pre-built REST API adapter libraries and sandbox testing environments.',
        },
        {
          risk: 'Data compliance alignment during transition',
          mitigation: 'GDPR and HIPAA-compliant data masking and secure TLS metadata encryption.',
        },
      ],
      nextSteps: [
        'Review and sign the Statement of Work (SOW)',
        'Designate technical integration team leads',
        'Schedule the project kickoff call and align calendar dates',
      ],
    };
  }
}
export default ProposalWriter;
