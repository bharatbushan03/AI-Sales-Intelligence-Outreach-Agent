/**
 * Validate Invitation API (Public)
 * Returns invitation details without authentication
 */

import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { getInvitationByToken } from '@/lib/firestore-schema';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS } from '@/lib/firestore-schema';

/**
 * GET /api/invitations/validate
 * Validate invitation token and return details (public endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return ApiResponse.badRequest('Token is required');
    }

    // Get invitation by token
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      return ApiResponse.notFound('Invitation not found or invalid');
    }

    if (invitation.status !== 'pending') {
      return ApiResponse.badRequest(`Invitation is ${invitation.status} and cannot be accepted`);
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return ApiResponse.badRequest('Invitation has expired');
    }

    // Get organization name
    const orgDoc = await adminDb
      .collection(COLLECTIONS.ORGANIZATIONS)
      .doc(invitation.organizationId)
      .get();
    const organizationName = orgDoc.exists ? orgDoc.data()?.name || 'Organization' : 'Organization';

    // Get workspace names if applicable
    let workspaceNames: string[] = [];
    if (invitation.workspaceIds && invitation.workspaceIds.length > 0) {
      const workspacePromises = invitation.workspaceIds.map((wsId) =>
        adminDb.collection(COLLECTIONS.WORKSPACES).doc(wsId).get(),
      );
      const workspaceDocs = await Promise.all(workspacePromises);
      workspaceNames = workspaceDocs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data()?.name || 'Workspace');
    }

    // Return safe invitation details (don't expose sensitive info)
    const invitationDetails = {
      email: invitation.email,
      organizationName,
      workspaceNames: workspaceNames.length > 0 ? workspaceNames : undefined,
      role: invitation.role,
      inviterName: invitation.invitedByName,
      message: invitation.message,
      expiresAt: invitation.expiresAt,
    };

    logger.info('Invitation validated', {
      email: invitation.email,
      organizationId: invitation.organizationId,
    });

    return ApiResponse.success(invitationDetails);
  } catch (error) {
    logger.error('Failed to validate invitation', error);
    return ApiResponse.invitationError('Failed to validate invitation');
  }
}
