'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

type Author = {
  id: string;
  name: string;
  email: string;
  postCount?: number;
};

type SessionUser = {
  name: string;
  email: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'authors' | 'account'>('authors');

  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetchAuthors();
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.success && data.user) setSessionUser(data.user);
      })
      .catch(() => {});
  }, []);

  const fetchAuthors = () => {
    setLoading(true);
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAuthors(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (data.success) {
        setName('');
        setEmail('');
        setShowAddModal(false);
        fetchAuthors();
      } else {
        setError(data.error || 'Failed to add author');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author? Any posts linked to this author might fail to render if they do not have an author.')) return;

    try {
      const res = await fetch(`/api/authors?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setAuthors(authors.filter((a) => a.id !== id));
      } else {
        alert(data.error || 'Failed to delete author');
      }
    } catch (err) {
      alert('An error occurred while deleting the author.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-heading">
          <h1 className="page-title">Settings</h1>
          <p className="page-description">Authors and account preferences for the admin portal.</p>
        </div>
      </div>

      <div className="tab-bar">
        <button
          type="button"
          className={`tab-pill ${activeTab === 'authors' ? 'active' : ''}`}
          onClick={() => setActiveTab('authors')}
        >
          Authors
        </button>
        <button
          type="button"
          className={`tab-pill ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      {activeTab === 'authors' ? (
        <div className="table-container">
          <div className="panel-header">
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {authors.length} author{authors.length === 1 ? '' : 's'}
            </span>
            <button type="button" className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add author
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading authors...</div>
          ) : authors.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No authors registered.</div>
          ) : (
            <div className="recent-list">
              {authors.map((author) => (
                <div className="recent-list-row" key={author.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="recent-list-title">{author.name}</div>
                      <div className="recent-list-meta">{author.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexShrink: 0 }}>
                    {typeof author.postCount === 'number' && (
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {author.postCount} post{author.postCount === 1 ? '' : 's'}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 8px', color: '#ef4444', borderColor: '#fecaca' }}
                      title="Delete author"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '480px' }}>
          <h2 className="section-heading" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            Signed in as
          </h2>
          {sessionUser ? (
            <div className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Name</label>
                <div style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500 }}>{sessionUser.name}</div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <div style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500 }}>{sessionUser.email}</div>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Account details are unavailable in this session.
            </p>
          )}
        </div>
      )}

      {/* Add Author Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(13, 46, 78, 0.5)', backdropFilter: 'blur(4px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div className="card" style={{ width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 className="section-heading" style={{ margin: 0 }}>Add new author</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '6px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddAuthor} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kishan B M"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. kishan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                <Plus size={18} /> {saving ? 'Adding...' : 'Add Author'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
