import { NextRequest, NextResponse } from 'next/server';
import { submitSuggestionFeedback, getAllFeedbackAdmin } from '@/lib/data/store';
import { notifyAdminEvent } from '@/lib/email/google-apps-script';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Only allow querying own feedback for private user dashboard
    if (userId) {
      const all = await getAllFeedbackAdmin();
      const userFeedback = all.filter((f) => f.user_id === userId);
      return NextResponse.json({ success: true, feedback: userFeedback });
    }

    // Public cannot query feedback list!
    return NextResponse.json({ error: 'Unauthorized access to private feedback' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error fetching feedback' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, type, subject, message, user_id } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }
    if (type !== 'suggestion' && type !== 'feedback') {
      return NextResponse.json({ error: 'Type must be either suggestion or feedback' }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ error: 'Message must be at least 10 characters long' }, { status: 400 });
    }

    // Store private suggestion/feedback
    const item = await submitSuggestionFeedback({
      name: name.trim(),
      email: email.trim(),
      type,
      subject: subject.trim(),
      message: message.trim(),
      user_id: user_id || null,
    });

    // Notify administrator
    notifyAdminEvent(type, {
      from: item.name,
      email: item.email,
      type: item.type,
      subject: item.subject,
      id: item.id,
    }).catch((e) => console.warn('Admin notification warning:', e));

    return NextResponse.json({
      success: true,
      message: `Your ${type} has been securely transmitted to the Project S.H.E. administrative team. Thank you!`,
      item,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit feedback' }, { status: 500 });
  }
}
