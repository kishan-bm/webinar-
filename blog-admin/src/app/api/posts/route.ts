import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all posts (with filtering support)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');

    const posts = await prisma.post.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(authorId ? { authorId } : {}),
      },
      include: {
        author: { select: { name: true, avatarUrl: true } },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error: any) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.slug || !body.content || !body.authorId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (title, slug, content, authorId)' },
        { status: 400 }
      );
    }

    let categoryData = undefined;
    if (body.categoryName && body.categoryName.trim() !== '') {
      const catName = body.categoryName.trim();
      categoryData = {
        connectOrCreate: {
          where: { name: catName },
          create: { name: catName, slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
        }
      };
    }

    let tagsData = undefined;
    if (body.tagNames && body.tagNames.trim() !== '') {
      const tagsArray = body.tagNames.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '');
      if (tagsArray.length > 0) {
        tagsData = {
          connectOrCreate: tagsArray.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }
          }))
        };
      }
    }

    // Ensure slug is unique. Uses a retry loop that also handles the race condition
    // where two simultaneous requests both see the slug as available and one gets P2002.
    let finalSlug = body.slug;
    let suffix = 2;
    let post;
    while (true) {
      // Pre-check (avoids P2002 in the common non-concurrent case)
      const taken = await prisma.post.findFirst({ where: { slug: finalSlug }, select: { id: true } });
      if (taken) {
        finalSlug = `${body.slug}-${suffix++}`;
        continue;
      }
      try {
        post = await prisma.post.create({
          data: {
            title: body.title,
            slug: finalSlug,
            content: body.content,
            excerpt: body.excerpt,
            coverImage: body.coverImage,
            seoTitle: body.seoTitle,
            seoDescription: body.seoDescription,
            status: body.status || 'DRAFT',
            author: { connect: { id: body.authorId } },
            category: categoryData,
            tags: tagsData,
            publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
          },
        });
        break; // success
      } catch (err: any) {
        if (err.code === 'P2002') {
          // Race condition: another request claimed this slug between our check and create
          finalSlug = `${body.slug}-${suffix++}`;
        } else {
          throw err; // unrelated error — rethrow to outer catch
        }
      }
    }

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
