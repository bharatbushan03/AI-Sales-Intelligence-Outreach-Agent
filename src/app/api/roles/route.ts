/**
 * Role Management API
 * Handles role assignments, permission checks, and role-based operations
 */

import { NextRequest } from 'next/server';
import { withAuth, withPermissions } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { SYSTEM_ROLES, canManageRole } from '@/lib/rbac';
import { Role } from '@/types/auth';

/**
 * GET /api/roles
 * Get available roles and their permissions
 */
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const includePermissions = searchParams.get('includePermissions') === 'true';
    const filterByLevel = searchParams.get('filterByLevel') === 'true';

    let roles = Object.values(SYSTEM_ROLES);

    // Filter roles based on user's level (can only see roles they can manage)
    if (filterByLevel) {
      const userLevel = SYSTEM_ROLES[context.user.role].level;
      roles = roles.filter(role => role.level < userLevel);
    }

    // Optionally exclude permissions to reduce payload size
    if (!includePermissions) {
      roles = roles.map(role => ({
        ...role,
        permissions: role.permissions.length, // Just return count
      }));
    }

    logger.info('Roles retrieved', { 
      userId: context.user.uid,
      roleCount: roles.length,
      includePermissions 
    });

    return ApiResponse.success({
      roles,
      userRole: context.user.role,
      userLevel: SYSTEM_ROLES[context.user.role].level,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Role retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve roles', 'INTERNAL_ERROR', 500);
  }
}, {
  requiredPermissions: ['users.read'],
});

/**
 * POST /api/roles/assign
 * Assign a role to a user
 */
export const POST = withPermissions(
  ['users.manage_roles'],
  async (request, context) => {
    try {
      const body = await request.json();
      const { userId, role, reason } = body;

      if (!userId || !role) {
        return ApiResponse.badRequest('User ID and role are required');
      }

      // Validate role
      if (!Object.keys(SYSTEM_ROLES).includes(role)) {
        return ApiResponse.badRequest('Invalid role specified');
      }

      // Check if current user can assign this role
      if (!canManageRole(context.user.role, role as Role)) {
        return ApiResponse.permissionDenied(`Cannot assign role '${role}'`);
      }

      // Get target user
      const userRef = adminDb.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return ApiResponse.notFound('User not found');
      }

      const userData = userDoc.data();

      // Check organization access
      if (userData?.organizationId !== context.organizationId) {
        return ApiResponse.permissionDenied('Cannot assign roles to users in different organizations');
      }

      // Get current role for comparison
      const currentRole = userData?.role;

      // Update user role
      await userRef.update({
        role: role,
        updatedAt: new Date().toISOString(),
      });

      // Log activity
      await adminDb.collection('activity_feed').add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        organizationId: context.organizationId,
        action: 'ROLE_CHANGED',
        entityType: 'user',
        entityId: userId,
        entityName: userData?.name || 'Unknown User',
        details: `Role changed from ${currentRole} to ${role}${reason ? ` - ${reason}` : ''}`,
        metadata: {
          previousRole: currentRole,
          newRole: role,
          changedBy: context.user.uid,
          reason,
        },
        timestamp: new Date().toISOString(),
      });

      // Create audit log
      await adminDb.collection('audit_logs').add({
        organizationId: context.organizationId,
        actor: {
          uid: context.user.uid,
          email: context.user.email,
          name: context.user.profile.name,
          role: context.user.role,
        },
        action: 'ROLE_ASSIGNMENT',
        entityType: 'user',
        entityId: userId,
        changes: {
          field: 'role',
          previousValue: currentRole,
          newValue: role,
        },
        metadata: {
          reason,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
        timestamp: new Date().toISOString(),
      });

      logger.info('Role assigned successfully', {
        adminId: context.user.uid,
        targetUserId: userId,
        previousRole: currentRole,
        newRole: role,
        organizationId: context.organizationId,
      });

      return ApiResponse.success({
        success: true,
        userId,
        previousRole: currentRole,
        newRole: role,
        message: `Role successfully changed to ${role}`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Role assignment failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to assign role', 'INTERNAL_ERROR', 500);
    }
  }
);