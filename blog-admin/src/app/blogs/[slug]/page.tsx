import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import AISummary from '@/components/AISummary';

export const revalidate = 60;

// Dynamically generate SEO tags for this specific post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ 
    where: { slug },
    include: { tags: true }
  });
  
  if (!post) {
    return { title: 'Post Not Found | Navigation Trading' };
  }

  const tagsList = post.tags?.map(t => t.name).join(', ') || '';

  return {
    title: `${post.seoTitle || post.title} | Navigation Trading`,
    description: post.seoDescription || post.title,
    keywords: tagsList || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.title,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      tags: post.tags?.map(t => t.name) || [],
    }
  };
}

function decodeHTMLBlocks(htmlString: string) {
  return htmlString.replace(
    /<div[^>]+data-html-block="true"[^>]+data-content="([^"]+)"[^>]*><\/div>/g,
    (match, content) => {
      return content
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    }
  );
}

// Injects unique IDs into headings H1, H2, H3, H4 inside post content for anchor linking
function injectHeadingIds(html: string) {
  let headingIndex = 0;
  return html.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    if (/id=/i.test(attrs)) return match;
    headingIndex++;
    const id = `heading-${headingIndex}`;
    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });
}

// Parses heading texts, levels, and matching anchor IDs
function parseHeadings(html: string) {
  const headings: { text: string; id: string; level: number }[] = [];
  let headingIndex = 0;
  
  const matches = html.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi);
  for (const match of matches) {
    headingIndex++;
    const level = parseInt(match[1].replace(/h/i, ''), 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      headings.push({ text, id: `heading-${headingIndex}`, level });
    }
  }
  return headings;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [post, categories, banners] = await Promise.all([
    prisma.post.findUnique({
      where: { slug },
      include: { author: true, category: true, tags: true },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.banner.findMany({ orderBy: { order: 'asc' } }),
  ]);

  if (!post) {
    notFound();
  }

  if (post.status !== 'PUBLISHED') {
    notFound();
  }

  // Fetch cached AI summary if it exists
  const cachedSummaryConfig = await prisma.siteConfig.findUnique({
    where: {
      pageKey_key: {
        pageKey: `blog-summary:${post.id}`,
        key: 'data'
      }
    }
  });

  let initialSummary = null;
  if (cachedSummaryConfig) {
    try {
      initialSummary = JSON.parse(cachedSummaryConfig.value);
    } catch (_) {}
  }

  const decodedContent = decodeHTMLBlocks(post.content);
  const headings = parseHeadings(decodedContent);
  const contentWithHeadingIds = injectHeadingIds(decodedContent);

  return (
    <div className="blog-page-container">

      {/* ── FULL-WIDTH COVER IMAGE (navbar floats on top, zero gap) ── */}
      {post.coverImage ? (
        <div className="article-cover-hero">
          {/* Real img tag: fills full width, shows full image, no clipping */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="article-cover-img"
            loading="eager"
          />
          {/* Back button lives ON the image, below the navbar */}
          <Link href="/blogs" className="cover-back-link">
            ← Back
          </Link>
        </div>
      ) : (
        /* Back button below navbar when no cover image */
        <div className="article-back-bar">
          <Link href="/blogs" className="article-back-link">
            ← Back
          </Link>
        </div>
      )}

      {/* ── THREE-COLUMN LAYOUT ── */}
      <div className="article-outer">

        {/* Left column: Sticky Table of Contents */}
        <TableOfContents headings={headings} />

        {/* Center column: Article */}
        <div className="article-main">
          <article className="blog-content" style={{ margin: 0, maxWidth: 'none', padding: 0, overflow: 'hidden' }}>

            {/* Article Header */}
            <div className="article-header">
              {post.category && (
                <div style={{ marginBottom: '12px' }}>
                  <Link
                    href={`/blogs?category=${encodeURIComponent(post.category.name)}`}
                    className="article-category-label"
                  >
                    {post.category.name}
                  </Link>
                </div>
              )}

              <h1 className="blog-title" style={{
                fontSize: '38px',
                color: '#0d2e4e',
                lineHeight: '1.25',
                marginBottom: '20px',
                fontWeight: 800
              }}>
                {post.title}
              </h1>

              <div className="blog-meta" style={{ marginTop: '16px', marginBottom: 0, color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--teal-900)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{post.author.name}</div>
                    <div style={{ fontSize: '13px' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                  {post.tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/blogs?tag=${encodeURIComponent(tag.name)}`}
                      className="blog-tag-link"
                      style={{
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-light)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary Block */}
            <div style={{ padding: '0 48px' }} className="article-summary-container">
              <AISummary postId={post.id} initialSummary={initialSummary} />
            </div>

            {/* Article Body */}
            <div
              className="blog-body"
              style={{ padding: '40px 48px 48px' }}
              dangerouslySetInnerHTML={{ __html: contentWithHeadingIds }}
            />
          </article>
        </div>

        {/* Right column: Sidebar */}
        <aside className="article-sidebar">
          {/* Widget 1: Search */}
          <div className="sidebar-widget">
            <form action="/blogs" method="GET" style={{ position: 'relative' }}>
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '40px',
                  border: '1px solid var(--border-light)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#1e293b'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔍
              </button>
            </form>
          </div>

          {/* Widget 2: Categories (Topics) */}
          <div className="sidebar-widget">
            <h3 style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#0d2e4e',
              marginBottom: '16px',
              borderBottom: '2px solid rgba(13, 46, 78, 0.1)',
              paddingBottom: '8px'
            }}>
              Navigation Trading Topics
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {categories
                .filter(cat => cat._count.posts > 0)
                .map(cat => (
                  <li key={cat.id}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        fontSize: '14px',
                        color: 'var(--text-dim)',
                        transition: 'color 0.2s',
                        fontWeight: 500
                      }}
                      className="blog-category-link"
                    >
                      <span style={{ color: 'var(--emerald-600)', marginRight: '8px', fontWeight: 'bold' }}>&rsaquo;</span>
                      <span style={{ marginRight: '4px' }}>{cat.name}</span>
                      <span style={{ color: 'var(--emerald-600)', fontWeight: 600 }}>({cat._count.posts})</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Widget 3: Banners */}
          {banners.map((banner: any) => {
            const bannerContent = (
              <div key={banner.id} style={{ display: 'flex', flexDirection: 'column' }}>
                {banner.title && (
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-dim)',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {banner.title}
                  </h4>
                )}
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Navigation Trading Banners'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}
                />
              </div>
            );

            if (banner.linkUrl) {
              let displayUrl = banner.linkUrl;
              if (!/^https?:\/\//i.test(displayUrl) && !displayUrl.startsWith('/')) {
                displayUrl = 'https://' + displayUrl;
              }

              return (
                <a
                  key={banner.id}
                  href={displayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-banner-link"
                >
                  {bannerContent}
                </a>
              );
            }

            return bannerContent;
          })}
        </aside>
      </div>
    </div>
  );
}
