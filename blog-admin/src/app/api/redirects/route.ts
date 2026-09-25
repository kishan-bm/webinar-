import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function normalizeSlug(raw: string) {
  return raw.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
}

// GET all redirects
export async function GET() {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, data: redirects });
}

// POST create a new redirect
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = normalizeSlug(body.slug || '');
    const targetUrl = String(body.targetUrl || '').trim();

    if (!slug || !targetUrl) {
      return NextResponse.json({ success: false, error: 'Slug and target URL are required' }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(targetUrl)) {
      return NextResponse.json({ success: false, error: 'Target URL must start with http:// or https://' }, { status: 400 });
    }

    const redirect = await prisma.redirect.create({ data: { slug, targetUrl } });
    return NextResponse.json({ success: true, data: redirect }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A redirect for this slug already exists' }, { status: 409 });
    }
    console.error('Failed to create redirect:', error);
    return NextResponse.json({ success: false, error: 'Failed to create redirect' }, { status: 500 });
  }
}
