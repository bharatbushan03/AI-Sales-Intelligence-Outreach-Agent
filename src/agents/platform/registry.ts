import { PromptDefinition, PromptVersion } from './types';
import { promptRegistryRepository, promptVersionsRepository } from '../../lib/repositories';
import { logger } from '../../utils/logger';

// Default prompt templates for seeding
const DEFAULT_PROMPTS: Record<string, Omit<PromptDefinition, 'isActive' | 'version'>> = {
  'research.company': {
    id: 'research.company',
    name: 'Company Profiler Prompt',
    description:
      'Profiles a target company based on query input, classification, vertical, and target segments.',
    template: 'Query: "{{query}}"\nExtract core profile details.',
    systemInstruction: `You are the CompanyProfiler Agent. Your task is to gather core intelligence on a company based on the search query. Use grounding if available. Respond ONLY with a JSON object of this structure: { "name": "Company Name", "website": "website.com", "description": "Short description of the company", "industry": { "classification": "Main classification", "vertical": "Specific vertical niche", "tags": ["tag1", "tag2"] }, "profile": { "employeeCount": 450, "estimatedRevenue": "$80M", "founded": "2015", "location": "Boston, MA", "businessModel": "B2B SaaS", "targetCustomers": ["Sales Managers", "AEs"], "marketPosition": "Market Leader" } }`,
    fewShots: ['Input: stripe.com\nOutput: { "name": "Stripe", "website": "stripe.com", ... }'],
    outputInstructions:
      'Output must represent valid schema-compliant JSON. Do not include any markdown comments.',
  },
  'research.web': {
    id: 'research.web',
    name: 'Website Analyzer Prompt',
    description: 'Analyzes key products, offering packages, and hiring intent signals.',
    template: 'Company Profile: {{profile}}\nAnalyze website products and signals.',
    systemInstruction: `You are the WebsiteAnalyzer Agent. Your task is to analyze the company's product offerings and pricing based on the provided company profile. Respond ONLY with a JSON object of this structure: { "products": [ { "name": "Product Name", "description": "Short description", "pricing": "pricing tier" } ], "signals": { "hiringSignal": "Description of departments hiring", "growthIndicator": "headcount growth or releases" } }`,
    outputInstructions: 'Output MUST be valid JSON matching the website analyzer structure.',
  },
  'research.competitor': {
    id: 'research.competitor',
    name: 'Competitor Landscape Prompt',
    description: 'Identifies 3 key competitors, direct or indirect, highlighting advantages.',
    template: 'Company Profile: {{profile}}\nIdentify and map competitors.',
    systemInstruction: `You are the CompetitorAnalyzer Agent. Your task is to analyze the competitive landscape for the company. Identify 3 key competitors (direct, indirect, or alternative solutions). Respond ONLY with a JSON object of this structure: { "competitors": [ { "name": "Competitor Name", "website": "competitor.com", "relationship": "direct" | "indirect" | "alternative", "advantage": "Our advantage", "disadvantage": "Their advantage" } ] }`,
    outputInstructions: 'Provide exactly 3 competitor entries in the JSON array.',
  },
  'research.opportunity': {
    id: 'research.opportunity',
    name: 'Opportunity Discovery Prompt',
    description: 'Identifies sales triggers, technology upgrades, and business opportunities.',
    template:
      'Company: {{company}}, Products: {{products}}, Competitors: {{competitors}}\nFind opportunities and risks.',
    systemInstruction: `You are the OpportunityDiscoveryEngine. Your task is to identify B2B sales opportunities and risk vectors. Respond ONLY with a JSON object of this structure: { "opportunities": [ { "insight": "Insight description", "confidence": 85, "source": "Website Careers Page", "type": "technology" | "expansion" | "operational" | "challenge" } ], "risks": [ { "insight": "Description of risk vector", "confidence": 75, "source": "Source data" } ] }`,
  },
  'research.insight': {
    id: 'research.insight',
    name: 'Research Synthesis Prompt',
    description: 'Aggregates outputs into executive summaries and structured hooks.',
    template:
      'Company: {{company}}, Opportunities: {{opportunities}}\nGenerate synthesis and recommendations.',
    systemInstruction: `You are the InsightGenerator. Create a final synthesis. Respond ONLY with a JSON object of this structure: { "summary": "Executive summary paragraph...", "recommendations": [ "Sales hook recommendation 1", "Sales hook recommendation 2" ] }`,
  },
  'manager.plan': {
    id: 'manager.plan',
    name: 'Workflow Planning Prompt',
    description: 'Parses goals and schedules specialist agents steps sequentially.',
    template: 'User Goal: "{{goal}}"\nDecompose this goal according to system parameters.',
    systemInstruction: `You are the Manager Agent for a B2B Sales multi-agent system. Decompose the request into steps with unique IDs. Use the 'dependsOn' array to specify sequential order. Respond ONLY with a JSON object of this structure: { "intent": "A short summary", "steps": [ { "id": "step_id", "agentCapability": "research" | "opportunity-analysis" | "outreach" | "crm" | "proposal", "dependsOn": ["dependent_step_id"] } ] }`,
  },
  'manager.synthesis': {
    id: 'manager.synthesis',
    name: 'Workflow Synthesis Prompt',
    description: 'Reviews goal and aggregates specialist agent outputs.',
    template: 'User Goal: "{{goal}}"\nShared Memory: {{memory}}\nSynthesize final outcomes.',
    systemInstruction: `You are the Manager Agent. Review the user goal and specialist outputs. Respond ONLY with a JSON object of this structure: { "summary": "Client-facing summary...", "recommendations": ["Recommended next step 1", "Recommended next step 2"] }`,
  },
};

