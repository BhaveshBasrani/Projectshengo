import { NextRequest, NextResponse } from 'next/server';
import { saveUpdate } from '@/lib/data/store';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 4 bulletin posts per hour per IP
    const rateCheck = checkRateLimit(req, 4, 60 * 60 * 1000, 'bulletin');
    if (!rateCheck.success) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }

    const body = await req.json();
    const {
      title,
      category,
      content,
      image_url,
      card_style,
      author_name,
      author_id,
      link_url,
      link_text,
      is_banner,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Please add a headline for your note.' }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Please write a message to post on the board.' }, { status: 400 });
    }

    const payload = {
      body: content.trim(),
      image_url: image_url || null,
      card_style: card_style || 'zine',
      is_banner: Boolean(is_banner),
      link_url: link_url || null,
      link_text: link_text || null,
      author_name: author_name || 'Community Member',
      author_id: author_id || null,
      pinned: false,
      locked: false,
      likes: 0,
      liked_by: [],
      comments: [],
    };

    const newUpdate = await saveUpdate({
      title: title.trim(),
      category: category || 'Discussion',
      content: JSON.stringify(payload),
      status: 'published',
    });

    return NextResponse.json({ success: true, update: newUpdate });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error creating bulletin' }, { status: 500 });
  }
}
