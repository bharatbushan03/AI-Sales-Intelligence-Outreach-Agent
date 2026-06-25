/**
 * Protected Route Components
 * Provides route-level protection based on authentication and permissions
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Role, Permission } from '@/types/auth';
import { Loader2, Lock, AlertTriangle, Mail } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requiredPermissions?: Permission[];
  requireEmailVerification?: boolean;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
  emailVerificationComponent?: React.ReactNode;
}

/**
 * Main Protected Route Component
 */
export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermissions = [],
  requireEmailVerification = false,
  fallbackPath = '/auth/login',
  loadingComponent,
  unauthorizedComponent,
  emailVerificationComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, initializing, isEmailVerified } = useAuth();
  const permissions = usePermissions();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  useEffect(() => {
    if (initializing || loading) {
      return;
    }

    // Not authenticated
    if (!user || !profile) {
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`${fallbackPath}?returnUrl=${returnUrl}`);
      return;
    }

    // Email verification required but not verified
    if (requireEmailVerification && !isEmailVerified) {
      setHasCheckedAccess(true);
      return;
    }

    // Check role requirements
    if (requiredRole && !permissions.hasRole(requiredRole)) {
      setHasCheckedAccess(true);
      return;
    }

    // Check permission requirements
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((permission) =>
        permissions.hasPermission(permission),
      );

      if (!hasAllPermissions) {
        setHasCheckedAccess(true);
        return;
      }
    }

    setHasCheckedAccess(true);
  }, [
    user,
    profile,
    loading,
    initializing,
    isEmailVerified,
    requiredRole,
    requiredPermissions,
    requireEmailVerification,
    permissions,
    router,
    pathname,
    fallbackPath,
  ]);

  // Show loading state
  if (initializing || loading || !hasCheckedAccess) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Not authenticated
  if (!user || !profile) {
    return null; // Will redirect
  }

  // Email verification required
  if (requireEmailVerification && !isEmailVerified) {
    return emailVerificationComponent || <EmailVerificationRequired />;
  }

  // Check role access
  if (requiredRole && !permissions.hasRole(requiredRole)) {
    return unauthorizedComponent || <UnauthorizedAccess requiredRole={requiredRole} />;
  }

  // Check permission access
  if (requiredPermissions.length > 0) {
    const missingPermissions = requiredPermissions.filter(
      (permission) => !permissions.hasPermission(permission),
    );

    if (missingPermissions.length > 0) {
      return (
        unauthorizedComponent || <UnauthorizedAccess missingPermissions={missingPermissions} />
      );
    }
  }

  return <>{children}</>;
}

/**
 * Role-specific protected routes
 */
export const OwnerRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <ProtectedRoute
    requiredRole="Owner"
    requireEmailVerification={true}
    unauthorizedComponent={fallback}
  >
    {children}
  </ProtectedRoute>
);

export const AdminRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <ProtectedRoute
    requiredRole="Admin"
    requireEmailVerification={true}
    unauthorizedComponent={fallback}
  >
    {children}
  </ProtectedRoute>
);

export const ManagerRoute: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <ProtectedRoute
    requiredRole="Manager"
    requireEmailVerification={true}
    unauthorizedComponent={fallback}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Permission-based protected routes
 */
export const PermissionRoute: React.FC<{
  children: React.ReactNode;
  permissions: Permission[];
  fallback?: React.ReactNode;
}> = ({ children, permissions, fallback }) => (
  <ProtectedRoute
    requiredPermissions={permissions}
    requireEmailVerification={true}
    unauthorizedComponent={fallback}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Default Loading Component
 */
function DefaultLoadingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Email Verification Required Component
 */
function EmailVerificationRequired() {
  const { resendEmailVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      const result = await resendEmailVerification();
      if (result.success) {
        setSent(true);
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-xl bg-slate-900 p-8 shadow-xl">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-indigo-400" />
          <h1 className="mt-4 text-2xl font-bold text-white">Email Verification Required</h1>
          <p className="mt-2 text-sm text-slate-400">
            Please verify your email address to continue. Check your inbox for a verification link.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleResend}
            disabled={sending || sent}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50"
          >
            {sending ? 'Sending...' : sent ? 'Sent!' : 'Resend Verification Email'}
          </button>
        </div>

        {sent && (
          <p className="mt-4 text-center text-sm text-green-400">
            Verification email sent! Please check your inbox.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Unauthorized Access Component
 */
function UnauthorizedAccess({
  requiredRole,
  missingPermissions,
}: {
  requiredRole?: Role;
  missingPermissions?: Permission[];
}) {
  const router = useRouter();
  const permissions = usePermissions();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-xl bg-slate-900 p-8 shadow-xl">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-2xl font-bold text-white">Access Denied</h1>

          {requiredRole && (
            <p className="mt-2 text-sm text-slate-400">
              This page requires <span className="font-medium text-white">{requiredRole}</span>{' '}
              access or higher.
              <br />
              Your current role:{' '}
              <span className="font-medium text-indigo-400">{permissions.user?.role}</span>
            </p>
          )}

          {missingPermissions && missingPermissions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Missing required permissions:</p>
              <ul className="mt-2 space-y-1">
                {missingPermissions.map((permission) => (
                  <li key={permission} className="text-sm font-medium text-red-400">
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Go Back
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-6 rounded-lg bg-slate-800 p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Need Access?</p>
              <p className="text-xs text-slate-400">
                Contact your organization administrator to request the necessary permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Higher-order component for protecting pages
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  protectionConfig: Omit<ProtectedRouteProps, 'children'>,
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...protectionConfig}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook for imperative access checks
 */
export function useAccessControl() {
  const permissions = usePermissions();
  const router = useRouter();

  const checkAccess = (
    requiredRole?: Role,
    requiredPermissions?: Permission[],
    redirectPath = '/dashboard',
  ): boolean => {
    if (requiredRole && !permissions.hasRole(requiredRole)) {
      router.push(redirectPath);
      return false;
    }

    if (requiredPermissions?.some((permission) => !permissions.hasPermission(permission))) {
      router.push(redirectPath);
      return false;
    }

    return true;
  };

  return { checkAccess, ...permissions };
}