export class PromptRegistry {
  private static instance: PromptRegistry;
  private staticCache: Map<string, PromptDefinition> = new Map();
  private staticCacheHistory: Map<string, PromptVersion[]> = new Map();

  private constructor() {
    // Seed in-memory default templates
    Object.entries(DEFAULT_PROMPTS).forEach(([key, value]) => {
      const definition: PromptDefinition = {
        ...value,
        version: 1,
        isActive: true,
      };
      this.staticCache.set(key, definition);
      this.staticCacheHistory.set(key, [
        {
          promptId: key,
          version: 1,
          template: definition.template,
          systemInstruction: definition.systemInstruction,
          changelog: 'Initial seed configuration',
          createdAt: new Date().toISOString(),
        },
      ]);
    });
  }

  public static getInstance(): PromptRegistry {
    if (!PromptRegistry.instance) {
      PromptRegistry.instance = new PromptRegistry();
    }
    return PromptRegistry.instance;
  }

  /**
   * Initializes prompt registry, seeding Firestore collections if empty.
   */
  public async initialize(): Promise<void> {
    try {
      const existing = await promptRegistryRepository.list(undefined, 'id', 'asc', 1);
      if (existing.length === 0) {
        logger.info('PromptRegistry: Firestore prompt collection is empty. Seeding defaults...');
        for (const promptDef of this.staticCache.values()) {
          await promptRegistryRepository.create(promptDef.id, promptDef);

          // Seed the initial version in prompt_versions
          const initialVersion: PromptVersion = {
            promptId: promptDef.id,
            version: 1,
            template: promptDef.template,
            systemInstruction: promptDef.systemInstruction,
            changelog: 'Initial seed configuration',
            createdAt: new Date().toISOString(),
          };
          await promptVersionsRepository.add(initialVersion);
        }
        logger.info(`PromptRegistry: Successfully seeded ${this.staticCache.size} prompts.`);
      }
    } catch (err) {
      logger.error('Failed to initialize and seed PromptRegistry:', err);
    }
  }

  /**
   * Fetches the active prompt definition.
   */
  public async getPrompt(promptId: string): Promise<PromptDefinition> {
    try {
      const doc = await promptRegistryRepository.get(promptId);
      if (doc && doc.isActive) {
        return doc;
      }
    } catch (err) {
      logger.warn(
        `Failed to read prompt "${promptId}" from database. Falling back to static seed.`,
        { error: String(err) },
      );
    }

    const fallback = this.staticCache.get(promptId);
    if (!fallback) {
      throw new Error(`Prompt definition "${promptId}" is not registered in the system.`);
    }
    return fallback;
  }

