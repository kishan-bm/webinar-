import { useState } from "react";

const faqs = [
  {
    q: "What's the difference between Pro and Day Trading membership?",
    a: "The Day Trading membership ($129/month) includes 10 day trading strategy courses, daily live streams, and trade alerts for day trading setups. Pro ($179/month) includes everything in Day Trading plus 7 additional advanced strategy courses covering income spreads, trend trading, and portfolio strategies. Pro members also get trade alerts for every strategy we teach — not just day trading — plus the full suite of custom chart indicators and watch lists. For $50 more per month, you get the complete NavigationTrading system.",
  },
  {
    q: "Is $179/month worth it?",
    a: "That's $5.96 per day for daily live trading sessions, 17+ strategy courses, real-time alerts across every strategy, custom tools, and access to an active community of serious traders. Most traders lose more than that on a single bad trade made without proper education. The question isn't whether $179 is a lot. It's whether not having the right strategies and tools is costing you more.",
  },
  {
    q: "I'm a complete beginner. Should I start with Pro?",
    a: "If you've never traded options before, we recommend starting with our Free Membership to learn the fundamentals. The free courses cover options basics, how contracts work, and beginner strategies. Once you're comfortable with the foundations, Pro is where you take it to the next level. That said, if you're motivated and ready to commit, Pro gives you everything from day one — including the foundational knowledge.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. Your membership renews monthly, and you can cancel anytime. If you cancel, you keep access through the end of your current billing period.",
  },
  {
    q: "What time are the live streams?",
    a: "The morning session starts around 9:15 AM Eastern, before the market opens at 9:30. The Power Hour session begins around 3:15 PM Eastern for the final hour of trading. Both sessions run every market day (Monday through Friday, excluding market holidays).",
  },
  {
    q: "Do I need a large account to trade these strategies?",
    a: "No. Many of our strategies — especially the day trading and 0 DTE setups, can be traded with accounts of $5,000 or less. The courses cover how to match strategies to your account size. Some of the advanced strategies like portfolio margin are designed for larger accounts, but you don't need to trade every strategy to get value from Pro. Start with what fits your account and expand as you grow.",
  },
  {
    q: "Will I get overwhelmed with 17+ strategies?",
    a: "No, and this is important. You don't learn all 17 strategies at once. They're organized by category (day trading, 0 DTE, income, trend, portfolio), and most members start with one category that matches their current goals. The live streams and alerts cover all strategies, but you choose which ones to focus on. Think of it as a library you grow into, not a firehose you drink from.",
  },
  {
    q: "Can I talk to someone if I have questions?",
    a: "Absolutely. The live trading room has real-time chat where you can ask questions during the stream. The TradeHacker Discord community is active throughout the day. Experienced members and the NavigationTrading team are there to help. You're never trading alone.",
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
          <p>Everything you need to know about the Pro membership and how it fits your trading style.</p>
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
