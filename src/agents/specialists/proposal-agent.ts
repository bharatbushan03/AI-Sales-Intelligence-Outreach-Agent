import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../lib/env';
import { IAgent, AgentContext, AgentStepResult } from '../types';
import { SolutionDesigner } from './proposal/solution-designer';
import { BusinessCaseGenerator } from './proposal/business-case-generator';
import { ROIEngine } from './proposal/roi-engine';
import { ProposalWriter } from './proposal/proposal-writer';
import { ExecutiveSummaryGenerator } from './proposal/executive-summary-generator';
import { PresentationGenerator } from './proposal/presentation-generator';
import { ProposalPackage, RoadmapPhase, ProposalDocument, BusinessCase, RoiAnalysis } from './proposal/types';
import { logger } from '../../utils/logger';

export class ProposalAgent implements IAgent {
  public name = 'ProposalAgent';
  public description =
    'Drafts structural B2B proposals, outlines recommended solutions, and generates pricing frames.';
  public capabilities = ['proposal'] as const;

  private solutionDesigner: SolutionDesigner;
  private businessCaseGenerator: BusinessCaseGenerator;
  private roiEngine: ROIEngine;
  private proposalWriter: ProposalWriter;
  private summaryGenerator: ExecutiveSummaryGenerator;
  private presentationGenerator: PresentationGenerator;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const key = env.GEMINI_API_KEY;
    this.genAI = key && key !== 'mock-gemini-key' ? new GoogleGenerativeAI(key) : null;

