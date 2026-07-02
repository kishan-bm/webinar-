import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/session';

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
    pathname === '/';

  if (isAdminRoute) {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(getRedirectUrl(request, '/login'));
    }

    const decrypted = await decryptSession(sessionCookie);

    if (!decrypted || decrypted.expiresAt < Date.now()) {
      const response = NextResponse.redirect(getRedirectUrl(request, '/login'));
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
      });
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
      pathname.endsWith('/ai-summary');
      
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
