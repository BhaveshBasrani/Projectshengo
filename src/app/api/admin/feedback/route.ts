import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin/auth';
import { getAllFeedbackAdmin, updateFeedbackStatus, deleteFeedback } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const feedback = await getAllFeedbackAdmin();
    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !['new', 'reviewed', 'resolved'].includes(status)) {
      return NextResponse.json({ error: 'Valid ID and status (new, reviewed, resolved) required' }, { status: 400 });
    }

    const updated = await updateFeedbackStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN: Hard Administrator Authorization Required' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const deleted = await deleteFeedback(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Delete failed' }, { status: 500 });
  }
}
