import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/cookieDomain';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearSessionCookie(response, request);
  return response;
}

export async function GET(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const redirectUrl = host ? `${proto}://${host}/login` : new URL('/login', request.url).toString();

  const response = NextResponse.redirect(redirectUrl);
  clearSessionCookie(response, request);
  return response;
}
