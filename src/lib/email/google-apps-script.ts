/**
 * Server-side Google Apps Script email dispatcher.
 * Keeps secret URLs and execution credentials strictly on the backend.
 */

const APPSCRIPT_URL = process.env.GOOGLE_APPSCRIPT_URL || process.env.NEXT_PUBLIC_APPSCRIPT_URL || '';
const APPSCRIPT_SECRET = process.env.APPSCRIPT_SECRET || '';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'projectshe.ngo@gmail.com';

interface EmailPayload {
  action: 'admin_notification' | 'newsletter_broadcast' | 'welcome_user';
  to?: string;
  recipients?: string[];
  subject: string;
  body: string;
  metadata?: Record<string, any>;
}

export async function sendEmailViaAppsScript(payload: EmailPayload): Promise<{ success: boolean; message: string }> {
  if (!APPSCRIPT_URL) {
    console.log('[Email Simulation Mode] No GOOGLE_APPSCRIPT_URL configured. Logged payload:', payload);
    return {
      success: true,
      message: 'Email dispatched (Simulated / Local mode: configure GOOGLE_APPSCRIPT_URL for live delivery)',
    };
  }

  try {
    const res = await fetch(APPSCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        secret: APPSCRIPT_SECRET,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({ status: 'success' }));
    return {
      success: true,
      message: data.message || 'Email successfully processed by Google Apps Script',
    };
  } catch (error: any) {
    console.error('[Google Apps Script Error]:', error);
    return {
      success: false,
      message: error?.message || 'Failed to dispatch email via Google Apps Script',
    };
  }
}

/**
 * Notifies the Project S.H.E. administrator of critical website events.
 */
export async function notifyAdminEvent(eventType: 'review' | 'suggestion' | 'feedback' | 'registration', details: Record<string, any>) {
  const subjects = {
    review: '[Project S.H.E.] New Public Review Submitted for Moderation',
    suggestion: '[Project S.H.E.] New Community Suggestion Received',
    feedback: '[Project S.H.E.] New Community Feedback Received',
    registration: '[Project S.H.E.] New User Registered',
  };

  const body = `
Project S.H.E. Administrator Alert:
----------------------------------------
Event: ${eventType.toUpperCase()}
Date: ${new Date().toLocaleString()}
Details:
${JSON.stringify(details, null, 2)}
----------------------------------------
Review this item in the Project S.H.E. Admin Dashboard: /admin
  `;

  return sendEmailViaAppsScript({
    action: 'admin_notification',
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: subjects[eventType] || '[Project S.H.E.] Administrative Alert',
    body,
    metadata: details,
  });
}
