import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllUsersAdmin, getAllNewsletterSubscribers } from '@/lib/data/store';
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

    // 1. Gather subscribers from both newsletter table and opted-in user accounts
    const newsletterSubscribers = await getAllNewsletterSubscribers();
    let recipients: string[] = [];

    if (targetAudience === 'all') {
      const allUsers = await getAllUsersAdmin();
      const combined = new Set([...newsletterSubscribers, ...allUsers.map((u) => u.email.trim().toLowerCase())]);
      recipients = Array.from(combined).filter(Boolean);
    } else {
      recipients = newsletterSubscribers;
    }

    // 2. Dispatch via Google Apps Script (If recipients array is empty, Apps Script will safely broadcast to all active subscribers in Google Sheets Subscribers tab!)
    const result = await sendEmailViaAppsScript({
      action: 'newsletter_broadcast',
      recipients: recipients.length > 0 ? recipients : undefined,
      subject: subject.trim(),
      body: content.trim(),
      metadata: {
        sentAt: new Date().toISOString(),
        totalSubscribers: recipients.length,
      },
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message || 'Failed to dispatch newsletter via Google Apps Script',
        message: result.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recipientCount: recipients.length,
      message: result.message || `Newsletter successfully dispatched!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to dispatch newsletter' }, { status: 500 });
  }
}
