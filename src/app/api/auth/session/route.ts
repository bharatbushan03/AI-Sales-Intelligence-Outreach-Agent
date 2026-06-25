/**
 * Session Management API
 * Handles session creation, validation, and cleanup
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { ApiResponse } from '@/utils/api-response';
import { logger } from '@/utils/logger';

/**
 * GET /api/auth/session
 * Get current session information
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return ApiResponse.error('Missing or invalid authorization header', 'UNAUTHORIZED', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Get user sessions
    const sessionsQuery = await adminDb
      .collection('sessions')
      .where('userId', '==', decodedToken.uid)
      .where('revoked', '==', false)
      .orderBy('lastActiveAt', 'desc')
      .limit(10)
      .get();

    const sessions = sessionsQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ApiResponse.success({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      },
      sessions,
      tokenExpiry: new Date(decodedToken.exp * 1000).toISOString(),
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Session retrieval failed: ${errorMsg}`, error);
    return ApiResponse.error('Session retrieval failed', 'SESSION_ERROR', 500);
  }
}

/**
 * POST /api/auth/session
 * Create a new session record
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return ApiResponse.error('Missing or invalid authorization header', 'UNAUTHORIZED', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const body = await req.json();
    const { deviceInfo, organizationId } = body;

    // Get client IP and user agent
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Create session record
    const sessionData = {
      userId: decodedToken.uid,
      organizationId: organizationId || '',
      deviceInfo: {
        userAgent: deviceInfo?.userAgent || userAgent,
        ip,
        location: deviceInfo?.location || '', // Would be set by IP geolocation service
      },
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      revoked: false,
    };

    const sessionRef = await adminDb.collection('sessions').add(sessionData);

    logger.info('Session created', {
      userId: decodedToken.uid,
      sessionId: sessionRef.id,
      ip,
      userAgent: userAgent.substring(0, 50) + '...',
    });

    return ApiResponse.success(
      {
        sessionId: sessionRef.id,
        expiresAt: sessionData.expiresAt,
      },
      201,
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Session creation failed: ${errorMsg}`, error);
    return ApiResponse.error('Session creation failed', 'SESSION_ERROR', 500);
  }
}

/**
 * PUT /api/auth/session
 * Update session activity
 */
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return ApiResponse.error('Missing or invalid authorization header', 'UNAUTHORIZED', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return ApiResponse.error('Session ID is required', 'BAD_REQUEST', 400);
    }

    // Update session last activity
    const sessionRef = adminDb.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return ApiResponse.error('Session not found', 'NOT_FOUND', 404);
    }

    const sessionData = sessionDoc.data();
    if (sessionData?.userId !== decodedToken.uid) {
      return ApiResponse.error('Unauthorized session access', 'UNAUTHORIZED', 401);
    }

    await sessionRef.update({
      lastActiveAt: new Date().toISOString(),
    });

    // Also update user activity metrics
    const userRef = adminDb.collection('users').doc(decodedToken.uid);
    await userRef.update({
      'activityMetrics.lastActiveAt': new Date().toISOString(),
      'activityMetrics.sessionCount': (sessionData?.sessionCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    return ApiResponse.success({ success: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Session update failed: ${errorMsg}`, error);
    return ApiResponse.error('Session update failed', 'SESSION_ERROR', 500);
  }
}

/**
 * DELETE /api/auth/session
 * Revoke a session
 */
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return ApiResponse.error('Missing or invalid authorization header', 'UNAUTHORIZED', 401);
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const allSessions = searchParams.get('all') === 'true';

    if (allSessions) {
      // Revoke all sessions for the user
      const sessionsQuery = await adminDb
        .collection('sessions')
        .where('userId', '==', decodedToken.uid)
        .where('revoked', '==', false)
        .get();

      const batch = adminDb.batch();
      sessionsQuery.docs.forEach((doc) => {
        batch.update(doc.ref, {
          revoked: true,
          revokedAt: new Date().toISOString(),
        });
      });

      await batch.commit();

      logger.info('All sessions revoked', { userId: decodedToken.uid });

      return ApiResponse.success({
        success: true,
        revokedCount: sessionsQuery.docs.length,
      });
    }

    if (!sessionId) {
      return ApiResponse.error('Session ID is required', 'BAD_REQUEST', 400);
    }

    // Revoke specific session
    const sessionRef = adminDb.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      return ApiResponse.error('Session not found', 'NOT_FOUND', 404);
    }

    const sessionData = sessionDoc.data();
    if (sessionData?.userId !== decodedToken.uid) {
      return ApiResponse.error('Unauthorized session access', 'UNAUTHORIZED', 401);
    }

    await sessionRef.update({
      revoked: true,
      revokedAt: new Date().toISOString(),
    });

    logger.info('Session revoked', { userId: decodedToken.uid, sessionId });

    return ApiResponse.success({ success: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`Session revocation failed: ${errorMsg}`, error);
    return ApiResponse.error('Session revocation failed', 'SESSION_ERROR', 500);
  }
}
