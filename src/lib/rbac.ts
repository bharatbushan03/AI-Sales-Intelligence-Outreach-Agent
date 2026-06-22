/**
 * Role-Based Access Control (RBAC) System
 * Defines roles, permissions, and access control logic for the B2B SaaS platform
 */

import { Role, WorkspaceRole, Permission, RoleDefinition } from '../types/auth';

// System Role Definitions
export const SYSTEM_ROLES: Record<Role, RoleDefinition> = {
  'Owner': {
    name: 'Owner',
    displayName: 'Organization Owner',
    description: 'Full control over organization, billing, and all resources',
    level: 5,
    isSystemRole: true,
    permissions: [
      // User Management
      'users.create',
      'users.read',
      'users.update',
      'users.delete',
      'users.invite',
      'users.manage_roles',
      
      // Organization Management
      'organization.read',
      'organization.update',
      'organization.settings',
      'organization.billing',
      'organization.delete',
      
      // Workspace Management
      'workspaces.create',
      'workspaces.read',
      'workspaces.update',
      'workspaces.delete',
      'workspaces.manage_members',
      
      // Content Management
      'workflows.create',
      'workflows.read',
      'workflows.update',
      'workflows.delete',
      'workflows.execute',
      
      'reports.create',
      'reports.read',
      'reports.update',
      'reports.delete',
      'reports.export',
      
      'proposals.create',
      'proposals.read',
      'proposals.update',
      'proposals.delete',
      'proposals.share',
      
      'leads.create',
      'leads.read',
      'leads.update',
      'leads.delete',
      'leads.import',
      'leads.export',
      
      // Collaboration
      'comments.create',
      'comments.read',
      'comments.update',
      'comments.delete',
      
      // System
      'system.admin',
      'system.audit',
      'system.backup',
    ],
  },

  'Admin': {
    name: 'Admin',
    displayName: 'Administrator',
    description: 'Manage users, workspaces, and organization settings (except billing)',
    level: 4,
    isSystemRole: true,
    permissions: [
      // User Management
      'users.create',
      'users.read',
      'users.update',
      'users.invite',
      'users.manage_roles',
      
      // Organization Management (no billing or delete)
      'organization.read',
      'organization.update',
      'organization.settings',
      
      // Workspace Management
      'workspaces.create',
      'workspaces.read',
      'workspaces.update',
      'workspaces.delete',
      'workspaces.manage_members',
      
      // Content Management
      'workflows.create',
      'workflows.read',
      'workflows.update',
      'workflows.delete',
      'workflows.execute',
      
      'reports.create',
      'reports.read',
      'reports.update',
      'reports.delete',
      'reports.export',
      
      'proposals.create',
      'proposals.read',
      'proposals.update',
      'proposals.delete',
      'proposals.share',
      
      'leads.create',
      'leads.read',
      'leads.update',
      'leads.delete',
      'leads.import',
      'leads.export',
      
      // Collaboration
      'comments.create',
      'comments.read',
      'comments.update',
      'comments.delete',
      
      // System
      'system.audit',
    ],
  },

  'Manager': {
    name: 'Manager',
    displayName: 'Team Manager',
    description: 'Manage team members and content within assigned workspaces',
    level: 3,
    isSystemRole: true,
    permissions: [
      // User Management (limited)
      'users.read',
      'users.invite',
      
      // Organization Management (read-only)
      'organization.read',
      
      // Workspace Management (limited)
      'workspaces.create',
      'workspaces.read',
      'workspaces.update',
      'workspaces.manage_members',
      
      // Content Management
      'workflows.create',
      'workflows.read',
      'workflows.update',
      'workflows.delete',
      'workflows.execute',
      
      'reports.create',
      'reports.read',
      'reports.update',
      'reports.delete',
      'reports.export',
      
      'proposals.create',
      'proposals.read',
      'proposals.update',
      'proposals.delete',
      'proposals.share',
      
      'leads.create',
      'leads.read',
      'leads.update',
      'leads.delete',
      'leads.export',
      
      // Collaboration
      'comments.create',
      'comments.read',
      'comments.update',
      'comments.delete',
    ],
  },

  'Sales Rep': {
    name: 'Sales Rep',
    displayName: 'Sales Representative',
    description: 'Create and manage sales content, execute workflows',
    level: 2,
    isSystemRole: true,
    permissions: [
      // User Management (read-only)
      'users.read',
      
      // Organization Management (read-only)
      'organization.read',
      
      // Workspace Management (read-only)
      'workspaces.read',
      
      // Content Management
      'workflows.create',
      'workflows.read',
      'workflows.update',
      'workflows.execute',
      
      'reports.create',
      'reports.read',
      'reports.update',
      'reports.export',
      
      'proposals.create',
      'proposals.read',
      'proposals.update',
      'proposals.share',
      
      'leads.create',
      'leads.read',
      'leads.update',
      'leads.export',
      
      // Collaboration
      'comments.create',
      'comments.read',
      'comments.update',
    ],
  },

  'Viewer': {
    name: 'Viewer',
    displayName: 'Viewer',
    description: 'Read-only access to shared content and reports',
    level: 1,
    isSystemRole: true,
    permissions: [
      // User Management (read-only)
      'users.read',
      
      // Organization Management (read-only)
      'organization.read',
      
      // Workspace Management (read-only)
      'workspaces.read',
      
      // Content Management (read-only)
      'workflows.read',
      'reports.read',
      'proposals.read',
      'leads.read',
      
      // Collaboration (read and comment)
      'comments.create',
      'comments.read',
    ],
  },
};

