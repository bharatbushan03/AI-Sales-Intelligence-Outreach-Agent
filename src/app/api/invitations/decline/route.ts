/**
 * Decline Invitation API
 * Handles invitation decline
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { adminDb } from '@/lib/firebase-admin';
import { COLLECTIONS, getInvitationByToken } from '@/lib/firestore-schema';

const declineInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * POST /api/invitations/decline
 * Decline an invitation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = declineInvitationSchema.parse(body);

    // Get and validate invitation
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      return ApiResponse.notFound('Invitation not found or invalid token');
    }

    if (invitation.status !== 'pending') {
      return ApiResponse.badRequest(`Invitation is ${invitation.status} and cannot be declined`);
    }

    const now = new Date().toISOString();

    // Update invitation status to declined
    await adminDb
      .collection(COLLECTIONS.INVITATIONS)
      .doc(invitation.id)
      .update({
        status: 'declined' as any, // Type assertion since our Invitation type doesn't include 'declined'
        updatedAt: now,
      });

    // Create notification for inviter
    await adminDb.collection(COLLECTIONS.NOTIFICATIONS).add({
      userId: invitation.invitedBy,
      organizationId: invitation.organizationId,
      type: 'team_invite',
      title: 'Invitation Declined',
      message: `${invitation.email} declined your invitation`,
      data: {
        invitationId: invitation.id,
        email: invitation.email,
      },
      read: false,
      priority: 'low',
      createdAt: now,
    });

    // Log activity
    await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
      userId: invitation.invitedBy,
      userName: invitation.invitedByName,
      organizationId: invitation.organizationId,
      action: 'UPDATED',
      entityType: 'invitation',
      entityId: invitation.id,
      entityName: invitation.email,
      details: `Invitation to ${invitation.email} was declined`,
      metadata: {
        action: 'declined',
      },
      timestamp: now,
    });

    logger.info('Invitation declined', {
      invitationId: invitation.id,
      email: invitation.email,
    });

    return ApiResponse.success({
      message: 'Invitation declined successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.validationError('Invalid request data', (error as any).errors);
    }

    logger.error('Failed to decline invitation', error);
    return ApiResponse.invitationError('Failed to decline invitation');
  }
}
