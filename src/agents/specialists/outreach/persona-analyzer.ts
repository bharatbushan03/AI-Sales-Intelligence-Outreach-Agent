import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, PersonaInfo } from './types';
import { PERSONA_ANALYZER_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class PersonaAnalyzer {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async analyze(profile: CompanyProfile, opportunities?: unknown[]): Promise<PersonaInfo[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nOpportunities:\n${JSON.stringify(
          opportunities || [],
        )}\n\nAnalyze likely stakeholders and generate target personas.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: PERSONA_ANALYZER_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.personas || [];
      } catch (error) {
        logger.error(
          `PersonaAnalyzer live analysis failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockPersonas(profile.name);
  }

  private getMockPersonas(companyName: string): PersonaInfo[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          role: 'CTO / VP of Engineering',
          priorities: [
            'Maintain 99.999% uptime',
            'Minimize integration overhead',
            'Optimize cross-border checkout flows',
          ],
          likelyChallenges: [
            'Complex legacy Connect integrations',
            'Granular subscription taxation configurations',
            'Developer resource constraints',
          ],
          preferredMessaging:
            'Highly technical, developer-centric, API-first and performance-driven',
          decisionInfluence: 'high',
        },
        {
          role: 'VP of Finance / CFO',
          priorities: [
            'Reduce processing fees',
            'Ensure tax compliance',
            'Improve cash collection automation',
          ],
          likelyChallenges: [
            'Manual reconciliation overhead',
            'SDR payment leakages',
            'Localized payment drop-offs in Europe',
          ],
          preferredMessaging: 'ROI-driven, risk reduction, operational cost savings',
          decisionInfluence: 'high',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          role: 'VP of Sales Operations',
          priorities: [
            'Improve sales pipeline velocity',
            'Minimize CRM churn and object limitation friction',
            'Standardize sales playbook execution',
          ],
          likelyChallenges: [
            'Custom object limit ceilings',
            'granular data model fragmentation',
            'Partner portal onboarding friction',
          ],
          preferredMessaging: 'Process-oriented, platform scalability, and ease of customization',
          decisionInfluence: 'high',
        },
        {
          role: 'Head of Customer Success',
          priorities: [
            'Reduce customer churn',
            'Optimize customer onboarding sequences',
            'Unify cross-departmental records',
          ],
          likelyChallenges: [
            'Customer feedback data silos',
            'Difficulty mapping onboarding milestones in multi-portal structures',
          ],
          preferredMessaging: 'Retention-driven, user-friendly, collaboration-centric',
          decisionInfluence: 'medium',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          role: 'Chief Revenue Officer (CRO)',
          priorities: [
            'Boost sales efficiency',
            'Maximize custom system return-on-investment',
            'Enable real-time AI capabilities',
          ],
          likelyChallenges: [
            'Astronomical total cost of ownership (TCO)',
            'Apex customization complexity',
            'Slow performance latency on large databases',
          ],
          preferredMessaging:
            'Executive-level, platform unification, strategic scale, and AI enablement',
          decisionInfluence: 'high',
        },
        {
          role: 'Salesforce Administrator Leader',
          priorities: [
            'Minimize maintenance overhead',
            'Reduce custom code dependencies',
            'Simplify data sync processes',
          ],
          likelyChallenges: [
            'Granular table latency',
            'Apex code refactoring backlog',
            'User adoption friction',
          ],
          preferredMessaging: 'Feature-centric, compliance-friendly, technical simplification',
          decisionInfluence: 'medium',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          role: 'Head of Knowledge Management / Operations',
          priorities: [
            'Unify company documentation',
            'Enhance search speed and accuracy',
            'Prevent wiki structural decay',
          ],
          likelyChallenges: [
            'Granular permission leaks',
            'Wiki clutter in teams >150 employees',
            'Workspace information fragmentation',
          ],
          preferredMessaging: 'Organization-driven, clean UI, security controls, and efficiency',
          decisionInfluence: 'high',
        },
        {
          role: 'VP of Product',
          priorities: [
            'Improve team design documentation speed',
            'Integrate development roadmaps with wikis',
            'Increase internal collaboration',
          ],
          likelyChallenges: [
            'Granular permission inheritance management',
            'Outdated specifications docs',
          ],
          preferredMessaging: 'Action-oriented, collaborative, integrations capability-centric',
          decisionInfluence: 'medium',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          role: 'VP of E-commerce Operations',
          priorities: [
            'Maximize checkout conversion rate',
            'Reduce app-store subscription dependency',
            'Streamline B2B wholesale orders',
          ],
          likelyChallenges: [
            'Granular checkouts customization limits',
            'Third-party app performance conflicts',
            'Net-payment term automation blockages',
          ],
          preferredMessaging:
            'Revenue-first, performance optimization, and application simplification',
          decisionInfluence: 'high',
        },
        {
          role: 'Director of Wholesale / B2B Commerce',
          priorities: [
            'Scale B2B merchant acquisition',
            'Integrate ERP solutions seamlessly',
            'Automate credit approval flows',
          ],
          likelyChallenges: [
            'Manual credit review loops',
            'Friction in headless checkout custom parameters',
          ],
          preferredMessaging: 'Scale-oriented, credit automation, ERP connectivity',
          decisionInfluence: 'high',
        },
      ];
    }

    // Generic fallback
    return [
      {
        role: 'Founder / CEO',
        priorities: [
          'Scale outbound pipeline',
          'Control operational overhead',
          'Accelerate revenue velocity',
        ],
        likelyChallenges: ['Inefficient outbound sales flows', 'Resource constraints'],
        preferredMessaging: 'Brief, strategic, growth-focused, and outcome-oriented',
        decisionInfluence: 'high',
      },
      {
        role: 'Director of Business Development',
        priorities: [
          'Increase rep quota attainment',
          'Improve personalization at scale',
          'Standardize outreach playbook',
        ],
        likelyChallenges: [
          'Generic AI email spam filters',
          'Time-consuming manual account research',
        ],
        preferredMessaging: 'Tactical, software-focused, sales utility-centric',
        decisionInfluence: 'medium',
      },
    ];
  }
}
export default PersonaAnalyzer;
