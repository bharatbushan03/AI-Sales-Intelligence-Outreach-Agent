/**
 * Workspaces API
 * Handles workspace creation, retrieval, updates, and management
 */

import { NextRequest } from 'next/server';
import { withAuth, withPermissions } from '@/lib/auth-middleware';
import { ApiResponse, validateRequired } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Workspace, WorkspaceMember } from '@/types/auth';
import { DOCUMENT_TEMPLATES } from '@/lib/firestore-schema';
import { checkPlanLimits } from '@/lib/rbac';

/**
 * GET /api/workspaces
 * Get user's workspaces
 */
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || context.organizationId;
    const type = searchParams.get('type');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Verify access to organization
    if (organizationId !== context.organizationId && context.user.role !== 'Owner') {
      return ApiResponse.permissionDenied('Cannot access workspaces in other organizations');
    }

    let query = adminDb
      .collection('workspaces')
      .where('organizationId', '==', organizationId)
      .where('deleted', '==', false);

    if (type) {
      query = query.where('type', '==', type);
    }

    const workspacesSnapshot = await query.orderBy('createdAt', 'desc').get();
    
    const workspaces = await Promise.all(
      workspacesSnapshot.docs.map(async (doc) => {
        const data = { id: doc.id, ...doc.data() } as Workspace;
        
        // Check if user is member of this workspace
        const isMember = data.members?.some(member => member.userId === context.user.uid) || 
                        context.user.role === 'Owner' || 
                        context.user.role === 'Admin';

        const workspace = {
          id: data.id,
          name: data.name,
          description: data.description,
          type: data.type,
          organizationId: data.organizationId,
          createdBy: data.createdBy,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          settings: data.settings,
          memberCount: data.members?.length || 0,
          isMember,
          isDefault: data.settings?.isDefault || false,
        };

        // Add detailed stats if requested and user has access
        if (includeStats && isMember) {
          // Get workflow count
          const workflowsCount = await adminDb
            .collection('workflows')
            .where('workspaceId', '==', doc.id)
            .where('deleted', '==', false)
            .count()
            .get();

          // Get recent activity count
          const recentActivityCount = await adminDb
            .collection('activity_feed')
            .where('workspaceId', '==', doc.id)
            .where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .count()
            .get();

          return {
            ...workspace,
            stats: {
              workflowCount: workflowsCount.data().count,
              recentActivityCount: recentActivityCount.data().count,
              lastActivity: data.updatedAt,
            },
          };
        }

        return workspace;
      })
    );

    logger.info('Workspaces retrieved', {
      organizationId,
      requestedBy: context.user.uid,
      workspaceCount: workspaces.length,
      includeStats,
    });

    return ApiResponse.success({
      workspaces: workspaces.filter(ws => ws.isMember), // Only return workspaces user has access to
      total: workspaces.filter(ws => ws.isMember).length,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Workspace retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve workspaces', 'WORKSPACE_ERROR', 500);
  }
});

/**
 * POST /api/workspaces
 * Create a new workspace
 */
