import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllUsersAdmin } from '@/lib/data/store';
import { sendEmailViaAppsScript } from '@/lib/email/google-apps-script';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { subject, content, targetAudience = 'subscribed_only' } = body;

    if (!subject || !subject.trim() || !content || !content.trim()) {
      return NextResponse.json({ error: 'Newsletter subject and content are required' }, { status: 400 });
    }

    const allUsers = await getAllUsersAdmin();
    // Strictly filter by subscription preference: only opted-in users receive newsletters
    const recipients = targetAudience === 'all'
      ? allUsers.map((u) => u.email)
      : allUsers.filter((u) => u.email_subscribed).map((u) => u.email);

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No subscribed recipients found in the database.',
      }, { status: 400 });
    }

    // Call server-side Google Apps Script integration
    const result = await sendEmailViaAppsScript({
      action: 'newsletter_broadcast',
      recipients,
      subject: subject.trim(),
      body: content.trim(),
      metadata: {
        sentAt: new Date().toISOString(),
        totalSubscribers: recipients.length,
      },
    });

    return NextResponse.json({
      success: result.success,
      recipientCount: recipients.length,
      message: result.message || `Newsletter successfully queued for ${recipients.length} subscribers.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to dispatch newsletter' }, { status: 500 });
  }
}
