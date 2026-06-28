/**
 * Invitations API
 * Handles invitation creation and listing
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/rbac';
import { createInvitation, getInvitations, validateInvitationLimits } from '@/lib/firestore-schema';
import { organizationsRepository, workspacesRepository } from '@/lib/repositories';
import { sendInvitationEmail } from '@/lib/email-service';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore-schema';

// Schema for creating invitations
const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  organizationId: z.string().optional(),
  workspaceIds: z.array(z.string()).optional(),
  role: z.enum(['Owner', 'Admin', 'Manager', 'Sales Rep', 'Viewer']),
  workspaceRole: z.enum(['Owner', 'Admin', 'Manager', 'Member', 'Viewer']).optional(),
  message: z.string().max(500).optional(),
  expiryDays: z.number().min(1).max(30).optional().default(7),
});

// Schema for querying invitations
const queryInvitationsSchema = z.object({
  organizationId: z.string().optional(),
  workspaceId: z.string().optional(),
  email: z.string().email().optional(),
  status: z.enum(['pending', 'accepted', 'expired', 'revoked']).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(parseInt(val, 10), 50) : 20)),
});

/**
 * POST /api/invitations
 * Create a new invitation
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const validatedData = createInvitationSchema.parse(body);

    const { email, organizationId, workspaceIds, role, workspaceRole, message, expiryDays } =
      validatedData;

    // Use user's organization if not specified
    const targetOrgId = organizationId || context.organizationId;

    // Check if user has permission to invite
    if (!hasPermission(context.user.role, 'users.invite')) {
      return ApiResponse.permissionDenied('You do not have permission to send invitations');
    }

    // Validate invitation limits
    const validation = await validateInvitationLimits(targetOrgId, email);
    if (!validation.allowed) {
      return ApiResponse.planLimitExceeded(validation.reason || 'Cannot send invitation');
    }

    // Get organization details
    const org = await organizationsRepository.get(targetOrgId);
    if (!org) {
      return ApiResponse.organizationError('Organization not found');
    }

    // Get workspace names if provided
    let workspaceNames: string[] = [];
    if (workspaceIds && workspaceIds.length > 0) {
      const workspacePromises = workspaceIds.map((id) => workspacesRepository.get(id));
      const workspaces = await Promise.all(workspacePromises);
      workspaceNames = workspaces.filter((ws) => ws).map((ws) => ws!.name || 'Workspace');
    }

    // Create invitation
    const invitation = await createInvitation({
      organizationId: targetOrgId,
      workspaceIds,
      email,
      role,
      workspaceRole,
      invitedBy: context.user.uid,
      invitedByName: context.user.profile.name,
      message,
      expiryDays,
    });

    // Send invitation email
    await sendInvitationEmail({
      email,
      invitation,
      inviterName: context.user.profile.name,
      organizationName: org.name || 'Organization',
      workspaceName: workspaceNames.length > 0 ? workspaceNames.join(', ') : undefined,
      message,
    });

    // Log activity
    await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
      userId: context.user.uid,
      userName: context.user.profile.name,
      userAvatar: context.user.profile.avatar,
      organizationId: targetOrgId,
      action: 'INVITED',
      entityType: 'invitation',
      entityId: invitation.id,
      entityName: email,
      details: `Invited ${email} to join as ${role}`,
      metadata: {
        email,
        role,
        workspaceIds,
      },
      timestamp: new Date().toISOString(),
    });

    logger.info('Invitation created successfully', {
      invitationId: invitation.id,
      email,
      organizationId: targetOrgId,
      invitedBy: context.user.uid,
    });

    return ApiResponse.success(invitation, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.validationError('Invalid request data', error.errors);
    }

    logger.error('Failed to create invitation', error, { userId: context.user.uid });
    return ApiResponse.invitationError('Failed to create invitation');
  }
});

/**
 * GET /api/invitations
 * List invitations with optional filters
 */
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const validatedQuery = queryInvitationsSchema.parse(query);

    const { organizationId, workspaceId, email, status, page, pageSize } = validatedQuery;

    // Use user's organization if not specified
    const targetOrgId = organizationId || context.organizationId;

    // Check if user has permission to view invitations
    if (!hasPermission(context.user.role, 'users.read')) {
      return ApiResponse.permissionDenied('You do not have permission to view invitations');
    }

    // Ensure user can only see invitations from their organization
    if (targetOrgId !== context.organizationId && context.user.role !== 'Owner') {
      return ApiResponse.permissionDenied('Cannot view invitations from other organizations');
    }

    // Get invitations
    const result = await getInvitations({
      organizationId: targetOrgId,
      workspaceId,
      email,
      status,
      page,
      pageSize,
    });

    logger.info('Invitations retrieved', {
      organizationId: targetOrgId,
      count: result.invitations.length,
      requestedBy: context.user.uid,
    });

    return ApiResponse.paginated(
      result.invitations,
      result.page,
      result.pageSize,
      result.total,
      200,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.validationError('Invalid query parameters', error.errors);
    }

    logger.error('Failed to fetch invitations', error, { userId: context.user.uid });
    return ApiResponse.invitationError('Failed to fetch invitations');
  }
});
