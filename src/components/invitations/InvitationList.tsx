/**
 * Invitation List Component
 * Displays and manages team invitations
 */

'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  Ban,
  Trash2,
  Calendar,
  User,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import {
  useInvitations,
  useResendInvitation,
  useRevokeInvitation,
  useDeleteInvitation,
} from '@/hooks/useInvitations';
import { InvitationBadge } from './InvitationBadge';
import { Invitation } from '@/types/auth';
import { clsx } from 'clsx';

interface InvitationListProps {
  organizationId?: string;
  workspaceId?: string;
  onInvite?: () => void;
}

type StatusFilter = 'all' | 'pending' | 'accepted' | 'expired' | 'revoked';

export function InvitationList({ organizationId, workspaceId, onInvite }: InvitationListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const {
    invitations,
    loading,
    error,
    total,
    page,
    pageSize,
    refresh,
    nextPage,
    previousPage,
    filterByStatus,
  } = useInvitations(organizationId, workspaceId);

  const { resendInvitation, loading: resending } = useResendInvitation();
  const { revokeInvitation, loading: revoking } = useRevokeInvitation();
  const { deleteInvitation, loading: deleting } = useDeleteInvitation();

  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    if (status === 'all') {
      filterByStatus(undefined);
    } else {
      filterByStatus(status);
    }
  };

  const handleResend = async (invitation: Invitation) => {
    setActionLoading({ [invitation.id]: true });
    const result = await resendInvitation(invitation.id);
    setActionLoading({ [invitation.id]: false });

    if (result.success) {
      refresh();
    }
  };

  const handleRevoke = async (invitation: Invitation) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${invitation.email}?`)) {
      return;
    }

    setActionLoading({ [invitation.id]: true });
    const result = await revokeInvitation(invitation.id);
    setActionLoading({ [invitation.id]: false });

    if (result.success) {
      refresh();
    }
  };

  const handleDelete = async (invitation: Invitation) => {
    if (!confirm(`Are you sure you want to delete the invitation for ${invitation.email}?`)) {
      return;
    }

    setActionLoading({ [invitation.id]: true });
    const result = await deleteInvitation(invitation.id);
    setActionLoading({ [invitation.id]: false });

    if (result.success) {
      refresh();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalPages = Math.ceil(total / pageSize);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Team Invitations</h2>
            <p className="mt-1 text-sm text-gray-500">Manage pending and past invitations</p>
          </div>
          {onInvite && (
            <button
              onClick={onInvite}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex gap-2">
          {(['all', 'pending', 'accepted', 'expired', 'revoked'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={clsx(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-1 text-sm font-medium text-gray-900">No invitations found</h3>
            <p className="text-sm text-gray-500">
              {statusFilter === 'all'
                ? 'Start inviting team members to collaborate'
                : `No ${statusFilter} invitations`}
            </p>
          </div>
        )}

        {!loading && !error && invitations.length > 0 && (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Sent Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {invitation.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{invitation.role}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <InvitationBadge status={invitation.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(invitation.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {invitation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleResend(invitation)}
                                disabled={actionLoading[invitation.id]}
                                className="rounded p-1.5 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                                title="Resend invitation"
                              >
                                {actionLoading[invitation.id] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleRevoke(invitation)}
                                disabled={actionLoading[invitation.id]}
                                className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                title="Revoke invitation"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(invitation)}
                            disabled={actionLoading[invitation.id]}
                            className="rounded p-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            title="Delete invitation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * pageSize, total)}</span> of{' '}
                  <span className="font-medium">{total}</span> invitations
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={previousPage}
                    disabled={!hasPrevious}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={!hasNext}
                    className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
