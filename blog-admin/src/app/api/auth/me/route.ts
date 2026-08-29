import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const decrypted = await decryptSession(sessionCookie);
  if (!decrypted || decrypted.expiresAt < Date.now()) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: { name: decrypted.name, email: decrypted.email },
  });
}
