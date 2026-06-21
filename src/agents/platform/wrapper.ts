import { AIPlatform } from './platform';
import { PromptRegistry } from './registry';
import { logger } from '../../utils/logger';

export class AIPlatformGenerativeAI {
  private platform = AIPlatform.getInstance();

  constructor(_apiKey: string) {
    // The wrapper hooks into the platform singleton
  }

  public getGenerativeModel(options: { model: string; generationConfig?: any }): AIPlatformGenerativeModel {
    return new AIPlatformGenerativeModel(this.platform, options);
  }
}

export class AIPlatformGenerativeModel {
  constructor(
    private platform: AIPlatform,
    private modelOptions: { model: string; generationConfig?: any },
  ) {}

  /**
   * Generates content by mapping the parameters to the platform's executeGeneration flow.
   */
  public async generateContent(params: {
    contents: any;
    systemInstruction?: any;
  }): Promise<{ response: { text: () => string } }> {
    // 1. Extract prompt text
    let promptText = '';
    if (params.contents && Array.isArray(params.contents)) {
      promptText = params.contents
        .map((c: any) => {
          if (Array.isArray(c.parts)) {
            return c.parts.map((p: any) => p.text || '').join('\n');
          }
          return '';
        })
        .join('\n');
    } else if (typeof params.contents === 'string') {
      promptText = params.contents;
    }

    // 2. Extract system instruction
    let systemInstruction = '';
    if (params.systemInstruction) {
      if (typeof params.systemInstruction === 'string') {
        systemInstruction = params.systemInstruction;
      } else if (params.systemInstruction.parts && Array.isArray(params.systemInstruction.parts)) {
        systemInstruction = params.systemInstruction.parts.map((p: any) => p.text || '').join('\n');
      }
    }

    // 3. Map system instruction and content to seeded prompt IDs
    const promptId = this.mapInstructionToPromptId(systemInstruction, promptText);
    
    // Inject the prompt text directly into template variables
    const variables = {
      query: promptText,
      profile: promptText,
      company: promptText,
      goal: promptText,
      memory: promptText,
      products: promptText,
      competitors: promptText,
      prompt: promptText,
    };

    // 4. Construct platform options
    const agentName = this.inferAgentName(promptId);
    const options = {
      model: this.modelOptions.model,
      responseMimeType: this.modelOptions.generationConfig?.responseMimeType,
      temperature: this.modelOptions.generationConfig?.temperature,
      agentName,
    };

    // 5. Build schema expectations for Guardrails based on prompt template
    const schema = this.inferSchema(promptId);

    // Ensure prompt is registered (fallback fallback)
    await this.ensurePromptRegistered(promptId, systemInstruction);

    logger.info(`AIPlatform Wrapper routing execution for agent: "${agentName}" via promptId: "${promptId}"`);
    const text = await this.platform.executeGeneration(promptId, variables, schema, options);

    return {
      response: {
        text: () => text,
      },
    };
  }

  /**
   * Mock countTokens call matching GenerativeModel interface.
   */
  public async countTokens(params: any): Promise<{ totalTokens: number }> {
    const textLen = JSON.stringify(params).length;
    return {
      totalTokens: Math.max(1, Math.round(textLen / 4)),
    };
  }

  /**
   * Maps system instructions to central prompt registry IDs.
   */
  private mapInstructionToPromptId(systemInstruction: string, promptText: string): string {
    const inst = systemInstruction.toLowerCase();
    const prompt = promptText.toLowerCase();

    if (inst.includes('companyprofiler') || prompt.includes('extract core profile')) return 'research.company';
    if (inst.includes('websiteanalyzer') || prompt.includes('website products')) return 'research.web';
    if (inst.includes('competitoranalyzer') || prompt.includes('landscape')) return 'research.competitor';
    if (inst.includes('opportunitydiscovery') || prompt.includes('opportunities and risks')) return 'research.opportunity';
    if (inst.includes('insightgenerator') || prompt.includes('synthesis')) return 'research.insight';
    if (inst.includes('manager agent') && (prompt.includes('workflow plan') || prompt.includes('decompose'))) return 'manager.plan';
    if (inst.includes('manager agent') && (prompt.includes('successfully executed') || prompt.includes('outcome'))) return 'manager.synthesis';

    return 'generic.generation';
  }

  /**
   * Infers the specialist agent name based on the prompt category.
   */
  private inferAgentName(promptId: string): string {
    if (promptId.startsWith('research.')) return 'ResearchAgent';
    if (promptId.startsWith('manager.')) return 'ManagerAgent';
    if (promptId.startsWith('opportunity.')) return 'OpportunityAgent';
    if (promptId.startsWith('outreach.')) return 'OutreachAgent';
    if (promptId.startsWith('crm.')) return 'CrmAgent';
    if (promptId.startsWith('proposal.')) return 'ProposalAgent';
    return 'GenericAgent';
  }

  /**
   * Infers schema expectations for structured outputs validation.
   */
  private inferSchema(promptId: string): Record<string, any> | undefined {
    if (promptId === 'research.company') {
      return {
        name: 'string',
        website: 'string',
        description: 'string',
        industry: 'object',
        profile: 'object',
      };
    }
    if (promptId === 'research.web') {
      return {
        products: 'array',
        signals: 'object',
      };
    }
    if (promptId === 'research.competitor') {
      return {
        competitors: 'array',
      };
    }
    if (promptId === 'research.opportunity') {
      return {
        opportunities: 'array',
        risks: 'array',
      };
    }
    if (promptId === 'research.insight') {
      return {
        summary: 'string',
        recommendations: 'array',
      };
    }
    if (promptId === 'manager.plan') {
      return {
        intent: 'string',
        steps: 'array',
      };
    }
    if (promptId === 'manager.synthesis') {
      return {
        summary: 'string',
        recommendations: 'array',
      };
    }
    return undefined;
  }

  /**
   * Ensures fallback prompt IDs are registered dynamically in memory.
   */
  private async ensurePromptRegistered(promptId: string, systemInstruction: string): Promise<void> {
    const registry = PromptRegistry.getInstance();
    try {
      await registry.getPrompt(promptId);
    } catch {
      logger.info(`AIPlatform: Registering generic/fallback prompt ID: "${promptId}"`);
      const seedRegistry = (registry as any).staticCache;
      if (seedRegistry) {
        seedRegistry.set(promptId, {
          id: promptId,
          name: `Dynamic Wrapper: ${promptId}`,
          description: 'Auto-registered by AIPlatform SDK wrapper pipeline.',
          template: '{{prompt}}',
          systemInstruction,
          version: 1,
          isActive: true,
        });
      }
    }
  }
}
