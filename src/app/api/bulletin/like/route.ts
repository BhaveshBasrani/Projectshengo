import { NextRequest, NextResponse } from 'next/server';
import { toggleBulletinLike, toggleBulletinCommentLike } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { updateId, commentId, userId } = body;

    if (!updateId || !userId) {
      return NextResponse.json({ error: 'Missing bulletin ID or user ID' }, { status: 400 });
    }

    if (commentId) {
      const res = await toggleBulletinCommentLike(updateId, commentId, userId);
      return NextResponse.json(res);
    } else {
      const res = await toggleBulletinLike(updateId, userId);
      return NextResponse.json(res);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error processing like' }, { status: 500 });
  }
}
