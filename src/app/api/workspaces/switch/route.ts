/**
 * Workspace Switching API
 * Handles active workspace switching for users
 */

import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Workspace } from '@/types/auth';

/**
 * POST /api/workspaces/switch
 * Switch user's active workspace
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { workspaceId } = body;

    if (!workspaceId) {
      return ApiResponse.badRequest('Workspace ID is required');
    }

    // Get workspace to verify access
    const workspaceDoc = await adminDb.collection('workspaces').doc(workspaceId).get();
    if (!workspaceDoc.exists) {
      return ApiResponse.notFound('Workspace not found');
    }

    const workspaceData = workspaceDoc.data() as Workspace;

    // Verify workspace belongs to user's organization
    if (workspaceData.organizationId !== context.organizationId) {
      return ApiResponse.permissionDenied('Cannot switch to workspace in different organization');
    }

    // Check if user has access to this workspace
    const isMember = workspaceData.members?.some(member => member.userId === context.user.uid);
    const isOrgAdmin = ['Owner', 'Admin'].includes(context.user.role);

    if (!isMember && !isOrgAdmin) {
      return ApiResponse.permissionDenied('Not authorized to access this workspace');
    }

    // Update user's active workspace
    const userRef = adminDb.collection('users').doc(context.user.uid);
    await userRef.update({
      'preferences.activeWorkspaceId': workspaceId,
      updatedAt: new Date().toISOString(),
    });

    // Log activity
    await adminDb.collection('activity_feed').add({
      userId: context.user.uid,
      userName: context.user.profile.name,
      organizationId: context.organizationId,
      workspaceId,
      action: 'WORKSPACE_SWITCHED',
      entityType: 'workspace',
      entityId: workspaceId,
      entityName: workspaceData.name,
      details: `Switched to workspace "${workspaceData.name}"`,
      timestamp: new Date().toISOString(),
    });

    logger.info('Workspace switched', {
      userId: context.user.uid,
      organizationId: context.organizationId,
      workspaceId,
      workspaceName: workspaceData.name,
    });

    return ApiResponse.success({
      success: true,
      message: `Switched to workspace "${workspaceData.name}"`,
      workspace: {
        id: workspaceId,
        name: workspaceData.name,
        type: workspaceData.type,
        description: workspaceData.description,
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Workspace switching failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to switch workspace', 'WORKSPACE_ERROR', 500);
  }
});

/**
 * GET /api/workspaces/switch
 * Get user's current active workspace
 */
export const GET = withAuth(async (request, context) => {
  try {
    const activeWorkspaceId = context.user.profile.preferences?.activeWorkspaceId;

    if (!activeWorkspaceId) {
      return ApiResponse.success({
        activeWorkspace: null,
        message: 'No active workspace set',
      });
    }

    // Get active workspace details
    const workspaceDoc = await adminDb.collection('workspaces').doc(activeWorkspaceId).get();
    
    if (!workspaceDoc.exists) {
      // Clear invalid active workspace
      await adminDb.collection('users').doc(context.user.uid).update({
        'preferences.activeWorkspaceId': '',
        updatedAt: new Date().toISOString(),
      });

      return ApiResponse.success({
        activeWorkspace: null,
        message: 'Active workspace no longer exists',
      });
    }

    const workspaceData = workspaceDoc.data() as Workspace;

    // Verify user still has access
    const isMember = workspaceData.members?.some(member => member.userId === context.user.uid);
    const isOrgAdmin = ['Owner', 'Admin'].includes(context.user.role);

    if (!isMember && !isOrgAdmin) {
      // Clear inaccessible active workspace
      await adminDb.collection('users').doc(context.user.uid).update({
        'preferences.activeWorkspaceId': '',
        updatedAt: new Date().toISOString(),
      });

      return ApiResponse.success({
        activeWorkspace: null,
        message: 'No longer have access to active workspace',
      });
    }

    const activeWorkspace = {
      id: workspaceDoc.id,
      name: workspaceData.name,
      type: workspaceData.type,
      description: workspaceData.description,
      organizationId: workspaceData.organizationId,
      memberCount: workspaceData.members?.length || 0,
      isDefault: workspaceData.settings?.isDefault || false,
    };

    logger.info('Active workspace retrieved', {
      userId: context.user.uid,
      organizationId: context.organizationId,
      workspaceId: activeWorkspaceId,
      workspaceName: workspaceData.name,
    });

    return ApiResponse.success({
      activeWorkspace,
      message: 'Active workspace retrieved successfully',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Active workspace retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve active workspace', 'WORKSPACE_ERROR', 500);
  }
});

/**
 * DELETE /api/workspaces/switch
 * Clear user's active workspace (set to none)
 */
export const DELETE = withAuth(async (request, context) => {
  try {
    // Clear active workspace
    await adminDb.collection('users').doc(context.user.uid).update({
      'preferences.activeWorkspaceId': '',
      updatedAt: new Date().toISOString(),
    });

    logger.info('Active workspace cleared', {
      userId: context.user.uid,
      organizationId: context.organizationId,
    });

    return ApiResponse.success({
      success: true,
      message: 'Active workspace cleared',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Active workspace clearing failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to clear active workspace', 'WORKSPACE_ERROR', 500);
  }
});