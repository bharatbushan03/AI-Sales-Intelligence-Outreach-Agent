import { IAgent, AgentContext, AgentStepResult } from '../types';

export class ProposalAgent implements IAgent {
  public name = 'ProposalAgent';
  public description = 'Drafts structural B2B proposals, outlines recommended solutions, and generates pricing frames.';
  public capabilities = ['proposal'] as const;

  public async execute(context: AgentContext): Promise<AgentStepResult> {
    const research = context.sharedMemory.research as Record<string, unknown> | undefined;
    const companyName = (research?.companyName as string) || 'Valued Prospect';
    const opportunity = context.sharedMemory.opportunityAnalysis as Record<string, unknown> | undefined;
    const valueProps = (opportunity?.valuePropositionsMatched as string[]) || [];

    // Simulate proposal rendering latency
    await new Promise((resolve) => setTimeout(resolve, 300));

    const output = {
      proposalUrl: 'https://docs.google.com/document/d/1mock_proposal_document_xyz/edit',
      proposalData: {
        title: `Enterprise Agreement Proposal for ${companyName}`,
        solutionsProposed: valueProps.map((prop: string, idx: number) => ({
          solutionId: `SOL-00${idx + 1}`,
          title: prop,
          description: `Custom implementation of ${prop} integrated directly inside your systems.`,
        })),
        pricingModel: {
          setupFee: '$5,000',
          monthlySubscription: '$1,200',
          tier: 'Growth Standard',
        },
      },
    };

    return {
      success: true,
      output,
    };
  }
}
