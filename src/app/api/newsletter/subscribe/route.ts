import { NextRequest, NextResponse } from 'next/server';
import { updateUserSubscription, subscribeNewsletter } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, subscribed, source } = body;

    // Case 1: Direct email newsletter signup (from the minimalist center modal)
    if (email) {
      const result = await subscribeNewsletter(email, source || 'center_modal');
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      // If Google Apps Script webhook is configured, dispatch notification asynchronously
      const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
      if (scriptUrl) {
        fetch(scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'newsletter_signup',
            email: email.trim().toLowerCase(),
            source: source || 'center_modal',
            timestamp: new Date().toISOString(),
          }),
        }).catch((err) => console.warn('AppScript dispatch failed:', err));
      }

      return NextResponse.json({ success: true, message: 'Welcome to the movement' });
    }

    // Case 2: Registered user toggling their profile email notifications
    if (userId) {
      const success = await updateUserSubscription(userId, Boolean(subscribed));
      return NextResponse.json({ success, subscribed: Boolean(subscribed) });
    }

    return NextResponse.json({ error: 'Please provide an email address' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to process subscription' }, { status: 500 });
  }
}

