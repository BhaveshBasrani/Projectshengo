import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteSettings, updateSiteSettings } from '@/lib/data/store';
import { getValidAdminSecrets } from '@/lib/admin/auth';
import { SiteSettings } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Live Site Text & Links API.
 * GET is public so frontend hero, ticker marquee, and footer can fetch
 * dynamic content updates immediately.
 * PATCH is strictly protected by Team Passkey.
 */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
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

    // Explicitly allow and capture all editable website fields
    const updates: Partial<SiteSettings> = {};

    if (body.default_theme === 'light' || body.default_theme === 'dark') {
      updates.default_theme = body.default_theme;
    }

    const textKeys: (keyof SiteSettings)[] = [
      'marquee_text',
      'hero_headline',
      'hero_headline_2',
      'hero_headline_3',
      'hero_badge',
      'hero_subbadge',
      'hero_description',
      'about_statement',
      'pillar_1_title',
      'pillar_1_desc',
      'pillar_2_title',
      'pillar_2_desc',
      'pillar_3_title',
      'pillar_3_desc',
      'donation_headline',
      'donation_subtext',
      'donation_upi_id',
      'donation_qr_url',
      'footer_quote',
      'google_form_team_app',
      'google_form_artwork_poetry',
      'google_form_anonymous_confessions',
      'emergency_helpline',
      'contact_email',
      'instagram_url',
    ];

    for (const key of textKeys) {
      if (typeof body[key] === 'string' && body[key].trim() !== '') {
        (updates as any)[key] = body[key].trim();
      }
    }

    const updated = await updateSiteSettings(updates);
    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: 'Website text and links updated successfully.',
        settings: updated,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
