/**
 * Organization Management Hook
 * Provides organization-related state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Organization, User, Plan } from '../types/auth';
import { logger } from '../utils/logger';

interface OrganizationStats {
  memberCount: number;
  workspaceCount: number;
}

interface OrganizationState {
  organization: Organization | null;
  stats: OrganizationStats | null;
  loading: boolean;
  error: string | null;
}

interface OrganizationOperations {
  updateOrganization: (
    updates: Partial<Organization>,
  ) => Promise<{ success: boolean; error?: string }>;
  refreshOrganization: () => Promise<void>;
  getMembers: (
    page?: number,
    pageSize?: number,
  ) => Promise<{
    success: boolean;
    members?: any[];
    total?: number;
    error?: string;
  }>;
  updateMember: (
    userId: string,
    updates: { role?: string; status?: string },
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  removeMember: (userId: string) => Promise<{ success: boolean; error?: string }>;
  deleteOrganization: () => Promise<{ success: boolean; error?: string }>;
}

export function useOrganization(): OrganizationState & OrganizationOperations {
  const { user, profile } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [stats, setStats] = useState<OrganizationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch organization data
  const fetchOrganization = useCallback(async () => {
    if (!user || !profile?.organizationId) {
      setOrganization(null);
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/organizations?id=${profile.organizationId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch organization');
      }

      const data = await response.json();
      if (data.success) {
        setOrganization(data.data);
        setStats(data.data.stats);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch organization');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      logger.error('Failed to fetch organization', err);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Initial fetch and profile changes
  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  // Update organization
  const updateOrganization = useCallback(
    async (updates: Partial<Organization>) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/organizations', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (data.success) {
          // Refresh organization data
          await fetchOrganization();
          return { success: true };
        } else {
          return { success: false, error: data.error?.message || 'Update failed' };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Update failed';
        logger.error('Failed to update organization', err);
        return { success: false, error: errorMsg };
      }
    },
    [user, fetchOrganization],
  );

  // Refresh organization data
  const refreshOrganization = useCallback(async () => {
    await fetchOrganization();
  }, [fetchOrganization]);

  // Get organization members
  const getMembers = useCallback(
    async (page = 1, pageSize = 20) => {
      if (!user || !profile?.organizationId) {
        return { success: false, error: 'User not authenticated' };
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch(
          `/api/organizations/${profile.organizationId}/members?page=${page}&pageSize=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            members: data.data.items,
            total: data.data.pagination.total,
          };
        } else {
          return { success: false, error: data.error?.message || 'Failed to get members' };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get members';
        logger.error('Failed to get organization members', err);
        return { success: false, error: errorMsg };
      }
    },
    [user, profile],
  );

  // Update member
  const updateMember = useCallback(
    async (userId: string, updates: { role?: string; status?: string }) => {
      if (!user || !profile?.organizationId) {
        return { success: false, error: 'User not authenticated' };
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`/api/organizations/${profile.organizationId}/members`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, ...updates }),
        });

        const data = await response.json();

        if (data.success) {
          return { success: true };
        } else {
          return { success: false, error: data.error?.message || 'Update failed' };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Update failed';
        logger.error('Failed to update member', err);
        return { success: false, error: errorMsg };
      }
    },
    [user, profile],
  );

  // Remove member
  const removeMember = useCallback(
    async (userId: string) => {
      if (!user || !profile?.organizationId) {
        return { success: false, error: 'User not authenticated' };
      }

      try {
        const idToken = await user.getIdToken();
        const response = await fetch(
          `/api/organizations/${profile.organizationId}/members?userId=${userId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (data.success) {
          // Refresh stats
          await fetchOrganization();
          return { success: true };
        } else {
          return { success: false, error: data.error?.message || 'Removal failed' };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Removal failed';
        logger.error('Failed to remove member', err);
        return { success: false, error: errorMsg };
      }
    },
    [user, profile, fetchOrganization],
  );

  // Delete organization
  const deleteOrganization = useCallback(async () => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/organizations?confirm=true', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setOrganization(null);
        setStats(null);
        return { success: true };
      } else {
        return { success: false, error: data.error?.message || 'Deletion failed' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Deletion failed';
      logger.error('Failed to delete organization', err);
      return { success: false, error: errorMsg };
    }
  }, [user]);

  return {
    organization,
    stats,
    loading,
    error,
    updateOrganization,
    refreshOrganization,
    getMembers,
    updateMember,
    removeMember,
    deleteOrganization,
  };
}

// Plan management hook
export function usePlanManagement() {
  const { organization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const currentPlan = organization?.plan || 'Free';
  const planFeatures = organization?.planFeatures;
  const limits = organization?.limits;

  const canUpgrade = useCallback(
    (targetPlan: Plan) => {
      const planHierarchy: Record<Plan, number> = {
        Free: 1,
        Pro: 2,
        Business: 3,
        Enterprise: 4,
      };

      return planHierarchy[targetPlan] > planHierarchy[currentPlan];
    },
    [currentPlan],
  );

  const isAtLimit = useCallback(
    (limitType: 'users' | 'workspaces' | 'workflowRuns' | 'storage') => {
      if (!limits) return false;

      const limitMapping = {
        users: { current: limits.currentUsers, max: limits.maxUsers },
        workspaces: { current: limits.currentWorkspaces, max: limits.maxWorkspaces },
        workflowRuns: { current: limits.currentWorkflowRuns, max: limits.maxWorkflowRuns },
        storage: { current: limits.currentStorageGB, max: limits.maxStorageGB },
      };

      const limit = limitMapping[limitType];
      return limit.max !== -1 && limit.current >= limit.max;
    },
    [limits],
  );

  const getUsagePercentage = useCallback(
    (limitType: 'users' | 'workspaces' | 'workflowRuns' | 'storage') => {
      if (!limits) return 0;

      const limitMapping = {
        users: { current: limits.currentUsers, max: limits.maxUsers },
        workspaces: { current: limits.currentWorkspaces, max: limits.maxWorkspaces },
        workflowRuns: { current: limits.currentWorkflowRuns, max: limits.maxWorkflowRuns },
        storage: { current: limits.currentStorageGB, max: limits.maxStorageGB },
      };

      const limit = limitMapping[limitType];
      if (limit.max === -1) return 0; // Unlimited

      return Math.min((limit.current / limit.max) * 100, 100);
    },
    [limits],
  );

  return {
    currentPlan,
    planFeatures,
    limits,
    loading,
    canUpgrade,
    isAtLimit,
    getUsagePercentage,
  };
}
