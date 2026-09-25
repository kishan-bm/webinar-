import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Public, unauthenticated lookup used by the Cloudflare Worker to resolve
// short slugs (e.g. /pro) to their destination URL.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const redirect = await prisma.redirect.findUnique({
    where: { slug: slug.toLowerCase() },
    select: { targetUrl: true },
  });

  if (!redirect) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  return NextResponse.json({ success: true, targetUrl: redirect.targetUrl });
}
