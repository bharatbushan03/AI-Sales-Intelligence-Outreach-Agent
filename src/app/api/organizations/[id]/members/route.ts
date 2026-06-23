/**
 * Organization Members API
 * Handles organization member management
 */

import { NextRequest } from 'next/server';
import { withAuth, withPermissions } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { User, Role } from '@/types/auth';
import { canManageRole } from '@/lib/rbac';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/organizations/[id]/members
 * Get organization members
 */
export async function GET(request: NextRequest, props: RouteParams) {
  return withAuth(async (req, context) => {
    try {
      const params = await props.params;
      const orgId = params.id;

      // Verify access to organization
      if (orgId !== context.organizationId && context.user.role !== 'Owner') {
        return ApiResponse.permissionDenied('Cannot access other organization members');
      }

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 100);
      const role = searchParams.get('role');
      const status = searchParams.get('status') || 'active';
      const search = searchParams.get('search');

      let query = adminDb
        .collection('users')
        .where('organizationId', '==', orgId)
        .where('status', '==', status);

      if (role) {
        query = query.where('role', '==', role);
      }

      // Get total count
      const countQuery = await query.count().get();
      const total = countQuery.data().count;

      // Get paginated results
      let membersQuery = query
        .orderBy('createdAt', 'desc')
        .limit(pageSize);

      if (page > 1) {
        const offset = (page - 1) * pageSize;
        const offsetQuery = await query
          .orderBy('createdAt', 'desc')
          .limit(offset)
          .get();

        if (!offsetQuery.empty) {
          const lastDoc = offsetQuery.docs[offsetQuery.docs.length - 1];
          membersQuery = membersQuery.startAfter(lastDoc);
        }
      }

      const membersSnapshot = await membersQuery.get();

      let members = membersSnapshot.docs.map(doc => {
        const data = doc.data() as User;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          role: data.role,
          status: data.status,
          lastLoginAt: data.lastLoginAt,
          createdAt: data.createdAt,
          activityMetrics: data.activityMetrics,
        };
      });

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        members = members.filter(member =>
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower)
        );
      }

      logger.info('Organization members retrieved', {
        organizationId: orgId,
        requestedBy: context.user.uid,
        memberCount: members.length,
        page,
        pageSize,
      });

      return ApiResponse.paginated(members, page, pageSize, total);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Member retrieval failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to retrieve members', 'ORGANIZATION_ERROR', 500);
    }
  })(request);
}

/**
 * DELETE /api/organizations/[id]/members
 * Remove a member from organization
 */
