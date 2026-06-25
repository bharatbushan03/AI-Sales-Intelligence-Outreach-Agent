/**
 * Permission and Role-Based Access Control Hooks
 * Provides React hooks for checking permissions and roles in components
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role, WorkspaceRole, Permission, Plan } from '../types/auth';
import {
  hasPermission,
  hasWorkspacePermission,
  canManageRole,
  getUserPermissions,
  canAccessOrganization,
  canAccessWorkspace,
  checkPlanLimits,
  PLAN_FEATURES,
} from '../lib/rbac';

/**
 * Main permissions hook
 */
export function usePermissions() {
  const { profile, user } = useAuth();

  // Get all user permissions (org + workspace combined)
  const permissions = useMemo(() => {
    if (!profile) return [];

    const workspaceRoles =
      profile.workspaceIds?.map((wsId) => ({
        workspaceId: wsId,
        role: 'Member' as WorkspaceRole, // Default, should come from workspace membership
      })) || [];

    return getUserPermissions(profile.role, workspaceRoles);
  }, [profile]);

  // Permission checking functions
  const checkPermission = (permission: Permission): boolean => {
    if (!profile) return false;
    return hasPermission(profile.role, permission);
  };

  const checkWorkspacePermission = (
    workspaceRole: WorkspaceRole,
    permission: Permission,
  ): boolean => {
    return hasWorkspacePermission(workspaceRole, permission);
  };

  const checkRole = (requiredRole: Role): boolean => {
    if (!profile) return false;

    const roleHierarchy = {
      Owner: 5,
      Admin: 4,
      Manager: 3,
      'Sales Rep': 2,
      Viewer: 1,
    };

    const userLevel = roleHierarchy[profile.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  const canManageUser = (targetRole: Role): boolean => {
    if (!profile) return false;
    return canManageRole(profile.role, targetRole);
  };

  const canAccessOrg = (organizationId: string): boolean => {
    if (!profile) return false;
    return canAccessOrganization(profile.organizationId, organizationId);
  };

  const canAccessWs = (workspaceId: string, organizationId: string): boolean => {
    if (!profile) return false;
    return canAccessWorkspace(
      profile.organizationId,
      profile.workspaceIds || [],
      workspaceId,
      organizationId,
    );
  };

  return {
    // User info
    user: profile,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified || false,

    // Role checks
    isOwner: profile?.role === 'Owner',
    isAdmin: profile?.role === 'Admin' || profile?.role === 'Owner',
    isManager: checkRole('Manager'),
    isSalesRep: checkRole('Sales Rep'),
    isViewer: profile?.role === 'Viewer',

    // Permission checks
    permissions,
    hasPermission: checkPermission,
    hasWorkspacePermission: checkWorkspacePermission,
    hasRole: checkRole,
    canManageRole: canManageUser,

    // Access control
    canAccessOrganization: canAccessOrg,
    canAccessWorkspace: canAccessWs,

    // Specific permission shortcuts
    canCreateUsers: checkPermission('users.create'),
    canManageUsers: checkPermission('users.manage_roles'),
    canInviteUsers: checkPermission('users.invite'),
    canUpdateOrganization: checkPermission('organization.update'),
    canManageBilling: checkPermission('organization.billing'),
    canCreateWorkspaces: checkPermission('workspaces.create'),
    canManageWorkspaces: checkPermission('workspaces.manage_members'),
    canCreateWorkflows: checkPermission('workflows.create'),
    canExecuteWorkflows: checkPermission('workflows.execute'),
    canCreateReports: checkPermission('reports.create'),
    canExportReports: checkPermission('reports.export'),
    canCreateProposals: checkPermission('proposals.create'),
    canShareProposals: checkPermission('proposals.share'),
    canManageLeads: checkPermission('leads.create'),
    canExportLeads: checkPermission('leads.export'),
    canComment: checkPermission('comments.create'),
    canModerateComments: checkPermission('comments.delete'),
  };
}

/**
 * Plan and feature access hook
 */
export function usePlanFeatures() {
  const { profile } = useAuth();

  // Get organization plan (would need to fetch from org data)
  const currentPlan: Plan = 'Free'; // TODO: Get from organization data

  const planFeatures = useMemo(() => {
    return PLAN_FEATURES[currentPlan];
  }, [currentPlan]);

  const hasFeature = (feature: keyof typeof PLAN_FEATURES.Free.features): boolean => {
    return planFeatures.features[feature];
  };

  const canPerformAction = (
    action: 'add_user' | 'add_workspace' | 'run_workflow' | 'add_storage',
    currentUsage: { users: number; workspaces: number; workflowRuns: number; storageGB: number },
  ): boolean => {
    return checkPlanLimits(currentPlan, currentUsage, action);
  };

  return {
    currentPlan,
    planFeatures,
    hasFeature,
    canPerformAction,

    // Feature shortcuts
    hasAI: hasFeature('aiEnabled'),
    hasAdvancedReporting: hasFeature('advancedReporting'),
    hasApiAccess: hasFeature('apiAccess'),
    hasSSO: hasFeature('ssoEnabled'),
    hasPrioritySupport: hasFeature('prioritySupport'),
    hasCustomBranding: hasFeature('customBranding'),

    // Limits
    maxUsers: planFeatures.maxUsers,
    maxWorkspaces: planFeatures.maxWorkspaces,
    maxWorkflowRuns: planFeatures.maxWorkflowRuns,
    maxStorage: planFeatures.storageGB,
  };
}

/**
 * Workspace-specific permissions hook
 */
export function useWorkspacePermissions(workspaceId?: string) {
  const { profile, activeWorkspaceId } = useAuth();
  const targetWorkspaceId = workspaceId || activeWorkspaceId;

  // Get user's role in the specific workspace
  const workspaceRole = useMemo(() => {
    if (!profile || !targetWorkspaceId) return null;

    // TODO: Get actual workspace role from workspace membership data
    // For now, map org role to workspace role
    const roleMapping: Record<Role, WorkspaceRole> = {
      Owner: 'Owner',
      Admin: 'Admin',
      Manager: 'Manager',
      'Sales Rep': 'Member',
      Viewer: 'Viewer',
    };

    return roleMapping[profile.role];
  }, [profile, targetWorkspaceId]);

  const checkWorkspacePermission = (permission: Permission): boolean => {
    if (!workspaceRole) return false;
    return hasWorkspacePermission(workspaceRole, permission);
  };

  return {
    workspaceId: targetWorkspaceId,
    workspaceRole,
    hasWorkspacePermission: checkWorkspacePermission,

    // Workspace-specific permission shortcuts
    canUpdateWorkspace: checkWorkspacePermission('workspaces.update'),
    canManageWorkspaceMembers: checkWorkspacePermission('workspaces.manage_members'),
    canDeleteWorkspace: checkWorkspacePermission('workspaces.delete'),
    canCreateWorkspaceContent: checkWorkspacePermission('workflows.create'),
    canManageWorkspaceReports: checkWorkspacePermission('reports.update'),
  };
}

/**
 * Higher-order component for permission-based rendering
 */
export function usePermissionGate() {
  const permissions = usePermissions();

  const PermissionGate: React.FC<{
    requiredPermission?: Permission;
    requiredRole?: Role;
    fallback?: React.ReactNode;
    children: React.ReactNode;
  }> = ({ requiredPermission, requiredRole, fallback = null, children }) => {
    let hasAccess = true;

    if (requiredPermission) {
      hasAccess = permissions.hasPermission(requiredPermission);
    }

    if (requiredRole && hasAccess) {
      hasAccess = permissions.hasRole(requiredRole);
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
  };

  return { PermissionGate, ...permissions };
}

/**
 * Hook for conditional UI rendering based on permissions
 */
export function useConditionalRender() {
  const permissions = usePermissions();

  const renderIf = (
    condition: boolean | (() => boolean),
    component: React.ReactNode,
    fallback: React.ReactNode = null,
  ) => {
    const shouldRender = typeof condition === 'function' ? condition() : condition;
    return shouldRender ? component : fallback;
  };

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
  ) => {
    const perms = Array.isArray(permission) ? permission : [permission];
    const hasPermission = perms.some((p) => permissions.hasPermission(p));
    return hasPermission ? component : fallback;
  };

  return {
    renderIf,
    renderForRole,
    renderForPermission,
    ...permissions,
  };
}

/**
 * Hook for navigation access control
 */
export function useNavigationAccess() {
  const permissions = usePermissions();

  const navigationAccess = useMemo(() => {
    return {
      dashboard: true, // Everyone can access dashboard
      leads: permissions.hasPermission('leads.read'),
      research: permissions.hasPermission('reports.read'),
      opportunities: permissions.hasPermission('reports.read'),
      outreach: permissions.hasPermission('workflows.read'),
      crm: permissions.hasPermission('leads.read'),
      proposals: permissions.hasPermission('proposals.read'),
      memory: permissions.hasRole('Manager'),
      intelligence: permissions.hasRole('Manager'),
      admin: permissions.isAdmin,
      settings: true, // Everyone can access their settings

      // Organization management
      organizationSettings: permissions.canUpdateOrganization,
      teamMembers: permissions.canManageUsers,
      billing: permissions.canManageBilling,
      workspaceManagement: permissions.canCreateWorkspaces,
    };
  }, [permissions]);

  return navigationAccess;
}

/**
 * Data access control hook
 */
export function useDataAccess() {
  const permissions = usePermissions();
  const { profile } = useAuth();

  const canAccessData = (
    dataType: 'workflow' | 'report' | 'proposal' | 'lead' | 'account',
    action: 'create' | 'read' | 'update' | 'delete' | 'export',
    ownerId?: string,
    organizationId?: string,
  ): boolean => {
    // Check organization access first
    if (organizationId && !permissions.canAccessOrganization(organizationId)) {
      return false;
    }

    // Check ownership for read access on sensitive data
    if (action === 'read' && ownerId && ownerId !== profile?.id && !permissions.isAdmin) {
      // Only admins or owners can read other users' data
      return false;
    }

    // Map data types to permissions
    const permissionMap: Record<string, Record<string, Permission>> = {
      workflow: {
        create: 'workflows.create',
        read: 'workflows.read',
        update: 'workflows.update',
        delete: 'workflows.delete',
        export: 'workflows.read', // Use read permission for export
      },
      report: {
        create: 'reports.create',
        read: 'reports.read',
        update: 'reports.update',
        delete: 'reports.delete',
        export: 'reports.export',
      },
      proposal: {
        create: 'proposals.create',
        read: 'proposals.read',
        update: 'proposals.update',
        delete: 'proposals.delete',
        export: 'proposals.read',
      },
      lead: {
        create: 'leads.create',
        read: 'leads.read',
        update: 'leads.update',
        delete: 'leads.delete',
        export: 'leads.export',
      },
      account: {
        create: 'leads.create',
        read: 'leads.read',
        update: 'leads.update',
        delete: 'leads.delete',
        export: 'leads.export',
      },
    };

    const requiredPermission = permissionMap[dataType]?.[action];
    if (!requiredPermission) return false;

    return permissions.hasPermission(requiredPermission);
  };

  return {
    canAccessData,
    organizationId: profile?.organizationId,
    userId: profile?.id,
  };
}
