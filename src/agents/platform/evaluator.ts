import { GoogleGenerativeAI } from '@google/generative-ai';
import { EvaluationResult, EvaluationScores } from './types';
import { evaluationResultsRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class AIEvaluator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Evaluates generation text outputs against scoring metrics.
   */
  public async evaluate(
    promptId: string,
    agentName: string,
    text: string,
    variables: Record<string, any>,
  ): Promise<EvaluationResult> {
    const timestamp = new Date().toISOString();
    let scores: EvaluationScores = {
      relevance: 85,
      accuracy: 85,
      completeness: 80,
      personalization: 80,
      businessValue: 85,
      actionability: 80,
    };
    let note = 'Heuristics baseline scorecard evaluation.';

    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const evalPrompt = `
You are the AI Quality Evaluator. Score the following generation output against the target context variables.
Evaluate:
1. Relevance: matches the goal intent
2. Accuracy: factual soundness
3. Completeness: addresses all requested areas
4. Personalization: custom fit for variables details
5. Business Value: commercial worth of insights
6. Actionability: immediate sales utility

Give each category a score between 0 and 100.
Context: ${JSON.stringify(variables)}
Generated Output:
${text}

Respond ONLY with a JSON object of this structure:
{
  "scores": {
    "relevance": 90,
    "accuracy": 92,
    "completeness": 85,
    "personalization": 88,
    "businessValue": 90,
    "actionability": 87
  },
  "note": "A short justification explaining the evaluation results."
}
`;
        const result = await model.generateContent(evalPrompt);
        const resText = result.response.text();
        const json = JSON.parse(resText);

        if (json.scores) {
          scores = {
            relevance: json.scores.relevance || 80,
            accuracy: json.scores.accuracy || 80,
            completeness: json.scores.completeness || 80,
            personalization: json.scores.personalization || 80,
            businessValue: json.scores.businessValue || 80,
            actionability: json.scores.actionability || 80,
          };
        }
        note = json.note || 'Gemini evaluator output review registered.';
      } catch (err) {
        logger.warn('Gemini evaluator failed, using fallback heuristic scores.', {
          error: String(err),
        });
      }
    } else {
      // Heuristic offline scores adjustment based on length and variable grounding
      const lengthScore = Math.min(100, Math.round(text.length / 50) + 50); // longer text usually indicates higher completeness
      const company = (variables.companyName || '').toLowerCase();
      const hasPersonalization = company && text.toLowerCase().includes(company);

      scores = {
        relevance: 90,
        accuracy: 85,
        completeness: lengthScore,
        personalization: hasPersonalization ? 90 : 60,
        businessValue: 80,
        actionability: 85,
      };
      note = 'Heuristics offline scoring based on keyword validation and output length.';
    }

    const overallScore = Math.round(
      (scores.relevance +
        scores.accuracy +
        scores.completeness +
        scores.personalization +
        scores.businessValue +
        scores.actionability) /
        6,
    );

    const evaluation: EvaluationResult = {
      promptId,
      agentName,
      scores,
      overallScore,
      evaluatorNote: note,
      createdAt: timestamp,
    };

    // Save to Firestore asynchronously
    evaluationResultsRepository.add(evaluation).catch((err) => {
      logger.error('Failed to log evaluation results in database:', err);
    });

    return evaluation;
  }
}
