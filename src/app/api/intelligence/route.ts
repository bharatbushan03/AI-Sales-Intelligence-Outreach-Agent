import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { PromptRegistry } from '@/agents/platform/registry';
import {
  promptRegistryRepository,
  promptVersionsRepository,
  evaluationResultsRepository,
  qualityScoresRepository,
  tokenUsageRepository,
  responseCacheRepository,
  hallucinationReportsRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';

/**
 * GET /api/intelligence
 * Returns all prompts, versions, evaluation results, quality scorecards, token usage, and hallucination reports.
 */
export async function GET() {
  try {
    const registry = PromptRegistry.getInstance();
    // Seed Firestore collections if they are empty
    await registry.initialize();

    const [
      prompts,
      versions,
      evaluations,
      scorecards,
      tokenUsage,
      cacheEntries,
      hallucinations,
    ] = await Promise.all([
      promptRegistryRepository.list(undefined, 'id', 'asc'),
      promptVersionsRepository.list(undefined, 'createdAt', 'desc'),
      evaluationResultsRepository.list(undefined, 'createdAt', 'desc'),
      qualityScoresRepository.list(undefined, 'agentName', 'asc'),
      tokenUsageRepository.list(undefined, 'createdAt', 'desc'),
      responseCacheRepository.list(undefined, 'createdAt', 'desc'),
      hallucinationReportsRepository.list(undefined, 'createdAt', 'desc'),
    ]);

    return ApiResponse.success({
      prompts,
      versions,
      evaluations,
      scorecards,
      tokenUsage,
      cache: cacheEntries,
      hallucinations,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('Failed to fetch intelligence metrics', error);
    return ApiResponse.error(errorMsg, 'INTERNAL_ERROR', 500);
  }
}

/**
 * POST /api/intelligence
 * Updates a prompt template, creating a new version, or deprecates a prompt.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, promptId } = body;

    if (!promptId) {
      return ApiResponse.error('Prompt ID is required', 'VALIDATION_ERROR', 400);
    }

    const registry = PromptRegistry.getInstance();

    if (action === 'UPDATE_PROMPT') {
      const { name, description, template, systemInstruction, fewShots, outputInstructions, changelog } = body;

      if (!template) {
        return ApiResponse.error('Template is required for update', 'VALIDATION_ERROR', 400);
      }

      const updated = await registry.updatePrompt(promptId, {
        name,
        description,
        template,
        systemInstruction,
        fewShots,
        outputInstructions,
        changelog: changelog || 'Changelog not specified',
      });

      return ApiResponse.success(updated, 200);
    }

    if (action === 'DEPRECATE_PROMPT') {
      await registry.deprecatePrompt(promptId);
      return ApiResponse.success({ message: `Prompt "${promptId}" has been deprecated.` }, 200);
    }

    return ApiResponse.error(`Invalid action: ${action}`, 'VALIDATION_ERROR', 400);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('Failed to handle intelligence action', error);
    return ApiResponse.error(errorMsg, 'INTERNAL_ERROR', 500);
  }
}
