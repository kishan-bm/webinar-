import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a single post by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, category: true, tags: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error('Failed to fetch post:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT update a post by ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    let categoryUpdate: any = undefined;

    if (body.categoryName !== undefined) {
      if (body.categoryName && body.categoryName.trim() !== '') {
        const catName = body.categoryName.trim();
        categoryUpdate = {
          connectOrCreate: {
            where: { name: catName },
            create: { name: catName, slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
          }
        };
      } else {
        categoryUpdate = { disconnect: true };
      }
    }

    let tagsUpdate: any = undefined;
    if (body.tagNames !== undefined) {
      const tagsArray = body.tagNames.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
      tagsUpdate = {
        set: [],
        connectOrCreate: tagsArray.map((tagName: string) => ({
          where: { name: tagName },
          create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
        }))
      };
    }

    // Determine slug to use — never auto-update to empty, never conflict with another post
    let slugToSet: string | undefined = undefined;
    if (body.slug && body.slug.trim()) {
      const trimmedSlug = body.slug.trim();
      const conflict = await prisma.post.findFirst({
        where: { slug: trimmedSlug, id: { not: id } },
        select: { id: true },
      });
      if (conflict) {
        return NextResponse.json({ success: false, error: 'A post with this slug already exists' }, { status: 409 });
      }
      slugToSet = trimmedSlug;
    }
    // If body.slug is empty/missing, slugToSet remains undefined → Prisma won't touch the slug field

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: slugToSet,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        coverImageAlt: body.coverImageAlt !== undefined ? (body.coverImageAlt || null) : undefined,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        status: body.status,
        author: body.authorId ? {
          connect: { id: body.authorId }
        } : undefined,
        category: categoryUpdate,
        tags: tagsUpdate,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    console.error('Failed to update post:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update post', detail: error.message }, { status: 500 });
  }
}

// DELETE a post by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
