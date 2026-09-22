import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getSupabaseServer, isSupabaseConfigured } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum permitted limit of 5MB' }, { status: 400 });
    }

    // Validate mime type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed formats: JPEG, PNG, WEBP, GIF, PDF' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = path.extname(file.name) || '.png';
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;

    // Upload to Supabase Storage if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseServer();
        const bucketName = 'project-she-assets';

        // Check/upload to bucket
        const { data, error } = await supabase.storage.from(bucketName).upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName,
            size: file.size,
          });
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to local asset write:', err);
      }
    }

    // Local asset write fallback
    const localDir = path.resolve('public/uploads');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const localFilePath = path.join(localDir, localFileName);
    fs.writeFileSync(localFilePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${localFileName}`,
      fileName: localFileName,
      size: file.size,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'File upload failed' }, { status: 500 });
  }
}
