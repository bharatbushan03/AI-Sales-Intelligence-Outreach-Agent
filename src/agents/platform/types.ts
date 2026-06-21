export interface AIProvider {
  generateText(
    prompt: string,
    systemInstruction?: string,
    options?: GenerationOptions,
  ): Promise<GenerationResult>;
}

export interface PromptDefinition {
  id: string; // e.g. "research.company"
  name: string;
  description: string;
  template: string;
  version: number;
  isActive: boolean;
  systemInstruction?: string;
  fewShots?: string[];
  outputInstructions?: string;
}

export interface PromptVersion {
  id?: string;
  promptId: string;
  version: number;
  template: string;
  systemInstruction?: string;
  changelog: string;
  createdAt: string;
}

export interface EvaluationScores {
  relevance: number;
  accuracy: number;
  completeness: number;
  personalization: number;
  businessValue: number;
  actionability: number;
}

export interface EvaluationResult {
  id?: string;
  promptId: string;
  agentName: string;
  scores: EvaluationScores;
  overallScore: number;
  evaluatorNote?: string;
  createdAt: string;
}

export interface QualityScorecard {
  id?: string;
  agentName: string;
  successRate: number;
  averageQuality: number;
  runsCount: number;
  lastExecutedAt: string;
}

export interface TokenUsage {
  id?: string;
  promptId: string;
  agentName: string;
  workflowId?: string;
  promptTokens: number;
  responseTokens: number;
  estimatedCost: number;
  latencyMs: number;
  createdAt: string;
}

export interface ResponseCache {
  id?: string;
  cacheKey: string;
  text: string;
  hits: number;
  expiresAt: string;
  createdAt: string;
}

export interface HallucinationStatement {
  statement: string;
  evidence: string;
  isGrounded: boolean;
}

export interface HallucinationReport {
  id?: string;
  promptId: string;
  confidence: number;
  unsupportedClaims: string[];
  statements: HallucinationStatement[];
  createdAt: string;
}

export interface GenerationOptions {
  model?: string;
  responseMimeType?: string;
  temperature?: number;
  workflowId?: string;
  agentName?: string;
}

export interface GenerationResult {
  text: string;
  promptTokens: number;
  responseTokens: number;
}
