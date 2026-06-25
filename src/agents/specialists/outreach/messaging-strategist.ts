import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, MessagingTheme } from './types';
import { MESSAGING_STRATEGIST_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class MessagingStrategist {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async strategize(
    profile: CompanyProfile,
    opportunities?: unknown[],
    painPoints?: unknown[],
  ): Promise<MessagingTheme[]> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nOpportunities:\n${JSON.stringify(
          opportunities || [],
        )}\nPain Points:\n${JSON.stringify(painPoints || [])}\n\nFormulate outreach messaging themes.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: MESSAGING_STRATEGIST_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return json.messagingStrategy || [];
      } catch (error) {
        logger.error(
          `MessagingStrategist live analysis failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockStrategy(profile.name);
  }

  private getMockStrategy(companyName: string): MessagingTheme[] {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return [
        {
          audience: 'VP of Payments / Engineering',
          messageTheme: 'Pain-Point-Driven: Streamline European localized checkouts',
          businessValue:
            'Identify and resolve card decline patterns to capture up to 5% more cross-border transaction revenue without complicating Connect APIs.',
          callToAction:
            'Would you be open to reviewing the local-routing benchmarks for European merchants?',
        },
        {
          audience: 'Finance Operations Director',
          messageTheme: 'Outcome-Driven: Automated Tax Compliance Reconciliation',
          businessValue:
            'Automates tax collection auditing to eliminate manual billing audit queues, saving up to 15 hours of operations work per week.',
          callToAction: 'Can I send you a 2-page brief on how this cuts integration tax audits?',
        },
        {
          audience: 'CFO',
          messageTheme: 'Executive: Optimize Payment Profitability and Net Yield',
          businessValue:
            'Directly impacts net payment volume yield by optimizing localized routing rules in secondary European markets.',
          callToAction:
            'Are you available for a brief discussion on payment route optimization trends?',
        },
        {
          audience: 'Lead Developer / Architect',
          messageTheme: 'Technical: SDK-first Integration Simplification',
          businessValue:
            'Speeds up implementation times by using standardized API connectors, reducing developer integration backlogs.',
          callToAction: 'Would you like to check out our open-source Connect boilerplate SDK?',
        },
      ];
    }

    if (name.includes('hubspot')) {
      return [
        {
          audience: 'VP of Sales Operations',
          messageTheme: 'Pain-Point-Driven: Bypassing Custom Object Constraints',
          businessValue:
            'Synchronizes custom sales pipeline models without hitting HubSpot custom object caps, keeping CRM operations scalable.',
          callToAction: 'Would you be open to a 5-minute showcase of custom database routing?',
        },
        {
          audience: 'Head of Customer Success',
          messageTheme: 'Outcome-Driven: Connected Support and Success Silos',
          businessValue:
            'Increases customer retention rates by synchronizing support activity and success milestones in a unified customer record.',
          callToAction: 'Would you like a walkthrough of our CRM support sync workflow?',
        },
        {
          audience: 'CRO / Founder',
          messageTheme: 'Executive: Accelerating Sales Velocity & Partner Scaling',
          businessValue:
            'Streamlines partner onboarding pipelines to drive higher agency partner channel sales growth.',
          callToAction:
            'Should we schedule a short conversation about partner onboarding efficiency?',
        },
        {
          audience: 'CS Operations Architect',
          messageTheme: 'Technical: Granular CRM Object Data Sync',
          businessValue:
            'Eliminates API sync latency when pushing customer metrics between external apps and core HubSpot contact timelines.',
          callToAction: 'Can I share our CRM sync latency benchmarks?',
        },
      ];
    }

    if (name.includes('salesforce')) {
      return [
        {
          audience: 'Salesforce Admin Lead',
          messageTheme: 'Pain-Point-Driven: Reducing APEX Maintenance & TCO',
          businessValue:
            'Automates manual database configuration tasks and reduces complex Apex code dependencies, lowering system total cost of ownership.',
          callToAction: 'Would you like to see how we automate custom APEX dependency checks?',
        },
        {
          audience: 'CRO / VP Sales',
          messageTheme: 'Outcome-Driven: Accelerate Real-time Pipeline Reporting',
          businessValue:
            'Accelerates dashboard query speed and removes table performance latency, letting sales leaders analyze pipeline metrics instantly.',
          callToAction: 'Is real-time pipeline reporting speed on your radar this quarter?',
        },
        {
          audience: 'C-Suite Executives',
          messageTheme: 'Executive: Modernizing CRM Infrastructure Profitably',
          businessValue:
            'Improves CRM ROI by removing unnecessary administrative overhead while enabling smart AI discovery capabilities.',
          callToAction:
            'Let’s connect to discuss how enterprise firms optimize CRM cost structures.',
        },
        {
          audience: 'Solutions Architect / Developer',
          messageTheme: 'Technical: Real-time Data Cloud Sync Optimization',
          businessValue:
            'Improves query execution speeds on large custom object tables through smart indexing and data consolidation.',
          callToAction: 'Would you like to examine our custom query consolidation patterns?',
        },
      ];
    }

    if (name.includes('notion')) {
      return [
        {
          audience: 'Head of Operations',
          messageTheme: 'Pain-Point-Driven: Combating Workspace Information Decay',
          businessValue:
            'Unifies scattered databases and identifies duplicate documents automatically, keeping company wikis clean and reliable.',
          callToAction: 'Can I share our wiki-structural audit framework with you?',
        },
        {
          audience: 'VP of Product / Design',
          messageTheme: 'Outcome-Driven: Synchronized Product Development Documentation',
          businessValue:
            'Reduces miscommunication cycles between product and engineering by automating link updates and spec-page synchronizations.',
          callToAction: 'Would you like a quick video of our automated product documentation sync?',
        },
        {
          audience: 'CEO',
          messageTheme: 'Executive: Securing Granular Corporate Knowledge Base',
          businessValue:
            'Ensures strict document permission compliance and protects proprietary knowledge assets at scale.',
          callToAction: 'Are you available for a quick chat regarding knowledge-sharing security?',
        },
        {
          audience: 'Workspace Administrator',
          messageTheme: 'Technical:Granular Database Permission Inheritance Rules',
          businessValue:
            'Enables custom workspace security compliance templates, preventing accidental public document exposures.',
          callToAction: 'Would you like to review our database permission inheritance scripts?',
        },
      ];
    }

    if (name.includes('shopify')) {
      return [
        {
          audience: 'VP of E-commerce',
          messageTheme: 'Pain-Point-Driven: Consolidating Compounding App Fees',
          businessValue:
            'Replaces multiple external subscriptions with a unified check-out marketing suite, reducing app transaction delays.',
          callToAction: 'Can I send you our checkout app consolidation checklist?',
        },
        {
          audience: 'Head of B2B Wholesale Commerce',
          messageTheme: 'Outcome-Driven: Automating Net-Payment Term Invoicing',
          businessValue:
            'Allows wholesale buyers to execute transactions with pre-approved credit terms automatically, accelerating wholesale revenue loops.',
          callToAction: 'Would you like a quick demo of wholesale net-payment automation?',
        },
        {
          audience: 'Chief Revenue Officer (CRO)',
          messageTheme: 'Executive: Expanding Wholesale and Headless Profit Margins',
          businessValue:
            'Boosts headless checkout conversion rates and opens up new wholesale channels with lower integration overhead.',
          callToAction: 'Let’s connect to discuss scaling headless B2B ecommerce checkouts.',
        },
        {
          audience: 'Lead Developer / Engineer',
          messageTheme: 'Technical: Headless Cart APIs Optimization',
          businessValue: 'Decreases cart load time and stabilizes API routing during flash sales.',
          callToAction: 'Would you like to examine our headless cart performance metrics?',
        },
      ];
    }

    // Generic fallback
    return [
      {
        audience: 'C-Suite Leadership',
        messageTheme: 'Pain-Point-Driven: Streamlining Operational Scaling Complexity',
        businessValue:
          'Automates manual coordination tasks to boost team productivity and reduce scaling bottlenecks.',
        callToAction: 'Would you be open to a 10-minute briefing on workflow automation metrics?',
      },
      {
        audience: 'Director of Business Development',
        messageTheme: 'Outcome-Driven: Increasing Outbound Quota Attainment',
        businessValue:
          'Improves response rates by helping sales reps craft highly personalized outreach sequences automatically.',
        callToAction: 'Can I share a short video demonstrating personalized campaign scaling?',
      },
      {
        audience: 'CEO / Founder',
        messageTheme: 'Executive: Scaling Market Share and Sales Efficiency',
        businessValue:
          'Accelerates business development growth cycles and reduces customer acquisition cost limits.',
        callToAction: 'Are you available to discuss sales efficiency benchmarks next week?',
      },
      {
        audience: 'Engineering Lead',
        messageTheme: 'Technical: Smart API Integration Pipelines',
        businessValue:
          'Secures and accelerates data transfers between core business applications and external platforms.',
        callToAction: 'Would you like to check out our integration API documentation?',
      },
    ];
  }
}
export default MessagingStrategist;
