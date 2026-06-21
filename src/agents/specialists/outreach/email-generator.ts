import { GoogleGenerativeAI } from '@google/generative-ai';
import { CompanyProfile, ColdEmailVariant, FollowUpStep, MessagingTheme } from './types';
import { EMAIL_GENERATOR_PROMPT } from '../../prompts/outreach-prompts';
import { logger } from '../../../utils/logger';

export class EmailGenerator {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async generate(
    profile: CompanyProfile,
    messagingThemes: MessagingTheme[],
    painPoints?: unknown[],
  ): Promise<{ coldEmails: ColdEmailVariant[]; followUpSequence: FollowUpStep[] }> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Target Company:\n${JSON.stringify(profile)}\nMessaging Themes:\n${JSON.stringify(
          messagingThemes,
        )}\nPain Points:\n${JSON.stringify(painPoints || [])}\n\nGenerate cold emails and follow-up sequence.`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: EMAIL_GENERATOR_PROMPT,
        });

        const json = JSON.parse(result.response.text());
        return {
          coldEmails: json.coldEmails || [],
          followUpSequence: json.followUpSequence || [],
        };
      } catch (error) {
        logger.error(
          `EmailGenerator live generation failed for ${profile.name}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockEmails(profile.name);
  }

  private getMockEmails(companyName: string): {
    coldEmails: ColdEmailVariant[];
    followUpSequence: FollowUpStep[];
  } {
    const name = companyName.toLowerCase();

    // Setup variants
    let coldEmails: ColdEmailVariant[] = [];
    let followUpSequence: FollowUpStep[] = [];

    if (name.includes('stripe')) {
      coldEmails = [
        {
          variantName: 'Executive Version',
          subject: 'Optimizing European payment net-yield at Stripe',
          opening: `Hi there,\n\nI noticed that Stripe has been accelerating engineering hiring in Europe. With local merchant payment drop-offs averaging 3-5% due to routing friction, optimization is top of mind for scaling fintech platforms.`,
          valueProposition: 'We specialize in simplifying localized routing rules and dynamic card compliance checks, directly increasing transaction net-yield without bloating your API dependencies.',
          socialProofPlaceholder: '[Case study: Helped a Tier-1 Connect merchant capture an additional €4.2M in annual cross-border volume by optimizing localized EU routing.]',
          cta: 'Are you open to a brief 10-minute briefing on payment route optimization trends?',
          fullBody: `Hi there,\n\nI noticed that Stripe has been accelerating engineering hiring in Europe. With local merchant payment drop-offs averaging 3-5% due to routing friction, optimization is top of mind for scaling fintech platforms.\n\nWe specialize in simplifying localized routing rules and dynamic card compliance checks, directly increasing transaction net-yield without bloating your API dependencies.\n\n[Case study: Helped a Tier-1 Connect merchant capture an additional €4.2M in annual cross-border volume by optimizing localized EU routing.]\n\nAre you open to a brief 10-minute briefing on payment route optimization trends?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Problem-Solution Version',
          subject: 'Resolving Stripe Connect API integration bottlenecks',
          opening: `Hi there,\n\nI saw that Stripe's developer forums have had an influx of complex subscription tax and Connect API integration queries recently. Custom enterprise client integrations often hit implementation delays.`,
          valueProposition: 'Our integration accelerator framework automates the configuration steps for multi-party Connect flows, reducing developer implementation bottlenecks by up to 40%.',
          socialProofPlaceholder: '[Integration stat: Cut client onboarding cycles from 8 weeks to 18 days for a leading global billing platform.]',
          cta: 'Would you be open to checking out our open-source Connect integration templates?',
          fullBody: `Hi there,\n\nI saw that Stripe's developer forums have had an influx of complex subscription tax and Connect API integration queries recently. Custom enterprise client integrations often hit implementation delays.\n\nOur integration accelerator framework automates the configuration steps for multi-party Connect flows, reducing developer implementation bottlenecks by up to 40%.\n\n[Integration stat: Cut client onboarding cycles from 8 weeks to 18 days for a leading global billing platform.]\n\nWould you be open to checking out our open-source Connect integration templates?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Growth-Oriented Version',
          subject: 'Supporting Stripe’s European payment expansion',
          opening: `Hi there,\n\nCongratulations on Stripe's recent merchant scaling expansions across Europe. As your transaction volume scales, regional compliance and card network optimization become highly critical.`,
          valueProposition: 'We provide real-time transaction decline mapping that hooks directly into Stripe to isolate and resolve localized network decline spikes as they happen.',
          socialProofPlaceholder: '[Customer proof: Reduced cross-border credit card decline rates by 2.1% during rapid transaction scaling.]',
          cta: 'Would next Tuesday work for a quick introduction call to discuss regional routing benchmarks?',
          fullBody: `Hi there,\n\nCongratulations on Stripe's recent merchant scaling expansions across Europe. As your transaction volume scales, regional compliance and card network optimization become highly critical.\n\nWe provide real-time transaction decline mapping that hooks directly into Stripe to isolate and resolve localized network decline spikes as they happen.\n\n[Customer proof: Reduced cross-border credit card decline rates by 2.1% during rapid transaction scaling.]\n\nWould next Tuesday work for a quick introduction call to discuss regional routing benchmarks?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Consultative Version',
          subject: 'Benchmarks: Local payment compliance and conversion in EU',
          opening: `Hi there,\n\nI’ve been analyzing regional payment decline benchmarks in European merchant networks. Many scaling US fintech firms struggle with localized compliance rules and card issuer routing friction.`,
          valueProposition: 'We compiled a comparative benchmark report detailing localized card routing rates and SCA compliance drop-offs across 15 European countries.',
          socialProofPlaceholder: '[Benchmark data: Used by major checkout operations teams to identify payment leakage points.]',
          cta: 'Should I email you a copy of the EU payments benchmark report?',
          fullBody: `Hi there,\n\nI’ve been analyzing regional payment decline benchmarks in European merchant networks. Many scaling US fintech firms struggle with localized compliance rules and card issuer routing friction.\n\nWe compiled a comparative benchmark report detailing localized card routing rates and SCA compliance drop-offs across 15 European countries.\n\n[Benchmark data: Used by major checkout operations teams to identify payment leakage points.]\n\nShould I email you a copy of the EU payments benchmark report?\n\nBest,\n[Your Name]`,
        },
      ];

      followUpSequence = [
        {
          day: 1,
          objective: 'Context hook / follow-up',
          message: 'Hi there, I wanted to quickly follow up on my email regarding localized routing benchmarks. I know you are scaling payment operations in Europe and thought this benchmark brief might be useful.',
          cta: 'Do you have 5 minutes for a quick call this week?',
        },
        {
          day: 3,
          objective: 'Value drop / case study',
          message: 'Hi there, following up on our localized checkout routing discussion. Here is a link to a case study detailing how we helped a Tier-1 billing platform minimize merchant payment leakage by 3.2% in under 3 weeks.',
          cta: 'Would you be open to reviewing the routing flowchart?',
        },
        {
          day: 7,
          objective: 'Objection handling / value prop',
          message: 'Hi, I realize developer resources are likely focused on core product APIs right now. Our integration SDK is pre-configured and connects directly via webhooks, meaning zero disruption to your active code sprint.',
          cta: 'Let me know if you would like to review the API reference guide.',
        },
        {
          day: 14,
          objective: 'Alternative contact query',
          message: 'Hi there, since I haven’t heard back, I wanted to check if there is a more appropriate stakeholder in payment operations or engineering to coordinate with regarding European localized checkout compliance.',
          cta: 'Could you steer me in the right direction?',
        },
        {
          day: 21,
          objective: 'Break-up email',
          message: 'Hi, I assume this isn’t a priority for Stripe payments team right now, so I will stop checking in. If localized payment declines or compliance audits become active issues in the future, feel free to reach back out.',
          cta: 'All the best with the scaling expansion.',
        },
      ];
    } else if (name.includes('hubspot')) {
      coldEmails = [
        {
          variantName: 'Executive Version',
          subject: 'Custom object database scaling for HubSpot Enterprise',
          opening: `Hi there,\n\nI noticed HubSpot is rapidly expanding Sales Hub Enterprise features upmarket. Supporting enterprise accounts with complex relational schemas often strains default custom object limits.`,
          valueProposition: 'We build database optimization connectors that let enterprise users map, query, and synchronize hundreds of relational variables in HubSpot without hitches or database clutter.',
          socialProofPlaceholder: '[Case study: Enabled a top-tier partner agency to sync 250+ custom tables, preventing system limitations.]',
          cta: 'Do you have 10 minutes next Wednesday to discuss custom object scalability?',
          fullBody: `Hi there,\n\nI noticed HubSpot is rapidly expanding Sales Hub Enterprise features upmarket. Supporting enterprise accounts with complex relational schemas often strains default custom object limits.\n\nWe build database optimization connectors that let enterprise users map, query, and synchronize hundreds of relational variables in HubSpot without hitches or database clutter.\n\n[Case study: Enabled a top-tier partner agency to sync 250+ custom tables, preventing system limitations.]\n\nDo you have 10 minutes next Wednesday to discuss custom object scalability?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Problem-Solution Version',
          subject: 'Simplifying partner portal onboarding at HubSpot',
          opening: `Hi there,\n\nI’ve heard from several HubSpot agency partners that complex multi-portal setups often lead to configuration issues and client account friction.`,
          valueProposition: 'Our automated portal sync engine configures and updates user access rules and CRM objects across multiple partner portals simultaneously, removing manual setup tasks.',
          socialProofPlaceholder: '[Onboarding stat: Decreased portal setup time by 75% for enterprise agency networks.]',
          cta: 'Would you be open to a quick video showing automated portal synchronization?',
          fullBody: `Hi there,\n\nI’ve heard from several HubSpot agency partners that complex multi-portal setups often lead to configuration issues and client account friction.\n\nOur automated portal sync engine configures and updates user access rules and CRM objects across multiple partner portals simultaneously, removing manual setup tasks.\n\n[Onboarding stat: Decreased portal setup time by 75% for enterprise agency networks.]\n\nWould you be open to a quick video showing automated portal synchronization?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Growth-Oriented Version',
          subject: 'Supporting HubSpot’s upmarket CRM expansions',
          opening: `Hi there,\n\nCongratulations on Sales Hub’s growth. Scaling CRM platforms upmarket means resolving data latency and granular object limitations for enterprise users.`,
          valueProposition: 'Our middleware handles high-volume custom data tables and syncs them directly with contact records in real time, avoiding native API caps.',
          socialProofPlaceholder: '[Customer proof: Helped an enterprise SaaS user scale CRM data syncing to 10M records daily.]',
          cta: 'Would you be open to a short call to review these performance benchmarks?',
          fullBody: `Hi there,\n\nCongratulations on Sales Hub’s growth. Scaling CRM platforms upmarket means resolving data latency and granular object limitations for enterprise users.\n\nOur middleware handles high-volume custom data tables and syncs them directly with contact records in real time, avoiding native API caps.\n\n[Customer proof: Helped an enterprise SaaS user scale CRM data syncing to 10M records daily.]\n\nWould you be open to a short call to review these performance benchmarks?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Consultative Version',
          subject: 'CRM Scalability: Managing custom relational objects at scale',
          opening: `Hi there,\n\nWe recently analyzed data schema complexity in enterprise CRM implementations. Most scaling sales teams run into custom object limit bottlenecks within the first 12 months.`,
          valueProposition: 'We created an optimization handbook mapping out clean CRM data structures and custom object partitioning strategies.',
          socialProofPlaceholder: '[Guide data: Utilized by leading revenue operations architects to design custom objects.]',
          cta: 'Can I email you a copy of the CRM optimization handbook?',
          fullBody: `Hi there,\n\nWe recently analyzed data schema complexity in enterprise CRM implementations. Most scaling sales teams run into custom object limit bottlenecks within the first 12 months.\n\nWe created an optimization handbook mapping out clean CRM data structures and custom object partitioning strategies.\n\n[Guide data: Utilized by leading revenue operations architects to design custom objects.]\n\nCan I email you a copy of the CRM optimization handbook?\n\nBest,\n[Your Name]`,
        },
      ];

      followUpSequence = [
        {
          day: 1,
          objective: 'Context hook / follow-up',
          message: 'Hi there, I wanted to follow up on my note regarding CRM custom object limits. Since Sales Hub Enterprise is expanding upmarket, optimizing data structures is likely top of mind.',
          cta: 'Do you have a few minutes for a brief call next week?',
        },
        {
          day: 3,
          objective: 'Value drop / case study',
          message: 'Hi there, I wanted to share this case study showing how we helped a HubSpot partner agency automate custom table setups, saving their developers 20+ hours per client migration.',
          cta: 'Is this something your dev ops team would find helpful?',
        },
        {
          day: 7,
          objective: 'Objection handling / value prop',
          message: 'Hi, I know CRM migrations can feel complex. Our integration requires no core system downtime and maps to existing contact timelines through standard webhooks.',
          cta: 'Let me know if you would like a quick API demo.',
        },
        {
          day: 14,
          objective: 'Alternative contact query',
          message: 'Hi there, following up. If custom object constraints or partner portal setups aren’t under your purview, is there another member of the RevOps or CS Ops team I should connect with?',
          cta: 'Let me know who is best to contact.',
        },
        {
          day: 21,
          objective: 'Break-up email',
          message: 'Hi, it looks like CRM custom object scaling isn’t an active priority for you right now, so I’ll step back. If you face portal sync issues or data limitations in the future, feel free to reach out.',
          cta: 'Best of luck with your upmarket initiatives.',
        },
      ];
    } else {
      // Generic / Fallback
      coldEmails = [
        {
          variantName: 'Executive Version',
          subject: 'Improving outbound sales efficiency and conversion',
          opening: `Hi there,\n\nI saw your team is focused on expanding sales operations and driving outbound pipeline growth. Standard outbound methods are facing decreasing response rates across the board.`,
          valueProposition: 'We provide an autonomous intelligence system that researches prospects and generates highly personalized messaging scripts automatically, boosting positive reply rates.',
          socialProofPlaceholder: '[Case study: Helped a leading B2B SaaS platform double their outbound meeting booking rate in 60 days.]',
          cta: 'Do you have 10 minutes next week for a brief overview?',
          fullBody: `Hi there,\n\nI saw your team is focused on expanding sales operations and driving outbound pipeline growth. Standard outbound methods are facing decreasing response rates across the board.\n\nWe provide an autonomous intelligence system that researches prospects and generates highly personalized messaging scripts automatically, boosting positive reply rates.\n\n[Case study: Helped a leading B2B SaaS platform double their outbound meeting booking rate in 60 days.]\n\nDo you have 10 minutes next week for a brief overview?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Problem-Solution Version',
          subject: 'Automating manual prospect research for your sales team',
          opening: `Hi there,\n\nI noticed many SDR teams spend up to 40% of their day manually researching prospect companies, leaving less time for actual discovery conversations.`,
          valueProposition: 'Our sales intelligence agent automates deep account research, extracting pain points, hiring signals, and news events to craft custom hooks in seconds.',
          socialProofPlaceholder: '[Efficiency stat: Saved SDRs an average of 2 hours of admin work per day while increasing outreach volume.]',
          cta: 'Would you be open to a 5-minute video demonstration of our research automation?',
          fullBody: `Hi there,\n\nI noticed many SDR teams spend up to 40% of their day manually researching prospect companies, leaving less time for actual discovery conversations.\n\nOur sales intelligence agent automates deep account research, extracting pain points, hiring signals, and news events to craft custom hooks in seconds.\n\n[Efficiency stat: Saved SDRs an average of 2 hours of admin work per day while increasing outreach volume.]\n\nWould you be open to a 5-minute video demonstration of our research automation?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Growth-Oriented Version',
          subject: 'Scaling your sales pipeline alongside your growth signals',
          opening: `Hi there,\n\nI noticed your organization has been hitting notable growth indicators recently. Scaling sales teams need automated tools to maintain personalization as campaign volume increases.`,
          valueProposition: 'Our system creates dynamic outreach campaigns targeting specific buyer personas based on hiring spikes and active sales triggers.',
          socialProofPlaceholder: '[Customer proof: Maintained a 22% email open rate while scaling outreach campaigns by 300%.]',
          cta: 'Would next Thursday work for a quick introduction call?',
          fullBody: `Hi there,\n\nI noticed your organization has been hitting notable growth indicators recently. Scaling sales teams need automated tools to maintain personalization as campaign volume increases.\n\nOur system creates dynamic outreach campaigns targeting specific buyer personas based on hiring spikes and active sales triggers.\n\n[Customer proof: Maintained a 22% email open rate while scaling outreach campaigns by 300%.]\n\nWould next Thursday work for a quick introduction call?\n\nBest,\n[Your Name]`,
        },
        {
          variantName: 'Consultative Version',
          subject: 'Outbound Benchmarks: Moving past generic AI emails',
          opening: `Hi there,\n\nWe recently analyzed response rates for AI-generated outreach templates. The data shows that default generic emails have drop-offs of over 80% as buyers filter out spam.`,
          valueProposition: 'We compiled a sales outreach guide detailing personalization frameworks that bypass filters and engage decision makers.',
          socialProofPlaceholder: '[Guide data: Used by elite revenue operations teams to structure outbound templates.]',
          cta: 'Should I email you a copy of the sales personalization guide?',
          fullBody: `Hi there,\n\nWe recently analyzed response rates for AI-generated outreach templates. The data shows that default generic emails have drop-offs of over 80% as buyers filter out spam.\n\nWe compiled a sales outreach guide detailing personalization frameworks that bypass filters and engage decision makers.\n\n[Guide data: Used by elite revenue operations teams to structure outbound templates.]\n\nShould I email you a copy of the sales personalization guide?\n\nBest,\n[Your Name]`,
        },
      ];

      followUpSequence = [
        {
          day: 1,
          objective: 'Context hook / follow-up',
          message: 'Hi there, I wanted to follow up on my email regarding sales research automation. If your team is scaling outbound campaigns, this could save your reps significant manual research hours.',
          cta: 'Do you have time for a brief call next week?',
        },
        {
          day: 3,
          objective: 'Value drop / case study',
          message: 'Hi, following up on our outbound discussion. Here is a brief case study showing how we helped a B2B platform automate account research and double their booked meeting rates in 2 months.',
          cta: 'Would you be open to reviewing the case study?',
        },
        {
          day: 7,
          objective: 'Objection handling / value prop',
          message: 'Hi, I understand introducing new tools can feel disruptive. Our platform integrates directly with your existing CRM and requires under 15 minutes to set up.',
          cta: 'Let me know if you would like a quick setup walk-through.',
        },
        {
          day: 14,
          objective: 'Alternative contact query',
          message: 'Hi there, since I haven’t heard back, is there another member of your Sales Operations or Enablement team who oversees sales tools and outreach templates?',
          cta: 'Let me know who is best to contact.',
        },
        {
          day: 21,
          objective: 'Break-up email',
          message: 'Hi, it seems that sales automation isn’t a priority right now, so I will stop checking in. If you face pipeline scaling challenges in the future, feel free to reach back out.',
          cta: 'All the best with your sales goals.',
        },
      ];
    }

    return { coldEmails, followUpSequence };
  }
}
export default EmailGenerator;
