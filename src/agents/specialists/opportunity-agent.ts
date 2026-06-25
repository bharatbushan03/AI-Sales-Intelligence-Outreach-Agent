import { AIPlatformGenerativeAI } from '../platform/wrapper';
import { env } from '../../lib/env';
import { IAgent, AgentContext, AgentStepResult } from '../types';
import { PainPointDetector } from './opportunity/pain-point-detector';
import { GrowthSignalAnalyzer } from './opportunity/growth-analyzer';
import { SalesTriggerDetector } from './opportunity/trigger-detector';
import { OpportunityScorer } from './opportunity/scorer';
import { RecommendationEngine } from './opportunity/recommendation-engine';
import { StrategicInsightGenerator } from './opportunity/strategic-insights';
import { logger } from '../../utils/logger';
import { ResearchReport } from './research/types';

export class OpportunityAgent implements IAgent {
  public name = 'OpportunityAgent';
  public description =
    'Identifies latent business pain points and matches them against user value propositions.';
  public capabilities = ['opportunity-analysis'] as const;

  private painDetector: PainPointDetector;
  private growthAnalyzer: GrowthSignalAnalyzer;
  private triggerDetector: SalesTriggerDetector;
  private scorer: OpportunityScorer;
  private recommendationEngine: RecommendationEngine;
  private insightGenerator: StrategicInsightGenerator;

  constructor() {
    const key = env.GEMINI_API_KEY;
    const genAI =
      key && key !== 'mock-gemini-key' ? (new AIPlatformGenerativeAI(key) as any) : null;

    this.painDetector = new PainPointDetector(genAI);
    this.growthAnalyzer = new GrowthSignalAnalyzer(genAI);
    this.triggerDetector = new SalesTriggerDetector(genAI);
    this.scorer = new OpportunityScorer(genAI);
    this.recommendationEngine = new RecommendationEngine(genAI);
    this.insightGenerator = new StrategicInsightGenerator(genAI);
  }

  /**
   * Coordinates the multi-stage opportunity analysis pipeline.
   */
  public async execute(
    context: AgentContext,
    options?: Record<string, unknown>,
  ): Promise<AgentStepResult> {
    const researchData = (options?.researchData || context.sharedMemory.research) as unknown as
      | ResearchReport
      | undefined;

    const company = researchData?.company || {
      name: this.extractCompanyName(context.userGoal) || 'Prospect Company',
      website: 'prospect.com',
      description: 'Business analysis prospect.',
    };
    const products = researchData?.products || [];
    const competitors = researchData?.competitors || [];
    const researchSignals = researchData?.signals || null;

    logger.info(`OpportunityAgent executing pipeline for company: "${company.name}"`);

    try {
      // Stage 1: Pain Point Detection
      logger.info('Stage 1: Running PainPointDetector...');
      const painPoints = await this.painDetector.detect(company, products, competitors);

      // Stage 2: Growth Signal Detection
      logger.info('Stage 2: Running GrowthSignalAnalyzer...');
      const growthSignals = await this.growthAnalyzer.analyze(company, researchSignals);

      // Stage 3: Sales Trigger Detection
      logger.info('Stage 3: Running SalesTriggerDetector...');
      const salesTriggers = await this.triggerDetector.detect(company, painPoints, growthSignals);

      // Stage 4: Weighted Opportunity Scoring
      logger.info('Stage 4: Running OpportunityScorer...');
      const scoreResult = await this.scorer.score(company, painPoints, salesTriggers);
      const opportunities = scoreResult.opportunities;
      const overallOpportunityScore = scoreResult.overallOpportunityScore;

      // Stage 5: Recommendation Engine
      logger.info('Stage 5: Running RecommendationEngine...');
      const recommendations = await this.recommendationEngine.recommend(
        company,
        painPoints,
        opportunities,
      );

      // Stage 6: Strategic Insight Synthesis
      logger.info('Stage 6: Running StrategicInsightGenerator...');
      const insightResult = await this.insightGenerator.generate(
        company,
        painPoints,
        opportunities,
      );
      const executiveSummary = insightResult.executiveSummary;
      const executiveInsights = insightResult.executiveInsights;

      const report = {
        company,
        painPoints,
        growthSignals,
        salesTriggers,
        opportunities,
        recommendations,
        executiveInsights,
        executiveSummary,
        overallOpportunityScore,
        opportunityScore: overallOpportunityScore, // Legacy alias for orchestrator unit test assertions
        metadata: {
          workflowId: context.workflowId,
          timestamp: new Date().toISOString(),
        },
      };

      logger.info(`OpportunityAgent completed successfully for: ${company.name}`);

      return {
        success: true,
        output: report,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`OpportunityAgent pipeline failed for "${company.name}": ${errorMsg}`, error);
      return {
        success: false,
        output: {},
        error: errorMsg,
      };
    }
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
export default OpportunityAgent;
export { OpportunityAgent as OpportunityAnalysisAgent };
