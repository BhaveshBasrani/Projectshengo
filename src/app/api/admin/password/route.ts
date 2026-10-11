import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin, setDynamicAdminPassword, getDynamicAdminPassword } from '@/lib/admin/auth';
import { getSiteConfig, updateSiteConfig } from '@/lib/data/store';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    configured: true,
    masked: '••••••••',
    message: 'Password is active and secured.',
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newPassword = body.newPassword?.trim();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 1. Update in runtime memory & auth secrets
    setDynamicAdminPassword(newPassword);

    // 2. Persist in database site_config
    await updateSiteConfig({ admin_master_password: newPassword });

    // 3. Best-effort update to .env.local on disk so restarts retain it
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('ADMIN_SECRET_KEY=')) {
          envContent = envContent.replace(/ADMIN_SECRET_KEY=.*/, `ADMIN_SECRET_KEY=${newPassword}`);
        } else {
          envContent += `\nADMIN_SECRET_KEY=${newPassword}\n`;
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
    } catch (e) {
      console.warn('Could not update .env.local file:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password successfully updated.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update administrator password' },
      { status: 500 }
    );
  }
}
