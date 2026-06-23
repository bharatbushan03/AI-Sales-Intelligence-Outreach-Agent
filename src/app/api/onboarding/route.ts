/**
 * User Onboarding API
 * Handles the complete user onboarding flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth-middleware';
import { ApiResponse, validateRequired, isValidEmail } from '@/utils/api-response';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { User, Organization, Workspace } from '@/types/auth';
import { DOCUMENT_TEMPLATES } from '@/lib/firestore-schema';
import { setCustomClaims } from '@/lib/auth-middleware';

interface OnboardingData {
  step: 'profile' | 'organization' | 'workspace' | 'complete';
  profileData?: {
    name: string;
    role: string;
    industry?: string;
    teamSize?: string;
  };
  organizationData?: {
    name: string;
    domain: string;
    industry?: string;
    size?: string;
  };
  workspaceData?: {
    name: string;
    description?: string;
    type?: string;
  };
  inviteEmails?: string[];
}

/**
 * POST /api/onboarding
 * Process onboarding step
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json() as OnboardingData;
    const { step, profileData, organizationData, workspaceData, inviteEmails } = body;

    if (!step) {
      return ApiResponse.badRequest('Onboarding step is required');
    }

    const userId = context.user.uid;
    const userRef = adminDb.collection('users').doc(userId);
    
    switch (step) {
      case 'profile':
        return await handleProfileStep(userRef, profileData!, userId);
      
      case 'organization':
        return await handleOrganizationStep(userRef, organizationData!, userId, context);
      
      case 'workspace':
        return await handleWorkspaceStep(userRef, workspaceData!, userId, context);
      
      case 'complete':
        return await handleCompleteStep(userRef, inviteEmails || [], userId, context);
      
      default:
        return ApiResponse.badRequest('Invalid onboarding step');
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Onboarding failed: ${errorMsg}`, error);
    return ApiResponse.error('Onboarding process failed', 'ONBOARDING_ERROR', 500);
  }
});

/**
 * GET /api/onboarding
 * Get current onboarding status
 */
