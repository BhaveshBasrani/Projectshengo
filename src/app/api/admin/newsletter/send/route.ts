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
    const {
      subject,
      headline,
      subtitle,
      content,
      ctaText,
      ctaUrl,
      targetAudience = 'subscribed_only',
    } = body;

    if (!subject || !subject.trim() || !content || !content.trim()) {
      return NextResponse.json({ error: 'Newsletter subject and content are required' }, { status: 400 });
    }

    let recipients: string[] = [];

    // Case 1: Test send to Admin inbox only
    if (targetAudience === 'test_admin') {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'projectshe.ngo@gmail.com';
      recipients = [adminEmail];
    } else if (targetAudience === 'all') {
      // Case 2: All registered accounts + newsletter subscribers
      const newsletterSubscribers = await getAllNewsletterSubscribers();
      const allUsers = await getAllUsersAdmin();
      const combined = new Set([...newsletterSubscribers, ...allUsers.map((u) => u.email.trim().toLowerCase())]);
      recipients = Array.from(combined).filter(Boolean);
    } else {
      // Case 3: Subscribed members only
      recipients = await getAllNewsletterSubscribers();
    }

    // Dispatch via Google Apps Script (If recipients array is empty, Apps Script broadcasts to active sheet subscribers)
    const result = await sendEmailViaAppsScript({
      action: 'newsletter_broadcast',
      recipients: recipients.length > 0 ? recipients : undefined,
      subject: subject.trim(),
      headline: (headline || subject).trim(),
      subtitle: subtitle ? subtitle.trim() : undefined,
      body: content.trim(),
      ctaText: ctaText ? ctaText.trim() : undefined,
      ctaUrl: ctaUrl ? ctaUrl.trim() : undefined,
      metadata: {
        sentAt: new Date().toISOString(),
        totalSubscribers: recipients.length,
        audience: targetAudience,
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
      message: targetAudience === 'test_admin'
        ? `Test newsletter sent to ${recipients[0]}`
        : `Newsletter successfully sent to ${recipients.length} subscriber(s)!`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to dispatch newsletter' }, { status: 500 });
  }
}
