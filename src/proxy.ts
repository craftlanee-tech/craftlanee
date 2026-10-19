import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySessionToken } from './lib/admin-auth';

// Optimistic gate only — every admin page, action and route re-checks the session itself.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const authed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!authed && !isLoginPage) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authed && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
