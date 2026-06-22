/**
 * Authentication and Authorization Middleware
 * Enforces RBAC and multi-tenancy across API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from './firebase-admin';
import { Role, Permission, User } from '../types/auth';
import { hasPermission, canAccessOrganization, canAccessWorkspace } from './rbac';
import { ApiResponse } from '../utils/api-response';
import { logger } from '../utils/logger';

export interface AuthenticatedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  role: Role;
  organizationId: string;
  workspaceIds: string[];
  permissions: Permission[];
  profile: User;
}

export interface AuthContext {
  user: AuthenticatedUser;
  organizationId: string;
  workspaceId?: string;
  sessionId?: string;
}

/**
 * Authenticate user from Firebase ID token
 */
export async function authenticateUser(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return { success: false, error: 'Missing or invalid authorization header' };
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return { success: false, error: 'Missing ID token' };
    }

    // Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user profile from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return { success: false, error: 'User profile not found' };
    }

    const userProfile = { id: userDoc.id, ...userDoc.data() } as User;
    
    // Check if user is active
    if (userProfile.status !== 'active') {
      return { success: false, error: 'User account is not active' };
    }

    // Get user permissions
    const permissions = hasPermission as any; // We'll implement this properly

    const authenticatedUser: AuthenticatedUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      emailVerified: decodedToken.email_verified || false,
      role: userProfile.role,
      organizationId: userProfile.organizationId,
      workspaceIds: userProfile.workspaceIds || [],
      permissions: [], // TODO: Calculate permissions based on role
      profile: userProfile,
    };

    logger.info('User authenticated successfully', {
      userId: authenticatedUser.uid,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      organizationId: authenticatedUser.organizationId,
    });

    return { success: true, user: authenticatedUser };
  } catch (error) {
    logger.error('Authentication failed', error);
    
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return { success: false, error: 'Token expired' };
      }
      if (error.message.includes('invalid')) {
        return { success: false, error: 'Invalid token' };
      }
    }
    
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Middleware factory for protecting API routes
 */
export function withAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>,
  options: {
    requiredRole?: Role;
    requiredPermissions?: Permission[];
    requireEmailVerification?: boolean;
    requireOrganizationAccess?: boolean;
    requireWorkspaceAccess?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Authenticate user
      const authResult = await authenticateUser(request);
      if (!authResult.success || !authResult.user) {
        return ApiResponse.unauthorized(authResult.error || 'Authentication required');
      }

      const user = authResult.user;

      // Check email verification if required
      if (options.requireEmailVerification && !user.emailVerified) {
        return ApiResponse.forbidden('Email verification required');
      }

      // Check role requirements
      if (options.requiredRole && user.role !== options.requiredRole) {
        const roleHierarchy = {
          'Owner': 5,
          'Admin': 4,
          'Manager': 3,
          'Sales Rep': 2,
          'Viewer': 1,
        };
        
        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[options.requiredRole] || 0;
        
        if (userLevel < requiredLevel) {
          return ApiResponse.permissionDenied(`Role '${options.requiredRole}' or higher required`);
        }
      }

      // Check permission requirements
      if (options.requiredPermissions?.length) {
        for (const permission of options.requiredPermissions) {
          if (!hasPermission(user.role, permission)) {
            return ApiResponse.permissionDenied(`Permission '${permission}' required`);
          }
        }
      }

      // Extract organization and workspace from request
      const url = new URL(request.url);
      let organizationId = user.organizationId;
      let workspaceId: string | undefined;

      // Try to get organization/workspace from URL path or query params
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const orgIndex = pathSegments.indexOf('organizations');
      const workspaceIndex = pathSegments.indexOf('workspaces');

      if (orgIndex !== -1 && pathSegments[orgIndex + 1]) {
        organizationId = pathSegments[orgIndex + 1];
      }
      
      if (workspaceIndex !== -1 && pathSegments[workspaceIndex + 1]) {
        workspaceId = pathSegments[workspaceIndex + 1];
      }

      // Fallback to query parameters
      organizationId = url.searchParams.get('organizationId') || organizationId;
      workspaceId = url.searchParams.get('workspaceId') || workspaceId;

      // Check organization access
      if (options.requireOrganizationAccess && organizationId) {
        if (!canAccessOrganization(user.organizationId, organizationId)) {
          return ApiResponse.permissionDenied('Organization access denied');
        }
      }

      // Check workspace access
      if (options.requireWorkspaceAccess && workspaceId) {
        if (!canAccessWorkspace(user.organizationId, user.workspaceIds, workspaceId, organizationId)) {
          return ApiResponse.permissionDenied('Workspace access denied');
        }
      }

      const authContext: AuthContext = {
        user,
        organizationId,
        workspaceId,
        sessionId: request.headers.get('x-session-id') || undefined,
      };

      // Call the actual handler
      return await handler(request, authContext);
    } catch (error) {
      logger.error('Auth middleware error', error);
      return ApiResponse.internalError('Authorization check failed');
    }
  };
}

