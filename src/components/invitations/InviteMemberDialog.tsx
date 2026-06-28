/**
 * Invite Member Dialog Component
 * Modal for inviting new team members
 */

'use client';

import React, { useState } from 'react';
import { X, Mail, Send, Loader2 } from 'lucide-react';
import { useSendInvitation } from '@/hooks/useInvitations';
import { Role, WorkspaceRole } from '@/types/auth';
import { clsx } from 'clsx';

interface InviteMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  organizationId?: string;
  workspaceIds?: string[];
  defaultRole?: Role;
}

const roleOptions: { value: Role; label: string; description: string }[] = [
  {
    value: 'Owner',
    label: 'Owner',
    description: 'Full access to organization, billing, and all resources',
  },
  {
    value: 'Admin',
    label: 'Administrator',
    description: 'Manage users, workspaces, and organization settings',
  },
  {
    value: 'Manager',
    label: 'Manager',
    description: 'Manage team members and content within workspaces',
  },
  {
    value: 'Sales Rep',
    label: 'Sales Representative',
    description: 'Create and manage sales content, execute workflows',
  },
  {
    value: 'Viewer',
    label: 'Viewer',
    description: 'Read-only access to shared content and reports',
  },
];

const workspaceRoleOptions: { value: WorkspaceRole; label: string }[] = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
];

export function InviteMemberDialog({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
  workspaceIds,
  defaultRole = 'Sales Rep',
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>(defaultRole);
  const [workspaceRole, setWorkspaceRole] = useState<WorkspaceRole>('Member');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const { sendInvitation, loading, error } = useSendInvitation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError && validateEmail(value)) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Send invitation
    const result = await sendInvitation({
      email,
      organizationId,
      workspaceIds,
      role,
      workspaceRole: workspaceIds && workspaceIds.length > 0 ? workspaceRole : undefined,
      message: message.trim() || undefined,
    });

    if (result.success) {
      // Reset form
      setEmail('');
      setRole(defaultRole);
      setWorkspaceRole('Member');
      setMessage('');
      setEmailError('');

      // Call success callback
      onSuccess?.();

      // Close dialog
      onClose();
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole(defaultRole);
    setWorkspaceRole('Member');
    setMessage('');
    setEmailError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={clsx(
                  'block w-full rounded-lg border py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:outline-none',
                  emailError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                )}
                placeholder="colleague@company.com"
                required
              />
            </div>
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
              Organization Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {roleOptions.find((r) => r.value === role)?.description}
            </p>
          </div>

          {/* Workspace Role (if workspace specified) */}
          {workspaceIds && workspaceIds.length > 0 && (
            <div className="mb-5">
              <label
                htmlFor="workspaceRole"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Workspace Role
              </label>
              <select
                id="workspaceRole"
                value={workspaceRole}
                onChange={(e) => setWorkspaceRole(e.target.value as WorkspaceRole)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {workspaceRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Message Textarea */}
          <div className="mb-6">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Add a personal note to your invitation..."
            />
            <p className="mt-1 text-xs text-gray-500">{message.length}/500 characters</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <p>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
