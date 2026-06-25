/**
 * Permission Gate Components
 * Conditional rendering based on user permissions and roles
 */

'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Role, Permission } from '@/types/auth';

interface PermissionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRole?: Role;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  organizationId?: string;
  workspaceId?: string;
}

/**
 * Main Permission Gate Component
 */
export function PermissionGate({
  children,
  fallback = null,
  requiredRole,
  requiredPermissions = [],
  requireAll = true,
  organizationId,
  workspaceId,
}: PermissionGateProps) {
  const permissions = usePermissions();

  // Check authentication
  if (!permissions.isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check organization access
  if (organizationId && !permissions.canAccessOrganization(organizationId)) {
    return <>{fallback}</>;
  }

  // Check workspace access
  if (
    workspaceId &&
    organizationId &&
    !permissions.canAccessWorkspace(workspaceId, organizationId)
  ) {
    return <>{fallback}</>;
  }

  // Check role requirements
  if (requiredRole && !permissions.hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every((permission) => permissions.hasPermission(permission))
      : requiredPermissions.some((permission) => permissions.hasPermission(permission));

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Role-specific gates
 */
export const OwnerGate: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <PermissionGate requiredRole="Owner" fallback={fallback}>
    {children}
  </PermissionGate>
);

export const AdminGate: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <PermissionGate requiredRole="Admin" fallback={fallback}>
    {children}
  </PermissionGate>
);

export const ManagerGate: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <PermissionGate requiredRole="Manager" fallback={fallback}>
    {children}
  </PermissionGate>
);

export const SalesRepGate: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <PermissionGate requiredRole="Sales Rep" fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * Permission-specific gates
 */
export const CanCreateUsers: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['users.create']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageUsers: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['users.manage_roles']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanInviteUsers: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['users.invite']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageOrganization: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['organization.update']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageBilling: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['organization.billing']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanCreateWorkspaces: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['workspaces.create']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanManageWorkspaces: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['workspaces.manage_members']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanExecuteWorkflows: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['workflows.execute']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanExportReports: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['reports.export']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanShareProposals: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['proposals.share']} fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanAccessAdmin: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate requiredPermissions={['system.admin']} fallback={fallback}>
    {children}
  </PermissionGate>
);

/**
 * Compound gates for complex permission checks
 */
export const CanManageTeam: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback,
}) => (
  <PermissionGate
    requiredPermissions={['users.invite', 'users.manage_roles']}
    requireAll={false}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const CanManageContent: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate
    requiredPermissions={['workflows.create', 'reports.create', 'proposals.create']}
    requireAll={false}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const CanViewAnalytics: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => (
  <PermissionGate
    requiredPermissions={['reports.read', 'system.audit']}
    requireAll={false}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

/**
 * Conditional render hook
 */
export function useConditionalRender() {
  const permissions = usePermissions();

  const renderForRole = (
    role: Role | Role[],
    component: React.ReactNode,
    fallback: React.ReactNode = null,
  ) => {
    const roles = Array.isArray(role) ? role : [role];
    const hasRole = roles.some((r) => permissions.hasRole(r));
    return hasRole ? component : fallback;
  };

  const renderForPermission = (
    permission: Permission | Permission[],
    component: React.ReactNode,
    fallback: React.ReactNode = null,
    requireAll = true,
  ) => {
    const perms = Array.isArray(permission) ? permission : [permission];
    const hasPermission = requireAll
      ? perms.every((p) => permissions.hasPermission(p))
      : perms.some((p) => permissions.hasPermission(p));
    return hasPermission ? component : fallback;
  };

  const renderForCapability = (
    capability: keyof ReturnType<typeof usePermissions>,
    component: React.ReactNode,
    fallback: React.ReactNode = null,
  ) => {
    const hasCapability = permissions[capability];
    return hasCapability ? component : fallback;
  };

  return {
    renderForRole,
    renderForPermission,
    renderForCapability,
    ...permissions,
  };
}

/**
 * Permission indicator components
 */
export function RoleBadge({ role }: { role?: Role }) {
  if (!role) return null;

  const colors = {
    Owner: 'bg-purple-100 text-purple-800 border-purple-200',
    Admin: 'bg-red-100 text-red-800 border-red-200',
    Manager: 'bg-blue-100 text-blue-800 border-blue-200',
    'Sales Rep': 'bg-green-100 text-green-800 border-green-200',
    Viewer: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[role]}`}
    >
      {role}
    </span>
  );
}

export function PermissionStatus({ permission }: { permission: Permission }) {
  const permissions = usePermissions();
  const hasPermission = permissions.hasPermission(permission);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        hasPermission ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
    >
      {hasPermission ? '✓' : '✗'} {permission}
    </span>
  );
}

/**
 * Debug component for development
 */
export function PermissionDebugger() {
  const permissions = usePermissions();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-lg bg-slate-800 p-4 text-xs text-white shadow-lg">
      <div className="font-semibold">Current User Permissions</div>
      <div className="mt-2">
        <div>
          Role: <RoleBadge role={permissions.user?.role} />
        </div>
        <div className="mt-2">
          <div className="font-medium">Capabilities:</div>
          <div className="mt-1 space-y-1">
            {Object.entries(permissions)
              .filter(([key, value]) => key.startsWith('can') && typeof value === 'boolean')
              .slice(0, 10) // Show first 10 capabilities
              .map(([key, value]) => (
                <div key={key} className={`text-xs ${value ? 'text-green-400' : 'text-red-400'}`}>
                  {value ? '✓' : '✗'}{' '}
                  {key
                    .replace('can', '')
                    .replace(/([A-Z])/g, ' $1')
                    .toLowerCase()}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
