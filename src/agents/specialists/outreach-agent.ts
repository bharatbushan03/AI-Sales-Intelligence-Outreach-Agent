import { IAgent, AgentContext, AgentStepResult } from '../types';

export class OutreachAgent implements IAgent {
  public name = 'OutreachAgent';
  public description =
    'Generates personalized multi-channel outreach campaigns including email and LinkedIn messages.';
  public capabilities = ['outreach'] as const;

  public async execute(context: AgentContext): Promise<AgentStepResult> {
    const research = context.sharedMemory.research as Record<string, unknown> | undefined;
    const companyName = (research?.companyName as string) || 'Valued Prospect';
    const opportunity = context.sharedMemory.opportunityAnalysis as
      | Record<string, unknown>
      | undefined;
    const valueProps = opportunity?.valuePropositionsMatched as string[] | undefined;
    const match = valueProps?.[0] || 'our custom B2B solutions';

    // Simulate outreach generation delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const output = {
      campaign: [
        {
          step: 1,
          channel: 'EMAIL',
          subject: `Solving transaction bottlenecks at ${companyName}`,
          body: `Hi there,\n\nI noticed that ${companyName} is expanding globally following your series B announcement. We specialize in helping companies implement ${match} to streamline cross-border conversions.\n\nWould you be open to a 10-minute introduction call next Tuesday?\n\nBest,\nSales Team`,
        },
        {
          step: 2,
          channel: 'LINKEDIN',
          body: `Hi! Congrats on theSeries B round at ${companyName}. I saw you're expanding the team. Let's connect if you're exploring transaction flow optimization!`,
        },
      ],
    };

    return {
      success: true,
      output,
    };
  }
}
