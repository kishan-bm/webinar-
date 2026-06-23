import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';

export const revalidate = 0; // Disable caching to fetch fresh post updates immediately

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
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true, tags: true }
  });

  if (!post) {
    notFound();
  }

  // Ensure it's published or we return 404
  if (post.status !== 'PUBLISHED') {
    notFound();
  }

  // Fetch categories with active post count
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: { where: { status: 'PUBLISHED' } }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Fetch sidebar banners
  const banners = await prisma.banner.findMany({
    orderBy: { order: 'asc' }
  });

  const decodedContent = decodeHTMLBlocks(post.content);
  const headings = parseHeadings(decodedContent);
  const contentWithHeadingIds = injectHeadingIds(decodedContent);

  return (
    <div className="blog-page-container" style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Back button container */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 0', marginBottom: '24px' }}>
        <Link href="/blogs" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          &larr; Back to all posts
        </Link>
      </div>

      {/* Modern Top Hero Header (Text only, no cover image background) */}
      <div style={{
        position: 'relative',
        color: '#0d2e4e',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px 24px',
        marginBottom: '48px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          {post.category && (
            <div style={{ marginBottom: '16px' }}>
              <Link 
                href={`/blogs?category=${encodeURIComponent(post.category.name)}`}
                style={{ 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: 'var(--emerald-600)', 
                  letterSpacing: '1px', 
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                {post.category.name}
              </Link>
            </div>
          )}
          
          <h1 style={{ 
            fontSize: '44px', 
            color: '#0d2e4e',
            lineHeight: '1.25',
            marginBottom: '24px',
            fontWeight: 800,
            maxWidth: '900px'
          }}>
            {post.title}
          </h1>
          
          <div style={{ 
            marginTop: '24px', 
            color: '#64748b' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'var(--teal-900)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0d2e4e' }}>{post.author.name}</div>
                <div style={{ fontSize: '13px' }}>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}>
              {post.tags.map(tag => (
                <Link 
                  key={tag.id} 
                  href={`/blogs?tag=${encodeURIComponent(tag.name)}`}
                  style={{ 
                    background: '#e2e8f0', 
                    border: '1px solid #cbd5e1', 
                    padding: '4px 12px', 
                    borderRadius: '100px', 
                    fontSize: '12px', 
                    color: '#475569',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Three column layout */}
      <div style={{
        display: 'flex',
        gap: '48px',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Left column: Sticky Table of Contents */}
        <TableOfContents headings={headings} />
        
        {/* Center column: Article content */}
        <div style={{ flex: 1, minWidth: '320px', maxWidth: '850px' }}>
          {post.coverImage && (
            <div style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
              <img 
                src={post.coverImage} 
                alt={post.title} 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
              />
            </div>
          )}
          <article className="blog-content" style={{ margin: 0, maxWidth: 'none', padding: 0, background: 'transparent', boxShadow: 'none' }}>
            <div 
              className="blog-body"
              style={{ padding: '0 0 48px 0' }}
              dangerouslySetInnerHTML={{ __html: contentWithHeadingIds }} 
            />
          </article>
        </div>

        {/* Right column: Sticky Sidebar */}
        <aside style={{
          width: '300px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          position: 'sticky',
          top: '120px',
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          paddingRight: '4px' // padding to avoid scrollbar overlapping content
        }}>
          {/* Widget 1: Search */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <form action="/blogs" method="GET" style={{ position: 'relative' }}>
              <input
                type="text"
                name="search"
                placeholder="Search..."
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
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '18px',
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
