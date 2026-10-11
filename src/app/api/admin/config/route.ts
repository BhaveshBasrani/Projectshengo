import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getSiteConfig, updateSiteConfig } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const config = await getSiteConfig();
    const { admin_master_password, ...safeConfig } = config as any;
    return NextResponse.json({ success: true, config: safeConfig });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await updateSiteConfig(body);
    return NextResponse.json({ success: true, config: updated, message: 'Configuration successfully updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update config' }, { status: 500 });
  }
}
