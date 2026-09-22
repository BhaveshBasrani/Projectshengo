import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAdminStats } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin statistics' }, { status: 500 });
  }
}
