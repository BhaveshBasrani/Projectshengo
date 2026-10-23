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
    const bodySecret = body.secret ? String(body.secret).trim() : (body.passkey ? String(body.passkey).trim() : '');
    const headerSecret = req.headers.get('x-admin-secret')?.trim() || '';
    const secret = bodySecret || password || headerSecret;

    const validSecrets = getValidAdminSecrets();
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'Local';
    const anonymizedIp = clientIp.includes('.')
      ? clientIp.split('.').slice(0, 2).join('.') + '.x.x'
      : 'Local Client';

    // Case 1: Checking master password directly
    if (secret && validSecrets.some((s) => s.trim() === secret)) {
      await import('@/lib/data/store').then((m) =>
        m.recordTeamAccessAttempt('successful', anonymizedIp, 'Verified passkey')
      ).catch(() => {});

      return NextResponse.json(
        {
          success: true,
          authorized: true,
          message: 'Access granted.',
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
        await import('@/lib/data/store').then((m) =>
          m.recordTeamAccessAttempt('successful', anonymizedIp, `Verified passkey (${email})`)
        ).catch(() => {});

        return NextResponse.json(
          {
            success: true,
            authorized: true,
            message: 'Access granted.',
          },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
          }
        );
      }
    }

    // Unsuccessful attempt
    await import('@/lib/data/store').then((m) =>
      m.recordTeamAccessAttempt('unsuccessful', anonymizedIp, 'Incorrect passkey')
    ).catch(() => {});

    return NextResponse.json(
      {
        success: false,
        error: 'Incorrect passkey. Please try again.',
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
