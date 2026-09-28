import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import {
  toggleBulletinPin,
  toggleBulletinLock,
  toggleBulletinBanner,
  deleteUpdate,
  getAllUpdatesAdmin,
} from '@/lib/data/store';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Admin password required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { updateId, action } = body;

    if (!updateId || !action) {
      return NextResponse.json({ error: 'Missing updateId or action' }, { status: 400 });
    }

    if (action === 'pin') {
      const res = await toggleBulletinPin(updateId);
      const updates = await getAllUpdatesAdmin();
      return NextResponse.json({ success: true, ...res, updates });
    }

    if (action === 'lock') {
      const res = await toggleBulletinLock(updateId);
      const updates = await getAllUpdatesAdmin();
      return NextResponse.json({ success: true, ...res, updates });
    }

    if (action === 'toggle_banner') {
      const res = await toggleBulletinBanner(updateId);
      const updates = await getAllUpdatesAdmin();
      return NextResponse.json({ success: true, ...res, updates });
    }

    if (action === 'delete') {
      const success = await deleteUpdate(updateId);
      const updates = await getAllUpdatesAdmin();
      return NextResponse.json({ success, updates });
    }

    return NextResponse.json({ error: 'Unknown moderation action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Moderation error' }, { status: 500 });
  }
}
