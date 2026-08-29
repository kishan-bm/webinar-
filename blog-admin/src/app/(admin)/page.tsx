'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, FileEdit, CheckCircle2, Image as ImageIcon, AlertTriangle, Video } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
  author: { name: string };
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Overview() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerCount, setBannerCount] = useState<number | null>(null);
  const [replayUrl, setReplayUrl] = useState<string | null>(null);

  const totalPosts = posts.length;
  const draftCount = posts.filter(p => p.status === 'DRAFT').length;
  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBannerCount(data.data.length);
      })
      .catch((err) => console.error(err));

    // Same source the Replay Video page reads its "current video" from
    fetch('/replay-config.json?t=' + Date.now())
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.vimeo_url) setReplayUrl(data.vimeo_url);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Page header ── */}
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">Overview</h1>
          <p className="page-description">
            Everything that needs your attention across the blog and marketing pages.
          </p>
        </div>
        <div className="page-header-actions">
          <Link href="/banners" className="btn-secondary">
            Add banner
          </Link>
          <Link href="/posts/new" className="btn-primary">
            <Plus size={18} /> New post
          </Link>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Total posts</span>
            <span className="stat-card-icon"><FileText size={16} /></span>
          </div>
          <span className="stat-card-value">{loading ? '—' : totalPosts}</span>
          <span className="stat-card-subtitle">All blog articles</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Drafts</span>
            <span className="stat-card-icon"><FileEdit size={16} /></span>
          </div>
          <span className="stat-card-value">{loading ? '—' : draftCount}</span>
          <span className="stat-card-subtitle">Not visible on the site</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Published</span>
            <span className="stat-card-icon"><CheckCircle2 size={16} /></span>
          </div>
          <span className="stat-card-value">{loading ? '—' : publishedCount}</span>
          <span className="stat-card-subtitle">Live on the blog</span>
        </div>
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-card-label">Active banners</span>
            <span className="stat-card-icon"><ImageIcon size={16} /></span>
          </div>
          <span className="stat-card-value">{bannerCount === null ? '—' : bannerCount}</span>
          <span className="stat-card-subtitle">Shown in article sidebars</span>
        </div>
      </div>

      {/* ── Two-column: recent posts + needs attention ── */}
      <div className="overview-columns">
        {/* Recent posts */}
        <div className="table-container">
          <div className="panel-header">
            <h2 className="section-heading" style={{ margin: 0 }}>Recent posts</h2>
            <Link href="/posts" className="panel-header-link">View all</Link>
          </div>
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading…</div>
          ) : posts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No posts yet.</div>
          ) : (
            <div className="recent-list">
              {posts.slice(0, 6).map(post => (
                <div className="recent-list-row" key={post.id}>
                  <div style={{ minWidth: 0 }}>
                    <div className="recent-list-title">{post.title}</div>
                    <div className="recent-list-meta">
                      {post.author?.name || 'Admin User'} · {formatDate(post.createdAt)}
                    </div>
                  </div>
                  <span className={`status-badge ${post.status === 'PUBLISHED' ? 'status-published' : 'status-draft'}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Needs attention */}
        <div>
          <h2 className="section-heading">Needs attention</h2>
          <div className="attention-stack">
            {!loading && draftCount > 0 && (
              <div className="attention-card">
                <span className="attention-card-icon attention-card-icon-warning"><AlertTriangle size={18} /></span>
                <div className="attention-card-body">
                  <div className="attention-card-title">{draftCount} draft{draftCount === 1 ? '' : 's'} unpublished</div>
                  <div className="attention-card-desc">Review and publish or archive them to keep the blog current.</div>
                  <Link href="/posts" className="attention-card-action">Review drafts</Link>
                </div>
              </div>
            )}

            <div className="attention-card">
              <span className="attention-card-icon attention-card-icon-accent"><Video size={18} /></span>
              <div className="attention-card-body">
                <div className="attention-card-title">Replay video</div>
                <div className="attention-card-desc" style={{ wordBreak: 'break-all' }}>
                  {replayUrl || 'No replay video set yet.'}
                </div>
                <Link href="/replay" className="attention-card-action">Update video</Link>
              </div>
            </div>

            {bannerCount !== null && (
              <div className="attention-card">
                <span className="attention-card-icon attention-card-icon-accent"><ImageIcon size={18} /></span>
                <div className="attention-card-body">
                  <div className="attention-card-title">{bannerCount} sidebar banner{bannerCount === 1 ? '' : 's'}</div>
                  <div className="attention-card-desc">Check ordering and links before the next campaign.</div>
                  <Link href="/banners" className="attention-card-action">Manage banners</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
