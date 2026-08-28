import { useState } from "react";

const faqs = [
  {
    q: "Is FLUX included with my membership?",
    a: "FLUX is available exclusively to Pro Members. If you're on a different plan, upgrading to Pro unlocks the full toolkit — Analyzer, Calendar IV, Earnings, NTT Scanner, 0 DTE, News, and Prediction Markets.",
  },
  {
    q: "Does FLUX place trades for me?",
    a: "No. FLUX is a read-only analysis tool — it models positions, tracks volatility, and surfaces signals, but every order goes through you. When you're ready to act, it hands you a pre-filled ticket or order string for ThinkorSwim, Tradier, or IBKR, and you review and submit it in your own broker.",
  },
  {
    q: "How current is the data in FLUX?",
    a: "Prices refresh automatically about every 30 seconds during U.S. market hours, with select feeds — like SPX in the Analyzer and 0 DTE — streaming live. Outside market hours, FLUX shows the last close and stops polling. All data is for analysis, not order routing, so always confirm live prices in your broker before trading.",
  },
  {
    q: "What can I actually do in the Analyzer?",
    a: "Build any options position — single legs, verticals, iron condors, calendars, and more — right-click to add structures, drag strikes to reshape a trade, and scrub time and volatility to see how it evolves. You can save, share, and import models, pull positions in directly from ThinkorSwim, and compare multiple trades side by side before ever placing an order.",
  },
  {
    q: "Will FLUX tell me exactly when to enter a trade?",
    a: "FLUX gives you the signals and analysis to make that call yourself — like IV ratios in Calendar IV, trend states in the NTT Scanner, and expected-move data in Earnings and 0 DTE — but it doesn't issue trade recommendations or place trades. Every tool is built to inform your decision, not make it for you.",
  },
];

const FAQ_CSS = `
  .flux-faq { background: #ffffff; padding: 120px 0; }
  .flux-faq-layout { display: grid; grid-template-columns: 360px 1fr; gap: 80px; align-items: start; margin: 0 auto; max-width: 1180px; padding: 0 24px; }
  .flux-faq-left { position: sticky; top: 100px; }
  .flux-faq-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #c8420a; }
  .flux-faq-left h2 { font-size: clamp(26px, 3vw, 38px); font-weight: 800; color: #0D2E4E; line-height: 1.15; letter-spacing: -.02em; margin-top: 10px; margin-bottom: 16px; }
  .flux-faq-left p { font-size: 14px; color: rgba(0,0,0,.55); line-height: 1.75; margin-bottom: 32px; }
  .flux-faq-contact { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-radius: 12px; background: rgba(13,46,78,.04); border: 1px solid rgba(13,46,78,.1); }
  .flux-faq-contact-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; background: rgba(200,66,10,.1); border: 1px solid rgba(200,66,10,.25); display: flex; align-items: center; justify-content: center; }
  .flux-faq-contact-icon svg { width: 16px; height: 16px; color: #c8420a; }
  .flux-faq-contact-text strong { display: block; font-size: 13px; color: #0D2E4E; font-weight: 700; }
  .flux-faq-contact-text span { font-size: 12px; color: rgba(0,0,0,.5); }
  .flux-faq-right { display: flex; flex-direction: column; gap: 8px; }
  .flux-faq-item { background: #f8fafc; border: 1px solid rgba(13,46,78,.08); border-radius: 14px; overflow: hidden; transition: border-color .25s, background .25s; }
  .flux-faq-item.open { background: #f1f5f9; border-color: rgba(200,66,10,.35); }
  .flux-faq-q { padding: 22px 28px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 16px; font-weight: 700; color: #0D2E4E; user-select: none; border: none; background: none; width: 100%; text-align: left; }
  .flux-faq-q:hover { color: #c8420a; }
  .flux-faq-icon { width: 28px; height: 28px; border-radius: 50%; background: rgba(200,66,10,.1); border: 1px solid rgba(200,66,10,.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; color: #c8420a; transition: transform .3s, background .3s; }
  .flux-faq-item.open .flux-faq-icon { transform: rotate(45deg); background: rgba(200,66,10,.2); }
  .flux-faq-a { max-height: 0; overflow: hidden; transition: max-height .35s ease; }
  .flux-faq-a-inner { padding: 0 28px 24px; font-size: 14.5px; color: rgba(0,0,0,.62); line-height: 1.75; }
  @media (max-width: 900px) {
    .flux-faq-layout { grid-template-columns: 1fr; gap: 48px; }
    .flux-faq-left { position: static; }
  }
`;

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="flux-faq" id="faq">
      <style>{FAQ_CSS}</style>
      <div className="flux-faq-layout">
        <div className="flux-faq-left">
          <span className="flux-faq-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about FLUX and how it fits into your trading.</p>
          <div className="flux-faq-contact">
            <div className="flux-faq-contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="flux-faq-contact-text">
              <strong>Still Have Questions?</strong>
              <span>support@navigationtrading.com</span>
            </div>
          </div>
        </div>

        <div className="flux-faq-right">
          {faqs.map((f, i) => {
            const isOpen = i === openIndex;
            return (
              <div key={f.q} className={`flux-faq-item${isOpen ? " open" : ""}`}>
                <button type="button" className="flux-faq-q" onClick={() => setOpenIndex(isOpen ? -1 : i)}>
                  {f.q}
                  <span className="flux-faq-icon">+</span>
                </button>
                <div className="flux-faq-a" style={{ maxHeight: isOpen ? 500 : 0 }}>
                  <div className="flux-faq-a-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
