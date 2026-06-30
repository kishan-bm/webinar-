import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT update a banner by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
        imageAlt: body.imageAlt !== undefined ? body.imageAlt : undefined,
        linkUrl: body.linkUrl !== undefined ? body.linkUrl : undefined,
        order: body.order !== undefined ? body.order : undefined,
      },
    });

    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    console.error('Failed to update banner:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE a banner by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete banner:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete banner' }, { status: 500 });
  }
}
