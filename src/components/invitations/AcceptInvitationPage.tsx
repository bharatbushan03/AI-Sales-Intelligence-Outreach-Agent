/**
 * Accept Invitation Page Component
 * Public page for accepting team invitations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, Mail, Building, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface InvitationDetails {
  email: string;
  organizationName: string;
  workspaceNames?: string[];
  role: string;
  inviterName: string;
  message?: string;
  expiresAt: string;
}

export function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);

  // Form fields for new users
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const isNewUser = !user;

  // Validate invitation token on mount
  useEffect(() => {
    const validateInvitation = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch invitation details (you'll need to create a public endpoint for this)
        const response = await fetch(`/api/invitations/validate?token=${token}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error?.message || 'Failed to validate invitation');
        }

        const data = await response.json();
        if (data.success) {
          setInvitation(data.data);
        } else {
          throw new Error(data.error?.message || 'Invalid invitation');
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to validate invitation';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (isNewUser) {
      // Validate form for new users
      if (!name.trim()) {
        setFormError('Name is required');
        return;
      }

      if (password.length < 8) {
        setFormError('Password must be at least 8 characters');
        return;
      }

      if (password !== confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }
    }

    setAccepting(true);

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...(isNewUser && { name, password }),
          ...(user && { userId: user.uid }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.error?.message || 'Failed to accept invitation');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to accept invitation';
      setFormError(errorMsg);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }

    try {
      const response = await fetch('/api/invitations/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/');
      } else {
        throw new Error(data.error?.message || 'Failed to decline invitation');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to decline invitation';
      setError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Invalid Invitation</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Welcome Aboard!</h2>
            <p className="mb-6 text-gray-600">
              You've successfully joined {invitation?.organizationName}
            </p>
            <div className="animate-pulse text-sm text-gray-500">Redirecting to dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h1 className="mb-2 text-2xl font-bold">You're Invited!</h1>
          <p className="text-indigo-100">Join your team and start collaborating</p>
        </div>

        {/* Invitation Details */}
        <div className="border-b border-gray-200 p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="font-medium text-gray-900">{invitation?.organizationName}</p>
              </div>
            </div>

            {invitation?.workspaceNames && invitation.workspaceNames.length > 0 && (
              <div className="flex items-start gap-3">
                <UserCheck className="mt-0.5 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Workspaces</p>
                  <p className="font-medium text-gray-900">
                    {invitation.workspaceNames.join(', ')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Your Role</p>
                <p className="font-medium text-gray-900">{invitation?.role}</p>
              </div>
            </div>

            {invitation?.message && (
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{invitation.inviterName}:</span> "
                  {invitation.message}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAccept} className="p-6">
          {isNewUser ? (
            <>
              <p className="mb-6 text-sm text-gray-600">
                Create your account to accept the invitation
              </p>

              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Re-enter password"
                  minLength={8}
                  required
                />
              </div>
            </>
          ) : (
            <p className="mb-6 text-sm text-gray-600">
              You're logged in as <span className="font-medium">{user?.email}</span>. Click below to
              accept the invitation.
            </p>
          )}

          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{formError}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              type="submit"
              disabled={accepting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {accepting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
