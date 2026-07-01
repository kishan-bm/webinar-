'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Download, ChevronDown } from 'lucide-react';
import '../blogs/public.css';

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: { name: string };
  content: string;
  coverImage?: string;
  excerpt?: string;
  category?: { name: string };
  tags?: { id: string; name: string }[];
};

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

function injectHeadingIds(html: string) {
  let headingIndex = 0;
  return html.replace(/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    if (/id=/i.test(attrs)) return match;
    headingIndex++;
    const id = `heading-${headingIndex}`;
    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });
}

const BASE_URL = 'https://webclass.navigationtrading.com';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreviewPost, setSelectedPreviewPost] = useState<Post | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFilter, setExportFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleExport = () => {
    const filtered = exportFilter === 'ALL'
      ? posts
      : posts.filter(p => p.status === exportFilter);

    const rows = [['S.No', 'URL', 'Status']];
    filtered.forEach((post, i) => {
      rows.push([(i + 1).toString(), `${BASE_URL}/blogs/${post.slug}`, post.status]);
    });

    const csv = rows.map(r => r.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `posts-${exportFilter.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (e) {
      alert('Failed to delete post');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Posts</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Export dropdown */}
          <div ref={exportRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setExportOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
            >
              <Download size={16} />
              Export
              <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>
            {exportOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '8px', boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                zIndex: 100, minWidth: '180px', padding: '6px',
              }}>
                {(['ALL', 'DRAFT', 'PUBLISHED'] as const).map(opt => (
                  <label key={opt} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '5px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: exportFilter === opt ? 600 : 400,
                    background: exportFilter === opt ? 'rgba(200,66,10,0.07)' : 'transparent',
                  }}>
                    <input
                      type="radio"
                      name="exportFilter"
                      value={opt}
                      checked={exportFilter === opt}
                      onChange={() => setExportFilter(opt)}
                      style={{ accentColor: 'var(--accent-color, #c8420a)' }}
                    />
                    {opt.charAt(0) + opt.slice(1).toLowerCase()}
                  </label>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color, #e2e8f0)', marginTop: '4px', paddingTop: '6px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleExport}
                    style={{ width: '100%', justifyContent: 'center', padding: '8px' }}
                  >
                    <Download size={14} /> Download CSV
                  </button>
                </div>
              </div>
            )}
          </div>
          <Link href="/posts/new" className="btn-primary">
            <Plus size={18} /> Create Post
          </Link>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No posts found. Create your first blog post!
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{post.title}</td>
                  <td>{post.author?.name || 'Admin User'}</td>
                  <td>
                    <span className={`status-badge ${post.status === 'PUBLISHED' ? 'status-published' : 'status-draft'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setSelectedPreviewPost(post)} 
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', color: 'var(--teal-900)' }}
                        title="Preview Post"
                      >
                        <Eye size={16} />
                      </button>
                      <Link href={`/posts/edit/${post.id}`} className="btn-secondary" style={{ padding: '6px 12px' }}>
                        <Edit size={16} /> Edit
                      </Link>
                      <button onClick={() => deletePost(post.id)} className="btn-secondary" style={{ padding: '6px 12px', color: '#ef4444', borderColor: '#fecaca' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* High-Fidelity Preview Modal */}
      {selectedPreviewPost && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 46, 78, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          }}
          onClick={() => setSelectedPreviewPost(null)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '960px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky Close Button */}
            <button 
              onClick={() => setSelectedPreviewPost(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'white',
                border: '1.5px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 100,
                color: 'var(--teal-900)',
                transition: 'all 0.2s',
              }}
              className="preview-close-btn"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="blog-page-container" style={{ paddingTop: 0, paddingBottom: 0, background: 'transparent' }}>
              {selectedPreviewPost.coverImage && (
                <div className="article-cover-hero" style={{ height: '320px', maxHeight: '320px' }}>
                  <img
                    src={selectedPreviewPost.coverImage}
                    alt={selectedPreviewPost.title}
                    className="article-cover-img"
                    style={{ height: '320px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ padding: '40px 48px' }}>
                <article className="blog-content" style={{ margin: 0, maxWidth: 'none', padding: 0, border: 'none', boxShadow: 'none' }}>
                  <div className="article-header" style={{ padding: '0 0 28px', background: 'transparent' }}>
                    {selectedPreviewPost.category && (
                      <div style={{ marginBottom: '12px' }}>
                        <span className="article-category-label">
                          {selectedPreviewPost.category.name}
                        </span>
                      </div>
                    )}

                    <h1 className="blog-title" style={{
                      fontSize: '34px',
                      color: '#0d2e4e',
                      lineHeight: '1.25',
                      marginBottom: '20px',
                      fontWeight: 800
                    }}>
                      {selectedPreviewPost.title}
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
                          {selectedPreviewPost.author?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{selectedPreviewPost.author?.name || 'Admin User'}</div>
                          <div style={{ fontSize: '13px' }}>{new Date(selectedPreviewPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                      </div>
                    </div>

                    {selectedPreviewPost.tags && selectedPreviewPost.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                        {selectedPreviewPost.tags.map(tag => (
                          <span
                            key={tag.id}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #e2e8f0',
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: 500
                            }}
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className="blog-body"
                    style={{ padding: '32px 0 0', fontSize: '16px', color: '#334155', lineHeight: '1.75' }}
                    dangerouslySetInnerHTML={{ 
                      __html: injectHeadingIds(decodeHTMLBlocks(selectedPreviewPost.content)) 
                    }}
                  />
                </article>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
