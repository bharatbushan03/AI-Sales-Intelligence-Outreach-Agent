/**
 * Workspace Members API
 * Handles workspace member management
 */

import { NextRequest } from 'next/server';
import { withAuth, withPermissions } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Workspace, WorkspaceMember, User, WorkspaceRole } from '@/types/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/workspaces/[id]/members
 * Get workspace members
 */
export async function GET(request: NextRequest, props: RouteParams) {
  return withAuth(async (req, context) => {
    try {
      const params = await props.params;
      const workspaceId = params.id;

      // Get workspace to verify access
      const workspaceDoc = await adminDb.collection('workspaces').doc(workspaceId).get();
      if (!workspaceDoc.exists) {
        return ApiResponse.notFound('Workspace not found');
      }

      const workspaceData = workspaceDoc.data() as Workspace;

      // Verify organization access
      if (workspaceData.organizationId !== context.organizationId) {
        return ApiResponse.permissionDenied('Cannot access workspace in different organization');
      }

      // Check if user has access to this workspace
      const isMember = workspaceData.members?.some(member => member.userId === context.user.uid);
      const isOrgAdmin = ['Owner', 'Admin'].includes(context.user.role);

      if (!isMember && !isOrgAdmin) {
        return ApiResponse.permissionDenied('Not authorized to view workspace members');
      }

      // Get detailed member information
      const memberDetails = await Promise.all(
        (workspaceData.members || []).map(async (member) => {
          const userDoc = await adminDb.collection('users').doc(member.userId).get();
          const userData = userDoc.data() as User;

          return {
            userId: member.userId,
            name: userData?.name || 'Unknown User',
            email: userData?.email || '',
            avatar: userData?.avatar,
            role: member.role,
            permissions: member.permissions || [],
            joinedAt: member.joinedAt,
            lastActive: userData?.activityMetrics?.lastActiveAt,
            status: userData?.status || 'unknown',
          };
        })
      );

      logger.info('Workspace members retrieved', {
        workspaceId,
        organizationId: context.organizationId,
        requestedBy: context.user.uid,
        memberCount: memberDetails.length,
      });

      return ApiResponse.success({
        workspaceId,
        workspaceName: workspaceData.name,
        members: memberDetails,
        totalMembers: memberDetails.length,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Workspace members retrieval failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to retrieve workspace members', 'WORKSPACE_ERROR', 500);
    }
  })(request, context);
}

/**
 * POST /api/workspaces/[id]/members
 * Add member to workspace
 */
export async function POST(request: NextRequest, props: RouteParams) {
  return withPermissions(
    ['workspaces.manage_members'],
    async (req, context) => {
      try {
        const params = await props.params;
        const workspaceId = params.id;
        const body = await req.json();
        const { userId, role = 'Member' } = body;

        if (!userId) {
          return ApiResponse.badRequest('User ID is required');
        }

        if (!['Owner', 'Admin', 'Manager', 'Member', 'Viewer'].includes(role)) {
          return ApiResponse.badRequest('Invalid workspace role');
        }

        // Get workspace
        const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
        const workspaceDoc = await workspaceRef.get();

        if (!workspaceDoc.exists) {
          return ApiResponse.notFound('Workspace not found');
        }

        const workspaceData = workspaceDoc.data() as Workspace;

        // Verify organization access
        if (workspaceData.organizationId !== context.organizationId) {
          return ApiResponse.permissionDenied('Cannot add members to workspace in different organization');
        }

        // Get target user
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists) {
          return ApiResponse.notFound('User not found');
        }

        const userData = userDoc.data() as User;

        // Verify user belongs to same organization
        if (userData.organizationId !== context.organizationId) {
          return ApiResponse.badRequest('Cannot add user from different organization');
        }

        // Check if user is already a member
        const isAlreadyMember = workspaceData.members?.some(member => member.userId === userId);
        if (isAlreadyMember) {
          return ApiResponse.conflict('User is already a member of this workspace');
        }

        // Create new member
        const newMember: WorkspaceMember = {
          userId,
          role: role as WorkspaceRole,
          permissions: [],
          joinedAt: new Date().toISOString(),
        };

        // Update workspace members
        const updatedMembers = [...(workspaceData.members || []), newMember];
        await workspaceRef.update({
          members: updatedMembers,
          updatedAt: new Date().toISOString(),
        });

        // Update user's workspace list
        const userWorkspaceIds = userData.workspaceIds || [];
        if (!userWorkspaceIds.includes(workspaceId)) {
          await adminDb.collection('users').doc(userId).update({
            workspaceIds: [...userWorkspaceIds, workspaceId],
            updatedAt: new Date().toISOString(),
          });
        }

        // Log activity
        await adminDb.collection('activity_feed').add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          organizationId: context.organizationId,
          workspaceId,
          action: 'JOINED',
          entityType: 'user',
          entityId: userId,
          entityName: userData.name,
          details: `${userData.name} was added to workspace "${workspaceData.name}" as ${role}`,
          metadata: {
            addedBy: context.user.uid,
            workspaceRole: role,
          },
          timestamp: new Date().toISOString(),
        });

        logger.info('Member added to workspace', {
          workspaceId,
          organizationId: context.organizationId,
          addedUserId: userId,
          addedBy: context.user.uid,
          role,
        });

        return ApiResponse.success({
          success: true,
          message: 'Member added to workspace successfully',
          member: {
            userId,
            name: userData.name,
            email: userData.email,
            role,
            joinedAt: newMember.joinedAt,
          },
        }, 201);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Workspace member addition failed: ${errorMsg}`, error);
        return ApiResponse.error('Failed to add member to workspace', 'WORKSPACE_ERROR', 500);
      }
    }
  )(request, context);
}

/**
 * PUT /api/workspaces/[id]/members
 * Update workspace member role
 */
export async function PUT(request: NextRequest, props: RouteParams) {
  return withPermissions(
    ['workspaces.manage_members'],
    async (req, context) => {
      try {
        const params = await props.params;
        const workspaceId = params.id;
        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role) {
          return ApiResponse.badRequest('User ID and role are required');
        }

        if (!['Owner', 'Admin', 'Manager', 'Member', 'Viewer'].includes(role)) {
          return ApiResponse.badRequest('Invalid workspace role');
        }

        // Cannot update own role
        if (userId === context.user.uid) {
          return ApiResponse.badRequest('Cannot update your own role');
        }

        // Get workspace
        const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
        const workspaceDoc = await workspaceRef.get();

        if (!workspaceDoc.exists) {
          return ApiResponse.notFound('Workspace not found');
        }

        const workspaceData = workspaceDoc.data() as Workspace;

        // Verify organization access
        if (workspaceData.organizationId !== context.organizationId) {
          return ApiResponse.permissionDenied('Cannot update members in workspace from different organization');
        }

        // Find member to update
        const memberIndex = workspaceData.members?.findIndex(member => member.userId === userId);
        if (memberIndex === -1 || memberIndex === undefined) {
          return ApiResponse.notFound('Member not found in workspace');
        }

        const updatedMembers = [...(workspaceData.members || [])];
        const previousRole = updatedMembers[memberIndex].role;
        updatedMembers[memberIndex] = {
          ...updatedMembers[memberIndex],
          role: role as WorkspaceRole,
        };

        // Update workspace
        await workspaceRef.update({
          members: updatedMembers,
          updatedAt: new Date().toISOString(),
        });

        // Get user data for logging
        const userDoc = await adminDb.collection('users').doc(userId).get();
        const userData = userDoc.data() as User;

        // Log activity
        await adminDb.collection('activity_feed').add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          organizationId: context.organizationId,
          workspaceId,
          action: 'ROLE_CHANGED',
          entityType: 'user',
          entityId: userId,
          entityName: userData?.name || 'Unknown User',
          details: `${userData?.name || 'User'} role changed from ${previousRole} to ${role} in workspace "${workspaceData.name}"`,
          metadata: {
            changedBy: context.user.uid,
            previousRole,
            newRole: role,
          },
          timestamp: new Date().toISOString(),
        });

        logger.info('Workspace member role updated', {
          workspaceId,
          organizationId: context.organizationId,
          targetUserId: userId,
          updatedBy: context.user.uid,
          previousRole,
          newRole: role,
        });

        return ApiResponse.success({
          success: true,
          message: 'Member role updated successfully',
          member: {
            userId,
            name: userData?.name || 'Unknown User',
            previousRole,
            newRole: role,
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Workspace member role update failed: ${errorMsg}`, error);
        return ApiResponse.error('Failed to update member role', 'WORKSPACE_ERROR', 500);
      }
    }
  )(request, context);
}

