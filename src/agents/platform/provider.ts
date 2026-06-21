import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, GenerationOptions, GenerationResult } from './types';
import { logger } from '../../utils/logger';

export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public async generateText(
    prompt: string,
    systemInstruction?: string,
    options?: GenerationOptions,
  ): Promise<GenerationResult> {
    const modelName = options?.model || 'gemini-1.5-flash';
    const config: any = {};
    if (options?.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }
    if (options?.temperature !== undefined) {
      config.temperature = options.temperature;
    }

    const model = this.genAI.getGenerativeModel({
      model: modelName,
      generationConfig: config,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      systemInstruction,
    });

    const response = await result.response;
    const text = response.text();

    // Fetch token counts or estimate if API call fails
    let promptTokens = 0;
    let responseTokens = 0;
    try {
      const pCount = await model.countTokens({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      promptTokens = pCount.totalTokens;

      const rCount = await model.countTokens({
        contents: [{ role: 'model', parts: [{ text }] }],
      });
      responseTokens = rCount.totalTokens;
    } catch {
      // rough estimation fallback (4 chars per token average)
      promptTokens = Math.max(1, Math.round(prompt.length / 4));
      responseTokens = Math.max(1, Math.round(text.length / 4));
    }

    return {
      text,
      promptTokens,
      responseTokens,
    };
  }
}

export class MockProvider implements AIProvider {
  public async generateText(
    prompt: string,
    systemInstruction?: string,
    _options?: GenerationOptions,
  ): Promise<GenerationResult> {
    // Generate responses based on context keywords in prompt or system instruction
    const p = (prompt + ' ' + (systemInstruction || '')).toLowerCase();
    let text = '{}';

    // 1. Company Profiler
    if (p.includes('extract core profile') || p.includes('profile')) {
      if (p.includes('stripe')) {
        text = JSON.stringify({
          name: 'Stripe',
          website: 'stripe.com',
          description: 'APIs powering online payment processing and commerce solutions.',
          profile: {
            employeeCount: 8500,
            estimatedRevenue: '$14.3B',
            founded: '2010',
            location: 'San Francisco, CA',
            businessModel: 'Transaction-based fees',
            targetCustomers: ['SaaS', 'E-commerce', 'Marketplaces'],
            marketPosition: 'Market Leader',
          },
          industry: {
            classification: 'FinTech',
            vertical: 'Payment Processing',
            tags: ['Payments', 'API', 'Commerce'],
          },
        });
      } else if (p.includes('hubspot')) {
        text = JSON.stringify({
          name: 'HubSpot',
          website: 'hubspot.com',
          description: 'Leading customer relationship management platform.',
          profile: {
            employeeCount: 7600,
            estimatedRevenue: '$2.2B',
            founded: '2006',
            location: 'Cambridge, MA',
            businessModel: 'B2B SaaS Subscriptions',
            targetCustomers: ['SMBs', 'Mid-market'],
            marketPosition: 'CRM Leader',
          },
          industry: {
            classification: 'SaaS',
            vertical: 'CRM Automation',
            tags: ['CRM', 'Inbound Marketing'],
          },
        });
      } else {
        text = JSON.stringify({
          name: 'GOOGLE',
          website: 'google.com',
          description: 'Search engine provider and enterprise SaaS.',
          profile: {
            employeeCount: 180000,
            estimatedRevenue: '$307B',
            founded: '1998',
            location: 'Mountain View, CA',
            businessModel: 'Ad & SaaS Fees',
            targetCustomers: ['Enterprise', 'SMBs'],
            marketPosition: 'Dominant Tech Leader',
          },
          industry: {
            classification: 'Technology',
            vertical: 'Search & Cloud',
            tags: ['Search', 'Cloud', 'AI'],
          },
        });
      }
    }
    // 2. Website Analyzer
    else if (p.includes('pricing') || p.includes('signals') || p.includes('hiring intent')) {
      text = JSON.stringify({
        products: [
          { name: 'Stripe Payments', description: 'Global checkout engine', pricing: '2.9% + 30c' },
        ],
        signals: {
          hiringSignal: 'Looking for Enterprise Account Executives in EU',
          growthIndicator: 'Expanding Stripe Tax offerings',
        },
      });
    }
    // 3. Competitor Analyzer
    else if (p.includes('competitors') || p.includes('competes')) {
      text = JSON.stringify([
        {
          name: 'Salesforce CRM',
          relationship: 'direct',
          advantage: 'Extremely deep enterprise ecosystem and customizable metadata pipelines.',
          disadvantage: 'Complex UI setups and heavy resource implementation requirements.',
        },
      ]);
    }
    // 4. Opportunity Discovery
    else if (p.includes('discover') || p.includes('scroed sales hooks') || p.includes('opportunities')) {
      text = JSON.stringify({
        opportunities: [
          {
            type: 'technology',
            insight: 'Introduce high-speed payment routing optimization middleware.',
            confidence: 88,
            source: 'Clearbit Integration APIs',
          },
        ],
        risks: [
          {
            insight: 'Friction points in localized decline rates.',
            confidence: 75,
            source: 'Adyen Developer Documentation',
          },
        ],
      });
    }
    // 5. Insight Generator
    else if (p.includes('recommendations') && p.includes('synthesis')) {
      text = JSON.stringify({
        summary: 'Stripe is expanding its global enterprise offerings aggressively.',
        recommendations: [
          'Review Smart-Route payment options to minimize localized decline rates.',
        ],
      });
    }
    // 6. Workflow Planner
    else if (p.includes('workflow plan') || p.includes('decompose')) {
      text = JSON.stringify({
        intent: 'Research and analyze Stripe opportunities',
        steps: [
          { id: 'step_research', agentCapability: 'research' },
          { id: 'step_opportunity', agentCapability: 'opportunity-analysis', dependsOn: ['step_research'] },
          { id: 'step_crm', agentCapability: 'crm', dependsOn: ['step_opportunity'] },
        ],
      });
    }
    // 7. Synthesis manager
    else if (p.includes('successfully executed') || p.includes('synthesize final')) {
      text = JSON.stringify({
        summary: 'Aggregated findings for Stripe enterprise billing solutions.',
        recommendations: ['Schedule introduction call with sales reps.'],
      });
    }
    // 8. Opportunity Agent Scoring
    else if (p.includes('scoring') || p.includes('fit score') || p.includes('scorecard')) {
      text = JSON.stringify({
        fitScore: 88,
        urgencyScore: 80,
        overallScore: 84,
        metrics: { matches: 5 },
      });
    }
    // 9. Strategic recommendations
    else if (p.includes('strategic recommendations') || p.includes('trigger') || p.includes('pain points')) {
      text = JSON.stringify({
        painPoints: [{ title: 'Sync Lag', description: 'Enterprise Data latency', severity: 'high' }],
        recommendations: [{ title: 'Sync pipeline', description: 'High-speed sync integration', valueScore: 90 }],
        triggers: [{ eventType: 'expansion', description: 'Enterprise expansion detected', triggerFitScore: 85 }],
      });
    }
    // 10. Outreach Campaign email templates
    else if (p.includes('outreach') || p.includes('email variant') || p.includes('campaign planner')) {
      text = JSON.stringify({
        emailVariants: [
          { subject: 'Optimizing Stripe Payments decline rates', body: 'Hi Stripe team, let us chat.' },
        ],
        linkedinMessage: 'Hi Stripe, let us connect.',
        discoveryCallScript: { opener: 'Hello, is this Stripe?', questions: [] },
        objections: [{ objection: 'Cost', response: 'High ROI' }],
      });
    }
    // 11. CRM Sync leads logs
    else if (p.includes('crm sync') || p.includes('sync crm') || p.includes('log lead')) {
      text = JSON.stringify({
        leadCreated: { id: 'lead_stripe_123', name: 'Stripe Account' },
        activityLogged: { id: 'act_123', description: 'Logged Stripe research run' },
      });
    }
    // 12. Proposals drafts
    else if (p.includes('proposal') || p.includes('business case') || p.includes('sow')) {
      text = JSON.stringify({
        executiveSummary: { text: 'Executive business case summary for Stripe.' },
        businessCase: { objectives: [], challenges: [], strategy: 'Strategy details' },
        sow: { scope: 'Integration setup support', terms: [] },
        roi: { returnPeriodMonths: 12, costSavingsUsd: 50000 },
        presentationOutline: { title: 'B2B Stripe proposal deck', slides: [] },
      });
    }
    // Fallback/Default structured replies
    else {
      text = JSON.stringify({
        success: true,
        summary: 'Mock synthesis response details.',
        recommendations: ['Mock recommendation details'],
        results: { content: 'mock' },
        scores: { relevance: 85, accuracy: 80, completeness: 90, personalization: 85, businessValue: 90, actionability: 85 },
        overallScore: 86,
        confidence: 0.85,
        unsupportedClaims: [],
        statements: [],
      });
    }

    const promptTokens = Math.max(1, Math.round(prompt.length / 4));
    const responseTokens = Math.max(1, Math.round(text.length / 4));

    return {
      text,
      promptTokens,
      responseTokens,
    };
  }
}
