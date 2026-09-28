/**
 * Server-side Google Apps Script email dispatcher.
 * Keeps secret URLs and execution credentials strictly on the backend.
 */

const CURRENT_LIVE_APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMuTtOY-_GVFNmy_vSY59W5kM6PMD1dGvX6r7qBt0c0QxabyZCyRTYkwCDSZKAsCKb/exec';

function getAppsScriptUrl(): string {
  const envUrl = process.env.GOOGLE_APPSCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
  // If envUrl is missing or points to the old outdated deployments, use the live verified deployment
  if (!envUrl || envUrl.includes('AKfycbw71-h03yI-JfAr_WvGVTcV_jvT7An1QuwkxnbBl9L49QFoM-HUHkfuwL7lDMNJzBSg') || envUrl.includes('AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA')) {
    return CURRENT_LIVE_APPSCRIPT_URL;
  }
  return envUrl;
}

function getAppsScriptSecret(): string {
  return process.env.APPSCRIPT_SECRET || process.env.GOOGLE_APPS_SCRIPT_TOKEN || 'she_secret_token_2026_goated';
}

function getAdminEmail(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'projectshe.ngo@gmail.com';
}

interface EmailPayload {
  action: 'admin_notification' | 'newsletter_broadcast' | 'welcome_user' | 'newsletter_signup' | 'newsletter_unsubscribe';
  to?: string;
  email?: string;
  source?: string;
  recipients?: string[];
  subject: string;
  headline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  body: string;
  metadata?: Record<string, any>;
}

export async function sendEmailViaAppsScript(payload: EmailPayload): Promise<{ success: boolean; message: string }> {
  const url = getAppsScriptUrl();
  const secret = getAppsScriptSecret();

  if (!url) {
    console.log('[Email Simulation Mode] No GOOGLE_APPSCRIPT_URL configured. Logged payload:', payload);
    return {
      success: true,
      message: 'Email dispatched (Simulated / Local mode: configure GOOGLE_APPSCRIPT_URL for live delivery)',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second safety timeout

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      redirect: 'follow',
      body: JSON.stringify({
        ...payload,
        secret,
        token: secret,
        timestamp: new Date().toISOString(),
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${res.status}`);
    }

    const data = await res.json().catch(() => ({ success: true, message: 'Dispatched' }));
    return {
      success: data.success !== false,
      message: data.message || data.error || 'Email successfully processed by Google Apps Script',
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
    to: getAdminEmail(),
    subject: subjects[eventType] || '[Project S.H.E.] Administrative Alert',
    body,
    metadata: details,
  });
}
