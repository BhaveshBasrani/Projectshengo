import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPosts, getPostBySlug, likeBlogPost } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await getPostBySlug(slug);
      if (!post || post.status !== 'published') {
        return NextResponse.json({ error: 'Post not found or unpublished' }, { status: 404 });
      }
      const resSingle = NextResponse.json({ success: true, post });
      resSingle.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return resSingle;
    }

    const posts = await getPublishedPosts();
    const response = NextResponse.json({ success: true, posts });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (action === 'like' && id) {
      const result = await likeBlogPost(id);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update post' }, { status: 500 });
  }
}
