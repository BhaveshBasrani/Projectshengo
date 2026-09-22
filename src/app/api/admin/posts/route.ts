import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllPostsAdmin, savePost, deletePost } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const posts = await getAllPostsAdmin();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, body: content } = body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return NextResponse.json({ error: 'Post title and body content are required' }, { status: 400 });
    }

    const saved = await savePost(body);
    return NextResponse.json({ success: true, post: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to save post' }, { status: 500 });
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
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const deleted = await deletePost(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete post' }, { status: 500 });
  }
}
