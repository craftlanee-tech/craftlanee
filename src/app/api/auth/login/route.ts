import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, checkPassword, createSessionToken, isAdminConfigured } from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured on server' }, { status: 500 });
  }

  let password = '';
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await request.json();
      password = body.password || '';
    } else {
      const formData = await request.formData();
      password = String(formData.get('password') || '');
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!password || !(await checkPassword(password))) {
    // Thwart timing attacks with deliberate delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ error: 'That password didn’t match. Try again.' }, { status: 401 });
  }

  const token = await createSessionToken();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

  const response = NextResponse.json({
    success: true,
    token,
    expiresAt,
    ttlSeconds: SESSION_TTL_SECONDS,
  });

  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return response;
}
