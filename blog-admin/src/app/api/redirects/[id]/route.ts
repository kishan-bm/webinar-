import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function normalizeSlug(raw: string) {
  return raw.trim().toLowerCase().replace(/^\/+|\/+$/g, '');
}

// PUT update a redirect
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const slug = normalizeSlug(body.slug || '');
    const targetUrl = String(body.targetUrl || '').trim();

    if (!slug || !targetUrl) {
      return NextResponse.json({ success: false, error: 'Slug and target URL are required' }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(targetUrl)) {
      return NextResponse.json({ success: false, error: 'Target URL must start with http:// or https://' }, { status: 400 });
    }

    const redirect = await prisma.redirect.update({ where: { id }, data: { slug, targetUrl } });
    return NextResponse.json({ success: true, data: redirect });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A redirect for this slug already exists' }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Redirect not found' }, { status: 404 });
    }
    console.error('Failed to update redirect:', error);
    return NextResponse.json({ success: false, error: 'Failed to update redirect' }, { status: 500 });
  }
}

// DELETE a redirect
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.redirect.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Redirect not found' }, { status: 404 });
    }
    console.error('Failed to delete redirect:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete redirect' }, { status: 500 });
  }
}
