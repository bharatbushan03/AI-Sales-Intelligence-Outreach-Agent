/**
 * Individual Invitation API
 * Handles GET, PATCH, and DELETE for specific invitations
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/auth-middleware';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore-schema';
import { Invitation } from '@/types/auth';
import { sendInvitationEmail } from '@/lib/email-service';
import { organizationsRepository, workspacesRepository } from '@/lib/repositories';
import crypto from 'crypto';

const updateInvitationSchema = z.object({
  action: z.enum(['resend', 'revoke']),
});

/**
 * GET /api/invitations/[id]
 * Retrieve specific invitation details
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(async (req, context) => {
    try {
      const { id } = params;

      const invitationDoc = await adminDb.collection(COLLECTIONS.INVITATIONS).doc(id).get();

      if (!invitationDoc.exists) {
        return ApiResponse.notFound('Invitation not found');
      }

      const invitation = { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;

      // Check permission - user must be from same organization or be the inviter
      if (
        invitation.organizationId !== context.organizationId &&
        invitation.invitedBy !== context.user.uid
      ) {
        return ApiResponse.permissionDenied('Cannot access this invitation');
      }

      logger.info('Invitation retrieved', {
        invitationId: id,
        requestedBy: context.user.uid,
      });

      return ApiResponse.success(invitation);
    } catch (error) {
      logger.error('Failed to retrieve invitation', error, { userId: context.user.uid });
      return ApiResponse.invitationError('Failed to retrieve invitation');
    }
  })(request);
}

/**
 * PATCH /api/invitations/[id]
 * Update invitation - resend or revoke
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(async (req, context) => {
    try {
      const { id } = params;
      const body = await request.json();
      const { action } = updateInvitationSchema.parse(body);

      const invitationRef = adminDb.collection(COLLECTIONS.INVITATIONS).doc(id);
      const invitationDoc = await invitationRef.get();

      if (!invitationDoc.exists) {
        return ApiResponse.notFound('Invitation not found');
      }

      const invitation = { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;

      // Check permission - must be inviter or admin/owner
      const canModify =
        invitation.invitedBy === context.user.uid ||
        context.user.role === 'Owner' ||
        context.user.role === 'Admin';

      if (!canModify) {
        return ApiResponse.permissionDenied('Only the inviter or admin can modify this invitation');
      }

      if (action === 'resend') {
        // Can only resend pending invitations
        if (invitation.status !== 'pending') {
          return ApiResponse.badRequest('Can only resend pending invitations');
        }

        // Check if expired and generate new token if needed
        const now = new Date();
        const expiresAt = new Date(invitation.expiresAt);
        let updatedInvitation = invitation;

        if (expiresAt < now) {
          // Generate new token and extend expiry
          const newToken = crypto.randomBytes(32).toString('hex');
          const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

          await invitationRef.update({
            token: newToken,
            expiresAt: newExpiresAt.toISOString(),
            updatedAt: now.toISOString(),
          });

          updatedInvitation = {
            ...invitation,
            token: newToken,
            expiresAt: newExpiresAt.toISOString(),
          };
        }

        // Get organization details for email
        const org = await organizationsRepository.get(invitation.organizationId);
        const orgName = org?.name || 'Organization';

        // Get workspace names if applicable
        let workspaceNames: string[] = [];
        if (invitation.workspaceIds && invitation.workspaceIds.length > 0) {
          const workspacePromises = invitation.workspaceIds.map((wsId) =>
            workspacesRepository.get(wsId),
          );
          const workspaces = await Promise.all(workspacePromises);
          workspaceNames = workspaces.filter((ws) => ws).map((ws) => ws!.name || 'Workspace');
        }

        // Resend email
        await sendInvitationEmail({
          email: invitation.email,
          invitation: updatedInvitation,
          inviterName: context.user.profile.name,
          organizationName: orgName,
          workspaceName: workspaceNames.length > 0 ? workspaceNames.join(', ') : undefined,
          message: invitation.message,
        });

        // Log activity
        await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          userAvatar: context.user.profile.avatar,
          organizationId: invitation.organizationId,
          action: 'UPDATED',
          entityType: 'invitation',
          entityId: invitation.id,
          entityName: invitation.email,
          details: `Resent invitation to ${invitation.email}`,
          metadata: { action: 'resend' },
          timestamp: now.toISOString(),
        });

        logger.info('Invitation resent', {
          invitationId: id,
          email: invitation.email,
          resentBy: context.user.uid,
        });

        return ApiResponse.success({
          message: 'Invitation resent successfully',
          invitation: updatedInvitation,
        });
      }

      if (action === 'revoke') {
        // Can only revoke pending invitations
        if (invitation.status !== 'pending') {
          return ApiResponse.badRequest('Can only revoke pending invitations');
        }

        await invitationRef.update({
          status: 'revoked',
          updatedAt: new Date().toISOString(),
        });

        // Log activity
        await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
          userId: context.user.uid,
          userName: context.user.profile.name,
          userAvatar: context.user.profile.avatar,
          organizationId: invitation.organizationId,
          action: 'UPDATED',
          entityType: 'invitation',
          entityId: invitation.id,
          entityName: invitation.email,
          details: `Revoked invitation for ${invitation.email}`,
          metadata: { action: 'revoke' },
          timestamp: new Date().toISOString(),
        });

        logger.info('Invitation revoked', {
          invitationId: id,
          email: invitation.email,
          revokedBy: context.user.uid,
        });

        return ApiResponse.success({
          message: 'Invitation revoked successfully',
        });
      }

      return ApiResponse.badRequest('Invalid action');
    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.validationError('Invalid request data', error.errors);
      }

      logger.error('Failed to update invitation', error, { userId: context.user.uid });
      return ApiResponse.invitationError('Failed to update invitation');
    }
  })(request);
}

/**
 * DELETE /api/invitations/[id]
 * Delete invitation (inviter or admin only)
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(async (req, context) => {
    try {
      const { id } = params;

      const invitationRef = adminDb.collection(COLLECTIONS.INVITATIONS).doc(id);
      const invitationDoc = await invitationRef.get();

      if (!invitationDoc.exists) {
        return ApiResponse.notFound('Invitation not found');
      }

      const invitation = { id: invitationDoc.id, ...invitationDoc.data() } as Invitation;

      // Check permission - must be inviter or admin/owner
      const canDelete =
        invitation.invitedBy === context.user.uid ||
        context.user.role === 'Owner' ||
        context.user.role === 'Admin';

      if (!canDelete) {
        return ApiResponse.permissionDenied('Only the inviter or admin can delete this invitation');
      }

      await invitationRef.delete();

      // Log activity
      await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        userAvatar: context.user.profile.avatar,
        organizationId: invitation.organizationId,
        action: 'DELETED',
        entityType: 'invitation',
        entityId: invitation.id,
        entityName: invitation.email,
        details: `Deleted invitation for ${invitation.email}`,
        timestamp: new Date().toISOString(),
      });

      logger.info('Invitation deleted', {
        invitationId: id,
        email: invitation.email,
        deletedBy: context.user.uid,
      });

      return ApiResponse.success({
        message: 'Invitation deleted successfully',
      });
    } catch (error) {
      logger.error('Failed to delete invitation', error, { userId: context.user.uid });
      return ApiResponse.invitationError('Failed to delete invitation');
    }
  })(request);
}
