'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, checkPassword, createSessionToken, isAdminConfigured, verifySessionToken } from '../../lib/admin-auth';
import { deleteSubmission, updateSubmission, type SubmissionPatch, type SubmissionStatus } from '../../lib/submissions';

export type LoginState = { error?: string };

const statuses: SubmissionStatus[] = ['new', 'progress', 'done', 'archived'];

async function assertAdmin() {
  const cookieStore = await cookies();
  if (!(await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value))) {
    throw new Error('Unauthorized');
  }
}

function safeNextPath(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/admin') && !next.startsWith('/admin/login') ? next : '/admin';
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: 'ADMIN_PASSWORD is not set on the server.' };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !(await checkPassword(password))) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: 'That password didn’t match. Try again.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(safeNextPath(formData.get('next')));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect('/admin/login');
}

export async function patchSubmission(id: string, patch: SubmissionPatch) {
  await assertAdmin();

  const clean: SubmissionPatch = {};
  if (patch.status && statuses.includes(patch.status)) clean.status = patch.status;
  if (typeof patch.starred === 'boolean') clean.starred = patch.starred;
  if (typeof patch.notes === 'string') clean.notes = patch.notes.slice(0, 5000);

  const updated = await updateSubmission(id, clean);
  revalidatePath('/admin', 'layout');
  return Boolean(updated);
}

export async function removeSubmission(id: string) {
  await assertAdmin();
  const removed = await deleteSubmission(id);
  revalidatePath('/admin', 'layout');
  return removed;
}
