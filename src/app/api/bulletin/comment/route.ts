import { NextRequest, NextResponse } from 'next/server';
import { addBulletinComment, deleteBulletinComment } from '@/lib/data/store';
import { isAuthorizedAdmin } from '@/lib/admin/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updateId, author_id, author_name, author_avatar, content, parent_id, reply_to_name } = body;

    if (!updateId || !content || !content.trim()) {
      return NextResponse.json({ error: 'Missing bulletin ID or comment text' }, { status: 400 });
    }

    const res = await addBulletinComment(updateId, {
      author_id: author_id || 'anon-' + Math.random().toString(36).substring(2, 7),
      author_name: author_name || 'Community Member',
      author_avatar: author_avatar || null,
      content: content.trim(),
      parent_id: parent_id || null,
      reply_to_name: reply_to_name || null,
    });

    if (!res.success) {
      return NextResponse.json({ error: 'Failed to post comment. This bulletin may be locked.' }, { status: 403 });
    }

    return NextResponse.json({ success: true, comment: res.comment, update: res.update });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error adding comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const updateId = searchParams.get('updateId');
    const commentId = searchParams.get('commentId');
    const requesterId = searchParams.get('requesterId');
    const isAdmin = isAuthorizedAdmin(req);

    if (!updateId || !commentId) {
      return NextResponse.json({ error: 'Missing updateId or commentId' }, { status: 400 });
    }

    const res = await deleteBulletinComment(updateId, commentId);
    if (!res.success) {
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 400 });
    }

    return NextResponse.json({ success: true, update: res.update });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error deleting comment' }, { status: 500 });
  }
}
