import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import {
  usersRepository,
  organizationsRepository,
  workspacesRepository,
  activityFeedRepository,
} from '@/lib/repositories';
import { logger } from '@/utils/logger';

/**
 * POST /api/auth
 * Handles user onboarding, profile setup, organization creation, and default workspace provisioning.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, companyName, role, industry, teamSize } = body;

    if (!userId || !name || !email || !companyName) {
      return ApiResponse.error('Missing required onboarding properties.', 'BAD_REQUEST', 400);
    }

    const orgId = `org_${Math.random().toString(36).substring(2, 11)}`;
    const wsId = `ws_${Math.random().toString(36).substring(2, 11)}`;

    const domain = email.split('@')[1] || 'domain.com';

    // 1. Create Organization
    await organizationsRepository.create(orgId, {
      organizationId: orgId,
      name: companyName,
      domain,
      owner: userId,
      createdAt: new Date().toISOString(),
      plan: 'Free',
      settings: {
        branding: 'dark',
        security: { mfa: false },
      },
    });

    // 2. Create Default Workspace
    await workspacesRepository.create(wsId, {
      id: wsId,
      organizationId: orgId,
      name: 'Sales Workspace',
      description: 'Default sales workspace for B2B outbound activities.',
      createdAt: new Date().toISOString(),
      createdBy: userId,
    });

    // 3. Create User Profile
    await usersRepository.create(userId, {
      id: userId,
      name,
      email,
      role: 'Owner', // First user (creator) is the Owner
      organizationId: orgId,
      preferences: {
        activeWorkspaceId: wsId,
        industry,
        teamSize,
        roleTitle: role,
      },
      activityMetrics: {
        workflowsRun: 0,
        proposalsCreated: 0,
      },
      createdAt: new Date().toISOString(),
    });

    // 4. Log to Activity Feed
    await activityFeedRepository.create(`act_${Math.random().toString(36).substring(2, 11)}`, {
      userId,
      userName: name,
      organizationId: orgId,
      workspaceId: wsId,
      action: 'ONBOARDING_COMPLETED',
      details: `Registered organization "${companyName}" and created default workspace.`,
      timestamp: new Date().toISOString(),
    });

    return ApiResponse.success(
      {
        success: true,
        organizationId: orgId,
        workspaceId: wsId,
      },
      201,
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Onboarding creation failed: ${errorMsg}`, error);
    return ApiResponse.error(`Onboarding failed: ${errorMsg}`, 'ONBOARDING_ERROR', 500);
  }
}
