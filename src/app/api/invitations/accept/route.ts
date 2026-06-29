/**
 * Accept Invitation API
 * Handles invitation acceptance for new and existing users
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { COLLECTIONS, DOCUMENT_TEMPLATES, getInvitationByToken } from '@/lib/firestore-schema';
import { User, Invitation } from '@/types/auth';
import { sendInvitationAcceptedNotification } from '@/lib/email-service';

const acceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  // For new users
  name: z.string().min(2).optional(),
  password: z.string().min(8).optional(),
  // For existing users
  userId: z.string().optional(),
});

/**
 * POST /api/invitations/accept
 * Accept an invitation and create/update user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, password, userId } = acceptInvitationSchema.parse(body);

    // Get and validate invitation
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      return ApiResponse.notFound('Invitation not found or invalid token');
    }

    if (invitation.status !== 'pending') {
      return ApiResponse.badRequest(`Invitation is ${invitation.status} and cannot be accepted`);
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return ApiResponse.badRequest('Invitation has expired');
    }

    const now = new Date().toISOString();
    let finalUserId: string;
    let isNewUser = false;

    // Check if user already exists with this email
    const existingUserSnapshot = await adminDb
      .collection(COLLECTIONS.USERS)
      .where('email', '==', invitation.email.toLowerCase())
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      // Existing user - update their organization/workspace access
      const userDoc = existingUserSnapshot.docs[0];
      finalUserId = userDoc.id;
      const userData = userDoc.data() as User;

      // Check if user is already in this organization
      if (userData.organizationId === invitation.organizationId) {
        return ApiResponse.conflict('User already belongs to this organization');
      }

      // For multi-org support in the future, you might want to handle this differently
      // For now, we'll prevent users from being in multiple organizations
      return ApiResponse.conflict(
        'User already belongs to another organization. Please contact support.',
      );
    } else {
      // New user - create Firebase Auth account and Firestore profile
      if (!name || !password) {
        return ApiResponse.badRequest('Name and password are required for new users');
      }

      isNewUser = true;

      try {
        // Create Firebase Auth user
        const userRecord = await adminAuth.createUser({
          email: invitation.email,
          password,
          displayName: name,
          emailVerified: true, // Auto-verify for invited users
        });

        finalUserId = userRecord.uid;

        // Create workspace membership
        const workspaceIds = invitation.workspaceIds || [];

        // Create user profile
        const userProfile = DOCUMENT_TEMPLATES.newUser({
          name,
          email: invitation.email,
          role: invitation.role,
          organizationId: invitation.organizationId,
          workspaceIds,
          status: 'active',
        });

        await adminDb.collection(COLLECTIONS.USERS).doc(finalUserId).set(userProfile);

        logger.info('New user created from invitation', {
          userId: finalUserId,
          email: invitation.email,
          organizationId: invitation.organizationId,
        });
      } catch (authError: any) {
        logger.error('Failed to create Firebase Auth user', authError);

        if (authError.code === 'auth/email-already-exists') {
          return ApiResponse.conflict('Email already in use');
        }

        return ApiResponse.internalError('Failed to create user account');
      }
    }

    // Add user to workspace members if workspaces specified
    if (invitation.workspaceIds && invitation.workspaceIds.length > 0) {
      for (const workspaceId of invitation.workspaceIds) {
        const workspaceRef = adminDb.collection(COLLECTIONS.WORKSPACES).doc(workspaceId);
        const workspaceDoc = await workspaceRef.get();

        if (workspaceDoc.exists) {
          const workspaceData = workspaceDoc.data();
          const members = workspaceData?.members || [];

          // Check if user is already a member
          const existingMember = members.find((m: any) => m.userId === finalUserId);

          if (!existingMember) {
            members.push({
              userId: finalUserId,
              role: invitation.workspaceRole || 'Member',
              permissions: [],
              joinedAt: now,
            });

            await workspaceRef.update({
              members,
              updatedAt: now,
            });
          }
        }
      }
    }

    // Update organization member count
    const orgRef = adminDb.collection(COLLECTIONS.ORGANIZATIONS).doc(invitation.organizationId);
    const orgDoc = await orgRef.get();

    if (orgDoc.exists) {
      const orgData = orgDoc.data();
      const currentUsers = orgData?.limits?.currentUsers || 0;

      await orgRef.update({
        'limits.currentUsers': currentUsers + 1,
        updatedAt: now,
      });
    }

    // Mark invitation as accepted
    await adminDb.collection(COLLECTIONS.INVITATIONS).doc(invitation.id).update({
      status: 'accepted',
      acceptedAt: now,
      updatedAt: now,
    });

    // Create notification for inviter
    await adminDb.collection(COLLECTIONS.NOTIFICATIONS).add({
      userId: invitation.invitedBy,
      organizationId: invitation.organizationId,
      type: 'team_invite',
      title: 'Invitation Accepted',
      message: `${name || invitation.email} accepted your invitation`,
      data: {
        invitationId: invitation.id,
        email: invitation.email,
        userId: finalUserId,
      },
      read: false,
      priority: 'medium',
      createdAt: now,
    });

    // Log activity
    await adminDb.collection(COLLECTIONS.ACTIVITY_FEED).add({
      userId: finalUserId,
      userName: name || invitation.email,
      organizationId: invitation.organizationId,
      action: 'JOINED',
      entityType: 'organization',
      entityId: invitation.organizationId,
      details: `${name || invitation.email} joined the organization`,
      metadata: {
        invitationId: invitation.id,
        role: invitation.role,
        isNewUser,
      },
      timestamp: now,
    });

    // Send notification email to inviter
    const inviterDoc = await adminDb.collection(COLLECTIONS.USERS).doc(invitation.invitedBy).get();
    if (inviterDoc.exists) {
      const inviterData = inviterDoc.data() as User;
      await sendInvitationAcceptedNotification({
        inviterEmail: inviterData.email,
        inviterName: inviterData.name,
        acceptedUserName: name || invitation.email,
        acceptedUserEmail: invitation.email,
        organizationName: orgDoc.data()?.name || 'Organization',
      });
    }

    logger.info('Invitation accepted successfully', {
      invitationId: invitation.id,
      userId: finalUserId,
      email: invitation.email,
      isNewUser,
    });

    return ApiResponse.success({
      message: 'Invitation accepted successfully',
      userId: finalUserId,
      isNewUser,
      organizationId: invitation.organizationId,
      workspaceIds: invitation.workspaceIds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return ApiResponse.validationError('Invalid request data', (error as any).errors);
    }

    logger.error('Failed to accept invitation', error);
    return ApiResponse.invitationError('Failed to accept invitation');
  }
}
