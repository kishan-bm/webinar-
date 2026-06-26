'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle2, AlertCircle, ChevronRight, MousePointerClick } from 'lucide-react';

const EXIT_FIELDS = [
  { key: 'exitPopupShow',     label: 'Enable Exit Intent Popup',              type: 'boolean',  description: 'Show the popup when visitors try to leave the page' },
  { key: 'exitPopupHeadline', label: 'Headline',                              type: 'text',     placeholder: 'e.g. Turn Any Options Trade Into a Risk-Free Position' },
  { key: 'exitPopupTagline',  label: 'Tagline',                               type: 'text',     placeholder: 'e.g. Using the DC TimeMachine strategy — live, with real trades.' },
  { key: 'exitPopupBullets',  label: 'Bullet Points (semicolon-separated)',   type: 'textarea', placeholder: 'Point one; Point two; Point three', description: 'Each bullet separated by a semicolon (;)' },
  { key: 'exitPopupDate',     label: 'Webinar Date Text',                     type: 'text',     placeholder: 'e.g. Tuesday, May 6 | 8 PM IST' },
  { key: 'exitPopupFormId',   label: 'ActiveCampaign Form ID',                type: 'number',   placeholder: 'e.g. 132' },
  { key: 'exitPopupRedirectUrl', label: 'Button Redirect URL (optional)',     type: 'text',     placeholder: 'e.g. /day-trading-offer', description: 'Only used on pages that use a redirect button instead of a form' },
];

const PAGES_WITH_EXIT = [
  { key: 'transformer-option-spreads', title: 'Option Spreads Webinar',       path: '/transformer-option-spreads' },
  { key: 'home',                        title: 'Homepage',                     path: '/home' },
  { key: 'pricing',                     title: 'Pricing & Plans',              path: '/pricing' },
  { key: 'free-membership',             title: 'Free Membership Welcome',      path: '/free-membership' },
  { key: 'paid-membership',             title: 'Paid Membership Welcome',      path: '/paid-membership' },
  { key: 'day-trading-replay-noshow',   title: 'Replay NoShow Page',           path: '/day-trading-replay-noshow' },
  { key: 'day-trading',                 title: 'Day Trading Live Webinar',     path: '/day-trading' },
  { key: 'dtt-6',                       title: 'Variant Webinar (dtt-6)',      path: '/dtt-6/16' },
];

export default function ExitIntentPage() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) setConfigs(data.data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Populate form when a page is selected
  useEffect(() => {
    if (!selectedKey) return;
    const pageValues = configs[selectedKey] || {};
    const state: Record<string, string> = {};
    EXIT_FIELDS.forEach(f => { state[f.key] = pageValues[f.key] || ''; });
    setFormState(state);
    setStatus({ type: null, message: '' });
  }, [selectedKey, configs]);

  const selectedPage = PAGES_WITH_EXIT.find(p => p.key === selectedKey);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;
    setSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pageKey: selectedKey, config: formState }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Exit intent settings saved successfully!' });
        setConfigs(prev => ({ ...prev, [selectedKey]: { ...(prev[selectedKey] || {}), ...formState } }));
      } else {
        setStatus({ type: 'error', message: data.error || 'Save failed.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error — please try again.' });
    }
    setSaving(false);
  };

  const getPageStatus = (key: string) => {
    const v = configs[key];
    if (!v) return 'unconfigured';
    return v.exitPopupShow === 'true' ? 'enabled' : 'disabled';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>

      {/* Left — page list */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: 0 }}>Pages</h2>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
          {PAGES_WITH_EXIT.map(page => {
            const st = loading ? 'loading' : getPageStatus(page.key);
            return (
              <li key={page.key}>
                <button
                  onClick={() => setSelectedKey(page.key)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '12px 20px',
                    background: selectedKey === page.key ? 'rgba(200,66,10,0.08)' : 'transparent',
                    border: 'none',
                    borderLeft: selectedKey === page.key ? '3px solid var(--accent-color)' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: selectedKey === page.key ? 'var(--accent-color)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {page.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{page.path}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block',
                      background: st === 'enabled' ? '#22c55e' : st === 'disabled' ? '#94a3b8' : '#e2e8f0',
                    }} />
                    <ChevronRight size={14} color="var(--text-secondary)" />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right — editor */}
      {!selectedPage ? (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 32px', textAlign: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(200,66,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MousePointerClick size={24} color="var(--accent-color)" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>Select a Page</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
              Pick a page from the left to edit its exit intent popup settings.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Header */}
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px' }}>{selectedPage.title}</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Exit intent popup settings for <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: '4px', fontSize: '12px' }}>{selectedPage.path}</code>
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              Popup Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {EXIT_FIELDS.map(field => {
                if (field.key === 'exitPopupRedirectUrl') {
                  const hasRedirect = ['day-trading-replay-noshow'].includes(selectedKey!);
                  if (!hasRedirect) return null;
                }
                return (
                  <div key={field.key} className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {field.label}
                      {field.description && (
                        <span style={{ fontWeight: 400, fontSize: '11.5px', color: 'var(--text-secondary)', textTransform: 'none', letterSpacing: 0 }}>{field.description}</span>
                      )}
                    </label>

                    {field.type === 'boolean' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setFormState(prev => ({ ...prev, [field.key]: prev[field.key] === 'true' ? 'false' : 'true' }))}
                          style={{
                            width: '44px', height: '24px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                            background: formState[field.key] === 'true' ? 'var(--accent-color)' : '#cbd5e1',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                          }}
                        >
                          <span style={{
                            position: 'absolute', top: '3px',
                            left: formState[field.key] === 'true' ? '23px' : '3px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#fff', transition: 'left 0.2s', display: 'block',
                          }} />
                        </button>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: formState[field.key] === 'true' ? 'var(--accent-color)' : 'var(--text-secondary)' }}>
                          {formState[field.key] === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder={field.placeholder}
                        value={formState[field.key] || ''}
                        onChange={e => setFormState(prev => ({ ...prev, [field.key]: e.target.value }))}
                        style={{ resize: 'vertical', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        className="form-input"
                        placeholder={field.placeholder}
                        value={formState[field.key] || ''}
                        onChange={e => setFormState(prev => ({ ...prev, [field.key]: e.target.value }))}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status */}
          {status.type && (
            <div style={{
              padding: '12px 16px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid',
              background: status.type === 'success' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              borderColor: status.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)',
              color: status.type === 'success' ? '#16a34a' : '#ef4444',
            }}>
              {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{ alignSelf: 'flex-start', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
          >
            {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
