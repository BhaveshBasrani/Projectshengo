import { NextResponse } from 'next/server';
import { getPublishedUpdates } from '@/lib/data/store';

export async function GET() {
  try {
    const updates = await getPublishedUpdates();
    return NextResponse.json({ success: true, updates });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch updates' }, { status: 500 });
  }
}
