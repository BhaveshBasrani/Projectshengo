import { NextRequest, NextResponse } from 'next/server';
import {
  getGalleryItemsList,
  addGalleryItemToStore,
  deleteGalleryItemFromStore,
} from '@/lib/data/store';
import { getValidAdminSecrets } from '@/lib/admin/auth';

/**
 * Visual Chronicles (Gallery Manager) API.
 * GET: Retrieves photography archive list.
 * POST: Adds new photograph. Protected by Team Passkey.
 * DELETE: Removes photograph by ID. Protected by Team Passkey.
 */
export async function GET() {
  try {
    const items = await getGalleryItemsList();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to load visual chronicles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const src = typeof body.src === 'string' ? body.src.trim() : '';

    if (!src) {
      return NextResponse.json(
        { success: false, error: 'Photo URL or path is required.' },
        { status: 400 }
      );
    }

    const title = typeof body.title === 'string' ? body.title.trim() : 'Event Photograph';
    const category = typeof body.category === 'string' ? body.category.trim() : 'BOTB 2.0';
    const aspect = typeof body.aspect === 'number' ? body.aspect : 1.0;

    const newItem = await addGalleryItemToStore({ src, title, category, aspect });

    return NextResponse.json({
      success: true,
      message: 'Photograph added to chronicles successfully.',
      item: newItem,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to add photograph' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret')?.trim();
    const validSecrets = getValidAdminSecrets();

    if (!secret || !validSecrets.some((s) => s.trim() === secret)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid passkey required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Photo identifier is required.' },
        { status: 400 }
      );
    }

    const removed = await deleteGalleryItemFromStore(id);

    return NextResponse.json({
      success: true,
      message: removed ? 'Photograph removed.' : 'Photo already deleted or not found.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete photograph' },
      { status: 500 }
    );
  }
}
