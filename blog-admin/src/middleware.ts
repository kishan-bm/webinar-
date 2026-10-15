import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';
import { clearSessionCookie } from './lib/cookieDomain';

// This used to build the absolute redirect URL from x-forwarded-host/host,
// which (because this site is reached through a Cloudflare Worker that
// proxies by fetching a different internal hostname, webclass...) sent
// people to that internal host instead of the domain they actually
// visited. Rather than detecting the host dynamically -- two attempts at
// that both crashed the Edge Runtime in production -- just hardcode the
// real domain the admin panel is meant to be used on. Preview/local
// testing (vercel.app, localhost) still uses its own host so that keeps
// working unaffected.
function getRedirectUrl(request: NextRequest, path: string): string {
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(':')[0];
  if (host.includes('vercel.app') || host.includes('localhost') || host.includes('127.0.0.1')) {
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    return `${proto}://${request.headers.get('host')}${path}`;
  }
  return `https://navigationtrading.com${path}`;
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
