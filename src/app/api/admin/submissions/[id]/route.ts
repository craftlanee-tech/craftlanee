import { NextResponse } from 'next/server';
import { isAdminSession } from '../../../../../lib/admin-session';
import { deleteSubmission, updateSubmission, type SubmissionPatch, type SubmissionStatus } from '../../../../../lib/submissions';

const validStatuses: SubmissionStatus[] = ['new', 'progress', 'done', 'archived'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const clean: SubmissionPatch = {};

    if (body.status && validStatuses.includes(body.status)) {
      clean.status = body.status;
    }
    if (typeof body.starred === 'boolean') {
      clean.starred = body.starred;
    }
    if (typeof body.notes === 'string') {
      clean.notes = body.notes.slice(0, 5000);
    }

    const updated = await updateSubmission(id, clean);
    if (!updated) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error('Failed to update submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 });
  }

  try {
    const removed = await deleteSubmission(id);
    if (!removed) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Submission deleted permanently' });
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
