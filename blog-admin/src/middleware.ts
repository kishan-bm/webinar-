import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';
import { clearSessionCookie } from './lib/cookieDomain';

// A relative Location header, rather than an absolute URL built from
// x-forwarded-host/host. This site is reached through a Cloudflare Worker
// that proxies by fetching a different internal hostname (webclass...), so
// those headers reflect that internal hop, not the domain the visitor is
// actually on -- an absolute redirect built from them sends people to the
// wrong host. A relative Location resolves against the browser's own
// current URL instead, sidestepping the problem entirely.
//
// NextResponse.redirect() requires an absolute URL, so we build one from
// request.url (same-origin as far as this middleware invocation is
// concerned) and then rewrite the Location header to the relative path
// afterward -- avoids constructing a raw Response by hand, which crashed
// the Edge Runtime here (MIDDLEWARE_INVOCATION_FAILED).
function redirectRelative(request: NextRequest, path: string, status = 307): NextResponse {
  const res = NextResponse.redirect(new URL(path, request.url), status);
  res.headers.set('Location', path);
  return res;
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
      return redirectRelative(request, '/login');
    }

    const decrypted = await decryptSession(sessionCookie);

    if (!decrypted || decrypted.expiresAt < Date.now()) {
      const response = redirectRelative(request, '/login');
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
        return redirectRelative(request, '/admin-blog');
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
