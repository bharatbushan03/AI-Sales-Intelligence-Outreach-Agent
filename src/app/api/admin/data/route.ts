import { NextRequest } from 'next/server';
import { ApiResponse } from '@/utils/api-response';
import { adminDb } from '@/lib/firebase-admin';
import {
  workflowsRepository,
  workflowStepsRepository,
  usersRepository,
  organizationsRepository,
  leadsRepository,
  opportunityReportsRepository,
  outreachCampaignsRepository,
  proposalsRepository,
} from '@/lib/repositories';
import { AuditTrailService, AuditActor } from '@/lib/audit-trail';
import { EventStoreService } from '@/lib/event-store';
import { VersionControlService } from '@/lib/version-control';
import { logger } from '@/utils/logger';

/**
 * GET /api/admin/data
 * Administrative query interface for inspecting data architectures.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const orgFilter = searchParams.get('organizationId');
    const docId = searchParams.get('documentId');
    const collectionName = searchParams.get('collectionName');

    const userId = req.headers.get('x-user-id') || 'mock-user-123';
    const userDoc = await usersRepository.get(userId);
    const userOrgId = userDoc?.organizationId || 'org_default';
    const userRole = userDoc?.role || 'Sales Rep';

    // RBAC check: Only Manager or Admin can view admin console data.
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return ApiResponse.error('Unauthorized. Insufficient permissions.', 'FORBIDDEN', 403);
    }

    // Tenant Scoping check: Admins can query any org; Managers are limited to their own org.
    const finalOrgId = userRole === 'Admin' ? orgFilter || userOrgId : userOrgId;

    if (type === 'versions' && collectionName && docId) {
      const versions = await VersionControlService.getVersions(collectionName, docId);
      return ApiResponse.success({ versions });
    }

    if (type === 'soft_deleted') {
      // Find soft deleted items across primary collections for this tenant
      const collections = [
        'workflows',
        'leads',
        'opportunity_reports',
        'outreach_campaigns',
        'proposals',
      ];
      const softDeletedList: any[] = [];

      for (const col of collections) {
        let query = adminDb.collection(col).where('deleted', '==', true);
        if (userRole !== 'Admin' || finalOrgId) {
          query = query.where('organizationId', '==', finalOrgId);
        }
        const snap = await query.get();
        snap.docs.forEach((doc) => {
          softDeletedList.push({
            id: doc.id,
            collectionName: col,
            ...doc.data(),
          });
        });
      }

      return ApiResponse.success({ softDeletedList });
    }

    // Default or 'all' type: Fetch overview tables
    const workflowsLimit = 50;
    const limit = 100;

    const [workflows, steps, auditLogs, events, orgs, users] = await Promise.all([
      workflowsRepository.list(undefined, 'createdAt', 'desc', workflowsLimit, finalOrgId),
      workflowStepsRepository.list(undefined, 'createdAt', 'desc', limit, finalOrgId),
      AuditTrailService.listForOrg(finalOrgId, limit),
      EventStoreService.listForOrg(finalOrgId, limit),
      userRole === 'Admin'
        ? organizationsRepository.list()
        : organizationsRepository.get(finalOrgId).then((o) => (o ? [o] : [])),
      userRole === 'Admin'
        ? usersRepository.list()
        : usersRepository.list([{ field: 'organizationId', operator: '==', value: finalOrgId }]),
    ]);

    return ApiResponse.success({
      workflows,
      steps,
      auditLogs,
      events,
      organizations: orgs,
      users,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Admin GET API failed: ${errorMsg}`, error);
    return ApiResponse.error(
      `Failed to fetch administrative data: ${errorMsg}`,
      'INTERNAL_ERROR',
      500,
    );
  }
}

/**
 * POST /api/admin/data
 * Handle administrative write, restoration, rollback, role assignment, and retention purges.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    const userId = req.headers.get('x-user-id') || 'mock-user-123';
    const userDoc = await usersRepository.get(userId);
    const userOrgId = userDoc?.organizationId || 'org_default';
    const userRole = userDoc?.role || 'Sales Rep';
    const userEmail = userDoc?.email || `${userId}@example.com`;

    // Strict checks: Admin/Manager role requirements
    if (userRole !== 'Admin' && userRole !== 'Manager') {
      return ApiResponse.error('Unauthorized. Admin or Manager role required.', 'FORBIDDEN', 403);
    }

    const actor: AuditActor = {
      uid: userId,
      email: userEmail,
      role: userRole,
    };

    if (action === 'RESTORE') {
      const { collection, id } = body;
      if (!collection || !id) {
        return ApiResponse.error('Missing collection name or document ID.', 'BAD_REQUEST', 400);
      }

      // Check tenant isolation: verify manager can only restore items belonging to their organization
      const docSnap = await adminDb.collection(collection).doc(id).get();
      if (!docSnap.exists) {
        return ApiResponse.error(
          `Document ${id} in ${collection} does not exist.`,
          'NOT_FOUND',
          404,
        );
      }
      const data = docSnap.data();
      if (userRole !== 'Admin' && data?.organizationId !== userOrgId) {
        return ApiResponse.error('Cross-tenant action forbidden.', 'FORBIDDEN', 403);
      }

      // Restore document
      await adminDb.collection(collection).doc(id).update({
        deleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
      });

      // Write audit trail entry
      await AuditTrailService.log({
        organizationId: data?.organizationId || userOrgId,
        actor,
        action: 'RESTORE',
        entityType: collection,
        entityId: id,
        metadata: { info: 'Restored from soft delete state' },
      });

      return ApiResponse.success({ message: `Successfully restored ${id} from ${collection}.` });
    }

    if (action === 'ROLLBACK') {
      const { collection, id, version } = body;
      if (!collection || !id || typeof version !== 'number') {
        return ApiResponse.error(
          'Missing collection name, document ID, or version index.',
          'BAD_REQUEST',
          400,
        );
      }

      // Check tenant isolation
      const docSnap = await adminDb.collection(collection).doc(id).get();
      if (!docSnap.exists) {
        return ApiResponse.error(
          `Document ${id} in ${collection} does not exist.`,
          'NOT_FOUND',
          404,
        );
      }
      const data = docSnap.data();
      if (userRole !== 'Admin' && data?.organizationId !== userOrgId) {
        return ApiResponse.error('Cross-tenant action forbidden.', 'FORBIDDEN', 403);
      }

      // Rollback document state
      const rolledBack = await VersionControlService.rollback(collection, id, version, userEmail);

      // Audit rollback
      await AuditTrailService.log({
        organizationId: data?.organizationId || userOrgId,
        actor,
        action: 'ROLLBACK',
        entityType: collection,
        entityId: id,
        metadata: { targetVersion: version },
      });

      return ApiResponse.success({
        message: `Successfully rolled back ${id} to version ${version}.`,
        data: rolledBack,
      });
    }

    if (action === 'PURGE') {
      // Purge action requires Admin role (Managers cannot run global retention cleanses)
      if (userRole !== 'Admin') {
        return ApiResponse.error(
          'Unauthorized. Only Admins can trigger data retention purges.',
          'FORBIDDEN',
          403,
        );
      }

      const retentionDays = Number(body.retentionDays);
      if (isNaN(retentionDays) || retentionDays < 0) {
        return ApiResponse.error('Invalid retentionDays configuration value.', 'BAD_REQUEST', 400);
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      const cutoffStr = cutoffDate.toISOString();

      let purgedWorkflows = 0;
      let purgedAudits = 0;

      // 1. Purge older workflows
      const workflowSnap = await adminDb
        .collection('workflows')
        .where('createdAt', '<', cutoffStr)
        .get();

      const batch1 = adminDb.batch();
      workflowSnap.docs.forEach((doc) => {
        batch1.delete(doc.ref);
        purgedWorkflows++;
      });
      if (purgedWorkflows > 0) await batch1.commit();

      // 2. Purge older audit logs
      const auditSnap = await adminDb
        .collection('audit_logs')
        .where('timestamp', '<', cutoffStr)
        .get();

      const batch2 = adminDb.batch();
      auditSnap.docs.forEach((doc) => {
        batch2.delete(doc.ref);
        purgedAudits++;
      });
      if (purgedAudits > 0) await batch2.commit();

      // Log the purge event itself in audit logs
      await AuditTrailService.log({
        organizationId: userOrgId,
        actor,
        action: 'RETENTION_PURGE',
        entityType: 'system',
        entityId: 'retention_scheduler',
        metadata: {
          retentionDays,
          cutoffStr,
          purgedWorkflowsCount: purgedWorkflows,
          purgedAuditsCount: purgedAudits,
        },
      });

      return ApiResponse.success({
        message: 'Retention policy purge executed successfully.',
        purgedWorkflows,
        purgedAudits,
      });
    }

    if (action === 'CREATE_ORGANIZATION') {
      if (userRole !== 'Admin') {
        return ApiResponse.error(
          'Unauthorized. Only Admins can register organizations.',
          'FORBIDDEN',
          403,
        );
      }

      const { name, id } = body;
      if (!name || !id) {
        return ApiResponse.error('Missing organization name or id.', 'BAD_REQUEST', 400);
      }

      await organizationsRepository.create(id, { name });

      // Audit organization creation
      await AuditTrailService.log({
        organizationId: id,
        actor,
        action: 'CREATE_ORGANIZATION',
        entityType: 'organizations',
        entityId: id,
        metadata: { name },
      });

      return ApiResponse.success({
        message: `Organization ${name} (${id}) registered successfully.`,
      });
    }

    if (action === 'UPDATE_USER_ROLE') {
      if (userRole !== 'Admin') {
        return ApiResponse.error('Unauthorized. Only Admins can update roles.', 'FORBIDDEN', 403);
      }

      const { targetUserId, role, organizationId } = body;
      if (!targetUserId || !role) {
        return ApiResponse.error('Missing targetUserId or role.', 'BAD_REQUEST', 400);
      }

      const updateData: any = { role };
      if (organizationId) {
        updateData.organizationId = organizationId;
      }

      await usersRepository.create(targetUserId, updateData);

      // Audit user role update
      await AuditTrailService.log({
        organizationId: organizationId || userOrgId,
        actor,
        action: 'UPDATE_USER_ROLE',
        entityType: 'users',
        entityId: targetUserId,
        metadata: { updateData },
      });

      return ApiResponse.success({
        message: `Successfully updated user ${targetUserId} properties.`,
      });
    }

    return ApiResponse.error('Invalid action requested.', 'BAD_REQUEST', 400);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Admin POST API failed: ${errorMsg}`, error);
    return ApiResponse.error(`Action execution failed: ${errorMsg}`, 'INTERNAL_ERROR', 500);
  }
}
