import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/data/store';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch config' }, { status: 500 });
  }
}
