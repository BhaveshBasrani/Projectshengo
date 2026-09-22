import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllUpdatesAdmin, saveUpdate, deleteUpdate } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const updates = await getAllUpdatesAdmin();
    return NextResponse.json({ success: true, updates });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch updates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const saved = await saveUpdate(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, update: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const deleted = await deleteUpdate(id);
    revalidatePath('/');
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Delete failed' }, { status: 500 });
  }
}
