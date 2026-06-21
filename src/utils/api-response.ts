import { NextResponse } from 'next/server';

export class ApiResponse {
  /**
   * Generates a successful response containing data payload.
   */
  static success<T>(data: T, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status },
    );
  }

  /**
   * Generates an error response with dynamic HTTP code.
   */
  static error(message: string, code = 'INTERNAL_SERVER_ERROR', status = 500) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
        },
      },
      { status },
    );
  }

  /**
   * Generates a validation error (400 Bad Request) containing field-level failures.
   */
  static validationError(errors: Record<string, string[] | undefined>) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors,
        },
      },
      { status: 400 },
    );
  }
}
