'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Download, ChevronDown, ChevronLeft, ChevronRight, Search, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import '../../blogs/public.css';

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

const PAGE_SIZE = 10;
const BASE_URL = 'https://webclass.navigationtrading.com';

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPreviewPost, setSelectedPreviewPost] = useState<Post | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFilter, setExportFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const exportRef = useRef<HTMLDivElement>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Search + filters + sort + pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'PUBLISHED'>('ALL');
  const [authorFilter, setAuthorFilter] = useState<'ALL' | string>('ALL');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);

  const draftCount = posts.filter(p => p.status === 'DRAFT').length;

  const authorNames = useMemo(() => {
    const names = new Set<string>();
    posts.forEach(p => { if (p.author?.name) names.add(p.author.name); });
    return Array.from(names).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = posts.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (authorFilter !== 'ALL' && (p.author?.name || 'Admin User') !== authorFilter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
    result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dateSort === 'asc' ? diff : -diff;
    });
    return result;
  }, [posts, statusFilter, authorFilter, search, dateSort]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, authorFilter, search]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
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
    setOpenMenuId(null);
  };

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">Posts</h1>
          <p className="page-description">
            {loading ? 'Loading…' : `${posts.length} article${posts.length === 1 ? '' : 's'} · ${draftCount} draft${draftCount === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="page-header-actions">
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
                background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
                zIndex: 100, minWidth: '180px', padding: '6px',
              }}>
                {(['ALL', 'DRAFT', 'PUBLISHED'] as const).map(opt => (
                  <label key={opt} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '5px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: exportFilter === opt ? 600 : 400,
                    background: exportFilter === opt ? 'var(--accent)' : 'transparent',
                  }}>
                    <input
                      type="radio"
                      name="exportFilter"
                      value={opt}
                      checked={exportFilter === opt}
                      onChange={() => setExportFilter(opt)}
                      style={{ accentColor: 'var(--accent-color)' }}
                    />
                    {opt.charAt(0) + opt.slice(1).toLowerCase()}
                  </label>
                ))}
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '4px', paddingTop: '6px' }}>
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

      {/* ── Search + filters ── */}
      <div className="filter-bar" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search posts by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <select
          className="filter-select"
          value={authorFilter}
          onChange={e => setAuthorFilter(e.target.value)}
        >
          <option value="ALL">All authors</option>
          {authorNames.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No posts found. Create your first blog post!
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No posts match your search or filters.
          </div>
        ) : (
          <>
          <table>
            <thead>
              <tr>
                <th style={{ width: '36px' }}>
                  <input type="checkbox" className="table-checkbox" aria-label="Select all" disabled />
                </th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>
                  <button
                    type="button"
                    onClick={() => setDateSort(s => (s === 'desc' ? 'asc' : 'desc'))}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', textTransform: 'inherit', letterSpacing: 'inherit', cursor: 'pointer' }}
                    title="Sort by date created"
                  >
                    Date Created <ArrowUpDown size={12} />
                  </button>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <input type="checkbox" className="table-checkbox" aria-label={`Select ${post.title}`} />
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    <Link href={`/posts/edit/${post.id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                      {post.title}
                    </Link>
                    <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)', fontFamily: 'monospace', marginTop: '2px' }}>
                      /{post.slug}
                    </div>
                  </td>
                  <td>{post.author?.name || 'Admin User'}</td>
                  <td>
                    <span className={`status-badge ${post.status === 'PUBLISHED' ? 'status-published' : 'status-draft'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }} ref={openMenuId === post.id ? menuRef : undefined}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '6px 8px' }}
                        onClick={() => setOpenMenuId(prev => (prev === post.id ? null : post.id))}
                        title="Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenuId === post.id && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                          background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
                          zIndex: 100, minWidth: '160px', padding: '6px', textAlign: 'left',
                        }}>
                          <button
                            type="button"
                            onClick={() => { setSelectedPreviewPost(post); setOpenMenuId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', borderRadius: '5px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)' }}
                          >
                            <Eye size={14} /> Preview
                          </button>
                          <Link
                            href={`/posts/edit/${post.id}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', borderRadius: '5px', fontSize: '13px', color: 'var(--text-primary)', textDecoration: 'none' }}
                          >
                            <Edit size={14} /> Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => deletePost(post.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', borderRadius: '5px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#ef4444' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {pagedPosts.length} of {filteredPosts.length} post{filteredPosts.length === 1 ? '' : 's'}
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="pagination-page">Page {currentPage} of {totalPages}</span>
              <button
                type="button"
                className="btn-secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
          </>
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
                      color: 'var(--primary-color)',
                      lineHeight: '1.25',
                      marginBottom: '20px',
                      fontWeight: 800
                    }}>
                      {selectedPreviewPost.title}
                    </h1>

                    <div className="blog-meta" style={{ marginTop: '16px', marginBottom: 0, color: 'var(--text-secondary)' }}>
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
                          <div style={{ fontSize: '13px' }}>{formatDate(selectedPreviewPost.createdAt)}</div>
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