/**
 * DELETE /api/workspaces/[id]/members
 * Remove member from workspace
 */
export async function DELETE(request: NextRequest, props: RouteParams) {
  return withPermissions(
    ['workspaces.manage_members'],
    async (req, context) => {
      try {
        const params = await props.params;
        const workspaceId = params.id;
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
          return ApiResponse.badRequest('User ID is required');
        }

        // Get workspace
        const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
        const workspaceDoc = await workspaceRef.get();

        if (!workspaceDoc.exists) {
          return ApiResponse.notFound('Workspace not found');
        }

        const workspaceData = workspaceDoc.data() as Workspace;

        // Verify organization access
        if (workspaceData.organizationId !== context.organizationId) {
          return ApiResponse.permissionDenied('Cannot remove members from workspace in different organization');
        }

        // Find member to remove
        const memberToRemove = workspaceData.members?.find(member => member.userId === userId);
        if (!memberToRemove) {
          return ApiResponse.notFound('Member not found in workspace');
        }

        // Cannot remove workspace owner unless you're org admin
        if (memberToRemove.role === 'Owner' && !['Owner', 'Admin'].includes(context.user.role)) {
          return ApiResponse.permissionDenied('Cannot remove workspace owner');
        }

        // Remove member from workspace
        const updatedMembers = workspaceData.members?.filter(member => member.userId !== userId) || [];
        await workspaceRef.update({
          members: updatedMembers,
          updatedAt: new Date().toISOString(),
        });

        // Update user's workspace list
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data() as User;
          const updatedWorkspaceIds = (userData.workspaceIds || []).filter(id => id !== workspaceId);
          
          await adminDb.collection('users').doc(userId).update({
            workspaceIds: updatedWorkspaceIds,
            // If this was their active workspace, reset to empty
            'preferences.activeWorkspaceId': userData.preferences?.activeWorkspaceId === workspaceId 
              ? (updatedWorkspaceIds[0] || '') 
              : userData.preferences?.activeWorkspaceId,
            updatedAt: new Date().toISOString(),
          });

          // Log activity
          await adminDb.collection('activity_feed').add({
            userId: context.user.uid,
            userName: context.user.profile.name,
            organizationId: context.organizationId,
            workspaceId,
            action: 'LEFT',
            entityType: 'user',
            entityId: userId,
            entityName: userData.name || 'Unknown User',
            details: `${userData.name || 'User'} was removed from workspace "${workspaceData.name}"`,
            metadata: {
              removedBy: context.user.uid,
              previousRole: memberToRemove.role,
            },
            timestamp: new Date().toISOString(),
          });
        }

        logger.info('Member removed from workspace', {
          workspaceId,
          organizationId: context.organizationId,
          removedUserId: userId,
          removedBy: context.user.uid,
          previousRole: memberToRemove.role,
        });

        return ApiResponse.success({
          success: true,
          message: 'Member removed from workspace successfully',
          removedMember: {
            userId,
            role: memberToRemove.role,
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Workspace member removal failed: ${errorMsg}`, error);
        return ApiResponse.error('Failed to remove member from workspace', 'WORKSPACE_ERROR', 500);
      }
    }
  )(request, context);
}