import { NextRequest, NextResponse } from 'next/server';
import { syncUserProfile } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, display_name, avatar_url } = body;

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing user id or email' }, { status: 400 });
    }

    const profile = await syncUserProfile({
      id,
      email,
      display_name: display_name || email.split('@')[0],
      avatar_url: avatar_url || null,
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'ACCOUNT_DELETED', message: 'This account was deleted by the administrator.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Sync failed' }, { status: 500 });
  }
}
