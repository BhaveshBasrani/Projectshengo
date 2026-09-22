import { NextRequest, NextResponse } from 'next/server';
import { getPublicReviews, submitReview, getAllReviewsAdmin } from '@/lib/data/store';
import { notifyAdminEvent } from '@/lib/email/google-apps-script';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // If userId provided, return the user's submitted reviews for their private dashboard
    if (userId) {
      const all = await getAllReviewsAdmin();
      const userReviews = all.filter((r) => r.user_id === userId);
      return NextResponse.json({ success: true, reviews: userReviews });
    }

    // Public request: strictly approved reviews only
    const reviews = await getPublicReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { display_name, role_or_relation, rating, review_text, user_id } = body;

    // Validation
    if (!display_name || !display_name.trim()) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 });
    }
    if (!review_text || review_text.trim().length < 10) {
      return NextResponse.json({ error: 'Review text must be at least 10 characters long' }, { status: 400 });
    }
    const numericRating = Number(rating) || 5;
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Submit review (strictly status: pending)
    const newReview = await submitReview({
      display_name: display_name.trim(),
      role_or_relation: role_or_relation?.trim() || 'Community Voice',
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
      message: 'Review submitted successfully! It will appear publicly after administrator moderation.',
      review: newReview,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit review' }, { status: 500 });
  }
}
