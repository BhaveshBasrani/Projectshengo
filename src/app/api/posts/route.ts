import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, getPostBySlug } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await getPostBySlug(slug);
      if (!post || post.status !== 'published') {
        return NextResponse.json({ error: 'Post not found or unpublished' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post });
    }

    const posts = await getPublishedPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch posts' }, { status: 500 });
  }
}
