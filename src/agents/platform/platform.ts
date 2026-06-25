import { env } from '../../lib/env';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AIProvider,
  GenerationOptions,
  GenerationResult,
  PromptDefinition,
  QualityScorecard,
  TokenUsage,
} from './types';
import { GeminiProvider, MockProvider } from './provider';
import { PromptRegistry, PromptTemplateSystem } from './registry';
import { ResponseCacheManager } from './cache';
import { GuardrailsManager } from './guardrails';
import { HallucinationDetector } from './hallucination';
import { AIEvaluator } from './evaluator';
import { qualityScoresRepository, tokenUsageRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class AIPlatform {
  private static instance: AIPlatform;
  private provider: AIProvider;
  private registry = PromptRegistry.getInstance();
  private cache = ResponseCacheManager.getInstance();
  private guardrails = GuardrailsManager.getInstance();
  private hallucinationDetector: HallucinationDetector;
  private evaluator: AIEvaluator;

  private constructor() {
    const key = env.GEMINI_API_KEY;
    if (key && key !== 'mock-gemini-key') {
      this.provider = new GeminiProvider(key);
      const genAI = new GoogleGenerativeAI(key);
      this.hallucinationDetector = new HallucinationDetector(genAI);
      this.evaluator = new AIEvaluator(genAI);
    } else {
      logger.info('AIPlatform initializing in offline/mock provider mode.');
      this.provider = new MockProvider();
      this.hallucinationDetector = new HallucinationDetector(null);
      this.evaluator = new AIEvaluator(null);
    }
  }

  public static getInstance(): AIPlatform {
    if (!AIPlatform.instance) {
      AIPlatform.instance = new AIPlatform();
    }
    return AIPlatform.instance;
  }

  /**
   * Overrides the current AI Provider (extremely useful for offline unit testing).
   */
  public setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  /**
   * Gets the active prompt registry.
   */
  public getRegistry(): PromptRegistry {
    return this.registry;
  }

  /**
   * Routes prompt request through Platform pipeline, checking cache and executing multi-pass loops.
   */
  public async executeGeneration(
    promptId: string,
    variables: Record<string, any>,
    schema?: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>,
    options?: GenerationOptions,
  ): Promise<string> {
    const startTimestamp = Date.now();
    const agentName = options?.agentName || 'UnknownAgent';
    const workflowId = options?.workflowId || '';

    // 1. Cache lookup check
    const cacheKey = this.cache.hashRequest(promptId, variables);
    const cachedEntry = await this.cache.get(cacheKey);
    if (cachedEntry) {
      logger.info(
        `AIPlatform Cache HIT for promptId: "${promptId}" (Key: ${cacheKey.substring(0, 8)})`,
      );
      return cachedEntry.text;
    }

    // 2. Fetch prompt structure
    const promptDef = await this.registry.getPrompt(promptId);
    let promptText = PromptTemplateSystem.compile(promptDef.template, variables);
    if (promptDef.fewShots && promptDef.fewShots.length > 0) {
      promptText += `\n\nFew-shot examples:\n${promptDef.fewShots.join('\n')}`;
    }
    if (promptDef.outputInstructions) {
      promptText += `\n\nInstructions:\n${promptDef.outputInstructions}`;
    }

    // 3. Multi-Pass Reasoning Loop (Draft -> Critique -> Self-Correction)
    let attempts = 0;
    const maxAttempts = 3;
    let text = '';
    let promptTokensSum = 0;
    let responseTokensSum = 0;
    let isValid = false;
    let lastErrors: string[] = [];

    while (attempts < maxAttempts && !isValid) {
      attempts++;
      const systemInstruction = promptDef.systemInstruction;

      const res = await this.provider.generateText(promptText, systemInstruction, options);
      text = res.text;
      promptTokensSum += res.promptTokens;
      responseTokensSum += res.responseTokens;

      // Validate structured output schemas
      const validation = this.guardrails.validate(text, schema);
      if (validation.isValid) {
        isValid = true;
      } else {
        lastErrors = validation.errors;
        logger.warn(
          `AIPlatform: Validation failed on attempt ${attempts}/${maxAttempts}. Errors: ${validation.errors.join(', ')}`,
        );

        // Improve prompt by feeding critique error payload back to generator
        promptText += `\n\n[Critique Attempt ${attempts}] Malformed output returned: ${validation.errors.join(', ')}. Please return corrected JSON conforming exactly to the schema.`;
      }
    }

    if (!isValid) {
      throw new Error(
        `AIPlatform: Guardrails rejected output structure after ${maxAttempts} attempts: ${lastErrors.join('; ')}`,
      );
    }

    const duration = Date.now() - startTimestamp;

    // 4. Calculate cost metrics (Gemini 1.5 Flash cost model)
    const costInput = (promptTokensSum / 1000000) * 0.075;
    const costOutput = (responseTokensSum / 1000000) * 0.3;
    const estimatedCost = costInput + costOutput;

    // 5. Save generation outputs in cache
    await this.cache.set(cacheKey, text);

    // 6. Trigger Evaluations and Hallucinations detection asynchronously
    this.runBackgroundAnalytics(
      promptId,
      agentName,
      workflowId,
      text,
      variables,
      promptTokensSum,
      responseTokensSum,
      estimatedCost,
      duration,
    ).catch((err) =>
      logger.error('Failed to execute AIPlatform background evaluation metrics:', err),
    );

    return text;
  }

  /**
   * Handles asynchronous evaluations, cost tracking logs, and agent scorecard updates.
   */
  private async runBackgroundAnalytics(
    promptId: string,
    agentName: string,
    workflowId: string,
    text: string,
    variables: Record<string, any>,
    promptTokens: number,
    responseTokens: number,
    estimatedCost: number,
    latencyMs: number,
  ): Promise<void> {
    // Write Token Analytics Log
    const usageRecord: TokenUsage = {
      promptId,
      agentName,
      workflowId,
      promptTokens,
      responseTokens,
      estimatedCost,
      latencyMs,
      createdAt: new Date().toISOString(),
    };
    await tokenUsageRepository.add(usageRecord);

    // Run Hallucination & Quality Evaluations
    const [hallucination, evaluation] = await Promise.all([
      this.hallucinationDetector.analyze(promptId, text, variables),
      this.evaluator.evaluate(promptId, agentName, text, variables),
    ]);

    // Update Agent Quality Scorecard
    const existingList = await qualityScoresRepository.list([
      { field: 'agentName', operator: '==' as const, value: agentName },
    ]);

    const isSuccess = evaluation.overallScore >= 70 && hallucination.confidence >= 0.7;
    const timestamp = new Date().toISOString();

    if (existingList.length > 0) {
      const scorecard = existingList[0];
      const newCount = scorecard.runsCount + 1;
      const prevQuality = scorecard.averageQuality * scorecard.runsCount;
      const newAvgQuality = (prevQuality + evaluation.overallScore) / newCount;

      const prevSuccesses = scorecard.successRate * scorecard.runsCount;
      const newSuccessRate = (prevSuccesses + (isSuccess ? 1 : 0)) / newCount;

      await qualityScoresRepository.update(scorecard.id!, {
        runsCount: newCount,
        averageQuality: Math.round(newAvgQuality * 10) / 10,
        successRate: Math.round(newSuccessRate * 100) / 100,
        lastExecutedAt: timestamp,
      });
    } else {
      const newScorecard: QualityScorecard = {
        agentName,
        successRate: isSuccess ? 1.0 : 0.0,
        averageQuality: evaluation.overallScore,
        runsCount: 1,
        lastExecutedAt: timestamp,
      };
      await qualityScoresRepository.add(newScorecard);
    }
  }
}
export default AIPlatform;
