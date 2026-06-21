import { describe, it, expect, beforeEach } from 'vitest';
import { AgentRegistry } from '../src/agents/registry';
import { ManagerAgent } from '../src/agents/manager-agent';
import { WorkflowEngine } from '../src/agents/engine';
import { createAgentContext } from '../src/agents/context';
import { IAgent, AgentContext, AgentStepResult } from '../src/agents/types';
import { ResearchAgent } from '../src/agents/specialists/research-agent';
import { OpportunityAgent } from '../src/agents/specialists/opportunity-agent';
import { OutreachAgent } from '../src/agents/specialists/outreach-agent';
import { CrmAgent } from '../src/agents/specialists/crm-agent';

// Custom Mock Agent that fails or delays to verify retry and timeout loops
class MockFailingAgent implements IAgent {
  public name: string;
  public description = 'Simulates transient failures and timeout triggers.';
  public capabilities = ['research'] as const;
  public executionCount = 0;

  constructor(
    private failAttempts: number,
    private delayMs = 0,
    name = 'ResearchAgent',
  ) {
    this.name = name;
  }

  public async execute(context: AgentContext): Promise<AgentStepResult> {
    this.executionCount++;
    if (!context.workflowId) {
      throw new Error('Missing workflowId context');
    }

    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    if (this.executionCount <= this.failAttempts) {
      throw new Error(`Transient error attempt ${this.executionCount}`);
    }

    return {
      success: true,
      output: { value: 'recovered' },
    };
  }
}

describe('Autonomous Multi-Agent Orchestration Layer', () => {
  const registry = AgentRegistry.getInstance();
  const engine = new WorkflowEngine();

  beforeEach(() => {
    registry.clear();
    // Re-register defaults
    registry.register(new ResearchAgent());
    registry.register(new OpportunityAgent());
    registry.register(new OutreachAgent());
    registry.register(new CrmAgent());
  });

  describe('Agent Registry & Interfaces', () => {
    it('should register and retrieve specialists successfully', () => {
      const research = registry.getAgent('ResearchAgent');
      expect(research).toBeDefined();
      expect(research?.name).toBe('ResearchAgent');
      expect(research?.capabilities).toContain('research');
    });

    it('should discover specialists by capability', () => {
      const match = registry.findAgentsByCapability('opportunity-analysis');
      expect(match.length).toBe(1);
      expect(match[0].name).toBe('OpportunityAgent');
    });

    it('should throw an error on double-registration', () => {
      expect(() => registry.register(new ResearchAgent())).toThrow();
    });
  });

  describe('Workflow Execution Engine (Topological Scheduling)', () => {
    it('should run a single step successfully', async () => {
      const context = createAgentContext('user_123', 'Research stripe.com');
      const plan = {
        goal: 'Research stripe.com',
        steps: [
          {
            id: 'step_1',
            agentCapability: 'research' as const,
            inputMapping: () => ({ websiteUrl: 'stripe.com' }),
          },
        ],
      };

      const updated = await engine.execute(context, plan);
      expect(updated.status).toBe('completed');
      const research = updated.sharedMemory.research as { company?: { name?: string } };
      expect(research.company?.name).toBe('Stripe');
    });

    it('should run sequential dependent steps in correct order', async () => {
      const context = createAgentContext(
        'user_123',
        'Research stripe.com and analyze opportunities',
      );
      const plan = {
        goal: 'Research stripe.com and analyze opportunities',
        steps: [
          {
            id: 'step_1',
            agentCapability: 'research' as const,
            inputMapping: () => ({ websiteUrl: 'stripe.com' }),
          },
          {
            id: 'step_2',
            agentCapability: 'opportunity-analysis' as const,
            dependsOn: ['step_1'],
            inputMapping: (ctx: AgentContext) => ({ researchData: ctx.sharedMemory.research }),
          },
        ],
      };

      const updated = await engine.execute(context, plan);
      expect(updated.status).toBe('completed');
      expect(updated.sharedMemory.research).toBeDefined();
      expect(updated.sharedMemory.opportunityAnalysis).toBeDefined();
      const opportunityAnalysis = updated.sharedMemory.opportunityAnalysis as {
        opportunityScore?: number;
      };
      expect(opportunityAnalysis.opportunityScore).toBe(88);

      const timelineEvts = updated.timeline.filter((e) => e.type === 'agent_end');
      expect(timelineEvts[0].agentName).toBe('ResearchAgent');
      expect(timelineEvts[1].agentName).toBe('OpportunityAgent');
    });

    it('should retry a transient failure step and succeed upon recovery', async () => {
      registry.clear(); // Clear default ResearchAgent
      const failingAgent = new MockFailingAgent(2); // Fail first 2 attempts, succeed on 3rd
      registry.register(failingAgent);

      const context = createAgentContext('user_123', 'Execute mock run');
      const plan = {
        goal: 'Execute mock run',
        steps: [
          {
            id: 'step_1',
            agentCapability: 'research' as const,
            inputMapping: () => ({}),
            retryLimit: 3,
          },
        ],
      };

      const updated = await engine.execute(context, plan);
      expect(updated.status).toBe('completed');
      expect(failingAgent.executionCount).toBe(3);
      expect(updated.sharedMemory.research).toBeDefined();
      const research = updated.sharedMemory.research as { value?: string };
      expect(research.value).toBe('recovered');
    });

    it('should fail the workflow if step exceeds retry limits', async () => {
      registry.clear();
      const failingAgent = new MockFailingAgent(5); // Fails 5 times (exceeds limit of 3)
      registry.register(failingAgent);

      const context = createAgentContext('user_123', 'Execute mock failing run');
      const plan = {
        goal: 'Execute mock failing run',
        steps: [
          {
            id: 'step_1',
            agentCapability: 'research' as const,
            inputMapping: () => ({}),
            retryLimit: 3,
          },
        ],
      };

      const updated = await engine.execute(context, plan);
      expect(updated.status).toBe('failed');
    });

    it('should timeout a step if it exceeds timeout limits', async () => {
      registry.clear();
      const hangingAgent = new MockFailingAgent(0, 1000); // 1s execution delay
      registry.register(hangingAgent);

      const context = createAgentContext('user_123', 'Execute timeout run');
      const plan = {
        goal: 'Execute timeout run',
        steps: [
          {
            id: 'step_1',
            agentCapability: 'research' as const,
            inputMapping: () => ({}),
            timeoutMs: 100, // timeout at 100ms
          },
        ],
      };

      const updated = await engine.execute(context, plan);
      expect(updated.status).toBe('failed');
      const errEvts = updated.timeline.filter((e) => e.type === 'agent_error');
      expect(errEvts[0].message).toContain('exceeded execution limit of 100ms');
    });
  });

  describe('Manager Agent Orchestrator', () => {
    it('should parse intent, plan, and synthesize final outcome successfully (Mock Mode)', async () => {
      const orchestrator = new ManagerAgent(true); // force mock mode
      const result = await orchestrator.orchestrate(
        'user_123',
        'Research stripe.com and write outreach campaign',
      );

      expect(result.status).toBe('completed');
      expect(result.agentsInvoked).toContain('ResearchAgent');
      expect(result.agentsInvoked).toContain('OpportunityAgent');
      expect(result.agentsInvoked).toContain('OutreachAgent');
      expect(result.results.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});