// Workspace Role Permissions (more granular than org roles)
export const WORKSPACE_ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  'Owner': [
    'workspaces.read',
    'workspaces.update',
    'workspaces.delete',
    'workspaces.manage_members',
    'workflows.create',
    'workflows.read',
    'workflows.update',
    'workflows.delete',
    'workflows.execute',
    'reports.create',
    'reports.read',
    'reports.update',
    'reports.delete',
    'reports.export',
    'proposals.create',
    'proposals.read',
    'proposals.update',
    'proposals.delete',
    'proposals.share',
    'leads.create',
    'leads.read',
    'leads.update',
    'leads.delete',
    'leads.export',
    'comments.create',
    'comments.read',
    'comments.update',
    'comments.delete',
  ],

  'Admin': [
    'workspaces.read',
    'workspaces.update',
    'workspaces.manage_members',
    'workflows.create',
    'workflows.read',
    'workflows.update',
    'workflows.delete',
    'workflows.execute',
    'reports.create',
    'reports.read',
    'reports.update',
    'reports.delete',
    'reports.export',
    'proposals.create',
    'proposals.read',
    'proposals.update',
    'proposals.delete',
    'proposals.share',
    'leads.create',
    'leads.read',
    'leads.update',
    'leads.delete',
    'leads.export',
    'comments.create',
    'comments.read',
    'comments.update',
    'comments.delete',
  ],

  'Manager': [
    'workspaces.read',
    'workflows.create',
    'workflows.read',
    'workflows.update',
    'workflows.execute',
    'reports.create',
    'reports.read',
    'reports.update',
    'reports.export',
    'proposals.create',
    'proposals.read',
    'proposals.update',
    'proposals.share',
    'leads.create',
    'leads.read',
    'leads.update',
    'leads.export',
    'comments.create',
    'comments.read',
    'comments.update',
  ],

  'Member': [
    'workspaces.read',
    'workflows.create',
    'workflows.read',
    'workflows.update',
    'workflows.execute',
    'reports.create',
    'reports.read',
    'reports.update',
    'proposals.create',
    'proposals.read',
    'proposals.update',
    'proposals.share',
    'leads.create',
    'leads.read',
    'leads.update',
    'comments.create',
    'comments.read',
    'comments.update',
  ],

  'Viewer': [
    'workspaces.read',
    'workflows.read',
    'reports.read',
    'proposals.read',
    'leads.read',
    'comments.create',
    'comments.read',
  ],
};

/**
 * Permission Hierarchy - Higher level roles inherit all permissions from lower levels
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  'Owner': ['Admin', 'Manager', 'Sales Rep', 'Viewer'],
  'Admin': ['Manager', 'Sales Rep', 'Viewer'],
  'Manager': ['Sales Rep', 'Viewer'],
  'Sales Rep': ['Viewer'],
  'Viewer': [],
};

/**
 * Check if a user has a specific permission based on their role
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const roleDefinition = SYSTEM_ROLES[userRole];
  return roleDefinition.permissions.includes(permission);
}

/**
 * Check if a user has workspace-level permission
 */
export function hasWorkspacePermission(workspaceRole: WorkspaceRole, permission: Permission): boolean {
  const permissions = WORKSPACE_ROLE_PERMISSIONS[workspaceRole];
  return permissions.includes(permission);
}

