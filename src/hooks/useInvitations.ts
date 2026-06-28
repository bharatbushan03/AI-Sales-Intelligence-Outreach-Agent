/**
 * Invitations Management Hooks
 * Provides invitation-related state and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Invitation, Role, WorkspaceRole } from '../types/auth';
import { logger } from '../utils/logger';

interface InvitationsState {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

interface InvitationFilters {
  organizationId?: string;
  workspaceId?: string;
  status?: 'pending' | 'accepted' | 'expired' | 'revoked';
  page?: number;
  pageSize?: number;
}

/**
 * Hook to fetch and manage invitations list
 */
export function useInvitations(
  organizationId?: string,
  workspaceId?: string,
  initialFilters?: InvitationFilters,
) {
  const { user, profile } = useAuth();
  const [state, setState] = useState<InvitationsState>({
    invitations: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 20,
  });

  const fetchInvitations = useCallback(
    async (filters?: InvitationFilters) => {
      if (!user) {
        setState((prev) => ({
          ...prev,
          invitations: [],
          loading: false,
          error: 'User not authenticated',
        }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const idToken = await user.getIdToken();

        const params = new URLSearchParams();
        if (organizationId) params.append('organizationId', organizationId);
        if (workspaceId) params.append('workspaceId', workspaceId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());

        const response = await fetch(`/api/invitations?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || 'Failed to fetch invitations');
        }

        const data = await response.json();
        if (data.success) {
          setState({
            invitations: data.data.items,
            total: data.data.pagination.total,
            page: data.data.pagination.page,
            pageSize: data.data.pagination.pageSize,
            loading: false,
            error: null,
          });
        } else {
          throw new Error(data.error?.message || 'Failed to fetch invitations');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
        logger.error('Failed to fetch invitations', err);
      }
    },
    [user, organizationId, workspaceId],
  );

  // Initial fetch
  useEffect(() => {
    fetchInvitations(initialFilters);
  }, [fetchInvitations, initialFilters]);

  const refresh = useCallback(
    (filters?: InvitationFilters) => {
      return fetchInvitations(filters);
    },
    [fetchInvitations],
  );

  const nextPage = useCallback(() => {
    fetchInvitations({ page: state.page + 1, pageSize: state.pageSize });
  }, [fetchInvitations, state.page, state.pageSize]);

  const previousPage = useCallback(() => {
    if (state.page > 1) {
      fetchInvitations({ page: state.page - 1, pageSize: state.pageSize });
    }
  }, [fetchInvitations, state.page, state.pageSize]);

  const filterByStatus = useCallback(
    (status: 'pending' | 'accepted' | 'expired' | 'revoked' | undefined) => {
      fetchInvitations({ status, page: 1 });
    },
    [fetchInvitations],
  );

  return {
    ...state,
    refresh,
    nextPage,
    previousPage,
    filterByStatus,
  };
}

/**
 * Hook for sending new invitations
 */
export function useSendInvitation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvitation = useCallback(
    async (params: {
      email: string;
      organizationId?: string;
      workspaceIds?: string[];
      role: Role;
      workspaceRole?: WorkspaceRole;
      message?: string;
    }) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken();

        const response = await fetch('/api/invitations', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (data.success) {
          setLoading(false);
          return { success: true, invitation: data.data };
        } else {
          const errorMsg = data.error?.message || 'Failed to send invitation';
          setError(errorMsg);
          setLoading(false);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send invitation';
        setError(errorMsg);
        setLoading(false);
        logger.error('Failed to send invitation', err);
        return { success: false, error: errorMsg };
      }
    },
    [user],
  );

  return { sendInvitation, loading, error };
}

/**
 * Hook for resending invitations
 */
export function useResendInvitation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendInvitation = useCallback(
    async (invitationId: string) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken();

        const response = await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'resend' }),
        });

        const data = await response.json();

        if (data.success) {
          setLoading(false);
          return { success: true };
        } else {
          const errorMsg = data.error?.message || 'Failed to resend invitation';
          setError(errorMsg);
          setLoading(false);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to resend invitation';
        setError(errorMsg);
        setLoading(false);
        logger.error('Failed to resend invitation', err);
        return { success: false, error: errorMsg };
      }
    },
    [user],
  );

  return { resendInvitation, loading, error };
}

/**
 * Hook for revoking invitations
 */
export function useRevokeInvitation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revokeInvitation = useCallback(
    async (invitationId: string) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken();

        const response = await fetch(`/api/invitations/${invitationId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'revoke' }),
        });

        const data = await response.json();

        if (data.success) {
          setLoading(false);
          return { success: true };
        } else {
          const errorMsg = data.error?.message || 'Failed to revoke invitation';
          setError(errorMsg);
          setLoading(false);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to revoke invitation';
        setError(errorMsg);
        setLoading(false);
        logger.error('Failed to revoke invitation', err);
        return { success: false, error: errorMsg };
      }
    },
    [user],
  );

  return { revokeInvitation, loading, error };
}

/**
 * Hook for deleting invitations
 */
export function useDeleteInvitation() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteInvitation = useCallback(
    async (invitationId: string) => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken();

        const response = await fetch(`/api/invitations/${invitationId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setLoading(false);
          return { success: true };
        } else {
          const errorMsg = data.error?.message || 'Failed to delete invitation';
          setError(errorMsg);
          setLoading(false);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete invitation';
        setError(errorMsg);
        setLoading(false);
        logger.error('Failed to delete invitation', err);
        return { success: false, error: errorMsg };
      }
    },
    [user],
  );

  return { deleteInvitation, loading, error };
}