export async function DELETE(request: NextRequest, props: RouteParams) {
  return withPermissions(
    ['users.delete'],
    async (req, context) => {
      try {
        const params = await props.params;
        const orgId = params.id;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
          return ApiResponse.badRequest('User ID is required');
        }

        if (orgId !== context.organizationId) {
          return ApiResponse.permissionDenied('Cannot remove members from other organizations');
        }

        // Cannot remove yourself
        if (userId === context.user.uid) {
          return ApiResponse.badRequest('Cannot remove yourself from the organization');
        }

        // Get target user
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          return ApiResponse.notFound('User not found');
        }

        const userData = userDoc.data() as User;

        // Verify user belongs to this organization
        if (userData.organizationId !== orgId) {
          return ApiResponse.badRequest('User does not belong to this organization');
        }

        // Check if current user can manage target user's role
        if (!canManageRole(context.user.role, userData.role)) {
          return ApiResponse.permissionDenied('Cannot remove user with higher or equal role');
        }

        // Check if this is the organization owner
        const orgDoc = await adminDb.collection('organizations').doc(orgId).get();
        const orgData = orgDoc.data();
        
        if (orgData?.owner === userId) {
          return ApiResponse.badRequest('Cannot remove organization owner. Transfer ownership first.');
        }

        // Remove user from organization
        await adminDb.collection('users').doc(userId).update({
          organizationId: null,
          role: 'Viewer', // Reset to default role
          workspaceIds: [], // Remove from all workspaces
          status: 'inactive',
          updatedAt: new Date().toISOString(),
        });

        // Remove user from all workspaces in the organization
        const workspacesQuery = await adminDb
          .collection('workspaces')
          .where('organizationId', '==', orgId)
          .get();

        const batch = adminDb.batch();
        workspacesQuery.docs.forEach(workspaceDoc => {
          const workspaceData = workspaceDoc.data();
          const updatedMembers = workspaceData.members?.filter(
            (member: any) => member.userId !== userId
          ) || [];

          batch.update(workspaceDoc.ref, {
            members: updatedMembers,
            updatedAt: new Date().toISOString(),
          });
        });

        await batch.commit();

        // Log activity
        await adminDb.collection('activity_feed').add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          organizationId: orgId,
          action: 'LEFT',
          entityType: 'user',
          entityId: userId,
          entityName: userData.name,
          details: `${userData.name} was removed from the organization`,
          metadata: {
            removedBy: context.user.uid,
            previousRole: userData.role,
          },
          timestamp: new Date().toISOString(),
        });

        logger.info('Member removed from organization', {
          organizationId: orgId,
          removedUserId: userId,
          removedBy: context.user.uid,
          previousRole: userData.role,
        });

        return ApiResponse.success({
          success: true,
          message: 'Member removed from organization successfully',
          removedUser: {
            id: userId,
            name: userData.name,
            email: userData.email,
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Member removal failed: ${errorMsg}`, error);
        return ApiResponse.error('Failed to remove member', 'ORGANIZATION_ERROR', 500);
      }
    }
  )(request);
}

/**
 * PUT /api/organizations/[id]/members
 * Update member role or status
 */
export async function PUT(request: NextRequest, props: RouteParams) {
  return withPermissions(
    ['users.manage_roles'],
    async (req, context) => {
      try {
        const params = await props.params;
        const orgId = params.id;
        const body = await req.json();
        const { userId, role, status } = body;

        if (!userId) {
          return ApiResponse.badRequest('User ID is required');
        }

        if (orgId !== context.organizationId) {
          return ApiResponse.permissionDenied('Cannot modify members in other organizations');
        }

        // Cannot modify yourself
        if (userId === context.user.uid) {
          return ApiResponse.badRequest('Cannot modify your own role');
        }

        // Get target user
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
          return ApiResponse.notFound('User not found');
        }

        const userData = userDoc.data() as User;

        // Verify user belongs to this organization
        if (userData.organizationId !== orgId) {
          return ApiResponse.badRequest('User does not belong to this organization');
        }

        const updates: Partial<User> = {
          updatedAt: new Date().toISOString(),
        };

        let activityDetails = '';

        // Handle role change
        if (role && role !== userData.role) {
          // Check if current user can assign this role
          if (!canManageRole(context.user.role, role as Role)) {
            return ApiResponse.permissionDenied(`Cannot assign role '${role}'`);
          }

          // Check if current user can manage target user's current role
          if (!canManageRole(context.user.role, userData.role)) {
            return ApiResponse.permissionDenied('Cannot modify user with higher or equal role');
          }

          updates.role = role as Role;
          activityDetails += `Role changed from ${userData.role} to ${role}. `;
        }

        // Handle status change
        if (status && status !== userData.status) {
          if (!['active', 'inactive', 'suspended'].includes(status)) {
            return ApiResponse.badRequest('Invalid status value');
          }

          updates.status = status;
          activityDetails += `Status changed to ${status}. `;
        }

        if (Object.keys(updates).length === 1) { // Only updatedAt
          return ApiResponse.badRequest('No valid updates provided');
        }

        // Apply updates
        await userRef.update(updates);

        // Log activity
        await adminDb.collection('activity_feed').add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          organizationId: orgId,
          action: 'UPDATED',
          entityType: 'user',
          entityId: userId,
          entityName: userData.name,
          details: `Member updated: ${activityDetails.trim()}`,
          metadata: {
            updatedBy: context.user.uid,
            changes: updates,
            previousRole: userData.role,
            previousStatus: userData.status,
          },
          timestamp: new Date().toISOString(),
        });

        logger.info('Member updated', {
          organizationId: orgId,
          targetUserId: userId,
          updatedBy: context.user.uid,
          changes: updates,
        });

        return ApiResponse.success({
          success: true,
          message: 'Member updated successfully',
          updates,
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Member update failed: ${errorMsg}`, error);
        return ApiResponse.error('Failed to update member', 'ORGANIZATION_ERROR', 500);
      }
    }
  )(request);
}