import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../lib/env';
import { IAgent, AgentContext, AgentStepResult } from '../types';
import { CompanyProfiler } from './research/profiler';
import { WebsiteAnalyzer } from './research/web-analyzer';
import { CompetitorAnalyzer } from './research/competitor-analyzer';
import { OpportunityDiscoveryEngine } from './research/opportunity-engine';
import { InsightGenerator } from './research/insight-generator';
import { logger } from '../../utils/logger';

export class ResearchAgent implements IAgent {
  public name = 'ResearchAgent';
  public description =
    'Gathers intelligence on prospect companies, including tech stack, news, and competitors.';
  public capabilities = ['research'] as const;

  private profiler: CompanyProfiler;
  private webAnalyzer: WebsiteAnalyzer;
  private competitorAnalyzer: CompetitorAnalyzer;
  private opportunityEngine: OpportunityDiscoveryEngine;
  private insightGenerator: InsightGenerator;

  constructor() {
    const key = env.GEMINI_API_KEY;
    const genAI = key && key !== 'mock-gemini-key' ? new GoogleGenerativeAI(key) : null;

    this.profiler = new CompanyProfiler(genAI);
    this.webAnalyzer = new WebsiteAnalyzer(genAI);
    this.competitorAnalyzer = new CompetitorAnalyzer(genAI);
    this.opportunityEngine = new OpportunityDiscoveryEngine(genAI);
    this.insightGenerator = new InsightGenerator(genAI);
  }

  /**
   * Coordinates the multi-stage research workflow.
   */
  public async execute(
    context: AgentContext,
    options?: Record<string, unknown>,
  ): Promise<AgentStepResult> {
    const query =
      (options?.websiteUrl as string) ||
      (context.sharedMemory.websiteUrl as string) ||
      context.userGoal;

    logger.info(`ResearchAgent executing pipeline for query: "${query}"`);

    try {
      // Stage 1: Company Discovery (Profile & Industry)
      logger.info('Stage 1: Running CompanyProfiler...');
      const profileResult = await this.profiler.profile(query);
      const company = profileResult.company;
      const industry = profileResult.industry;

      // Stage 2: Website Intelligence (Products & Signals)
      logger.info('Stage 2: Running WebsiteAnalyzer...');
      const websiteResult = await this.webAnalyzer.analyze(company);
      const products = websiteResult.products;
      const signals = websiteResult.signals;

      // Stage 3: Competitive Intelligence (Competitors list)
      logger.info('Stage 3: Running CompetitorAnalyzer...');
      const competitors = await this.competitorAnalyzer.analyze(company);

      // Stage 4: Opportunity & Risk Analysis
      logger.info('Stage 4: Running OpportunityDiscoveryEngine...');
      const opportunityResult = await this.opportunityEngine.discover(
        company,
        products,
        competitors,
      );
      const opportunities = opportunityResult.opportunities;
      const risks = opportunityResult.risks;

      // Stage 5: Insight Synthesis (Summary & Recommendations)
      logger.info('Stage 5: Running InsightGenerator...');
      const insightResult = await this.insightGenerator.generate(company, opportunities);
      const summary = insightResult.summary;
      const recommendations = insightResult.recommendations;

      // Aggregate final ResearchReport
      const report = {
        company: {
          ...company,
          logo: `https://logo.clearbit.com/${company.website}`,
        },
        industry,
        products,
        competitors,
        opportunities,
        risks,
        recommendations,
        summary,
        signals, // Include hiring & growth signals
        metadata: {
          workflowId: context.workflowId,
          timestamp: new Date().toISOString(),
        },
      };

      logger.info(`ResearchAgent pipeline completed successfully for: ${company.name}`);

      return {
        success: true,
        output: report,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`ResearchAgent pipeline failed for query "${query}": ${errorMsg}`, error);
      return {
        success: false,
        output: {},
        error: errorMsg,
      };
    }
  }
}
export default ResearchAgent;
