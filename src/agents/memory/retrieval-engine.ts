import { GoogleGenerativeAI } from '@google/generative-ai';
import { RELEVANCE_RANKING_PROMPT } from '../prompts/memory-prompts';
import { logger } from '../../utils/logger';

export class MemoryRetrievalEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Retrieves, ranks, and returns memories sorted by relevance.
   */
  public async retrieve<T extends { createdAt?: string; timestamp?: string }>(
    userGoal: string,
    memories: T[],
    limit = 10,
  ): Promise<Array<T & { score: number }>> {
    if (memories.length === 0) return [];

    let scores: number[] = [];

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const memoriesText = memories
          .map((m, idx) => `[Index ${idx}] ${JSON.stringify(m)}`)
          .join('\n');

        const prompt = `Goal: "${userGoal}"\n\nMemories:\n${memoriesText}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: RELEVANCE_RANKING_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        scores = json.scores || [];
      } catch (err) {
        logger.error('Gemini memory ranking failed, falling back to heuristic scoring', err);
      }
    }

    // Heuristic scoring fallback if Gemini is offline or fails
    if (scores.length !== memories.length) {
      scores = memories.map((m) => this.calculateHeuristicScore(userGoal, m));
    }

    // Map scores and compile ranking items
    const ranked = memories.map((memory, idx) => {
      const recencyBonus = this.calculateRecencyBonus(memory);
      const score = Math.min((scores[idx] || 0.5) + recencyBonus, 1.0);
      return {
        ...memory,
        score: Math.round(score * 100) / 100, // round to 2 decimals
      };
    });

    // Sort descending by relevance score
    return ranked.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Evaluates keyword matches to estimate baseline similarity.
   */
  private calculateHeuristicScore(userGoal: string, memory: unknown): number {
    const goalWords = userGoal
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    if (goalWords.length === 0) return 0.5;

    const memoryString = JSON.stringify(memory).toLowerCase();
    let matches = 0;

    goalWords.forEach((word) => {
      if (memoryString.includes(word)) {
        matches++;
      }
    });

    const matchRatio = matches / goalWords.length;
    return 0.3 + matchRatio * 0.7; // baseline 0.3, max 1.0
  }

  /**
   * Computes a small score bonus (up to 0.15) for recent records.
   */
  private calculateRecencyBonus(memory: { createdAt?: string; timestamp?: string }): number {
    const dateStr = memory.createdAt || memory.timestamp;
    if (!dateStr) return 0;

    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) return 0.15;
      if (diffDays <= 7) return 0.1;
      if (diffDays <= 30) return 0.05;
    } catch {
      // Ignore parse errors
    }
    return 0;
  }
}
export default MemoryRetrievalEngine;
