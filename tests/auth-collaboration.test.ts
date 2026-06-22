import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ManagerAgent } from '../src/agents/manager-agent';
import { usersRepository, workspacesRepository } from '../src/lib/repositories';
import * as rbac from '../src/lib/rbac';
import { WorkflowEngine } from '../src/agents/engine';

// Mock repositories and RBAC
vi.mock('../src/lib/repositories', () => ({
  usersRepository: {
    get: vi.fn(),
  },
  workspacesRepository: {
    get: vi.fn(),
  },
  agentMemoryRepository: { list: vi.fn().mockResolvedValue([]), add: vi.fn(), update: vi.fn() },
  workflowsRepository: { create: vi.fn() },
  workflowStepsRepository: { create: vi.fn() }
}));

vi.mock('../src/lib/rbac', () => ({
  hasPermission: vi.fn(),
}));

describe('Auth & Collaboration (SaaS Isolation)', () => {
  let manager: ManagerAgent;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new ManagerAgent(true); // force mock mode for Gemini
    vi.spyOn(WorkflowEngine.prototype, 'execute').mockResolvedValue({
      status: 'completed',
      sharedMemory: {
        research: {},
        opportunityAnalysis: {},
        outreach: {},
        crm: {},
        proposal: {}
      },
      timeline: [],
      executionHistory: []
    } as any);
  });

  describe('ManagerAgent RBAC and Tenant Boundaries', () => {
    it('should reject execution if user lacks workflows.execute permission', async () => {
      vi.mocked(usersRepository.get).mockResolvedValue({
        id: 'user_1',
        organizationId: 'org_1',
        role: 'Viewer',
      } as any);

      vi.mocked(rbac.hasPermission).mockReturnValue(false);

      await expect(manager.orchestrate('user_1', 'Research stripe.com', 'workspace_1'))
        .rejects.toThrow(/Unauthorized\. User role Viewer does not possess workflows.execute permissions\./);
      expect(rbac.hasPermission).toHaveBeenCalledWith('Viewer', 'workflows.execute');
    });

    it('should reject execution if workspace belongs to a different organization', async () => {
      vi.mocked(usersRepository.get).mockResolvedValue({
        id: 'user_1',
        organizationId: 'org_1',
        role: 'Manager',
      } as any);

      vi.mocked(rbac.hasPermission).mockReturnValue(true);

      vi.mocked(workspacesRepository.get).mockResolvedValue({
        id: 'workspace_1',
        organizationId: 'org_2', // Cross-tenant violation
      } as any);

      await expect(manager.orchestrate('user_1', 'Research stripe.com', 'workspace_1'))
        .rejects.toThrow(/does not belong to your organization/);
      expect(workspacesRepository.get).toHaveBeenCalledWith('workspace_1');
    });

    it('should allow execution if permissions and tenant match', async () => {
      vi.mocked(usersRepository.get).mockResolvedValue({
        id: 'user_1',
        organizationId: 'org_1',
        role: 'Manager',
      } as any);

      vi.mocked(rbac.hasPermission).mockReturnValue(true);

      vi.mocked(workspacesRepository.get).mockResolvedValue({
        id: 'workspace_1',
        organizationId: 'org_1',
      } as any);

      const result = await manager.orchestrate('user_1', 'Research stripe.com', 'workspace_1');

      expect(result.status).toBe('completed');
    });
  });
});