  /**
   * Fetches a specific historic version of a prompt template.
   */
  public async getPromptVersion(promptId: string, version: number): Promise<PromptVersion> {
    try {
      const versions = await promptVersionsRepository.list([
        { field: 'promptId', operator: '==' as const, value: promptId },
        { field: 'version', operator: '==' as const, value: version },
      ]);
      if (versions.length > 0) {
        return versions[0];
      }
    } catch (err) {
      logger.warn(`Failed to query version ${version} of prompt "${promptId}" from database.`, {
        error: String(err),
      });
    }

    const list = this.staticCacheHistory.get(promptId) || [];
    const match = list.find((v) => v.version === version);
    if (!match) {
      throw new Error(`Version ${version} of prompt "${promptId}" was not found.`);
    }
    return match;
  }

  /**
   * Registers a new prompt definition or updates an existing one, incrementing the version.
   */
  public async updatePrompt(
    promptId: string,
    updates: {
      name?: string;
      description?: string;
      template: string;
      systemInstruction?: string;
      fewShots?: string[];
      outputInstructions?: string;
      changelog: string;
    },
  ): Promise<PromptDefinition> {
    const current = await this.getPrompt(promptId);
    const newVersion = current.version + 1;

    const updatedDef: PromptDefinition = {
      ...current,
      name: updates.name || current.name,
      description: updates.description || current.description,
      template: updates.template,
      systemInstruction: updates.systemInstruction || current.systemInstruction,
      fewShots: updates.fewShots || current.fewShots,
      outputInstructions: updates.outputInstructions || current.outputInstructions,
      version: newVersion,
    };

    // 1. Update main record in registry
    await promptRegistryRepository.update(promptId, {
      name: updatedDef.name,
      description: updatedDef.description,
      template: updatedDef.template,
      systemInstruction: updatedDef.systemInstruction,
      fewShots: updatedDef.fewShots,
      outputInstructions: updatedDef.outputInstructions,
      version: updatedDef.version,
    });

    // 2. Save new version history record
    const versionRecord: PromptVersion = {
      promptId,
      version: newVersion,
      template: updates.template,
      systemInstruction: updates.systemInstruction,
      changelog: updates.changelog || `Updated template to version ${newVersion}`,
      createdAt: new Date().toISOString(),
    };
    await promptVersionsRepository.add(versionRecord);

    // Also update in-memory cache definition and history
    this.staticCache.set(promptId, updatedDef);
    const historyList = this.staticCacheHistory.get(promptId) || [];
    historyList.unshift(versionRecord);
    this.staticCacheHistory.set(promptId, historyList);

    logger.info(`Prompt "${promptId}" updated successfully to version ${newVersion}`);
    return updatedDef;
  }

  /**
   * Deprecates (deactivates) a prompt registry record.
   */
  public async deprecatePrompt(promptId: string): Promise<void> {
    await promptRegistryRepository.update(promptId, {
      isActive: false,
    });
    const current = this.staticCache.get(promptId);
    if (current) {
      current.isActive = false;
    }
    logger.warn(`Prompt registry record "${promptId}" has been marked as deprecated/inactive.`);
  }

  /**
   * Retrieves all prompt versions for comparison.
   */
  public async getHistory(promptId: string): Promise<PromptVersion[]> {
    try {
      const list = await promptVersionsRepository.list(
        [{ field: 'promptId', operator: '==' as const, value: promptId }],
        'version',
        'desc',
      );
      if (list.length > 0) return list;
    } catch (err) {
      logger.warn(`Failed to read prompt history for "${promptId}" from database.`, {
        error: String(err),
      });
    }
    return this.staticCacheHistory.get(promptId) || [];
  }
}

export class PromptTemplateSystem {
  /**
   * Replaces placeholders formatted as {{key}} in a template string.
   */
  public static compile(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      const valStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      result = result.replace(placeholder, valStr);
    }
    return result;
  }
}
