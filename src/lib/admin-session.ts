import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, verifySessionToken } from './admin-auth';

export async function isAdminSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminSession())) redirect('/admin/login');
}
