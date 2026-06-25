import { GoogleGenerativeAI } from '@google/generative-ai';
import { RelationshipScore, RelationshipClassification } from './types';
import { RELATIONSHIP_SCORER_PROMPT } from '../../prompts/crm-prompts';
import { logger } from '../../../utils/logger';

export class RelationshipScoringEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async scoreRelationship(
    companyName: string,
    activities: unknown[],
    accountId: string,
  ): Promise<RelationshipScore> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company: ${companyName}\nActivities:\n${JSON.stringify(
          activities,
        )}\n\nAnalyze and score relationship health.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: RELATIONSHIP_SCORER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return {
          relationshipId: `rel_${Math.random().toString(36).substring(2, 9)}`,
          accountId,
          score: json.score || 75,
          classification: json.classification || 'Moderate Relationship',
          rationale: json.rationale || 'Score generated.',
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        logger.error(
          `RelationshipScoringEngine live analysis failed. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockScore(companyName, accountId);
  }

  private getMockScore(companyName: string, accountId: string): RelationshipScore {
    const name = companyName.toLowerCase();
    const updatedAt = new Date().toISOString();

    if (name.includes('stripe')) {
      return {
        relationshipId: 'rel_stripe_001',
        accountId,
        score: 82,
        classification: 'Strong Relationship' as RelationshipClassification,
        rationale:
          'High level connection established on LinkedIn. Client requested EU payments compliance report and engaged with the local checkout routing materials.',
        updatedAt,
      };
    }

    if (name.includes('hubspot')) {
      return {
        relationshipId: 'rel_hubspot_001',
        accountId,
        score: 88,
        classification: 'Strong Relationship' as RelationshipClassification,
        rationale:
          'Completed discovery call. Proposal and relational schemas are currently under active evaluation by the technical lead.',
        updatedAt,
      };
    }

    if (name.includes('salesforce')) {
      return {
        relationshipId: 'rel_salesforce_001',
        accountId,
        score: 90,
        classification: 'Strong Relationship' as RelationshipClassification,
        rationale:
          'Active negotiation on custom integration terms. Contracts in C-Suite review cycles.',
        updatedAt,
      };
    }

    if (name.includes('notion')) {
      return {
        relationshipId: 'rel_notion_001',
        accountId,
        score: 55,
        classification: 'Moderate Relationship' as RelationshipClassification,
        rationale:
          'Cold outreach sequence started. Introductory client briefing on document permission leaks is currently pending follow-up.',
        updatedAt,
      };
    }

    if (name.includes('shopify')) {
      return {
        relationshipId: 'rel_shopify_001',
        accountId,
        score: 40,
        classification: 'Weak Relationship' as RelationshipClassification,
        rationale: 'Cold outbound initial stage. No direct reply from decision makers yet.',
        updatedAt,
      };
    }

    return {
      relationshipId: 'rel_generic_001',
      accountId,
      score: 60,
      classification: 'Moderate Relationship' as RelationshipClassification,
      rationale: 'Introductory outbound activities logged. Normal response timelines.',
      updatedAt,
    };
  }
}
export default RelationshipScoringEngine;
