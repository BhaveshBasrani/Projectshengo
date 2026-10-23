import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorAction } from '@/lib/data/store';

/**
 * Lightweight anonymous visitor ping.
 * Called when users interact with the site (if consent is given).
 * Anonymizes client IP to protect user privacy.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === 'string' ? body.action.trim() : 'Browsing Website';

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'Local';
    const anonymizedIp = clientIp.includes('.')
      ? clientIp.split('.').slice(0, 2).join('.') + '.x.x'
      : 'Local Visitor';

    // Simple regional approximation
    const country = req.headers.get('cf-ipcountry') || 'IN';
    const location = country === 'IN' ? 'Hyderabad, IN' : `${country} Visitor`;

    const log = await recordVisitorAction(action, location, `vis_${Math.random().toString(36).substring(2, 8)}`);

    return NextResponse.json({ success: true, id: log.id });
  } catch (error: any) {
    return NextResponse.json({ success: true }); // Always return 200 silently for pings
  }
}
