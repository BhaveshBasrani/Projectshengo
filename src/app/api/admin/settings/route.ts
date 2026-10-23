import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data/store';
import { getValidAdminSecrets } from '@/lib/admin/auth';

/**
 * Live Site Text & Links API.
 * GET is public so frontend hero, ticker marquee, and footer can fetch
 * dynamic content updates immediately without rebuilding or redeploying.
 * PATCH is strictly protected by Team Passkey.
 */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve site text & links' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret')?.trim();
    const validSecrets = getValidAdminSecrets();

    if (!secret || !validSecrets.some((s) => s.trim() === secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid passkey required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));

    // Filter allowed fields - only set if non-empty string
    const updates: Record<string, string> = {};
    if (typeof body.marquee_text === 'string' && body.marquee_text.trim()) updates.marquee_text = body.marquee_text.trim();
    if (typeof body.hero_headline === 'string' && body.hero_headline.trim()) updates.hero_headline = body.hero_headline.trim();
    if (typeof body.hero_description === 'string' && body.hero_description.trim()) updates.hero_description = body.hero_description.trim();
    if (typeof body.footer_quote === 'string' && body.footer_quote.trim()) updates.footer_quote = body.footer_quote.trim();
    if (typeof body.google_form_team_app === 'string' && body.google_form_team_app.trim()) updates.google_form_team_app = body.google_form_team_app.trim();
    if (typeof body.google_form_artwork_poetry === 'string' && body.google_form_artwork_poetry.trim()) updates.google_form_artwork_poetry = body.google_form_artwork_poetry.trim();
    if (typeof body.google_form_anonymous_confessions === 'string' && body.google_form_anonymous_confessions.trim()) updates.google_form_anonymous_confessions = body.google_form_anonymous_confessions.trim();
    if (typeof body.emergency_helpline === 'string' && body.emergency_helpline.trim()) updates.emergency_helpline = body.emergency_helpline.trim();
    if (typeof body.donation_upi_id === 'string' && body.donation_upi_id.trim()) updates.donation_upi_id = body.donation_upi_id.trim();
    if (typeof body.contact_email === 'string' && body.contact_email.trim()) updates.contact_email = body.contact_email.trim();
    if (typeof body.instagram_url === 'string' && body.instagram_url.trim()) updates.instagram_url = body.instagram_url.trim();

    const updated = await updateSiteSettings(updates);

    return NextResponse.json({
      success: true,
      message: 'Website text and links updated successfully.',
      settings: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
