import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all banners ordered by order ascending
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    console.error('Failed to fetch banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST create a new banner
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: imageUrl' },
        { status: 400 }
      );
    }

    // Get the max order currently to auto-increment
    const maxBanner = await prisma.banner.findFirst({
      orderBy: { order: 'desc' },
    });
    const nextOrder = maxBanner ? maxBanner.order + 1 : 0;

    const banner = await prisma.banner.create({
      data: {
        title: body.title || null,
        imageUrl: body.imageUrl,
        imageAlt: body.imageAlt || null,
        linkUrl: body.linkUrl || null,
        order: body.order !== undefined ? body.order : nextOrder,
      },
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create banner:', error);
    return NextResponse.json(
      { success: false, error: `Failed to create banner: ${error.message || error}` },
      { status: 500 }
    );
  }
}
