import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';
import { clearSessionCookie } from './lib/cookieDomain';

// NOTE: this used to build the absolute redirect URL from
// x-forwarded-host/host, which (because this site is reached through a
// Cloudflare Worker that proxies by fetching a different internal hostname,
// webclass...) sends people to that internal host instead of the domain
// they actually visited. Two attempted fixes for that (a hand-built
// Response, then NextResponse.redirect() with a rewritten Location header)
// both crashed the Edge Runtime in production (MIDDLEWARE_INVOCATION_FAILED,
// taking down the whole admin panel). Reverted to the simple, previously-
// stable version below. The wrong-host redirect is a real but low-severity
// cosmetic issue; it needs a safer fix (e.g. a header the Worker sets
// explicitly) investigated outside of an active-outage fix.
function getRedirectUrl(request: NextRequest, path: string): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}${path}` : new URL(path, request.url).toString();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  const isAdminRoute =
    pathname.startsWith('/site-config') ||
    pathname.startsWith('/banners') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/replay') ||
    pathname.startsWith('/posts') ||
    pathname.startsWith('/exit-intent') ||
    pathname.startsWith('/redirects') ||
    pathname === '/';

  if (isAdminRoute) {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(getRedirectUrl(request, '/login'));
    }

    const decrypted = await decryptSession(sessionCookie);

    if (!decrypted || decrypted.expiresAt < Date.now()) {
      const response = NextResponse.redirect(getRedirectUrl(request, '/login'));
      clearSessionCookie(response, request);
      return response;
    }
  }

  // Redirect from login if already logged in
  if (pathname === '/login') {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    if (sessionCookie) {
      const decrypted = await decryptSession(sessionCookie);
      if (decrypted && decrypted.expiresAt > Date.now()) {
        return NextResponse.redirect(getRedirectUrl(request, '/admin-blog'));
      }
    }
  }

  // Protect sensitive API routes (write methods / admin operations)
  if (pathname.startsWith('/api/')) {
    const isPublicApi =
      (request.method === 'GET' &&
       (pathname.startsWith('/api/config') || pathname.startsWith('/api/posts') || pathname.startsWith('/api/banners'))) ||
      pathname.startsWith('/api/collect') ||
      (request.method === 'GET' && pathname.startsWith('/api/redirects/lookup/'));
      
    const isAuthApi = pathname.startsWith('/api/auth');

    if (!isPublicApi && !isAuthApi) {
      const sessionCookie = request.cookies.get('admin_session')?.value;
      if (!sessionCookie || !(await decryptSession(sessionCookie))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