/**
 * Check if a role can perform action on another role (hierarchy check)
 */
export function canManageRole(actorRole: Role, targetRole: Role): boolean {
  if (actorRole === targetRole) return false; // Can't manage same role
  
  const actorLevel = SYSTEM_ROLES[actorRole].level;
  const targetLevel = SYSTEM_ROLES[targetRole].level;
  
  return actorLevel > targetLevel;
}

/**
 * Get all permissions for a user (combining org and workspace permissions)
 */
export function getUserPermissions(
  orgRole: Role,
  workspaceRoles: { workspaceId: string; role: WorkspaceRole }[] = []
): Permission[] {
  const orgPermissions = SYSTEM_ROLES[orgRole].permissions;
  const workspacePermissions = workspaceRoles.flatMap(({ role }) => 
    WORKSPACE_ROLE_PERMISSIONS[role]
  );
  
  // Combine and deduplicate permissions
  return Array.from(new Set([...orgPermissions, ...workspacePermissions]));
}

/**
 * Check if user can access organization
 */
export function canAccessOrganization(userOrgId: string, resourceOrgId: string): boolean {
  return userOrgId === resourceOrgId;
}

/**
 * Check if user can access workspace
 */
export function canAccessWorkspace(
  userOrgId: string,
  userWorkspaceIds: string[],
  workspaceId: string,
  resourceOrgId: string
): boolean {
  // Must be in same organization
  if (userOrgId !== resourceOrgId) return false;
  
  // Must be member of workspace or have org-level permissions
  return userWorkspaceIds.includes(workspaceId);
}

/**
 * Default plan features and limits
 */
export const PLAN_FEATURES = {
  Free: {
    name: 'Free',
    displayName: 'Free Plan',
    price: 0,
    maxUsers: 3,
    maxWorkspaces: 2,
    maxWorkflowRuns: 50,
    storageGB: 1,
    features: {
      aiEnabled: true,
      advancedReporting: false,
      apiAccess: false,
      ssoEnabled: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  Pro: {
    name: 'Pro',
    displayName: 'Pro Plan',
    price: 2900, // $29/month
    yearlyPrice: 29000, // $290/year (2 months free)
    maxUsers: 10,
    maxWorkspaces: 10,
    maxWorkflowRuns: 500,
    storageGB: 10,
    features: {
      aiEnabled: true,
      advancedReporting: true,
      apiAccess: true,
      ssoEnabled: false,
      prioritySupport: true,
      customBranding: false,
    },
  },
  Business: {
    name: 'Business',
    displayName: 'Business Plan',
    price: 9900, // $99/month
    yearlyPrice: 99000, // $990/year (2 months free)
    maxUsers: 50,
    maxWorkspaces: -1, // Unlimited
    maxWorkflowRuns: 2000,
    storageGB: 50,
    features: {
      aiEnabled: true,
      advancedReporting: true,
      apiAccess: true,
      ssoEnabled: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
  Enterprise: {
    name: 'Enterprise',
    displayName: 'Enterprise Plan',
    price: 29900, // $299/month
    yearlyPrice: 299000, // $2990/year (2 months free)
    maxUsers: -1, // Unlimited
    maxWorkspaces: -1, // Unlimited
    maxWorkflowRuns: -1, // Unlimited
    storageGB: 500,
    features: {
      aiEnabled: true,
      advancedReporting: true,
      apiAccess: true,
      ssoEnabled: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
} as const;

/**
 * Check if organization can perform action based on plan limits
 */
export function checkPlanLimits(
  currentPlan: keyof typeof PLAN_FEATURES,
  currentUsage: { users: number; workspaces: number; workflowRuns: number; storageGB: number },
  action: 'add_user' | 'add_workspace' | 'run_workflow' | 'add_storage'
): boolean {
  const planFeatures = PLAN_FEATURES[currentPlan];
  
  switch (action) {
    case 'add_user':
      return planFeatures.maxUsers === -1 || currentUsage.users < planFeatures.maxUsers;
    case 'add_workspace':
      return planFeatures.maxWorkspaces === -1 || currentUsage.workspaces < planFeatures.maxWorkspaces;
    case 'run_workflow':
      return planFeatures.maxWorkflowRuns === -1 || currentUsage.workflowRuns < planFeatures.maxWorkflowRuns;
    case 'add_storage':
      return currentUsage.storageGB < planFeatures.storageGB;
    default:
      return false;
  }
}