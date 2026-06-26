'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface PostWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date | string;
  category: { id: string; name: string } | null;
  author: { name: string; avatarUrl: string | null };
  tags?: { id: string; name: string }[] | null;
}

interface BlogListWithFilterProps {
  posts: PostWithRelations[];
}

export default function BlogListWithFilter({ posts }: BlogListWithFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tagQuery = searchParams.get('tag') || '';
  const categoryQuery = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<string>(categoryQuery);

  useEffect(() => {
    setActiveCategory(categoryQuery);
  }, [categoryQuery]);

  // Extract unique category names
  const categories = ['All', ...Array.from(new Set(
    posts
      .map(post => post.category?.name)
      .filter((name): name is string => !!name)
  ))];

  // Filter posts based on active category AND tag query parameter AND search query
  let filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter(post => post.category?.name === activeCategory);

  if (tagQuery) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags?.some(t => t.name.toLowerCase() === tagQuery.toLowerCase())
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(q) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(q))
    );
  }

  return (
    <div>
      {/* Active Search Filter Banner */}
      {searchQuery && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          margin: '-16px auto 32px auto',
          background: 'rgba(200, 66, 10, 0.05)',
          border: '1px dashed var(--orange)',
          padding: '10px 20px',
          borderRadius: '8px',
          maxWidth: 'fit-content'
        }}>
          <span style={{ fontSize: '15px', color: 'var(--teal-900)', fontWeight: 500 }}>
            Search results for: <strong style={{ color: 'var(--orange)' }}>"{searchQuery}"</strong>
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('search');
              router.push(`/blogs?${params.toString()}`);
            }}
            style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--orange)'
            }}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Active Tag Filter Banner */}
      {tagQuery && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          margin: '-16px auto 32px auto',
          background: 'rgba(200, 66, 10, 0.05)',
          border: '1px dashed var(--orange)',
          padding: '10px 20px',
          borderRadius: '8px',
          maxWidth: 'fit-content'
        }}>
          <span style={{ fontSize: '15px', color: 'var(--teal-900)', fontWeight: 500 }}>
            Showing posts tagged: <strong style={{ color: 'var(--orange)' }}>#{tagQuery}</strong>
          </span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('tag');
              router.push(`/blogs?${params.toString()}`);
            }}
            style={{
              background: 'white',
              border: '1px solid var(--border-light)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--orange)'
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                const params = new URLSearchParams(searchParams.toString());
                if (category === 'All') {
                  params.delete('category');
                } else {
                  params.set('category', category);
                }
                router.push(`/blogs?${params.toString()}`);
              }}
              style={{
                padding: '8px 20px',
                borderRadius: '30px',
                border: '1px solid var(--border-light)',
                background: activeCategory === category ? 'var(--orange)' : 'white',
                color: activeCategory === category ? 'white' : 'var(--teal-900)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeCategory === category ? '0 4px 12px rgba(200, 66, 10, 0.2)' : 'none',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="blog-grid">
        {filteredPosts.length === 0 ? (
          searchQuery ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '32px',
              flexWrap: 'wrap',
              padding: '24px 32px', 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid var(--border-light)', 
              width: '100%', 
              maxWidth: '1200px', 
              margin: '16px auto',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              textAlign: 'left'
            }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--teal-900)', margin: '0 0 4px 0' }}>
                  Need a new search?
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0 }}>
                  If you didn't find what you were looking for, try a new search!
                </p>
              </div>
              <form action="/blogs" method="GET" style={{ position: 'relative', width: '100%', maxWidth: '360px', margin: 0 }}>
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    paddingRight: '44px',
                    border: '2px solid var(--orange)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#1e293b',
                    boxShadow: '0 4px 14px rgba(200, 66, 10, 0.1)',
                    background: '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'var(--orange)'
                  }}
                >
                  🔍
                </button>
              </form>
            </div>
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px' }}>
              <p>No posts match this filter. Check back soon!</p>
            </div>
          )
        ) : (
          filteredPosts.map(post => {
            return (
              <a href={`/blogs/${post.slug}`} key={post.id} className="blog-card">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} loading="lazy" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <div className="blog-card-content">
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--emerald-600)', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {post.category ? post.category.name : 'ARTICLE'}
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <div className="blog-card-excerpt">
                    {post.excerpt || 'Read the full article to learn more...'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="read-more">
                      Read Post &rarr;
                    </div>
                  </div>
                </div>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
