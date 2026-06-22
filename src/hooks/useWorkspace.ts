/**
 * Workspace Management Hook
 * Provides workspace-related state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Workspace, WorkspaceMember } from '../types/auth';
import { logger } from '../utils/logger';

interface WorkspaceWithStats extends Workspace {
  memberCount: number;
  stats?: {
    workflowCount: number;
    recentActivityCount: number;
    lastActivity: string;
  };
  isMember: boolean;
  isDefault: boolean;
}

interface WorkspaceState {
  workspaces: WorkspaceWithStats[];
  activeWorkspace: WorkspaceWithStats | null;
  loading: boolean;
  error: string | null;
}

interface WorkspaceOperations {
  createWorkspace: (data: {
    name: string;
    description?: string;
    type?: string;
    visibility?: string;
    isDefault?: boolean;
  }) => Promise<{ success: boolean; workspace?: any; error?: string }>;
  
  updateWorkspace: (workspaceId: string, updates: {
    name?: string;
    description?: string;
    settings?: any;
  }) => Promise<{ success: boolean; error?: string }>;
  
  deleteWorkspace: (workspaceId: string) => Promise<{ success: boolean; error?: string }>;
  
  switchWorkspace: (workspaceId: string) => Promise<{ success: boolean; error?: string }>;
  
  getWorkspaceMembers: (workspaceId: string) => Promise<{
    success: boolean;
    members?: any[];
    error?: string;
  }>;
  
  addMember: (workspaceId: string, userId: string, role?: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  updateMemberRole: (workspaceId: string, userId: string, role: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  removeMember: (workspaceId: string, userId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  
  refreshWorkspaces: () => Promise<void>;
}

export function useWorkspace(): WorkspaceState & WorkspaceOperations {
  const { user, profile, activeWorkspaceId } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithStats[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceWithStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch workspaces
  const fetchWorkspaces = useCallback(async (includeStats = false) => {
    if (!user || !profile?.organizationId) {
      setWorkspaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(
        `/api/workspaces?organizationId=${profile.organizationId}&includeStats=${includeStats}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to fetch workspaces');
      }

      const data = await response.json();
      if (data.success) {
        setWorkspaces(data.data.workspaces);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch workspaces');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      logger.error('Failed to fetch workspaces', err);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Fetch active workspace details
  const fetchActiveWorkspace = useCallback(async () => {
    if (!user || !activeWorkspaceId) {
      setActiveWorkspace(null);
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/workspaces/switch', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success && data.data.activeWorkspace) {
        // Find the workspace in our list or create a basic one
        const workspace = workspaces.find(ws => ws.id === data.data.activeWorkspace.id) || {
          ...data.data.activeWorkspace,
          members: [],
          settings: {},
          createdAt: '',
          updatedAt: '',
          deleted: false,
          isMember: true,
        };
        setActiveWorkspace(workspace);
      } else {
        setActiveWorkspace(null);
      }
    } catch (err) {
      logger.error('Failed to fetch active workspace', err);
      setActiveWorkspace(null);
    }
  }, [user, activeWorkspaceId, workspaces]);

  // Initial fetch and dependency changes
  useEffect(() => {
    fetchWorkspaces(true);
  }, [fetchWorkspaces]);

  useEffect(() => {
    fetchActiveWorkspace();
  }, [fetchActiveWorkspace]);

  // Create workspace
  const createWorkspace = useCallback(async (data: {
    name: string;
    description?: string;
    type?: string;
    visibility?: string;
    isDefault?: boolean;
  }) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh workspaces list
        await fetchWorkspaces(true);
        return { success: true, workspace: result.data.workspace };
      } else {
        return { success: false, error: result.error?.message || 'Creation failed' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Creation failed';
      logger.error('Failed to create workspace', err);
      return { success: false, error: errorMsg };
    }
  }, [user, fetchWorkspaces]);

  // Update workspace
  const updateWorkspace = useCallback(async (
    workspaceId: string,
    updates: { name?: string; description?: string; settings?: any }
  ) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/workspaces', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspaceId, ...updates }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh workspaces list
        await fetchWorkspaces(true);
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Update failed' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Update failed';
      logger.error('Failed to update workspace', err);
      return { success: false, error: errorMsg };
    }
  }, [user, fetchWorkspaces]);

  // Delete workspace
  const deleteWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
        
        // Clear active workspace if it was deleted
        if (activeWorkspace?.id === workspaceId) {
          setActiveWorkspace(null);
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Deletion failed' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Deletion failed';
      logger.error('Failed to delete workspace', err);
      return { success: false, error: errorMsg };
    }
  }, [user, activeWorkspace]);

  // Switch workspace
  const switchWorkspace = useCallback(async (workspaceId: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workspaceId }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update active workspace locally
        const workspace = workspaces.find(ws => ws.id === workspaceId);
        if (workspace) {
          setActiveWorkspace(workspace);
        }
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Switch failed' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Switch failed';
      logger.error('Failed to switch workspace', err);
      return { success: false, error: errorMsg };
    }
  }, [user, workspaces]);

  // Get workspace members
  const getWorkspaceMembers = useCallback(async (workspaceId: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        return { success: true, members: result.data.members };
      } else {
        return { success: false, error: result.error?.message || 'Failed to get members' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get members';
      logger.error('Failed to get workspace members', err);
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Add member
  const addMember = useCallback(async (workspaceId: string, userId: string, role = 'Member') => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh workspaces to update member counts
        await fetchWorkspaces(true);
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Failed to add member' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add member';
      logger.error('Failed to add workspace member', err);
      return { success: false, error: errorMsg };
    }
  }, [user, fetchWorkspaces]);

  // Update member role
  const updateMemberRole = useCallback(async (workspaceId: string, userId: string, role: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role }),
      });

      const result = await response.json();
      
      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Failed to update member role' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update member role';
      logger.error('Failed to update workspace member role', err);
      return { success: false, error: errorMsg };
    }
  }, [user]);

  // Remove member
  const removeMember = useCallback(async (workspaceId: string, userId: string) => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`/api/workspaces/${workspaceId}/members?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh workspaces to update member counts
        await fetchWorkspaces(true);
        return { success: true };
      } else {
        return { success: false, error: result.error?.message || 'Failed to remove member' };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove member';
      logger.error('Failed to remove workspace member', err);
      return { success: false, error: errorMsg };
    }
  }, [user, fetchWorkspaces]);

  // Refresh workspaces
  const refreshWorkspaces = useCallback(async () => {
    await fetchWorkspaces(true);
  }, [fetchWorkspaces]);

  return {
    workspaces,
    activeWorkspace,
    loading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
    getWorkspaceMembers,
    addMember,
    updateMemberRole,
    removeMember,
    refreshWorkspaces,
  };
}

// Workspace switcher hook for UI components
export function useWorkspaceSwitcher() {
  const { workspaces, activeWorkspace, switchWorkspace, loading } = useWorkspace();
  const [switching, setSwitching] = useState(false);

  const handleSwitch = useCallback(async (workspaceId: string) => {
    setSwitching(true);
    try {
      const result = await switchWorkspace(workspaceId);
      return result;
    } finally {
      setSwitching(false);
    }
  }, [switchWorkspace]);

  const availableWorkspaces = workspaces.filter(ws => 
    ws.isMember && ws.id !== activeWorkspace?.id
  );

  return {
    workspaces,
    availableWorkspaces,
    activeWorkspace,
    handleSwitch,
    switching: switching || loading,
  };
}