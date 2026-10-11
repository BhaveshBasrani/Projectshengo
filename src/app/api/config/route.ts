import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data/store';

export async function GET() {
  try {
    const config = await getSiteConfig();
    // Strictly strip all internal sensitive keys from public configuration
    const { admin_master_password, ...publicConfig } = config as any;
    return NextResponse.json(
      { success: true, config: publicConfig },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch config' }, { status: 500 });
  }
}
