'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { ssr: false });

type EditPostProps = {
  params: Promise<{ id: string }>;
};

export default function EditPost({ params }: EditPostProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const lastSavedDataRef = useRef<string>('');
  const [authors, setAuthors] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    content: '',
    status: 'DRAFT',
    authorId: '',
    excerpt: '',
    coverImage: '',
    coverImageAlt: '',
    categoryName: '',
    tagNames: ''
  });

  // Fetch authors and post data
  useEffect(() => {
    // 1. Fetch authors
    fetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAuthors(data.data);
        }
      });

    // 2. Fetch post details
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const post = data.data;
          const loaded = {
            title: post.title || '',
            slug: post.slug || '',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            content: post.content || '',
            status: post.status || 'DRAFT',
            authorId: post.authorId || '',
            excerpt: post.excerpt || '',
            coverImage: post.coverImage || '',
            coverImageAlt: post.coverImageAlt || '',
            categoryName: post.category?.name || '',
            tagNames: post.tags?.map((t: any) => t.name).join(', ') || ''
          };
          setFormData(loaded);
          lastSavedDataRef.current = JSON.stringify(loaded);
        } else {
          alert('Failed to load post data');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load post data');
        setLoading(false);
      });
  }, [id]);

  // Auto-save every 10 seconds if there are unsaved changes
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(async () => {
      const current = JSON.stringify(formDataRef.current);
      if (current === lastSavedDataRef.current) return; // nothing changed

      setAutoSaveStatus('saving');
      try {
        const res = await fetch(`/api/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formDataRef.current, status: 'DRAFT' }),
        });
        const data = await res.json();
        if (data.success) {
          lastSavedDataRef.current = current;
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        } else {
          setAutoSaveStatus('error');
        }
      } catch {
        setAutoSaveStatus('error');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [id, loading]);

  const uploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSaving(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, coverImage: data.publicUrl }));
    } catch (error) {
      alert('Error uploading image');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Don't save if post data hasn't loaded yet
    setSaving(true);

    const submitData = { ...formData };
    // On edit, never auto-generate slug from title — the API will preserve the existing slug if empty

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      if (data.success) {
        window.location.href = '/posts';
      } else {
        alert(data.error || 'Failed to update post');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
        Loading post content...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-heading">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Edit post</h1>
            {autoSaveStatus === 'saving' && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1s infinite' }} />
                Auto-saving…
              </span>
            )}
            {autoSaveStatus === 'saved' && (
              <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ✓ Draft auto-saved
              </span>
            )}
            {autoSaveStatus === 'error' && (
              <span style={{ fontSize: '13px', color: '#ef4444' }}>Auto-save failed</span>
            )}
          </div>
          <p className="page-description">Changes to drafts are auto-saved every 10 seconds.</p>
        </div>
        <div className="page-header-actions">
          <Link href="/posts" className="btn-secondary">
            <ArrowLeft size={16} /> Back to posts
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="post-form-layout">
          {/* Main Content Column */}
          <div className="post-form-main">
            <div className="card">
              <h2 className="section-heading" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Content</h2>

              <div id="editor-toolbar-portal"></div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter an engaging title..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  placeholder="my-awesome-post"
                />
                <p className="form-hint">/blogs/{formData.slug || 'your-post'}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Excerpt</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="A short summary of the article..."
                ></textarea>
                <p className="form-hint">Shown in listings and previews.</p>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Body</label>
                <TipTapEditor
                  content={formData.content}
                  onChange={(html) => setFormData({...formData, content: html})}
                  toolbarPortalId="editor-toolbar-portal"
                />
              </div>
            </div>

            <div className="card">
              <h2 className="section-heading" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Organization</h2>

              <div className="form-group">
                <label className="form-label">Featured Image (Cover)</label>
                {formData.coverImage && (
                  <div style={{ marginBottom: '8px', position: 'relative', display: 'inline-block', width: '100%' }}>
                    <img src={formData.coverImage} alt={formData.coverImageAlt || 'Cover'} style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, coverImage: '', coverImageAlt: '' }))}
                      title="Remove image"
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(15,15,15,0.75)', color: '#fff',
                        border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50%',
                        width: '34px', height: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', fontSize: '20px', lineHeight: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                      }}
                    >×</button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={uploadCoverImage} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image Alt Text</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Describe the image for SEO and accessibility..."
                  value={formData.coverImageAlt}
                  onChange={e => setFormData({...formData, coverImageAlt: e.target.value})}
                />
              </div>
              <div className="post-form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.categoryName}
                    onChange={e => setFormData({...formData, categoryName: e.target.value})}
                    placeholder="e.g. Options Trading"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.tagNames}
                    onChange={e => setFormData({...formData, tagNames: e.target.value})}
                    placeholder="e.g. Iron Condor, SPX"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-secondary" onClick={() => router.push('/posts')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving || loading}>
                {saving ? 'Updating...' : loading ? 'Loading...' : 'Update Post'}
              </button>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="post-form-side">
            <div className="card">
              <h2 className="section-heading" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>Publishing</h2>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Author</label>
                {authors.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#ef4444' }}>No authors found. Set one in Settings!</div>
                ) : (
                  <select
                    className="form-input"
                    value={formData.authorId}
                    onChange={e => setFormData({...formData, authorId: e.target.value})}
                    required
                  >
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="section-heading" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>SEO</h2>

              <div className="form-group">
                <label className="form-label">SEO title</label>
                <input
                  type="text"
                  className="form-input"
                  maxLength={60}
                  value={formData.seoTitle}
                  onChange={e => setFormData({...formData, seoTitle: e.target.value})}
                />
                <p className="form-hint">{formData.seoTitle.length}/60 characters</p>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Meta description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  maxLength={160}
                  value={formData.seoDescription}
                  onChange={e => setFormData({...formData, seoDescription: e.target.value})}
                ></textarea>
                <p className="form-hint">{formData.seoDescription.length}/160 characters</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