export const POST = withPermissions(
  ['workspaces.create'],
  async (request, context) => {
    try {
      const body = await request.json();
      const { name, description, type = 'sales', visibility = 'organization', isDefault = false } = body;

      // Validate required fields
      const validation = validateRequired(body, ['name']);
      if (!validation.isValid) {
        return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`);
      }

      if (name.length < 2 || name.length > 100) {
        return ApiResponse.badRequest('Workspace name must be between 2 and 100 characters');
      }

      if (!['sales', 'marketing', 'customer_success', 'general'].includes(type)) {
        return ApiResponse.badRequest('Invalid workspace type');
      }

      // Check plan limits
      const orgDoc = await adminDb.collection('organizations').doc(context.organizationId).get();
      const orgData = orgDoc.data();
      
      if (orgData?.limits) {
        if (!checkPlanLimits(orgData.plan, orgData.limits, 'add_workspace')) {
          return ApiResponse.planLimitExceeded('Workspace limit exceeded for current plan');
        }
      }

      // Check if workspace name already exists in organization
      const existingWorkspace = await adminDb
        .collection('workspaces')
        .where('organizationId', '==', context.organizationId)
        .where('name', '==', name)
        .where('deleted', '==', false)
        .limit(1)
        .get();

      if (!existingWorkspace.empty) {
        return ApiResponse.conflict('Workspace name already exists in this organization');
      }

      const workspaceId = `ws_${Math.random().toString(36).substring(2, 11)}`;

      // Create initial member list with creator
      const initialMembers: WorkspaceMember[] = [{
        userId: context.user.uid,
        role: 'Owner',
        permissions: [],
        joinedAt: new Date().toISOString(),
      }];

      // Create workspace
      const workspaceData = DOCUMENT_TEMPLATES.newWorkspace({
        id: workspaceId,
        organizationId: context.organizationId,
        name,
        description,
        type,
        createdBy: context.user.uid,
        settings: {
          isDefault,
          visibility,
          aiSettings: {
            model: 'gemini-pro',
            temperature: 0.7,
            enableAutoGeneration: true,
          },
          collaboration: {
            allowComments: true,
            allowSharing: true,
            requireApproval: false,
          },
        },
        members: initialMembers,
      });

      await adminDb.collection('workspaces').doc(workspaceId).set(workspaceData);

      // Update user's workspace list
      await adminDb.collection('users').doc(context.user.uid).update({
        workspaceIds: [...(context.user.workspaceIds || []), workspaceId],
        'preferences.activeWorkspaceId': workspaceId, // Set as active workspace
        updatedAt: new Date().toISOString(),
      });

      // Update organization workspace count
      if (orgData?.limits) {
        await adminDb.collection('organizations').doc(context.organizationId).update({
          'limits.currentWorkspaces': (orgData.limits.currentWorkspaces || 0) + 1,
          updatedAt: new Date().toISOString(),
        });
      }

      // Log activity
      await adminDb.collection('activity_feed').add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        organizationId: context.organizationId,
        workspaceId,
        action: 'CREATED',
        entityType: 'workspace',
        entityId: workspaceId,
        entityName: name,
        details: `Workspace "${name}" created`,
        metadata: {
          type,
          visibility,
          isDefault,
        },
        timestamp: new Date().toISOString(),
      });

      logger.info('Workspace created', {
        workspaceId,
        organizationId: context.organizationId,
        createdBy: context.user.uid,
        name,
        type,
      });

      return ApiResponse.success({
        workspace: {
          id: workspaceId,
          name,
          description,
          type,
          organizationId: context.organizationId,
          createdBy: context.user.uid,
          settings: workspaceData.settings,
          memberCount: 1,
        },
        message: 'Workspace created successfully',
      }, 201);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Workspace creation failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to create workspace', 'WORKSPACE_ERROR', 500);
    }
  }
);

/**
 * PUT /api/workspaces
 * Update workspace settings
 */
export const PUT = withPermissions(
  ['workspaces.update'],
  async (request, context) => {
    try {
      const body = await request.json();
      const { workspaceId, name, description, settings } = body;

      if (!workspaceId) {
        return ApiResponse.badRequest('Workspace ID is required');
      }

      const workspaceRef = adminDb.collection('workspaces').doc(workspaceId);
      const workspaceDoc = await workspaceRef.get();

      if (!workspaceDoc.exists) {
        return ApiResponse.notFound('Workspace not found');
      }

      const workspaceData = workspaceDoc.data() as Workspace;

      // Verify access
      if (workspaceData.organizationId !== context.organizationId) {
        return ApiResponse.permissionDenied('Cannot access workspace in different organization');
      }

      // Check if user has permission to update this workspace
      const isMember = workspaceData.members?.some(member => member.userId === context.user.uid);
      const isOrgAdmin = ['Owner', 'Admin'].includes(context.user.role);
      
      if (!isMember && !isOrgAdmin) {
        return ApiResponse.permissionDenied('Not authorized to update this workspace');
      }

      const updates: Partial<Workspace> = {
        updatedAt: new Date().toISOString(),
      };

      if (name && name !== workspaceData.name) {
        if (name.length < 2 || name.length > 100) {
          return ApiResponse.badRequest('Workspace name must be between 2 and 100 characters');
        }

        // Check if new name already exists
        const existingWorkspace = await adminDb
          .collection('workspaces')
          .where('organizationId', '==', context.organizationId)
          .where('name', '==', name)
          .where('deleted', '==', false)
          .limit(1)
          .get();

        if (!existingWorkspace.empty && existingWorkspace.docs[0].id !== workspaceId) {
          return ApiResponse.conflict('Workspace name already exists in this organization');
        }

        updates.name = name;
      }

      if (description !== undefined) {
        updates.description = description;
      }

      if (settings) {
        updates.settings = {
          ...workspaceData.settings,
          ...settings,
        };
      }

      await workspaceRef.update(updates);

      // Log activity
      await adminDb.collection('activity_feed').add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        organizationId: context.organizationId,
        workspaceId,
        action: 'UPDATED',
        entityType: 'workspace',
        entityId: workspaceId,
        entityName: name || workspaceData.name,
        details: `Workspace settings updated`,
        metadata: {
          updatedFields: Object.keys(updates),
        },
        timestamp: new Date().toISOString(),
      });

      logger.info('Workspace updated', {
        workspaceId,
        organizationId: context.organizationId,
        updatedBy: context.user.uid,
        updatedFields: Object.keys(updates),
      });

      return ApiResponse.success({
        success: true,
        message: 'Workspace updated successfully',
        updates,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Workspace update failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to update workspace', 'WORKSPACE_ERROR', 500);
    }
  }
);