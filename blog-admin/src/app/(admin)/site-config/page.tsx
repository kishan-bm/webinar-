'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search, Save, Globe, Loader2, CheckCircle2, AlertCircle, Calendar, Link as LinkIcon, Hash, Sliders } from 'lucide-react';

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'datetime-local' | 'number' | 'boolean' | 'url' | 'textarea';
  placeholder?: string;
  description?: string;
}

interface PageConfig {
  key: string;
  title: string;
  path: string;
  description: string;
  fields: FieldConfig[];
}

const PAGES_CONFIG: PageConfig[] = [
  {
    key: 'day-trading',
    title: 'Day Trading Live Webinar',
    path: '/day-trading',
    description: 'Main landing/registration page for the live day trading webinar.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local', description: 'When the webinar countdown timer expires' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. March 19', description: 'Brief date shown in tags' },
      { key: 'timeLabel', label: 'Time Badge Text', type: 'text', placeholder: 'e.g. 3:30 PM CT', description: 'Brief time shown in tags' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · March 19', description: 'Subtitle of session details card' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. March 19, 2026', description: 'Overview section tag text' },
      { key: 'fullDateSubtext', label: 'Register Button Subtext', type: 'text', placeholder: 'e.g. Wednesday, March 19 · 7:00 PM ET · Free & Live', description: 'Extended subtext under the register button' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 126', description: 'The registration form identifier' },
    ]
  },
  {
    key: 'day-trading-offer',
    title: 'Day Trading Offer Page',
    path: '/day-trading-offer',
    description: '48-hour offer deadline page giving 30% discount.',
    fields: [
      { key: 'countdownTarget', label: 'Offer Expiry Date & Time', type: 'datetime-local', description: 'When the 48-hour discount window expires' },
      { key: 'whopOfferUrl', label: 'Whop Checkout Promo Link', type: 'url', placeholder: 'https://whop.com/...', description: 'Checkout URL applied to checkout buttons' },
    ]
  },
  {
    key: 'dtt-6',
    title: 'Variant Webinar (dtt-6)',
    path: '/dtt-6/16',
    description: 'Variant registration page for the June 16 webinar edition.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. June 16' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · June 16' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. June 16, 2026' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 134' },
    ]
  },
  {
    key: 'transformer-option-spreads',
    title: 'Option Spreads Webinar',
    path: '/transformer-option-spreads',
    description: 'Option Spreads registration page and exit intent settings.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. May 6' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · May 6th' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. May 6, 2026' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 132', description: 'Inline registration form ID' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', description: 'Whether to show the exit intent popup when visitors leave' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', placeholder: 'Turn Any Options Trade Into a Risk-Free Position' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', placeholder: 'Using the DC TimeMachine strategy — live, with real trades.' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', placeholder: 'See FLUX signal a real entry live; Learn the Double Calendar setup; Get the $200/mo FLUX tool free', description: 'Semicolon (;) separated bullet points' },
      { key: 'exitPopupDate', label: 'Exit Popup Webinar Date Text', type: 'text', placeholder: 'Tuesday, May 6 | 8 PM IST' },
      { key: 'exitPopupFormId', label: 'Exit Popup ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 132' },
    ]
  },
  {
    key: 'home',
    title: 'Homepage',
    path: '/home',
    description: 'Navigation Trading Homepage, containing free signups and join links.',
    fields: [
      { key: 'whopLink', label: 'Join Room Whop URL', type: 'url', placeholder: 'https://whop.com/...', description: 'Whop checkout link when clicking Join Room' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number' },
    ]
  },
  {
    key: 'pricing',
    title: 'Pricing & Plans',
    path: '/pricing',
    description: 'Pricing grid displaying Free, Day Trading, and Pro memberships.',
    fields: [
      { key: 'whopFree', label: 'Free Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'whopDay', label: 'Day Trading Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'whopPro', label: 'Pro Trading Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number' },
    ]
  },
  {
    key: 'free-membership',
    title: 'Free Membership Welcome',
    path: '/free-membership',
    description: 'Welcome and overview page for Free members.',
    fields: [
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number' },
    ]
  },
  {
    key: 'paid-membership',
    title: 'Paid Membership Welcome',
    path: '/paid-membership',
    description: 'Welcome and details page for Paid/Pro members.',
    fields: [
      { key: 'whopLink', label: 'Pro Join Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number' },
    ]
  },
  {
    key: 'day-trading-replay-noshow',
    title: 'Replay NoShow Page',
    path: '/day-trading-replay-noshow',
    description: 'Replay page for registered users who missed the live webinar.',
    fields: [
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea' },
      { key: 'exitPopupRedirectUrl', label: 'Exit Popup Button Link', type: 'url', placeholder: 'e.g. day-trading-offer.html', description: 'Redirect URL when clicking Join Now inside exit popup' },
    ]
  },
  {
    key: 'day-trading-replay-v2',
    title: 'Day Trading Replay V2',
    path: '/day-trading-replay-v2',
    description: 'Variant replay page showing different CTAs.',
    fields: [
      { key: 'whopReplayUrl', label: 'Main Replay Join Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'whopOfferUrl', label: 'Middle Offer Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
      { key: 'whopFinalUrl', label: 'Final Bottom Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
    ]
  },
  {
    key: 'day-trading-replay',
    title: 'Day Trading Replay',
    path: '/day-trading-replay',
    description: 'Standard day trading replay page.',
    fields: [
      { key: 'whopLink', label: 'Join Room Whop Link', type: 'url', placeholder: 'https://whop.com/...' },
    ]
  }
];

export default function SiteConfigPage() {
  const [selectedPage, setSelectedPage] = useState<PageConfig>(PAGES_CONFIG[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isPending, startTransition] = useTransition();

  // Load all configurations
  useEffect(() => {
    fetchConfigs();
  }, []);

  // Update current form fields when selected page or configs change
  useEffect(() => {
    if (selectedPage) {
      const pageValues = configs[selectedPage.key] || {};
      const newFormState: Record<string, string> = {};
      selectedPage.fields.forEach(field => {
        newFormState[field.key] = pageValues[field.key] || '';
      });
      setFormState(newFormState);
      setStatus({ type: null, message: '' });
    }
  }, [selectedPage, configs]);

  const fetchConfigs = () => {
    setLoading(true);
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfigs(data.data || {});
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching configs:', err);
        setLoading(false);
      });
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: selectedPage.key,
          config: formState
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Configuration saved successfully! All updates are live.' });
        // Update local configs map
        setConfigs(prev => ({
          ...prev,
          [selectedPage.key]: {
            ...(prev[selectedPage.key] || {}),
            ...formState
          }
        }));
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to save configuration.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  // Filter pages based on search
  const filteredPages = PAGES_CONFIG.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'datetime-local':
        return <Calendar size={15} style={{ color: 'var(--accent-color)' }} />;
      case 'url':
        return <LinkIcon size={15} style={{ color: 'var(--accent-color)' }} />;
      case 'number':
        return <Hash size={15} style={{ color: 'var(--accent-color)' }} />;
      default:
        return <Sliders size={15} style={{ color: 'var(--accent-color)' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Website Configuration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: '4px 0 0 0' }}>
            Manage countdown clocks, checkout/Whop redirects, form IDs, and exit-intent popup content for all pages.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', flexDirection: 'column', gap: '16px' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading configurations...</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left panel: page search and listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search marketing pages..."
                style={{ paddingLeft: '40px', width: '100%', borderRadius: '10px' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
              <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                Pages ({filteredPages.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto' }}>
                {filteredPages.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                    No pages matched search.
                  </div>
                ) : (
                  filteredPages.map(page => {
                    const isSelected = selectedPage.key === page.key;
                    return (
                      <button
                        key={page.key}
                        onClick={() => setSelectedPage(page)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          padding: '16px',
                          textAlign: 'left',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(200,66,10,0.06)' : 'transparent',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          borderLeft: isSelected ? '4px solid var(--accent-color)' : '4px solid transparent',
                          paddingLeft: isSelected ? '12px' : '16px',
                        }}
                        onMouseOver={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                        }}
                        onMouseOut={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '14px', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                          {page.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10.5px', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {page.path}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right panel: settings editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(200,66,10,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{selectedPage.title}</h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Serving at: <code style={{ background: 'var(--bg-main)', padding: '2px 4px', borderRadius: '4px', color: 'var(--accent-color)' }}>{selectedPage.path}</code>
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '-8px', marginBottom: '28px', lineHeight: 1.5 }}>
                {selectedPage.description}
              </p>

              {/* Status Banner */}
              {status.type && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  marginBottom: '24px',
                  border: '1px solid',
                  backgroundColor: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  borderColor: status.type === 'success' ? '#10b981' : '#fca5a5',
                  color: status.type === 'success' ? '#065f46' : '#991b1b',
                }}>
                  {status.type === 'success' ? (
                    <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedPage.fields.map(field => {
                    const value = formState[field.key];
                    return (
                      <div key={field.key} className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getFieldIcon(field.type)}
                          <label className="form-label" style={{ marginBottom: 0, fontWeight: 600, fontSize: '13.5px' }}>
                            {field.label}
                          </label>
                        </div>

                        {field.type === 'boolean' ? (
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                              <input
                                type="checkbox"
                                checked={value === 'true'}
                                onChange={e => handleFieldChange(field.key, e.target.checked ? 'true' : 'false')}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  accentColor: 'var(--accent-color)',
                                  cursor: 'pointer'
                                }}
                              />
                              <span style={{ fontSize: '13.5px', color: value === 'true' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 600 }}>
                                {value === 'true' ? 'Active' : 'Disabled'}
                              </span>
                            </label>
                          </div>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            style={{ width: '100%', fontFamily: 'inherit', fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                          />
                        ) : (
                          <input
                            type={field.type === 'datetime-local' ? 'datetime-local' : 'text'}
                            className="form-control"
                            placeholder={field.placeholder}
                            value={value || ''}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            style={{ width: '100%', fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                          />
                        )}

                        {field.description && (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '2px' }}>
                            {field.description}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                    style={{ minWidth: '140px', justifyContent: 'center' }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
