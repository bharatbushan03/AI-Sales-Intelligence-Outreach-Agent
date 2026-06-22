/**
 * Organizations API
 * Handles organization creation, retrieval, updates, and management
 */

import { NextRequest } from 'next/server';
import { withAuth, withPermissions } from '@/lib/auth-middleware';
import { ApiResponse, validateRequired, isValidEmail } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import { logger } from '@/utils/logger';
import { Organization, User } from '@/types/auth';
import { DOCUMENT_TEMPLATES } from '@/lib/firestore-schema';
import { checkPlanLimits, PLAN_FEATURES } from '@/lib/rbac';

/**
 * GET /api/organizations
 * Get organization details
 */
export const GET = withAuth(async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('id') || context.organizationId;

    if (!orgId) {
      return ApiResponse.badRequest('Organization ID is required');
    }

    // Check access to requested organization
    if (orgId !== context.organizationId && context.user.role !== 'Owner') {
      return ApiResponse.permissionDenied('Cannot access other organizations');
    }

    const orgDoc = await adminDb.collection('organizations').doc(orgId).get();
    if (!orgDoc.exists) {
      return ApiResponse.notFound('Organization not found');
    }

    const orgData = { id: orgDoc.id, ...orgDoc.data() } as Organization;

    // Get member count
    const membersQuery = await adminDb
      .collection('users')
      .where('organizationId', '==', orgId)
      .where('status', '==', 'active')
      .count()
      .get();

    // Get workspace count
    const workspacesQuery = await adminDb
      .collection('workspaces')
      .where('organizationId', '==', orgId)
      .where('deleted', '==', false)
      .count()
      .get();

    const response = {
      ...orgData,
      stats: {
        memberCount: membersQuery.data().count,
        workspaceCount: workspacesQuery.data().count,
      },
      planFeatures: PLAN_FEATURES[orgData.plan],
    };

    logger.info('Organization retrieved', {
      organizationId: orgId,
      requestedBy: context.user.uid,
    });

    return ApiResponse.success(response);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Organization retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to retrieve organization', 'ORGANIZATION_ERROR', 500);
  }
});

/**
 * PUT /api/organizations
 * Update organization details
 */
export const PUT = withPermissions(
  ['organization.update'],
  async (request, context) => {
    try {
      const body = await request.json();
      const { name, domain, industry, size, settings, logo } = body;

      const orgId = context.organizationId;
      const orgRef = adminDb.collection('organizations').doc(orgId);

      // Validate required fields
      if (name && name.length < 2) {
        return ApiResponse.badRequest('Organization name must be at least 2 characters');
      }

      if (domain && !domain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
        return ApiResponse.badRequest('Invalid domain format');
      }

      // Check if domain is already taken by another organization
      if (domain) {
        const domainQuery = await adminDb
          .collection('organizations')
          .where('domain', '==', domain)
          .limit(1)
          .get();

        if (!domainQuery.empty && domainQuery.docs[0].id !== orgId) {
          return ApiResponse.conflict('Domain is already taken by another organization');
        }
      }

      const updateData: Partial<Organization> = {
        updatedAt: new Date().toISOString(),
      };

      if (name) updateData.name = name;
      if (domain) updateData.domain = domain;
      if (industry) updateData.industry = industry;
      if (size) updateData.size = size;
      if (logo) updateData.logo = logo;

      // Merge settings
      if (settings) {
        const orgDoc = await orgRef.get();
        const currentData = orgDoc.data();
        updateData.settings = {
          ...currentData?.settings,
          ...settings,
        };
      }

      await orgRef.update(updateData);

      // Log activity
      await adminDb.collection('activity_feed').add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        organizationId: orgId,
        action: 'UPDATED',
        entityType: 'organization',
        entityId: orgId,
        entityName: name || 'Organization',
        details: 'Organization settings updated',
        metadata: {
          updatedFields: Object.keys(updateData),
        },
        timestamp: new Date().toISOString(),
      });

      logger.info('Organization updated', {
        organizationId: orgId,
        updatedBy: context.user.uid,
        updatedFields: Object.keys(updateData),
      });

      return ApiResponse.success({
        success: true,
        message: 'Organization updated successfully',
        updated: updateData,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Organization update failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to update organization', 'ORGANIZATION_ERROR', 500);
    }
  }
);

/**
 * POST /api/organizations
 * Create a new organization (typically during onboarding)
 */
