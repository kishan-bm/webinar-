'use client';

import { useState } from 'react';
import './public.css';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <nav className="navbar" id="navbar">
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          onClick={() => setNavOpen((o) => !o)}
        >
          &#9776;
        </button>
        <a href="https://webclass.navigationtrading.com/home" className="nav-logo">
          <img src="/logo.png" alt="NavigationTrading" />
        </a>
        <ul className={`nav-links${navOpen ? ' active' : ''}`}>
          <li className="nav-item-dropdown">
            <a href="https://webclass.navigationtrading.com/home">Home</a>
          </li>
          <li><a href="https://webclass.navigationtrading.com/performance">Performance</a></li>
          <li><a href="https://webclass.navigationtrading.com/pricing">Pricing</a></li>
          <li className="nav-item-dropdown">
            <a href="#">Services <span className="nav-chevron">▾</span></a>
            <div className="dropdown-menu">
              <a href="https://webclass.navigationtrading.com/free-membership">Free Membership</a>
              <a href="https://webclass.navigationtrading.com/day-trading-membership">Day Trade Membership</a>
              <a href="https://webclass.navigationtrading.com/paid-membership">Pro Membership</a>
              <a href="https://webclass.navigationtrading.com/coaching">Private Coaching</a>
              <a href="https://webclass.navigationtrading.com/flux">Flux</a>
            </div>
          </li>
          <li><a href="https://webclass.navigationtrading.com/podcast">Podcast</a></li>
          <li><a href="/blogs" className="active">Blog</a></li>
          <li><a href="https://webclass.navigationtrading.com/contact">Contact Us</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }} className="nav-auth-group">
            <a href="https://whop.com/orders/products/" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Login</a>
            <a href="https://whop.com/navigationtrading/" className="nav-cta">Join Now</a>
        </div>
        <div
          className={`nav-backdrop${navOpen ? ' active' : ''}`}
          onClick={() => setNavOpen(false)}
        />
      </nav>

      {children}

      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand">
              <img src="/logo.png" alt="NavigationTrading" />
            </div>
            <div className="footer-tagline">Institutional Grade Trading Education</div>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Contact</div>
              <a href="mailto:support@navigationtrading.com" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>support@navigationtrading.com</a>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Follow</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a href="https://www.facebook.com/navigationtrading" target="_blank" className="social-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
                <a href="https://x.com/navtrading1?s=21" target="_blank" className="social-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://www.instagram.com/navigationtrading" target="_blank" className="social-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
                <a href="https://www.youtube.com/@navigationtrading" target="_blank" className="social-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a1828"/></svg>
                </a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' }}>Legal</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" className="footer-link">Risk Disclosure</a>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" className="footer-link">Privacy Policy</a>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" className="footer-link">Terms</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <a href="https://navigationtrading.com/legal-disclaimers/#privacy" target="_blank" className="footer-link" style={{ display: 'inline' }}>Privacy Policy</a>
              <a href="https://navigationtrading.com/legal-disclaimers#terms" target="_blank" className="footer-link" style={{ display: 'inline' }}>Terms of Use</a>
              <a href="https://navigationtrading.com/legal-disclaimers/#refund" target="_blank" className="footer-link" style={{ display: 'inline' }}>Refund Policy</a>
            </div>
            <div className="footer-copy">&copy; 2026 Navigation Financial, LLC</div>
          </div>
          <div className="footer-copy">
            The risk of loss in trading securities, options, stocks, futures and forex can be substantial. Securities involve risk and are not suitable for all investors. Consider all relevant risk factors, including their personal financial situation, before trading. Past results of any individual or trading system published by Navigation Financial, LLC are not indicative of future returns. It should not be assumed that the methods, techniques, or indicators presented in these products and services will be profitable or that they will not result in losses.
          </div>
        </div>
      </footer>
    </>
  );
}
