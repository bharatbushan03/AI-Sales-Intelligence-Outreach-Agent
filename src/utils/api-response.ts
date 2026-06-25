/**
 * API Response Utilities
 * Standardized response formatting for API endpoints
 */

import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'AUTH_ERROR'
  | 'SESSION_ERROR'
  | 'ONBOARDING_ERROR'
  | 'PERMISSION_DENIED'
  | 'RESOURCE_NOT_FOUND'
  | 'ORGANIZATION_ERROR'
  | 'WORKSPACE_ERROR'
  | 'INVITATION_ERROR'
  | 'NOTIFICATION_ERROR'
  | 'PLAN_LIMIT_EXCEEDED'
  | 'FETCH_ERROR'
  | 'RESEARCH_PIPELINE_ERROR'
  | 'PROPOSAL_PIPELINE_ERROR'
  | 'OUTREACH_PIPELINE_ERROR'
  | 'OPPORTUNITY_PIPELINE_ERROR';

interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
  requestId?: string;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}

interface PaginatedResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export class ApiResponse {
  /**
   * Create a successful API response
   */
  static success<T>(data: T, statusCode: number = 200, requestId?: string): NextResponse {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Create a paginated success response
   */
  static paginated<T>(
    items: T[],
    page: number,
    pageSize: number,
    total: number,
    statusCode: number = 200,
    requestId?: string,
  ): NextResponse {
    const totalPages = Math.ceil(total / pageSize);

    const data: PaginatedResponse<T> = {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };

    return this.success(data, statusCode, requestId);
  }

  /**
   * Create an error API response
   */
  static error(
    message: string,
    code: ApiErrorCode,
    statusCode: number,
    details?: any,
    requestId?: string,
  ): NextResponse {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Common error responses
   */
  static badRequest(message: string = 'Bad request', details?: any): NextResponse {
    return this.error(message, 'BAD_REQUEST', 400, details);
  }

  static unauthorized(message: string = 'Unauthorized', details?: any): NextResponse {
    return this.error(message, 'UNAUTHORIZED', 401, details);
  }

  static forbidden(message: string = 'Forbidden', details?: any): NextResponse {
    return this.error(message, 'FORBIDDEN', 403, details);
  }

  static notFound(message: string = 'Not found', details?: any): NextResponse {
    return this.error(message, 'NOT_FOUND', 404, details);
  }

  static conflict(message: string = 'Conflict', details?: any): NextResponse {
    return this.error(message, 'CONFLICT', 409, details);
  }

  static validationError(message: string, details?: any): NextResponse {
    return this.error(message, 'VALIDATION_ERROR', 422, details);
  }

  static rateLimited(message: string = 'Rate limit exceeded'): NextResponse {
    return this.error(message, 'RATE_LIMITED', 429);
  }

  static internalError(message: string = 'Internal server error', details?: any): NextResponse {
    return this.error(message, 'INTERNAL_ERROR', 500, details);
  }

  static serviceUnavailable(message: string = 'Service unavailable'): NextResponse {
    return this.error(message, 'SERVICE_UNAVAILABLE', 503);
  }

  /**
   * Business logic specific errors
   */
  static authError(message: string, details?: any): NextResponse {
    return this.error(message, 'AUTH_ERROR', 401, details);
  }

  static sessionError(message: string, details?: any): NextResponse {
    return this.error(message, 'SESSION_ERROR', 401, details);
  }

  static permissionDenied(message: string = 'Permission denied', details?: any): NextResponse {
    return this.error(message, 'PERMISSION_DENIED', 403, details);
  }

  static planLimitExceeded(message: string, details?: any): NextResponse {
    return this.error(message, 'PLAN_LIMIT_EXCEEDED', 403, details);
  }

  static organizationError(message: string, details?: any): NextResponse {
    return this.error(message, 'ORGANIZATION_ERROR', 400, details);
  }

  static workspaceError(message: string, details?: any): NextResponse {
    return this.error(message, 'WORKSPACE_ERROR', 400, details);
  }

  static invitationError(message: string, details?: any): NextResponse {
    return this.error(message, 'INVITATION_ERROR', 400, details);
  }
}

/**
 * Helper function to extract request ID from headers
 */
export function getRequestId(request: Request): string | undefined {
  return request.headers.get('x-request-id') || undefined;
}

/**
 * Helper function to validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[],
): {
  isValid: boolean;
  missing: string[];
} {
  const missing = fields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Helper function to validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to sanitize error messages for client
 */
export function sanitizeError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === 'production') {
      return 'An unexpected error occurred';
    }
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Middleware helper for consistent error handling
 */
export function withErrorHandling<T extends any[]>(handler: (...args: T) => Promise<NextResponse>) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);

      const message = sanitizeError(error);
      return ApiResponse.internalError(message);
    }
  };
}

/**
 * Type guards for API responses
 */
export function isApiSuccessResponse<T>(response: any): response is ApiSuccessResponse<T> {
  return response && response.success === true && 'data' in response;
}

export function isApiErrorResponse(response: any): response is ApiErrorResponse {
  return response && response.success === false && 'error' in response;
}

// Export types for use in other modules
export type { ApiSuccessResponse, ApiErrorResponse, PaginatedResponse };
