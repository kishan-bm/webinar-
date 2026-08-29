'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Banner = {
  id: string;
  title: string | null;
  imageUrl: string;
  imageAlt: string | null;
  linkUrl: string | null;
  order: number;
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = () => {
    setLoading(true);
    fetch('/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBanners(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      setError('Supabase client is not configured. Please check your environment variables.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image. Make sure a public bucket named "images" exists.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setImageAlt('');
    setLinkUrl('');
    setImageUrl('');
    setError('');
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Please upload a banner image first.');
      return;
    }

    setSaving(true);
    setError('');

    let formattedLink = linkUrl.trim() || null;
    if (formattedLink && !/^https?:\/\//i.test(formattedLink) && !formattedLink.startsWith('/')) {
      formattedLink = 'https://' + formattedLink;
    }

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || null,
          imageAlt: imageAlt.trim() || null,
          linkUrl: formattedLink,
          imageUrl,
        }),
      });
      const data = await res.json();

      if (data.success) {
        resetForm();
        setShowAddModal(false);
        fetchBanners();
      } else {
        setError(data.error || 'Failed to create banner');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBanners(banners.filter((b) => b.id !== id));
      } else {
        alert(data.error || 'Failed to delete banner');
      }
    } catch (err) {
      alert('An error occurred while deleting the banner.');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = banners[index];
    const above = banners[index - 1];

    try {
      const currentOrder = current.order;
      const aboveOrder = above.order;

      await fetch(`/api/banners/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: aboveOrder }),
      });

      await fetch(`/api/banners/${above.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: currentOrder }),
      });

      fetchBanners();
    } catch (err) {
      console.error('Failed to change order:', err);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const current = banners[index];
    const below = banners[index + 1];

    try {
      const currentOrder = current.order;
      const belowOrder = below.order;

      await fetch(`/api/banners/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: belowOrder }),
      });

      await fetch(`/api/banners/${below.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: currentOrder }),
      });

      fetchBanners();
    } catch (err) {
      console.error('Failed to change order:', err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">Sidebar Banners</h1>
          <p className="page-description">
            Graphic posters that appear in the right-side column of all published blog articles.
          </p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add banner
          </button>
        </div>
      </div>

      {loading ? (
        <div className="table-container" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading banners...
        </div>
      ) : banners.length === 0 ? (
        <div className="table-container" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No banners yet. Click "Add banner" to create your first one.
        </div>
      ) : (
        <div className="banner-grid">
          {banners.map((banner, index) => (
            <div className="banner-card" key={banner.id}>
              <div className="banner-card-thumb">
                <img src={banner.imageUrl} alt={banner.imageAlt || banner.title || 'Banner'} />
              </div>
              <div className="banner-card-body">
                <div className="banner-card-title">
                  {banner.title || <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--text-secondary)' }}>No Title</span>}
                </div>
                {banner.linkUrl ? (
                  <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="banner-card-link">
                    {banner.linkUrl.replace(/^https?:\/\//, '')} <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="banner-card-link" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No link</span>
                )}
                <div className="banner-card-footer">
                  <span className="banner-card-sort">Sort {index + 1}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="btn-secondary"
                      style={{ padding: '5px 7px', opacity: index === 0 ? 0.4 : 1 }}
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === banners.length - 1}
                      className="btn-secondary"
                      style={{ padding: '5px 7px', opacity: index === banners.length - 1 ? 0.4 : 1 }}
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="btn-secondary"
                      style={{ padding: '5px 7px', color: '#ef4444', borderColor: '#fecaca' }}
                      title="Delete Banner"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(13, 46, 78, 0.5)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
          onClick={() => { setShowAddModal(false); resetForm(); }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="section-heading" style={{ margin: 0 }}>Add banner</h2>
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="btn-secondary"
                style={{ padding: '6px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddBanner} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Heading / Title (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Get Flagship Course Free!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image Alt Text (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Describe the banner image for SEO and accessibility..."
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Link URL (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. https://navigationtrading.com/alerts"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Upload Poster Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'block', fontSize: '13px' }}
                />
              </div>

              {uploading && (
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Uploading banner image...
                </div>
              )}

              {imageUrl && !uploading && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Uploaded Poster Preview:
                  </span>
                  <img
                    src={imageUrl}
                    alt="Uploaded preview"
                    style={{
                      width: '100%',
                      maxHeight: '160px',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: '#f9fafb',
                    }}
                  />
                </div>
              )}

              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving || uploading || !imageUrl}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <Plus size={18} /> {saving ? 'Saving...' : 'Add Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
