/**
 * Token Refresh API
 * Handles ID token refresh and session validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';

/**
 * POST /api/auth/refresh
 * Refresh Firebase ID token and validate session
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken, idToken } = body;

    if (!refreshToken && !idToken) {
      return ApiResponse.error('Refresh token or ID token is required', 'BAD_REQUEST', 400);
    }

    let decodedToken;
    let userId;

    // If we have an ID token, verify it first
    if (idToken) {
      try {
        decodedToken = await adminAuth.verifyIdToken(idToken, false); // Don't check expiry
        userId = decodedToken.uid;
      } catch (error) {
        logger.warn('ID token verification failed, proceeding with refresh token');
      }
    }

    // In a real implementation, you would:
    // 1. Use Firebase Admin SDK to verify the refresh token
    // 2. Generate a new custom token if needed
    // 3. Return the new ID token

    // For now, we'll validate the token and return session info
    if (!decodedToken && idToken) {
      try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
        userId = decodedToken.uid;
      } catch (error) {
        return ApiResponse.error('Invalid token', 'UNAUTHORIZED', 401);
      }
    }

    if (!userId) {
      return ApiResponse.error('Unable to determine user from token', 'UNAUTHORIZED', 401);
    }

    // Get user record to ensure account is still active
    try {
      const userRecord = await adminAuth.getUser(userId);

      if (userRecord.disabled) {
        return ApiResponse.error('Account has been disabled', 'FORBIDDEN', 403);
      }

      // Generate custom claims if needed
      const customClaims: Record<string, any> = {};

      // You can add custom claims here based on user data
      // For example, organization ID, role, etc.

      logger.info('Token refresh successful', {
        userId,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
      });

      return ApiResponse.success({
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          displayName: userRecord.displayName,
          photoURL: userRecord.photoURL,
          disabled: userRecord.disabled,
          customClaims: userRecord.customClaims || {},
        },
        tokenInfo: decodedToken
          ? {
              exp: decodedToken.exp,
              iat: decodedToken.iat,
              iss: decodedToken.iss,
              aud: decodedToken.aud,
            }
          : null,
        refreshedAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to get user record during refresh', error);
      return ApiResponse.error('User not found', 'NOT_FOUND', 404);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Token refresh failed: ${errorMsg}`, error);
    return ApiResponse.error('Token refresh failed', 'AUTH_ERROR', 500);
  }
}

/**
 * GET /api/auth/refresh
 * Get current token status and expiry info
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return ApiResponse.error('Missing or invalid authorization header', 'UNAUTHORIZED', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken, false); // Don't check expiry

      const now = Math.floor(Date.now() / 1000);
      const timeToExpiry = decodedToken.exp - now;
      const isExpired = timeToExpiry <= 0;
      const isExpiringSoon = timeToExpiry <= 300; // 5 minutes

      return ApiResponse.success({
        tokenInfo: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          issuedAt: new Date(decodedToken.iat * 1000).toISOString(),
          expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
          issuer: decodedToken.iss,
          audience: decodedToken.aud,
        },
        status: {
          isExpired,
          isExpiringSoon,
          timeToExpiry,
          customClaims: decodedToken.firebase?.sign_in_provider
            ? {
                signInProvider: decodedToken.firebase.sign_in_provider,
                identities: decodedToken.firebase.identities,
              }
            : {},
        },
        refreshRecommended: isExpired || isExpiringSoon,
      });
    } catch (error) {
      logger.error('Token verification failed', error);
      return ApiResponse.error('Invalid token', 'UNAUTHORIZED', 401);
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Token status check failed: ${errorMsg}`, error);
    return ApiResponse.error('Token status check failed', 'AUTH_ERROR', 500);
  }
}
