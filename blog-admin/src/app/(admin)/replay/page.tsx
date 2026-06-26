'use client';

import { useState, useEffect } from 'react';
import { Eye, Key, Save, ExternalLink, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function ReplayAdminPage() {
  const ADMIN_PASSWORD = 'ntreplay2026';
  const GITHUB_OWNER = 'kishan-bm';
  const GITHUB_REPO = 'webinar-';
  const CONFIG_PATH = 'replay-config.json';
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNCq_1GGFDQDM1ZHFY5ZOiT0byuu3DqTGcxHP3_NJlAZU9XoLMYrEsmgdaWQxUEyPZTmDgU79nLJN-/pub?gid=0&single=true&output=csv';

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [currentVideo, setCurrentVideo] = useState('Checking...');
  const [hasVideoClass, setHasVideoClass] = useState(false);

  const [activeTab, setActiveTab] = useState<'github' | 'sheet'>('github');

  useEffect(() => { loadCurrentConfig(); }, []);

  // GitHub Method State
  const [githubToken, setGithubToken] = useState('');
  const [vimeoUrl, setVimeoUrl] = useState('');
  const [githubStatus, setGithubStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; msg: string }>({ type: null, msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Sheet Method State
  const [sheetStatus, setSheetStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; msg: string }>({ type: null, msg: '' });

  // Handle Login
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      loadCurrentConfig();
    } else {
      setLoginError('Incorrect password.');
    }
  };

  // Load Config
  const loadCurrentConfig = async () => {
    setCurrentVideo('Checking...');
    setHasVideoClass(false);
    try {
      // In next.js admin page, we try fetching from public URL or fall back to sheet
      const res = await fetch('/replay-config.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data.vimeo_url) {
          setCurrentVideo(data.vimeo_url);
          setHasVideoClass(true);
          return;
        }
      }
      // Fallback to sheet check
      checkSheet();
    } catch (e) {
      checkSheet();
    }
  };

  const checkSheet = async () => {
    try {
      const res = await fetch(SHEET_CSV_URL + '&t=' + Date.now(), { cache: 'no-store' });
      const text = (await res.text()).trim();
      if (text && text.includes('vimeo')) {
        setCurrentVideo('(Google Sheet) ' + text);
        setHasVideoClass(true);
      } else {
        setCurrentVideo(text ? 'Sheet has: "' + text + '" (not a Vimeo URL)' : 'Nothing set yet.');
      }
    } catch (e) {
      setCurrentVideo('Could not load current configuration.');
    }
  };

  // Save via GitHub
  const saveViaGitHub = async () => {
    if (!githubToken) {
      setGithubStatus({ type: 'error', msg: 'Please enter your GitHub token.' });
      return;
    }
    if (!vimeoUrl) {
      setGithubStatus({ type: 'error', msg: 'Please enter a Vimeo URL.' });
      return;
    }

    setGithubStatus({ type: 'loading', msg: '⏳ Pushing to GitHub — Vercel will deploy in ~60 seconds...' });
    setIsSubmitting(true);

    try {
      // 1. Get current SHA
      const shaRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFIG_PATH}`, {
        headers: { 'Authorization': 'token ' + githubToken, 'Accept': 'application/vnd.github.v3+json' }
      });
      
      let sha = undefined;
      if (shaRes.ok) {
        const shaData = await shaRes.json();
        sha = shaData.sha;
      }

      // 2. Base64 encode new JSON content
      const content = btoa(JSON.stringify({ vimeo_url: vimeoUrl }, null, 2));

      // 3. Put request to update content
      const pushRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONFIG_PATH}`, {
        method: 'PUT',
        headers: { 
          'Authorization': 'token ' + githubToken, 
          'Accept': 'application/vnd.github.v3+json', 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ message: 'Set replay video URL', content, sha })
      });

      if (pushRes.ok) {
        setGithubStatus({ 
          type: 'success', 
          msg: '✅ Saved successfully! Replay pages will show the new video in ~60 seconds after Vercel deploys.' 
        });
        setCurrentVideo(vimeoUrl);
        setHasVideoClass(true);
      } else {
        const err = await pushRes.json();
        setGithubStatus({ type: 'error', msg: 'GitHub error: ' + (err.message || pushRes.status) });
      }
    } catch (e: any) {
      setGithubStatus({ type: 'error', msg: 'Network error: ' + e.message });
    }
    setIsSubmitting(false);
  };

  // Test Google Sheet Fetch
  const testSheetFetch = async () => {
    setSheetStatus({ type: 'loading', msg: '⏳ Fetching from Google Sheet...' });
    try {
      const res = await fetch(SHEET_CSV_URL + '&t=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = (await res.text()).trim();
      setSheetStatus({ type: 'success', msg: '✅ Sheet contains: "' + text + '"' });
    } catch (e: any) {
      setSheetStatus({ type: 'error', msg: '❌ Could not reach sheet: ' + e.message });
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto' }} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <Key size={20} className="text-secondary" />
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Authentication Required</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Admin Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
          />
        </div>
        <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
          Continue
        </button>
        {loginError && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>
            {loginError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>Set Replay Video</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: 0 }}>
          After the webinar ends, paste the Vimeo URL below to make it live on both replay pages.
        </p>
      </div>

      {/* Current video display */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Current Video Status
        </h3>
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          border: '1.5px solid',
          borderColor: hasVideoClass ? 'rgba(34,197,94,0.4)' : 'var(--border-color)',
          background: hasVideoClass ? 'rgba(34,197,94,0.05)' : '#f8fafc',
          color: hasVideoClass ? '#22c55e' : 'var(--text-secondary)',
          fontSize: '14px',
          fontWeight: 600,
          wordBreak: 'break-all'
        }}>
          {hasVideoClass ? '✅ Active Video: ' : ''}{currentVideo}
        </div>
      </div>

      {/* Method tabs */}
      <div className="card">
        <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Set New Video URL
        </h3>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('github')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid',
              borderColor: activeTab === 'github' ? 'var(--accent-color)' : 'var(--border-color)',
              background: activeTab === 'github' ? 'rgba(200,66,10,0.08)' : 'transparent',
              color: activeTab === 'github' ? 'var(--accent-color)' : 'var(--text-secondary)'
            }}
          >
            ⚡ Method 1 — GitHub Deploy
          </button>
          <button
            onClick={() => setActiveTab('sheet')}
            style={{
              flex: 1, padding: '12px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid',
              borderColor: activeTab === 'sheet' ? 'var(--accent-color)' : 'var(--border-color)',
              background: activeTab === 'sheet' ? 'rgba(200,66,10,0.08)' : 'transparent',
              color: activeTab === 'sheet' ? 'var(--accent-color)' : 'var(--text-secondary)'
            }}
          >
            📋 Method 2 — Google Sheet
          </button>
        </div>

        {/* Tab 1: GitHub */}
        {activeTab === 'github' && (
          <div>
            <div className="form-group">
              <label className="form-label">
                GitHub Personal Access Token <span style={{ color: 'var(--text-secondary)', fontWeight: 400, textTransform: 'none' }}>(repo scope — never stored)</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="ghp_xxxxxxxxxxxx"
                value={githubToken}
                onChange={e => setGithubToken(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Vimeo Video URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://vimeo.com/123456789"
                value={vimeoUrl}
                onChange={e => setVimeoUrl(e.target.value)}
              />
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', margin: '6px 0 0 0' }}>
                Full Vimeo URL — embed code is generated automatically. Vercel redeploys in ~60 seconds.
              </p>
            </div>
            <button 
              className="btn-primary" 
              onClick={saveViaGitHub} 
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', gap: '8px' }}
            >
              <Save size={18} />
              Save &amp; Deploy via GitHub
            </button>

            {githubStatus.type && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                border: '1px solid',
                backgroundColor: githubStatus.type === 'success' ? 'rgba(34,197,94,0.08)' : githubStatus.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
                borderColor: githubStatus.type === 'success' ? '#22c55e' : githubStatus.type === 'error' ? '#ef4444' : 'var(--border-color)',
                color: githubStatus.type === 'success' ? '#22c55e' : githubStatus.type === 'error' ? '#ef4444' : 'var(--text-secondary)',
              }}>
                {githubStatus.msg}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sheet */}
        {activeTab === 'sheet' && (
          <div>
            <div style={{
              background: 'rgba(34,197,94,0.05)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '8px',
              padding: '14px 16px',
              fontSize: '14px',
              color: '#16a34a',
              marginBottom: '20px',
              lineHeight: '1.6'
            }}>
              <strong>Instant — no deployment needed.</strong><br />
              Open the Google Sheet and paste the Vimeo video URL in cell <strong>A1</strong>. Replay pages pick it up immediately on next reload.
            </div>

            <a
              href="https://docs.google.com/spreadsheets/d/1fTv4KP0IQtbssIjpxm17ecH20w-ymRrF7_IRexJU5d0/edit"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px',
                background: 'rgba(34,197,94,0.08)',
                border: '1.5px solid rgba(34,197,94,0.3)',
                borderRadius: '8px',
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                marginBottom: '12px',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(34,197,94,0.15)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(34,197,94,0.08)'}
            >
              <ExternalLink size={18} />
              Open Google Sheet
            </a>

            <button
              onClick={testSheetFetch}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1.5px solid var(--border-color)',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} />
              Test — Check What Sheet Contains
            </button>

            {sheetStatus.type && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '6px',
                fontSize: '13.5px',
                fontWeight: 600,
                border: '1px solid',
                backgroundColor: sheetStatus.type === 'success' ? 'rgba(34,197,94,0.08)' : sheetStatus.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)',
                borderColor: sheetStatus.type === 'success' ? '#22c55e' : sheetStatus.type === 'error' ? '#ef4444' : 'var(--border-color)',
                color: sheetStatus.type === 'success' ? '#22c55e' : sheetStatus.type === 'error' ? '#ef4444' : 'var(--text-secondary)',
              }}>
                {sheetStatus.msg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
