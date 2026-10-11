import { NextRequest, NextResponse } from 'next/server';
import { getValidAdminSecrets, isAuthorizedAdminEmail } from '@/lib/admin/auth';

/**
 * Server-side Admin authentication endpoint.
 * Validates credentials strictly on the backend so zero passwords or secrets
 * are ever exposed in client-side JavaScript bundles or source files.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email ? String(body.email).trim().toLowerCase() : '';
    const password = body.password ? String(body.password).trim() : '';
    const secret = req.headers.get('x-admin-secret')?.trim() || password;

    const validSecrets = getValidAdminSecrets();

    // Case 1: Checking master password directly
    if (secret && validSecrets.some((s) => s.trim() === secret)) {
      return NextResponse.json(
        {
          success: true,
          authorized: true,
          message: 'Access granted: Master administrator authorization verified.',
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    // Case 2: Checking email + password combination
    if (email && isAuthorizedAdminEmail(email)) {
      if (password && validSecrets.some((s) => s.trim() === password)) {
        return NextResponse.json(
          {
            success: true,
            authorized: true,
            message: 'Access granted: Director authorization verified.',
          },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid clearance credentials. Access denied.',
      },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error' },
      { status: 500 }
    );
  }
}
