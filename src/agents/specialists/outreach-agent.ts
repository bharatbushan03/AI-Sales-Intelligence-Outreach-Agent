import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../lib/env';
import { IAgent, AgentContext, AgentStepResult } from '../types';
import { PersonaAnalyzer } from './outreach/persona-analyzer';
import { MessagingStrategist } from './outreach/messaging-strategist';
import { EmailGenerator } from './outreach/email-generator';
import { LinkedInGenerator } from './outreach/linkedin-generator';
import { CallPreparationEngine } from './outreach/call-prep';
import { ObjectionHandlingEngine } from './outreach/objection-handler';
import { CampaignPlanner } from './outreach/campaign-planner';
import { OUTREACH_SCORER_PROMPT } from '../prompts/outreach-prompts';
import { logger } from '../../utils/logger';
import { CompanyProfile, OutreachPackage } from './outreach/types';
import { ResearchReport } from './research/types';
import { OpportunityReport } from './opportunity/types';

export class OutreachAgent implements IAgent {
  public name = 'OutreachAgent';
  public description =
    'Generates personalized multi-channel outreach campaigns including email and LinkedIn messages.';
  public capabilities = ['outreach'] as const;

  private personaAnalyzer: PersonaAnalyzer;
  private messagingStrategist: MessagingStrategist;
  private emailGenerator: EmailGenerator;
  private linkedinGenerator: LinkedInGenerator;
  private campaignPlanner: CampaignPlanner;
  private callPrepEngine: CallPreparationEngine;
  private objectionEngine: ObjectionHandlingEngine;
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const key = env.GEMINI_API_KEY;
    this.genAI = key && key !== 'mock-gemini-key' ? new GoogleGenerativeAI(key) : null;

    this.personaAnalyzer = new PersonaAnalyzer(this.genAI);
    this.messagingStrategist = new MessagingStrategist(this.genAI);
    this.emailGenerator = new EmailGenerator(this.genAI);
    this.linkedinGenerator = new LinkedInGenerator(this.genAI);
    this.campaignPlanner = new CampaignPlanner(this.genAI);
    this.callPrepEngine = new CallPreparationEngine(this.genAI);
    this.objectionEngine = new ObjectionHandlingEngine(this.genAI);
  }

  public async execute(
    context: AgentContext,
    options?: Record<string, unknown>,
  ): Promise<AgentStepResult> {
    const researchData = (options?.research || context.sharedMemory.research) as unknown as
      | ResearchReport
      | undefined;
    const opportunityData = (options?.opportunityAnalysis ||
      context.sharedMemory.opportunityAnalysis) as unknown as OpportunityReport | undefined;

    const company = researchData?.company ||
      opportunityData?.company || {
        name: this.extractCompanyName(context.userGoal) || 'Prospect Company',
        website: 'prospect.com',
        description: 'Outreach target company analysis.',
      };

    logger.info(`OutreachAgent executing pipeline for company: "${company.name}"`);

    try {
      // Stage 1: Persona Analysis
      logger.info('Stage 1: Running PersonaAnalyzer...');
      const targetPersonas = await this.personaAnalyzer.analyze(
        company,
        opportunityData?.opportunities,
      );

      // Stage 2: Messaging Strategy
      logger.info('Stage 2: Running MessagingStrategist...');
      const messagingStrategy = await this.messagingStrategist.strategize(
        company,
        opportunityData?.opportunities,
        opportunityData?.painPoints,
      );

      // Stage 3: Email Generation
      logger.info('Stage 3: Running EmailGenerator...');
      const emailResult = await this.emailGenerator.generate(
        company,
        messagingStrategy,
        opportunityData?.painPoints,
      );
      const coldEmails = emailResult.coldEmails;
      const followUpSequence = emailResult.followUpSequence;

      // Stage 4: LinkedIn Generation
      logger.info('Stage 4: Running LinkedInGenerator...');
      const linkedInMessages = await this.linkedinGenerator.generate(company, messagingStrategy);

      // Stage 5: Campaign Planning
      logger.info('Stage 5: Running CampaignPlanner...');
      const campaigns = await this.campaignPlanner.plan(company, coldEmails);

      // Stage 6: Discovery Call Preparation
      logger.info('Stage 6: Running CallPreparationEngine...');
      const discoveryCallPlan = await this.callPrepEngine.prepare(
        company,
        opportunityData?.painPoints,
        opportunityData?.recommendations,
      );

      // Stage 7: Objection Handling Engine
      logger.info('Stage 7: Running ObjectionHandlingEngine...');
      const objections = await this.objectionEngine.generate(company, opportunityData?.painPoints);

      // Stage 8: Outreach Scoring & Executive Summary
      logger.info('Stage 8: Running Quality Scoring and Synthesis...');
      const scoringResult = await this.scoreOutreach(company, coldEmails, campaigns);
      const outreachScore = scoringResult.outreachScore;
      const executiveSummary = scoringResult.executiveSummary;

      const report: OutreachPackage = {
        company,
        targetPersonas,
        messagingStrategy,
        coldEmails,
        followUpSequence,
        linkedInMessages,
        discoveryCallPlan,
        objections,
        campaigns,
        outreachScore,
        executiveSummary,
        metadata: {
          workflowId: context.workflowId,
          timestamp: new Date().toISOString(),
        },
      };

      logger.info(`OutreachAgent completed successfully for: ${company.name}`);

      return {
        success: true,
        output: report as unknown as Record<string, unknown>,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`OutreachAgent pipeline failed for "${company.name}": ${errorMsg}`, error);
      return {
        success: false,
        output: {},
        error: errorMsg,
      };
    }
  }

  private async scoreOutreach(
    profile: CompanyProfile,
    emails: unknown[],
    campaigns: unknown[],
  ): Promise<{ outreachScore: number; executiveSummary: string }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nEmails:\n${JSON.stringify(
          emails,
        )}\nCampaigns:\n${JSON.stringify(campaigns)}\n\nEvaluate quality score and write executive summary.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: OUTREACH_SCORER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return {
          outreachScore: json.outreachScore || 85,
          executiveSummary:
            json.executiveSummary || 'Completed high-conversion multi-channel campaign plan.',
        };
      } catch (error) {
        logger.error(`Outreach scoring live analysis failed for ${profile.name}. Using mock.`, error);
      }
    }

    return this.getMockScoreAndSummary(profile.name);
  }

  private getMockScoreAndSummary(companyName: string): {
    outreachScore: number;
    executiveSummary: string;
  } {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        outreachScore: 92,
        executiveSummary: `The outreach strategy for Stripe targets European payments expansion signals. By highlighting localized routing efficiencies and credit card decline optimizations, we directly address key CRO and CTO priorities. The sequence is scheduled across Day 1 to Day 25, utilizing LinkedIn, cold emails, and phone calls to maximize response yield.`,
      };
    }

    if (name.includes('hubspot')) {
      return {
        outreachScore: 88,
        executiveSummary: `This campaign focuses on HubSpot's upmarket Sales Hub expansion and custom object bottlenecks. The messaging addresses RevOps and Product management challenges with relational database schemas. High personalization and clear technical proof points ensure high open and response rates among key stakeholders.`,
      };
    }

    return {
      outreachScore: 85,
      executiveSummary: `The outbound campaign for ${companyName} optimizes resource utilization by targeting key stakeholders with highly personalized value propositions. It combines LinkedIn connections, personalized email sequences, and phone call touchpoints. This approach bypasses standard filters and provides clear business value.`,
    };
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
export default OutreachAgent;
