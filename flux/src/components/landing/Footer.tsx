const FOOTER_CSS = `
  footer.nt-footer { background: #0D2E4E; border-top: 1px solid rgba(255,255,255,0.06); position: relative; overflow: hidden; }
  footer.nt-footer::before { content: ''; position: absolute; inset: 0; z-index: 0; background: url('/WhatsApp Image 2026-03-10 at 5.35.08 PM (1).jpeg') center/cover no-repeat; opacity: 0.05; pointer-events: none; }
  footer.nt-footer > .footer-top, footer.nt-footer > .footer-bottom { position: relative; z-index: 1; }
  .footer-top { padding: 50px 60px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 40px; }
  .footer-brand img { height: 24px; opacity: 0.6; transform: scale(4.5); transform-origin: left center; }
  .footer-tagline { font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; margin-top: 20px; }
  .social-icon { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); transition: background 0.2s, color 0.2s; text-decoration: none; }
  .social-icon:hover { background: #c8420a; color: #fff; }
  .footer-link { color: rgba(255,255,255,0.5); font-size: 13px; text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: rgba(255,255,255,0.9); }
  .footer-bottom { padding: 24px 60px; border-top: 1px solid rgba(255,255,255,0.06); }
  .footer-copy { font-size: 11.5px; color: rgba(255,255,255,0.25); line-height: 1.7; max-width: 900px; margin: 0 auto 8px; text-align: center; }
  @media (max-width: 768px) {
    .footer-top { padding: 40px 24px; }
    .footer-bottom { padding: 20px 24px; }
  }
`;

export function Footer() {
  return (
    <>
      <style>{FOOTER_CSS}</style>
      <footer className="nt-footer">
        <div className="footer-top">
          <div>
            <div className="footer-brand"><img src="/logo.png" alt="NavigationTrading" /></div>
            <div className="footer-tagline">Institutional Grade Trading Education</div>
          </div>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Contact</div>
              <a href="mailto:support@navigationtrading.com" style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>support@navigationtrading.com</a>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Follow</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a href="https://www.facebook.com/navigationtrading" target="_blank" rel="noreferrer" className="social-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                </a>
                <a href="https://x.com/navtrading1?s=21" target="_blank" rel="noreferrer" className="social-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="https://www.instagram.com/navigationtrading" target="_blank" rel="noreferrer" className="social-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                </a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" rel="noreferrer" className="footer-link">Risk Disclosure</a>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" rel="noreferrer" className="footer-link">Privacy Policy</a>
                <a href="https://navigationtrading.com/legal-disclaimers/" target="_blank" rel="noreferrer" className="footer-link">Terms</a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">The risk of loss in trading securities, options, stocks, futures and forex can be substantial. Securities involve risk and are not suitable for all investors. Consider all relevant risk factors, including their personal financial situation, before trading. Past results of any individual or trading system published by Navigation Financial, LLC are not indicative of future returns. It should not be assumed that the methods, techniques, or indicators presented in these products and services will be profitable or that they will not result in losses.</div>
          <div className="footer-copy">&copy; 2026 Navigation Financial, LLC</div>
        </div>
      </footer>
    </>
  );
}
