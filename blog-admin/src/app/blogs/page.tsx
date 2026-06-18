import prisma from '@/lib/prisma';
import BlogListWithFilter from './BlogListWithFilter';
import { Suspense } from 'react';

export const metadata = {
  title: 'Blog | Navigation Trading',
  description: 'Read the latest strategies, updates, and market insights from Navigation Trading.',
};

export const revalidate = 0; // Disable caching to fetch fresh post updates immediately

export default async function BlogsPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, avatarUrl: true } },
      category: true,
      tags: true, // Fetch tags!
    }
  });

  return (
    <div className="blog-page-container">
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="blog-title">NavigationTrading Blog</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '18px' }}>Market insights, institutional strategies, and updates.</p>
      </div>

      <Suspense fallback={<div style={{ textAlign: 'center', padding: '32px' }}>Loading blog feed...</div>}>
        <BlogListWithFilter posts={posts as any} />
      </Suspense>
    </div>
  );
}