/**
 * Role-based middleware factories
 */
export const withOwnerAuth = (handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: 'Owner', requireEmailVerification: true });

export const withAdminAuth = (handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: 'Admin', requireEmailVerification: true });

export const withManagerAuth = (handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>) =>
  withAuth(handler, { requiredRole: 'Manager', requireEmailVerification: true });

/**
 * Permission-based middleware factory
 */
export const withPermissions = (
  permissions: Permission[],
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) =>
  withAuth(handler, { requiredPermissions: permissions, requireEmailVerification: true });

/**
 * Organization-scoped middleware
 */
export const withOrganizationAuth = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) =>
  withAuth(handler, { 
    requireOrganizationAccess: true,
    requireEmailVerification: true,
  });

/**
 * Workspace-scoped middleware
 */
export const withWorkspaceAuth = (
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) =>
  withAuth(handler, { 
    requireOrganizationAccess: true,
    requireWorkspaceAccess: true,
    requireEmailVerification: true,
  });

/**
 * Custom claims middleware for Firebase tokens
 */
export async function setCustomClaims(
  userId: string,
  claims: {
    role?: Role;
    organizationId?: string;
    permissions?: Permission[];
    plan?: string;
  }
): Promise<void> {
  try {
    await adminAuth.setCustomUserClaims(userId, claims);
    logger.info('Custom claims updated', { userId, claims });
  } catch (error) {
    logger.error('Failed to set custom claims', error, { userId, claims });
    throw error;
  }
}

/**
 * Refresh user session and claims
 */
export async function refreshUserClaims(userId: string): Promise<void> {
  try {
    // Get latest user profile
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User profile not found');
    }

    const userProfile = userDoc.data() as User;
    
    // Update custom claims
    await setCustomClaims(userId, {
      role: userProfile.role,
      organizationId: userProfile.organizationId,
      plan: userProfile.organizationId ? 
        (await adminDb.collection('organizations').doc(userProfile.organizationId).get()).data()?.plan 
        : undefined,
    });

    logger.info('User claims refreshed', { userId });
  } catch (error) {
    logger.error('Failed to refresh user claims', error, { userId });
    throw error;
  }
}

/**
 * Rate limiting middleware
 */
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 60000,
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>
) {
  return withAuth(async (request: NextRequest, context: AuthContext): Promise<NextResponse> => {
    const key = `${context.user.uid}:${request.url}`;
    const now = Date.now();
    
    const userLimit = rateLimits.get(key);
    
    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= maxRequests) {
          return ApiResponse.rateLimited('Rate limit exceeded');
        }
        userLimit.count++;
      } else {
        // Reset window
        userLimit.count = 1;
        userLimit.resetTime = now + windowMs;
      }
    } else {
      // First request
      rateLimits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
    }

    return await handler(request, context);
  });
}

/**
 * Plan limits middleware
 */
export function withPlanLimits(
  handler: (request: NextRequest, context: AuthContext) => Promise<NextResponse>,
  options: {
    requiresFeature?: string;
    checkUsageLimits?: boolean;
  } = {}
) {
  return withAuth(async (request: NextRequest, context: AuthContext): Promise<NextResponse> => {
    try {
      // Get organization to check plan limits
      const orgDoc = await adminDb.collection('organizations').doc(context.organizationId).get();
      if (!orgDoc.exists) {
        return ApiResponse.organizationError('Organization not found');
      }

      const orgData = orgDoc.data();
      const plan = orgData?.plan || 'Free';

      // Check feature availability
      if (options.requiresFeature) {
        // This would check against plan features
        // For now, basic implementation
        const features = {
          Free: ['aiEnabled'],
          Pro: ['aiEnabled', 'advancedReporting', 'apiAccess'],
          Business: ['aiEnabled', 'advancedReporting', 'apiAccess', 'ssoEnabled', 'customBranding'],
          Enterprise: ['aiEnabled', 'advancedReporting', 'apiAccess', 'ssoEnabled', 'customBranding'],
        };

        if (!features[plan as keyof typeof features]?.includes(options.requiresFeature)) {
          return ApiResponse.planLimitExceeded(`Feature '${options.requiresFeature}' not available in ${plan} plan`);
        }
      }

      // Check usage limits
      if (options.checkUsageLimits && orgData?.limits) {
        // Example: Check workflow run limits
        if (orgData.limits.currentWorkflowRuns >= orgData.limits.maxWorkflowRuns) {
          return ApiResponse.planLimitExceeded('Workflow run limit exceeded');
        }
      }

      return await handler(request, context);
    } catch (error) {
      logger.error('Plan limits check failed', error);
      return ApiResponse.internalError('Plan limits check failed');
    }
  });
}