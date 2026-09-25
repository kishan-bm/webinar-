import type { NextRequest, NextResponse } from 'next/server';

// The admin panel is reachable through several hostnames that all proxy to
// this same app (navigationtrading.com, www.navigationtrading.com,
// webclass.navigationtrading.com). Scoping the session cookie to the parent
// domain lets a login on one of them work across all of them. For any other
// host (the raw *.vercel.app URL, localhost, etc.) we leave the domain
// unset so the browser defaults to the exact host, since a mismatched
// Domain attribute would just cause the browser to reject the cookie.
export function getSessionCookieDomain(request: NextRequest): string | undefined {
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(':')[0];
  return host.endsWith('navigationtrading.com') ? '.navigationtrading.com' : undefined;
}

// Clears the admin_session cookie under BOTH the old host-only scoping and
// the new .navigationtrading.com scoping, so browsers holding a cookie set
// before the domain-scoping fix still get logged out correctly.
export function clearSessionCookie(response: NextResponse, request: NextRequest) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.headers.append(
    'Set-Cookie',
    `admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${secure}`
  );
  const domain = getSessionCookieDomain(request);
  if (domain) {
    response.headers.append(
      'Set-Cookie',
      `admin_session=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${secure}`
    );
  }
}
