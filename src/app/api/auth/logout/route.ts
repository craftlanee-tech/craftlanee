import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '../../../../lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Signed out successfully' });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
