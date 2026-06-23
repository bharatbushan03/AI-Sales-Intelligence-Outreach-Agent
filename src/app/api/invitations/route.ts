import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/rbac';
import { invitationsRepository, organizationsRepository, workspacesRepository } from '@/lib/repositories';
import { sendInvitationEmail } from '@/lib/email-service';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';
import { Invitation } from '@/types/auth';

// Schema for creating invitations
const createInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  role: z.enum(['owner', 'admin', 'manager', 'sales_rep', 'viewer']),
  type: z.enum(['organization', 'workspace']).default('workspace'),
  message: z.string().optional(),
  expiresInDays: z.number().min(1).max(30).default(7)
});

// Schema for querying invitations
const queryInvitationsSchema = z.object({
  organizationId: z.string().optional(),
  workspaceId: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'declined', 'expired']).optional(),
  type: z.enum(['organization', 'workspace']).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val, 10), 50) : 20)
});

export async function POST(request: NextRequest) {
  return withAuth(async (req, { user }) => {
    try {
      const body = await request.json();
      const validatedData = createInvitationSchema.parse(body);

      const { email, organizationId, workspaceId, role, type, message, expiresInDays } = validatedData;

      // Check if user has permission to invite to this organization/workspace
      const hasPerm = hasPermission(user.role, 'users.invite' as any);

      if (!hasPerm) {
        return ApiResponse.forbidden('Insufficient permissions to send invitations');
      }

      // Check if organization and workspace exist
      const org = await organizationsRepository.get(organizationId);
      if (!org) {
        return ApiResponse.badRequest('Organization not found');
      }

      let wsName = '';
      if (workspaceId) {
        const ws = await workspacesRepository.get(workspaceId);
        if (ws) wsName = ws.name || workspaceId;
      }

      const id = `inv_${Date.now()}`;
      
      const invitation = {
        id,
        email,
        organizationId,
        workspaceId,
        role,
        type: type as any,
        invitedBy: user.uid,
        message,
        expiresInDays,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      // Create the invitation
      await invitationsRepository.add(invitation);

      // Send invitation email
      await sendInvitationEmail({
        email,
        invitation,
        inviterName: user.profile?.name || user.email || 'Team member',
        organizationName: org.name || 'Organization',
        workspaceName: wsName,
        message
      });

      logger.info('Invitation sent successfully', {
        invitationId: id,
        email,
        organizationId,
        workspaceId,
        invitedBy: user.uid
      });

      return ApiResponse.success(invitation, 201);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.validationError('Invalid request data', (error as any).errors);
      }

      logger.error('Failed to send invitation', { error, userId: user.uid });
      return ApiResponse.internalError('Failed to send invitation');
    }
  })(request);
}

export async function GET(request: NextRequest) {
  return withAuth(async (req, { user }) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = Object.fromEntries(searchParams.entries());
      const validatedQuery = queryInvitationsSchema.parse(query);

      const { organizationId, workspaceId, status, type, page, limit } = validatedQuery;

      // If querying specific org/workspace, check permissions
      if (organizationId || workspaceId) {
        const hasPerm = hasPermission(user.role, 'users.read' as any);

        if (!hasPerm) {
          return ApiResponse.forbidden('Insufficient permissions to view invitations');
        }
      }

      // Get invitations
      const filters: any[] = [];
      if (organizationId) filters.push({ field: 'organizationId', operator: '==', value: organizationId });
      if (workspaceId) filters.push({ field: 'workspaceId', operator: '==', value: workspaceId });
      if (status) filters.push({ field: 'status', operator: '==', value: status });
      if (type) filters.push({ field: 'type', operator: '==', value: type });
      
      const result = await invitationsRepository.list(filters);

      return ApiResponse.success(result);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return ApiResponse.validationError('Invalid query parameters', (error as any).errors);
      }

      logger.error('Failed to fetch invitations', { error, userId: user.uid });
      return ApiResponse.internalError('Failed to fetch invitations');
    }
  })(request);
}