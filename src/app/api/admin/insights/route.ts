import { NextRequest, NextResponse } from 'next/server';
import { getVisitorLogsList, getTeamAccessLogsList } from '@/lib/data/store';
import { getValidAdminSecrets } from '@/lib/admin/auth';

/**
 * Visitor Insights & Team Access API.
 * Returns anonymized community activity logs and access attempts.
 * Protected by Team Passkey.
 */
export async function GET(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret')?.trim();
    const validSecrets = getValidAdminSecrets();

    if (!secret || !validSecrets.some((s) => s.trim() === secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid passkey required.' },
        { status: 401 }
      );
    }

    const visitors = await getVisitorLogsList();
    const accessLogs = await getTeamAccessLogsList();

    return NextResponse.json({
      success: true,
      visitors,
      accessLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve visitor insights' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret')?.trim();
    const validSecrets = getValidAdminSecrets();

    if (!secret || !validSecrets.some((s) => s.trim() === secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid passkey required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') || 'all';

    const { clearVisitorLogs, clearTeamAccessLogs } = await import('@/lib/data/store');

    if (target === 'visitors' || target === 'all') {
      await clearVisitorLogs();
    }
    if (target === 'access' || target === 'all') {
      await clearTeamAccessLogs();
    }

    return NextResponse.json({
      success: true,
      message: 'Waste log data cleared successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to clear activity data' },
      { status: 500 }
    );
  }
}
