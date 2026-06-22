/**
 * Permissions API
 * Handles permission checks and user capabilities
 */

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { 
  hasPermission, 
  getUserPermissions, 
  SYSTEM_ROLES,
  WORKSPACE_ROLE_PERMISSIONS 
} from '@/lib/rbac';
import { Permission, Role, WorkspaceRole } from '@/types/auth';

/**
 * GET /api/permissions
 * Get user's permissions and capabilities
 */
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const includeWorkspace = searchParams.get('includeWorkspace') === 'true';
    const workspaceId = searchParams.get('workspaceId');

    // Get organization-level permissions
    const orgPermissions = SYSTEM_ROLES[context.user.role].permissions;
    
    let workspacePermissions: Permission[] = [];
    let workspaceRole: WorkspaceRole | null = null;

    // Get workspace-specific permissions if requested
    if (includeWorkspace && workspaceId) {
      // TODO: Get actual workspace role from workspace membership
      // For now, map org role to workspace role
      const roleMapping: Record<Role, WorkspaceRole> = {
        'Owner': 'Owner',
        'Admin': 'Admin', 
        'Manager': 'Manager',
        'Sales Rep': 'Member',
        'Viewer': 'Viewer',
      };
      
      workspaceRole = roleMapping[context.user.role];
      workspacePermissions = WORKSPACE_ROLE_PERMISSIONS[workspaceRole] || [];
    }

    // Combine all permissions and deduplicate
    const allPermissions = Array.from(new Set([
      ...orgPermissions,
      ...workspacePermissions,
    ]));

    const capabilities = {
      // User Management
      canCreateUsers: hasPermission(context.user.role, 'users.create'),
      canManageUsers: hasPermission(context.user.role, 'users.manage_roles'),
      canInviteUsers: hasPermission(context.user.role, 'users.invite'),
      canDeleteUsers: hasPermission(context.user.role, 'users.delete'),
      
      // Organization Management
      canUpdateOrganization: hasPermission(context.user.role, 'organization.update'),
      canManageOrganizationSettings: hasPermission(context.user.role, 'organization.settings'),
      canManageBilling: hasPermission(context.user.role, 'organization.billing'),
      canDeleteOrganization: hasPermission(context.user.role, 'organization.delete'),
      
      // Workspace Management
      canCreateWorkspaces: hasPermission(context.user.role, 'workspaces.create'),
      canManageWorkspaces: hasPermission(context.user.role, 'workspaces.manage_members'),
      canDeleteWorkspaces: hasPermission(context.user.role, 'workspaces.delete'),
      
      // Content Management
      canCreateWorkflows: hasPermission(context.user.role, 'workflows.create'),
      canExecuteWorkflows: hasPermission(context.user.role, 'workflows.execute'),
      canDeleteWorkflows: hasPermission(context.user.role, 'workflows.delete'),
      
      canCreateReports: hasPermission(context.user.role, 'reports.create'),
      canUpdateReports: hasPermission(context.user.role, 'reports.update'),
      canDeleteReports: hasPermission(context.user.role, 'reports.delete'),
      canExportReports: hasPermission(context.user.role, 'reports.export'),
      
      canCreateProposals: hasPermission(context.user.role, 'proposals.create'),
      canUpdateProposals: hasPermission(context.user.role, 'proposals.update'),
      canDeleteProposals: hasPermission(context.user.role, 'proposals.delete'),
      canShareProposals: hasPermission(context.user.role, 'proposals.share'),
      
      canCreateLeads: hasPermission(context.user.role, 'leads.create'),
      canUpdateLeads: hasPermission(context.user.role, 'leads.update'),
      canDeleteLeads: hasPermission(context.user.role, 'leads.delete'),
      canImportLeads: hasPermission(context.user.role, 'leads.import'),
      canExportLeads: hasPermission(context.user.role, 'leads.export'),
      
      // Collaboration
      canComment: hasPermission(context.user.role, 'comments.create'),
      canModerateComments: hasPermission(context.user.role, 'comments.delete'),
      
      // System
      canAccessAdmin: hasPermission(context.user.role, 'system.admin'),
      canViewAudits: hasPermission(context.user.role, 'system.audit'),
      canManageBackups: hasPermission(context.user.role, 'system.backup'),
    };

    const response = {
      user: {
        id: context.user.uid,
        email: context.user.email,
        role: context.user.role,
        organizationId: context.user.organizationId,
        workspaceIds: context.user.workspaceIds,
      },
      permissions: {
        organization: {
          role: context.user.role,
          permissions: orgPermissions,
        },
        ...(workspaceRole && {
          workspace: {
            workspaceId,
            role: workspaceRole,
            permissions: workspacePermissions,
          },
        }),
        all: allPermissions,
      },
      capabilities,
      roleInfo: {
        name: SYSTEM_ROLES[context.user.role].name,
        displayName: SYSTEM_ROLES[context.user.role].displayName,
        description: SYSTEM_ROLES[context.user.role].description,
        level: SYSTEM_ROLES[context.user.role].level,
      },
    };

    logger.info('Permissions retrieved', {
      userId: context.user.uid,
      role: context.user.role,
      organizationId: context.organizationId,
      workspaceId,
      permissionCount: allPermissions.length,
    });

    return ApiResponse.success(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Permission retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve permissions', 'INTERNAL_ERROR', 500);
  }
});

