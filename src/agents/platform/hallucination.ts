import { GoogleGenerativeAI } from '@google/generative-ai';
import { HallucinationReport, HallucinationStatement } from './types';
import { hallucinationReportsRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

export class HallucinationDetector {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  /**
   * Evaluates text outputs for ungrounded claims against prompt variables.
   */
  public async analyze(
    promptId: string,
    text: string,
    variables: Record<string, any>,
  ): Promise<HallucinationReport> {
    const timestamp = new Date().toISOString();
    const statements: HallucinationStatement[] = [];
    const unsupportedClaims: string[] = [];

    // Heuristic Heuristic grounding checks
    const company = (variables.companyName || variables.websiteUrl || '').toLowerCase();
    const parsedText = text.toLowerCase();

    // Check basic brand context consistency
    if (company && company.length > 2) {
      const isCompanyGrounded = parsedText.includes(company);
      statements.push({
        statement: `Response includes references to target account: "${company}"`,
        evidence: `Input query specifies "${company}"`,
        isGrounded: isCompanyGrounded,
      });
      if (!isCompanyGrounded) {
        unsupportedClaims.push(`Output failed to mention the target account context: "${company}"`);
      }
    }

    // Heuristic competitor name matches verification if present in variable inputs
    if (variables.competitors && Array.isArray(variables.competitors)) {
      variables.competitors.forEach((comp: any) => {
        const name = (comp.name || comp || '').toLowerCase();
        if (name && name.length > 2) {
          const isGrounded = parsedText.includes(name);
          statements.push({
            statement: `Output links with competitor name: "${name}"`,
            evidence: `Variables inputs detail competitor "${name}"`,
            isGrounded,
          });
        }
      });
    }

    // Gemini-based deep verification logic if available
    let confidence = 1.0;
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const verificationPrompt = `
Analyze the text below against the input variables. Verify if the claims, numbers, and statements are grounded, or represent hallucinations.
Variables: ${JSON.stringify(variables)}
Text:
${text}

Respond ONLY with a JSON object of this structure:
{
  "confidence": 0.95, // float from 0 to 1
  "statements": [
    { "statement": "Claim statement", "evidence": "grounding reference in variables", "isGrounded": true }
  ],
  "unsupportedClaims": ["list of any ungrounded assertions"]
}
`;
        const result = await model.generateContent(verificationPrompt);
        const resText = result.response.text();
        const json = JSON.parse(resText);

        confidence = typeof json.confidence === 'number' ? json.confidence : 1.0;
        if (Array.isArray(json.statements)) {
          statements.push(...json.statements);
        }
        if (Array.isArray(json.unsupportedClaims)) {
          unsupportedClaims.push(...json.unsupportedClaims);
        }
      } catch (err) {
        logger.warn('Gemini hallucination verification failed, falling back to heuristics.', { error: String(err) });
      }
    }

    // If heuristics failed, calculate mock confidence based on violations
    if (!this.genAI) {
      const violations = statements.filter((s) => !s.isGrounded).length;
      confidence = statements.length > 0 ? 1.0 - violations / statements.length : 1.0;
    }

    const report: HallucinationReport = {
      promptId,
      confidence: Math.round(confidence * 100) / 100,
      unsupportedClaims,
      statements,
      createdAt: timestamp,
    };

    // Save report to Firestore asynchronously
    hallucinationReportsRepository.add(report).catch((err) => {
      logger.error('Failed to log hallucination report in database:', err);
    });

    return report;
  }
}
