'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, ExternalLink, X } from 'lucide-react';

type Redirect = {
  id: string;
  slug: string;
  targetUrl: string;
  createdAt: string;
};

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [slug, setSlug] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = () => {
    setLoading(true);
    fetch('/api/redirects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRedirects(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const resetForm = () => {
    setSlug('');
    setTargetUrl('');
    setError('');
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (redirect: Redirect) => {
    setEditingId(redirect.id);
    setSlug(redirect.slug);
    setTargetUrl(redirect.targetUrl);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !targetUrl.trim()) {
      setError('Both the slug and the destination URL are required.');
      return;
    }

    setSaving(true);
    setError('');

    let formattedUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      const res = await fetch(editingId ? `/api/redirects/${editingId}` : '/api/redirects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, targetUrl: formattedUrl }),
      });
      const data = await res.json();

      if (data.success) {
        resetForm();
        setShowModal(false);
        fetchRedirects();
      } else {
        setError(data.error || 'Failed to save redirect');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this redirect? The slug will stop working immediately.')) return;

    try {
      const res = await fetch(`/api/redirects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRedirects(redirects.filter((r) => r.id !== id));
      } else {
        alert(data.error || 'Failed to delete redirect');
      }
    } catch (err) {
      alert('An error occurred while deleting the redirect.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">Redirects</h1>
          <p className="page-description">
            Short links like navigationtrading.com/pro that forward visitors to another page or a third-party link.
          </p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add redirect
          </button>
        </div>
      </div>

      {loading ? (
        <div className="table-container" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading redirects...
        </div>
      ) : redirects.length === 0 ? (
        <div className="table-container" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No redirects yet. Click "Add redirect" to create your first one.
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Slug</th>
                <th>Destination</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {redirects.map((r) => (
                <tr key={r.id}>
                  <td>
                    <code style={{ fontSize: '13px', fontWeight: 600 }}>/{r.slug}</code>
                  </td>
                  <td>
                    <a href={r.targetUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {r.targetUrl.length > 60 ? r.targetUrl.slice(0, 60) + '…' : r.targetUrl} <ExternalLink size={12} />
                    </a>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => openEditModal(r)}
                        className="btn-secondary"
                        style={{ padding: '5px 7px' }}
                        title="Edit redirect"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="btn-secondary"
                        style={{ padding: '5px 7px', color: '#ef4444', borderColor: '#fecaca' }}
                        title="Delete redirect"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(13, 46, 78, 0.5)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
          onClick={() => { setShowModal(false); resetForm(); }}
        >
          <div
            className="card"
            style={{ width: '100%', maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="section-heading" style={{ margin: 0 }}>{editingId ? 'Edit redirect' : 'Add redirect'}</h2>
              <button
                type="button"
                onClick={() => { setShowModal(false); resetForm(); }}
                className="btn-secondary"
                style={{ padding: '6px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. pro"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <p className="form-hint">navigationtrading.com/{slug || 'your-slug'}</p>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Destination URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. https://whop.com/navigationtrading/ntpro/"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              >
                <Plus size={18} /> {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add redirect'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