    this.solutionDesigner = new SolutionDesigner(this.genAI);
    this.businessCaseGenerator = new BusinessCaseGenerator(this.genAI);
    this.roiEngine = new ROIEngine(this.genAI);
    this.proposalWriter = new ProposalWriter(this.genAI);
    this.summaryGenerator = new ExecutiveSummaryGenerator(this.genAI);
    this.presentationGenerator = new PresentationGenerator(this.genAI);
  }

  public async execute(
    context: AgentContext,
    options?: Record<string, unknown>,
  ): Promise<AgentStepResult> {
    const userGoal = context.userGoal;
    logger.info(`ProposalAgent executing pipeline for goal: "${userGoal}"`);

    try {
      const research = context.sharedMemory.research as Record<string, unknown> | undefined;
      const opportunity = context.sharedMemory.opportunityAnalysis as
        | Record<string, unknown>
        | undefined;

      const companyName =
        (options?.companyName as string) ||
        (research?.companyName as string) ||
        this.extractCompanyName(userGoal) ||
        'Stripe';

      // 1. Solution Design
      logger.info(`ProposalAgent [1/6] designing solution for ${companyName}`);
      const solutionDesign = await this.solutionDesigner.design(
        companyName,
        research || {},
        opportunity || {},
      );

      // 2. Business Case Justification
      logger.info(`ProposalAgent [2/6] generating business case for ${companyName}`);
      const businessCase = await this.businessCaseGenerator.generate(
        companyName,
        research || {},
        opportunity || {},
        solutionDesign,
      );

      // 3. ROI Engine analysis
      logger.info(`ProposalAgent [3/6] calculating ROI metrics for ${companyName}`);
      const roiAnalysis = await this.roiEngine.calculate(
        companyName,
        opportunity || {},
        solutionDesign,
      );

      // 4. Draft main proposal text sections
      logger.info(`ProposalAgent [4/6] writing proposal document for ${companyName}`);
      const proposal = await this.proposalWriter.write(
        companyName,
        research || {},
        opportunity || {},
        solutionDesign,
        roiAnalysis,
      );

      // 5. C-Suite executive briefing summary
      logger.info(`ProposalAgent [5/6] compiling executive brief for ${companyName}`);
      const executiveSummary = await this.summaryGenerator.summarize(companyName, proposal);

      // 6. Presentation slide outline deck
      logger.info(`ProposalAgent [6/6] constructing pitch presentation for ${companyName}`);
      const presentationOutline = await this.presentationGenerator.generate(
        companyName,
        proposal,
        solutionDesign,
        roiAnalysis,
      );

      // Format Roadmap Phases matching type structure
      const implementationRoadmap: RoadmapPhase[] = [
        {
          phase: 'Phase 1: Discovery & Workspace Mapping',
          objectives: 'Conduct architecture reviews and outline operational sync hooks.',
          deliverables: ['Systems compatibility report', 'API credential audits'],
          timeline: 'Weeks 1-2',
          risks: ['API rate limits causing pipeline delays'],
        },
        {
          phase: 'Phase 2: Core Middleware Integration & API Configurations',
          objectives: 'Deploy localized routing and connector middleware networks.',
          deliverables: ['Custom connector setup', 'Secure database sync loops'],
          timeline: 'Weeks 3-6',
          risks: ['Data schema mismatch during sync trials'],
        },
        {
          phase: 'Phase 3: Quality Testing, Pilot Launch, and Dashboard Grounding',
          objectives: 'Validate transaction integrity, data masking, and load-time metrics.',
          deliverables: ['Data validation checks report', 'Pilot sandbox rollout'],
          timeline: 'Weeks 7-8',
          risks: ['User acceptance friction on manual workflows'],
        },
        {
          phase: 'Phase 4: Global Handover, Compliance Audits, and Scaling Support',
          objectives: 'Ensure comprehensive knowledge transfer and compliance checks.',
          deliverables: ['Operational playbooks documentation', 'Final audit reports'],
          timeline: 'Weeks 9-10',
          risks: ['Post-handover maintenance delays'],
        },
      ];

      // Document Quality Scorer logic
      const qualityScore = this.evaluateProposalQuality(proposal, businessCase, roiAnalysis);

      const recommendations = [
        'Review the customized email sequence drafts in the outreach hub before sending.',
        'Schedule a discovery presentation call with key technical stakeholders.',
        'Align on payment processing routing thresholds in the CRM dashboard.',
      ];

      const payload: ProposalPackage = {
        proposal,
        businessCase,
        roiAnalysis,
        executiveSummary,
        implementationRoadmap,
        presentationOutline,
        qualityScore,
        recommendations,
        metadata: {
          companyName,
          timestamp: new Date().toISOString(),
          query: userGoal,
          workflowId: context.workflowId,
        },
      };

      logger.info(`ProposalAgent completed successfully for ${companyName}`);

      return {
        success: true,
        output: payload as unknown as Record<string, unknown>,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`ProposalAgent execution failed: ${errorMsg}`, error);
      return {
        success: false,
        output: {},
        error: errorMsg,
      };
    }
  }

  private evaluateProposalQuality(
    proposal: ProposalDocument,
    businessCase: BusinessCase,
    roi: RoiAnalysis,
  ): number {
    let score = 80; // Baseline score

    // Heuristics checks to score completeness
    if (proposal.coverPage && typeof proposal.coverPage === 'object') score += 5;
    if (proposal.executiveSummary && String(proposal.executiveSummary).length > 50) score += 5;
    if (businessCase.currentState && businessCase.futureState) score += 5;
    if (roi.roiPercentage && Number(roi.roiPercentage) > 0) score += 5;

    return Math.min(score, 100);
  }

  private extractCompanyName(text: string): string | null {
    const query = text.toLowerCase();
    if (query.includes('stripe')) return 'Stripe';
    if (query.includes('hubspot')) return 'HubSpot';
    if (query.includes('salesforce')) return 'Salesforce';
    if (query.includes('notion')) return 'Notion';
    if (query.includes('shopify')) return 'Shopify';

    const match = text.match(/([a-zA-Z0-9-]+)\.[a-zA-Z]{2,}/);
    if (match) return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    return null;
  }
}
export default ProposalAgent;