export const POST = withAuth(async (request, context) => {
  try {
    const body = await request.json();
    const { name, domain, industry, size } = body;

    // Validate required fields
    const validation = validateRequired(body, ['name', 'domain']);
    if (!validation.isValid) {
      return ApiResponse.badRequest(`Missing required fields: ${validation.missing.join(', ')}`);
    }

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

    // Only allow if user doesn't already belong to an organization
    if (context.user.organizationId) {
      return ApiResponse.conflict('User already belongs to an organization');
    }

    const orgId = `org_${Math.random().toString(36).substring(2, 11)}`;

    // Create organization
    const orgData = DOCUMENT_TEMPLATES.newOrganization({
      id: orgId,
      organizationId: orgId,
      name,
      domain,
      industry,
      size,
      owner: context.user.uid,
    });

    await adminDb.collection('organizations').doc(orgId).set(orgData);

    // Update user to belong to this organization
    await adminDb.collection('users').doc(context.user.uid).update({
      organizationId: orgId,
      role: 'Owner',
      updatedAt: new Date().toISOString(),
    });

    // Log activity
    await adminDb.collection('activity_feed').add({
      userId: context.user.uid,
      userName: context.user.profile.name,
      organizationId: orgId,
      action: 'CREATED',
      entityType: 'organization',
      entityId: orgId,
      entityName: name,
      details: `Organization "${name}" created`,
      metadata: {
        domain,
        industry,
        size,
      },
      timestamp: new Date().toISOString(),
    });

    logger.info('Organization created', {
      organizationId: orgId,
      createdBy: context.user.uid,
      name,
      domain,
    });

    return ApiResponse.success({
      organization: {
        id: orgId,
        name,
        domain,
        industry,
        size,
        owner: context.user.uid,
        plan: 'Free',
      },
      message: 'Organization created successfully',
    }, 201);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Organization creation failed: ${errorMsg}`, error);
    return ApiResponse.error('Failed to create organization', 'ORGANIZATION_ERROR', 500);
  }
});

/**
 * DELETE /api/organizations
 * Delete an organization (Owner only)
 */
export const DELETE = withPermissions(
  ['organization.delete'],
  async (request, context) => {
    try {
      const { searchParams } = new URL(request.url);
      const confirmDelete = searchParams.get('confirm') === 'true';

      if (!confirmDelete) {
        return ApiResponse.badRequest('Confirmation required to delete organization');
      }

      const orgId = context.organizationId;

      // Get organization data for validation
      const orgDoc = await adminDb.collection('organizations').doc(orgId).get();
      if (!orgDoc.exists) {
        return ApiResponse.notFound('Organization not found');
      }

      const orgData = orgDoc.data() as Organization;

      // Only organization owner can delete
      if (orgData.owner !== context.user.uid) {
        return ApiResponse.permissionDenied('Only organization owner can delete the organization');
      }

      // Check if organization has other members
      const membersQuery = await adminDb
        .collection('users')
        .where('organizationId', '==', orgId)
        .where('status', '==', 'active')
        .count()
        .get();

      if (membersQuery.data().count > 1) {
        return ApiResponse.conflict(
          'Cannot delete organization with active members. Remove all members first.'
        );
      }

      // Begin deletion process
      const batch = adminDb.batch();

      // Delete organization
      batch.delete(orgDoc.ref);

      // Update user to remove organization
      const userRef = adminDb.collection('users').doc(context.user.uid);
      batch.update(userRef, {
        organizationId: null,
        role: 'Viewer', // Reset to default role
        updatedAt: new Date().toISOString(),
      });

      // Delete all workspaces
      const workspacesQuery = await adminDb
        .collection('workspaces')
        .where('organizationId', '==', orgId)
        .get();

      workspacesQuery.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Commit all deletions
      await batch.commit();

      // Log activity (this will be the last activity for this org)
      await adminDb.collection('activity_feed').add({
        userId: context.user.uid,
        userName: context.user.profile.name,
        organizationId: orgId,
        action: 'DELETED',
        entityType: 'organization',
        entityId: orgId,
        entityName: orgData.name,
        details: 'Organization deleted',
        timestamp: new Date().toISOString(),
      });

      logger.info('Organization deleted', {
        organizationId: orgId,
        deletedBy: context.user.uid,
        organizationName: orgData.name,
      });

      return ApiResponse.success({
        success: true,
        message: 'Organization deleted successfully',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Organization deletion failed: ${errorMsg}`, error);
      return ApiResponse.error('Failed to delete organization', 'ORGANIZATION_ERROR', 500);
    }
  }
);