import { describe, it, expect, beforeEach } from 'vitest';
import { PromptRegistry } from '../src/agents/platform/registry';
import { GuardrailsManager } from '../src/agents/platform/guardrails';
import { ResponseCacheManager } from '../src/agents/platform/cache';
import { HallucinationDetector } from '../src/agents/platform/hallucination';
import { AIEvaluator } from '../src/agents/platform/evaluator';
import { AIPlatform } from '../src/agents/platform/platform';
import { AIProvider, GenerationOptions, GenerationResult } from '../src/agents/platform/types';

// Mock Provider to test multi-pass reasoning loops & guardrail trigger flows
class MockPlatformAIProvider implements AIProvider {
  public callCount = 0;
  public responses: string[] = [];

  constructor(responses: string[]) {
    this.responses = responses;
  }

  public async generateText(
    _prompt: string,
    _systemInstruction?: string,
    _options?: GenerationOptions,
  ): Promise<GenerationResult> {
    const text = this.responses[this.callCount % this.responses.length];
    this.callCount++;
    return {
      text,
      promptTokens: 100,
      responseTokens: 200,
    };
  }
}

describe('Gemini Intelligence Platform & Governance Layer', () => {
  describe('Prompt Registry & Version Control', () => {
    const registry = PromptRegistry.getInstance();

    it('should initialize and load default templates', async () => {
      await registry.initialize();
      const prompt = await registry.getPrompt('research.company');
      expect(prompt).toBeDefined();
      expect(prompt.id).toBe('research.company');
      expect(prompt.version).toBeGreaterThanOrEqual(1);
      expect(prompt.isActive).toBe(true);
    });

    it('should update prompt template, increment version, and log history', async () => {
      const origPrompt = await registry.getPrompt('research.company');
      const origVersion = origPrompt.version;

      const updated = await registry.updatePrompt('research.company', {
        template: 'New Company Template for "{{query}}"',
        changelog: 'Refined query instructions for European payments market alignment',
      });

      expect(updated.version).toBe(origVersion + 1);
      expect(updated.template).toContain('New Company Template');

      const history = await registry.getHistory('research.company');
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history[0].version).toBe(updated.version);
      expect(history[0].changelog).toBe('Refined query instructions for European payments market alignment');
    });

    it('should deprecate (deactivate) prompts successfully', async () => {
      // Create a dynamic prompt to deprecate
      const registryInstance = registry as any;
      registryInstance.staticCache.set('temp.test', {
        id: 'temp.test',
        name: 'Temp test',
        description: 'Test template',
        template: 'Test',
        version: 1,
        isActive: true,
      });

      await registry.deprecatePrompt('temp.test');
      const tempDef = await registry.getPrompt('temp.test');
      expect(tempDef.isActive).toBe(false);
    });
  });

  describe('JSON Schema Guardrails', () => {
    const guardrails = GuardrailsManager.getInstance();

    it('should reject empty or whitespace generations', () => {
      const emptyCheck = guardrails.validate('   ');
      expect(emptyCheck.isValid).toBe(false);
      expect(emptyCheck.errors).toContain('Generation output is empty or whitespace.');
    });

    it('should reject malformed non-JSON strings', () => {
      const malformedCheck = guardrails.validate('Not a JSON string');
      expect(malformedCheck.isValid).toBe(false);
      expect(malformedCheck.errors[0]).toContain('Malformed JSON structure');
    });

    it('should validate correctly formatted schema outputs', () => {
      const payload = JSON.stringify({
        companyName: 'Stripe',
        opportunities: ['local routing'],
        score: 95,
      });

      const schema = {
        companyName: 'string' as const,
        opportunities: 'array' as const,
        score: 'number' as const,
      };

      const result = guardrails.validate(payload, schema);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should capture missing properties or incorrect types in validations', () => {
      const invalidPayload = JSON.stringify({
        companyName: 'Stripe',
        score: 'not-a-number', // type violation
      });

      const schema = {
        companyName: 'string' as const,
        opportunities: 'array' as const, // missing property
        score: 'number' as const,
      };

      const result = guardrails.validate(invalidPayload, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required field "opportunities"');
      expect(result.errors).toContain('Field "score" must be of type "number", got "string"');
    });
  });

  describe('Response Caching Engine', () => {
    const cache = ResponseCacheManager.getInstance();

    beforeEach(() => {
      cache.clear();
    });

    it('should generate deterministic request signatures', () => {
      const signatureA = cache.hashRequest('research.company', { query: 'stripe' });
      const signatureB = cache.hashRequest('research.company', { query: 'stripe' });
      const signatureC = cache.hashRequest('research.company', { query: 'hubspot' });

      expect(signatureA).toBe(signatureB);
      expect(signatureA).not.toBe(signatureC);
    });

    it('should store, hit, and retrieve cache entries under 20ms', async () => {
      const key = cache.hashRequest('research.company', { query: 'shopify' });
      const textVal = '{"name": "Shopify"}';

      await cache.set(key, textVal);

      const start = Date.now();
      const hit = await cache.get(key);
      const latency = Date.now() - start;

      expect(hit).toBeDefined();
      expect(hit?.text).toBe(textVal);
      expect(latency).toBeLessThan(20);
    });

    it('should return null on expired TTL cached items', async () => {
      const key = cache.hashRequest('research.company', { query: 'expiring' });
      // Set cache with negative TTL (already expired)
      await cache.set(key, 'Expired Text', -1);

      const hit = await cache.get(key);
      expect(hit).toBeNull();
    });
  });

  describe('Hallucination & Grounding Detection', () => {
    const detector = new HallucinationDetector(null);

    it('should verify grounded statements correctly', async () => {
      const variables = { companyName: 'Notion', competitors: ['Confluence'] };
      const outputText = 'Notion competes with Confluence in the workspace collaboration market.';

      const report = await detector.analyze('research.company', outputText, variables);
      expect(report.confidence).toBe(1.0);
      expect(report.unsupportedClaims.length).toBe(0);
      expect(report.statements.length).toBeGreaterThanOrEqual(2);
      expect(report.statements[0].isGrounded).toBe(true);
    });

    it('should flag ungrounded statements as potential hallucinations', async () => {
      const variables = { companyName: 'Stripe' };
      const outputText = 'This is an outreach email targeting random buyers.'; // Failed to mention Stripe

      const report = await detector.analyze('outreach.email', outputText, variables);
      expect(report.confidence).toBe(0.0);
      expect(report.unsupportedClaims[0]).toContain('failed to mention the target account context');
    });
  });

  describe('Response Evaluator Framework', () => {
    const evaluator = new AIEvaluator(null);

    it('should score outputs on a 0-100 scale using heuristics', async () => {
      const variables = { companyName: 'HubSpot' };
      const text = 'HubSpot offers Sales Hub, Marketing Hub, and Service Hub built on a unified codebase.';

      const evalResult = await evaluator.evaluate('research.web', 'ResearchAgent', text, variables);
      expect(evalResult.overallScore).toBeGreaterThanOrEqual(0);
      expect(evalResult.overallScore).toBeLessThanOrEqual(100);
      expect(evalResult.scores.relevance).toBe(90);
      expect(evalResult.scores.personalization).toBe(90); // Grounded in HubSpot
    });
  });

  describe('AI Platform Multi-Pass Reasoning Loop', () => {
    it('should run critique and self-correction cycles when first draft fails guardrails', async () => {
      const platform = AIPlatform.getInstance();

      // Mock provider returns malformed JSON on attempt 1, correct JSON on attempt 2
      const provider = new MockPlatformAIProvider([
        '{"invalid_json":', // Attempt 1: Malformed JSON
        '{"companyName": "Stripe", "opportunities": ["pricing optimization"], "score": 95}', // Attempt 2: Compliant
      ]);
      platform.setProvider(provider);

      const schema = {
        companyName: 'string' as const,
        opportunities: 'array' as const,
        score: 'number' as const,
      };

      const resultText = await platform.executeGeneration(
        'research.company',
        { query: 'stripe' },
        schema,
      );

      const parsed = JSON.parse(resultText);
      expect(parsed.companyName).toBe('Stripe');
      expect(provider.callCount).toBe(2); // Guardrail loop retried twice
    });
  });
});
