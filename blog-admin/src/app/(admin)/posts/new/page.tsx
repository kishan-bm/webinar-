'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), { ssr: false });

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  // Fetch authors for the dropdown
  useEffect(() => {
    fetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAuthors(data.data);
          setFormData(prev => ({ ...prev, authorId: data.data[0].id }));
        }
      });
  }, []);

  const uploadCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-generate slug if empty
    let submitData = { ...formData };
    if (!submitData.slug) {
      submitData.slug = slugify(submitData.title);
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = '/posts';
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">New post</h1>
          <p className="page-description">Draft a new blog article.</p>
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
                  placeholder="auto-generated from the title"
                />
                <p className="form-hint">/blogs/{formData.slug || slugify(formData.title) || 'your-post'}</p>
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
                  <div style={{ marginBottom: '8px' }}>
                    <img src={formData.coverImage} alt={formData.coverImageAlt || 'Cover'} style={{ width: '100%', borderRadius: '8px' }} />
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
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Post'}
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
                  <div style={{ fontSize: '12px', color: '#ef4444' }}>No authors found. Add one in Settings.</div>
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
