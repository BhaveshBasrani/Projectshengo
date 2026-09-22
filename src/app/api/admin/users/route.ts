import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllUsersAdmin, deleteUserAdmin } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Administrator Password Required' }, { status: 403 });
  }

  try {
    const users = await getAllUsersAdmin();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch registered members' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Administrator Password Required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const success = await deleteUserAdmin(id);
    return NextResponse.json({ success, message: success ? 'Member deleted successfully' : 'Member not found' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete member' }, { status: 500 });
  }
}
