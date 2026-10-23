import { NextRequest, NextResponse } from 'next/server';
import { getPublicReviews, submitReview, getAllReviewsAdmin, likeReview } from '@/lib/data/store';
import { notifyAdminEvent } from '@/lib/email/google-apps-script';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const sort = (searchParams.get('sort') as 'likes' | 'rating' | 'newest') || 'likes';

    // If userId provided, return the user's submitted reviews for their private dashboard
    if (userId) {
      const all = await getAllReviewsAdmin();
      const userReviews = all.filter((r) => r.user_id === userId);
      return NextResponse.json({ success: true, reviews: userReviews });
    }

    // Public request: strictly approved reviews only with sorting
    const reviews = await getPublicReviews(sort);
    const response = NextResponse.json({ success: true, reviews });
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to load reviews at this time.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action } = body;
    if (action === 'like' && id) {
      const result = await likeReview(id);
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Unable to update review at this time.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: max 4 reviews per hour per IP
    const rateCheck = checkRateLimit(req, 4, 60 * 60 * 1000, 'review');
    if (!rateCheck.success) {
      return NextResponse.json({ error: rateCheck.message }, { status: 429 });
    }

    const body = await req.json();
    const { display_name, role_or_relation, rating, review_text, user_id } = body;

    // Validation
    if (!display_name || !display_name.trim()) {
      return NextResponse.json({ error: 'Please share your name with us.' }, { status: 400 });
    }
    if (!review_text || review_text.trim().length < 10) {
      return NextResponse.json({ error: 'Please write a brief note (at least 10 characters).' }, { status: 400 });
    }
    const numericRating = Number(rating) || 5;
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Please provide a rating between 1 and 5 stars.' }, { status: 400 });
    }

    // Submit review (strictly status: pending)
    const newReview = await submitReview({
      display_name: display_name.trim(),
      role_or_relation: role_or_relation?.trim() || 'Community Member',
      rating: numericRating,
      review_text: review_text.trim(),
      user_id: user_id || null,
    });

    // Notify administrator asynchronously
    notifyAdminEvent('review', {
      name: newReview.display_name,
      rating: newReview.rating,
      excerpt: newReview.review_text.substring(0, 100) + '...',
      reviewId: newReview.id,
    }).catch((e) => console.warn('Admin notification warning:', e));

    return NextResponse.json({
      success: true,
      message: 'Thank you for sharing your experience! Your review will be published shortly once our team verifies it.',
      review: newReview,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to submit your review right now. Please try again in a few moments.' }, { status: 500 });
  }
}