export const GET = withAuth(async (request, context) => {
  try {
    const userId = context.user.uid;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return ApiResponse.success({
        currentStep: 'profile',
        completed: false,
        data: {},
      });
    }

    const userData = userDoc.data() as User;
    
    // Determine current onboarding step
    let currentStep: string = 'profile';
    let completed = false;

    if (userData.name && userData.role) {
      currentStep = 'organization';
      
      if (userData.organizationId) {
        // Check if organization exists
        const orgDoc = await adminDb.collection('organizations').doc(userData.organizationId).get();
        if (orgDoc.exists) {
          currentStep = 'workspace';
          
          // Check if user has any workspaces
          if (userData.workspaceIds && userData.workspaceIds.length > 0) {
            currentStep = 'complete';
            completed = true;
          }
        }
      }
    }

    return ApiResponse.success({
      currentStep,
      completed,
      data: {
        profile: {
          name: userData.name,
          role: userData.role,
          industry: userData.preferences?.industry,
          teamSize: userData.preferences?.teamSize,
        },
        organization: userData.organizationId ? {
          id: userData.organizationId,
        } : null,
        workspaces: userData.workspaceIds || [],
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Onboarding status check failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to get onboarding status', 'ONBOARDING_ERROR', 500);
  }
});

/**
 * Handle profile setup step
 */
async function handleProfileStep(
  userRef: any,
  profileData: OnboardingData['profileData'],
  userId: string
): Promise<NextResponse> {
  if (!profileData) {
    return ApiResponse.badRequest('Profile data is required');
  }

  const validation = validateRequired(profileData, ['name', 'role']);
  if (!validation.isValid) {
    return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`);
  }

  const { name, role, industry, teamSize } = profileData;

  if (name.length < 2 || name.length > 100) {
    return ApiResponse.badRequest('Name must be between 2 and 100 characters');
  }

  // Create or update user profile
  const userData = DOCUMENT_TEMPLATES.newUser({
    id: userId,
    name,
    email: '', // Will be populated from Firebase Auth
    role: 'Sales Rep', // Default role until organization is created
    organizationId: '',
    workspaceIds: [],
    preferences: {
      activeWorkspaceId: '',
      theme: 'dark',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notifications: {
        email: true,
        inApp: true,
        workflowUpdates: true,
        teamInvites: true,
        proposalUpdates: true,
        followupReminders: true,
      },
      industry,
      teamSize,
      roleTitle: role,
    },
    status: 'active',
  });

  // Get email from Firebase Auth
  const userRecord = await adminAuth.getUser(userId);
  userData.email = userRecord.email || '';

  await userRef.set(userData, { merge: true });

  logger.info('Onboarding profile step completed', {
    userId,
    name,
    role,
    industry,
    teamSize,
  });

  return ApiResponse.success({
    step: 'profile',
    completed: true,
    nextStep: 'organization',
    data: {
      profile: { name, role, industry, teamSize },
    },
  });
}

/**
 * Handle organization setup step
 */
async function handleOrganizationStep(
  userRef: any,
  organizationData: OnboardingData['organizationData'],
  userId: string,
  context: any
): Promise<NextResponse> {
  if (!organizationData) {
    return ApiResponse.badRequest('Organization data is required');
  }

  const validation = validateRequired(organizationData, ['name', 'domain']);
  if (!validation.isValid) {
    return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`);
  }

  const { name, domain, industry, size } = organizationData;

  if (!domain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
    return ApiResponse.badRequest('Invalid domain format');
  }

  // Check if domain is already taken
  const domainQuery = await adminDb
    .collection('organizations')
    .where('domain', '==', domain)
    .limit(1)
    .get();

  if (!domainQuery.empty) {
    return ApiResponse.conflict('Domain is already taken');
  }

  const orgId = `org_${Math.random().toString(36).substring(2, 11)}`;

  // Create organization
  const orgData = DOCUMENT_TEMPLATES.newOrganization({
    id: orgId,
    organizationId: orgId,
    name,
    domain,
    industry,
    size: size as "startup" | "small" | "medium" | "enterprise" | undefined,
    owner: userId,
  });

  await adminDb.collection('organizations').doc(orgId).set(orgData);

  // Update user to be organization owner
  await userRef.update({
    organizationId: orgId,
    role: 'Owner',
    updatedAt: new Date().toISOString(),
  });

  // Set custom claims for the user
  await setCustomClaims(userId, {
    role: 'Owner',
    organizationId: orgId,
    plan: 'Free',
  });

  logger.info('Onboarding organization step completed', {
    userId,
    organizationId: orgId,
    organizationName: name,
    domain,
  });

  return ApiResponse.success({
    step: 'organization',
    completed: true,
    nextStep: 'workspace',
    data: {
      organization: {
        id: orgId,
        name,
        domain,
        industry,
        size,
      },
    },
  });
}

/**
 * Handle workspace setup step
 */
async function handleWorkspaceStep(
  userRef: any,
  workspaceData: OnboardingData['workspaceData'],
  userId: string,
  context: any
): Promise<NextResponse> {
  if (!workspaceData) {
    return ApiResponse.badRequest('Workspace data is required');
  }

  if (!context.organizationId) {
    return ApiResponse.badRequest('Organization must be created first');
  }

  const { name = 'Sales Workspace', description, type = 'sales' } = workspaceData;

  if (name.length < 2 || name.length > 100) {
    return ApiResponse.badRequest('Workspace name must be between 2 and 100 characters');
  }

  const workspaceId = `ws_${Math.random().toString(36).substring(2, 11)}`;

  // Create default workspace
  const wsData = DOCUMENT_TEMPLATES.newWorkspace({
    id: workspaceId,
    organizationId: context.organizationId,
    name,
    description: description || 'Default workspace for B2B sales activities',
    type: type as "sales" | "marketing" | "customer_success" | "general" | undefined,
    createdBy: userId,
    settings: {
      isDefault: true,
      visibility: 'organization',
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
    members: [{
      userId,
      role: 'Owner',
      permissions: [],
      joinedAt: new Date().toISOString(),
    }],
  });

  await adminDb.collection('workspaces').doc(workspaceId).set(wsData);

  // Update user with workspace
  await userRef.update({
    workspaceIds: [workspaceId],
    'preferences.activeWorkspaceId': workspaceId,
    updatedAt: new Date().toISOString(),
  });

  // Update organization workspace count
  await adminDb.collection('organizations').doc(context.organizationId).update({
    'limits.currentWorkspaces': 1,
    updatedAt: new Date().toISOString(),
  });

  logger.info('Onboarding workspace step completed', {
    userId,
    organizationId: context.organizationId,
    workspaceId,
    workspaceName: name,
  });

  return ApiResponse.success({
    step: 'workspace',
    completed: true,
    nextStep: 'complete',
    data: {
      workspace: {
        id: workspaceId,
        name,
        description,
        type,
      },
    },
  });
}

/**
 * Handle completion step with optional team invitations
 */
async function handleCompleteStep(
  userRef: any,
  inviteEmails: string[],
  userId: string,
  context: any
): Promise<NextResponse> {
  const batch = adminDb.batch();

  // Process team invitations if provided
  const pendingInvitations = [];

  if (inviteEmails.length > 0) {
    for (const email of inviteEmails) {
      if (!isValidEmail(email)) {
        continue; // Skip invalid emails
      }

      // Check if user already exists in the organization
      const existingUserQuery = await adminDb
        .collection('users')
        .where('email', '==', email)
        .where('organizationId', '==', context.organizationId)
        .limit(1)
        .get();

      if (!existingUserQuery.empty) {
        continue; // Skip existing users
      }

      const inviteId = `inv_${Math.random().toString(36).substring(2, 11)}`;
      const token = `${inviteId}_${Math.random().toString(36).substring(2, 15)}`;
      
      const invitationData = {
        id: inviteId,
        organizationId: context.organizationId,
        email,
        role: 'Sales Rep',
        invitedBy: userId,
        invitedByName: context.user.profile.name,
        token,
        status: 'pending',
        message: 'Welcome to our sales team! Join us to collaborate on B2B sales intelligence.',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const inviteRef = adminDb.collection('invitations').doc(inviteId);
      batch.set(inviteRef, invitationData);
      
      pendingInvitations.push({
        email,
        inviteId,
        token,
      });
    }
  }

  // Log completion activity
  const activityRef = adminDb.collection('activity_feed').doc();
  batch.set(activityRef, {
    userId,
    userName: context.user.profile.name,
    organizationId: context.organizationId,
    action: 'ONBOARDING_COMPLETED',
    entityType: 'user',
    entityId: userId,
    entityName: context.user.profile.name,
    details: `Completed onboarding${pendingInvitations.length > 0 ? ` and invited ${pendingInvitations.length} team members` : ''}`,
    metadata: {
      invitedEmails: inviteEmails,
      invitationCount: pendingInvitations.length,
    },
    timestamp: new Date().toISOString(),
  });

  // Commit all changes
  await batch.commit();

  logger.info('Onboarding completed', {
    userId,
    organizationId: context.organizationId,
    invitationCount: pendingInvitations.length,
    invitedEmails: inviteEmails,
  });

  return ApiResponse.success({
    step: 'complete',
    completed: true,
    onboardingComplete: true,
    data: {
      invitations: pendingInvitations.map(inv => ({
        email: inv.email,
        status: 'pending',
        inviteId: inv.inviteId,
      })),
    },
    message: 'Onboarding completed successfully!',
  });
}