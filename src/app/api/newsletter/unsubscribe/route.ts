import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer, isSupabaseConfigured } from '@/lib/supabase/server';
import { sendEmailViaAppsScript } from '@/lib/email/google-apps-script';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    // 1. Update Supabase newsletter_subscribers table if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseServer();
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('email', email);

        await supabase
          .from('user_profiles')
          .update({ email_subscribed: false })
          .eq('email', email);
      } catch (err) {
        console.warn('Supabase unsubscribe update warning:', err);
      }
    }

    // 2. Notify Google Apps Script to mark as Unsubscribed in Google Sheet
    sendEmailViaAppsScript({
      action: 'newsletter_unsubscribe' as any,
      email,
      subject: 'Unsubscribe',
      body: `Unsubscribe request for ${email}`,
    }).catch((e) => console.warn('Apps Script unsubscribe warning:', e));

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from Project S.H.E. newsletters.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to process unsubscribe request' }, { status: 500 });
  }
}