/**
 * POST /api/permissions/check
 * Check specific permissions
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { permissions: permissionsToCheck, workspaceId } = body;

    if (!Array.isArray(permissionsToCheck)) {
      return ApiResponse.badRequest('Permissions must be an array');
    }

    const results: Record<string, boolean> = {};

    for (const permission of permissionsToCheck) {
      if (typeof permission !== 'string') {
        results[String(permission)] = false;
        continue;
      }

      // Check organization-level permission
      const hasOrgPermission = hasPermission(context.user.role, permission as Permission);
      
      // Check workspace-level permission if workspace specified
      let hasWorkspacePermission = false;
      if (workspaceId && context.user.workspaceIds.includes(workspaceId)) {
        // TODO: Get actual workspace role
        const workspaceRole = 'Member' as WorkspaceRole;
        hasWorkspacePermission = WORKSPACE_ROLE_PERMISSIONS[workspaceRole]?.includes(permission as Permission) || false;
      }

      results[permission] = hasOrgPermission || hasWorkspacePermission;
    }

    logger.info('Permissions checked', {
      userId: context.user.uid,
      organizationId: context.organizationId,
      workspaceId,
      checkedPermissions: permissionsToCheck,
    });

    return ApiResponse.success({
      userId: context.user.uid,
      organizationId: context.organizationId,
      workspaceId,
      results,
      summary: {
        total: permissionsToCheck.length,
        granted: Object.values(results).filter(Boolean).length,
        denied: Object.values(results).filter(v => !v).length,
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Permission check failed: ${errorMsg}`, error);
    return ApiResponse.error('Permission check failed', 'INTERNAL_ERROR', 500);
  }
});

/**
 * GET /api/permissions/matrix
 * Get complete permission matrix for role planning
 */
export const matrix = withAuth(async (request, context) => {
  try {
    // Only admins can see the full permission matrix
    if (!hasPermission(context.user.role, 'system.admin')) {
      return ApiResponse.permissionDenied('Admin access required');
    }

    const permissionMatrix = {
      organizationRoles: Object.entries(SYSTEM_ROLES).map(([role, definition]) => ({
        role,
        displayName: definition.displayName,
        description: definition.description,
        level: definition.level,
        permissions: definition.permissions,
        permissionCount: definition.permissions.length,
      })),
      workspaceRoles: Object.entries(WORKSPACE_ROLE_PERMISSIONS).map(([role, permissions]) => ({
        role,
        permissions,
        permissionCount: permissions.length,
      })),
      allPermissions: Array.from(new Set([
        ...Object.values(SYSTEM_ROLES).flatMap(role => role.permissions),
        ...Object.values(WORKSPACE_ROLE_PERMISSIONS).flat(),
      ])).sort(),
    };

    logger.info('Permission matrix retrieved', {
      userId: context.user.uid,
      organizationId: context.organizationId,
    });

    return ApiResponse.success(permissionMatrix);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Permission matrix retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve permission matrix', 'INTERNAL_ERROR', 500);
  }
}, {
  requiredPermissions: ['system.admin'],
});