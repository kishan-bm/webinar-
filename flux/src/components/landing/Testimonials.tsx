const quotes = [
  { q: "Just joined a couple of weeks ago and love it. Winner on my first trade. This trading method is in line with my philosophy on making money in the market with smaller controlled positions.", author: "Michael R.", role: "Verified Member" },
  { q: "After years of trading, I feel that I am not on the bullish side or bearish side of the market, but finally on the profitable side. The strategies taught here are the best. Thank you.", author: "Suresh N.", role: "Pro Member" },
  { q: "The live trade calls changed everything for me. Seeing the reasoning behind every entry — that's the part you can't get from a recorded course. Worth every penny.", author: "James K.", role: "Day Trading Member" },
];

const track = [...quotes, ...quotes];

const TESTIMONIALS_CSS = `
  .flux-testimonials { padding: 100px 0; background: #0D2E4E; position: relative; overflow: hidden; }
  .flux-testimonials::before { content: ''; position: absolute; inset: 0; background: url('/WhatsApp Image 2026-03-10 at 5.35.08 PM (1).jpeg') top center / cover no-repeat; opacity: 0.8; z-index: 1; pointer-events: none; }
  .flux-testimonials::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(13,32,64,.96) 0%, rgba(13,32,64,.82) 55%, rgba(13,32,64,.92) 100%); z-index: 2; pointer-events: none; }
  .flux-test-header { position: relative; z-index: 10; text-align: center; margin-bottom: 40px; padding: 0 24px; }
  .flux-test-eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(200,66,10,0.15); border: 1px solid rgba(200,66,10,0.32); border-radius: 50px; color: #e87040; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .flux-test-header h2 { font-size: clamp(32px, 4vw, 48px); color: #fff; letter-spacing: -1.5px; margin: 0 auto; font-weight: 800; line-height: 1.1; }
  .flux-test-header h2 span { background: linear-gradient(135deg, #fff 0%, #c8420a 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .flux-marquee-container { position: relative; z-index: 10; width: 100%; overflow: hidden; margin-top: 20px; -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent); }
  .flux-marquee-track { display: flex; gap: 20px; width: max-content; animation: flux-marquee-scroll 45s linear infinite; }
  .flux-marquee-track:hover { animation-play-state: paused; }
  @keyframes flux-marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 10px)); } }
  .flux-test-card { width: 420px; flex-shrink: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 30px; display: flex; flex-direction: column; transition: all 0.3s ease; }
  .flux-test-card:hover { background: rgba(0,0,0,0.6); border-color: rgba(255,255,255,0.25); transform: translateY(-5px); }
  .flux-test-stars { display: flex; gap: 3px; color: #c8420a; margin-bottom: 20px; }
  .flux-test-stars svg { width: 14px; height: 14px; fill: currentColor; }
  .flux-test-card p { font-size: 15px; line-height: 1.5; color: rgba(255,255,255,0.8); margin-bottom: 24px; flex-grow: 1; }
  .flux-test-author { display: flex; align-items: center; gap: 12px; }
  .flux-test-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 16px; flex-shrink: 0; }
  .flux-test-author-info { display: flex; flex-direction: column; }
  .flux-test-author-info strong { font-size: 14px; font-weight: 700; color: #fff; }
  .flux-test-author-info span { font-size: 11px; color: rgba(255,255,255,0.5); }
`;

export function Testimonials() {
  return (
    <section id="customers" className="flux-testimonials">
      <style>{TESTIMONIALS_CSS}</style>
      <div className="flux-test-header">
        <div className="flux-test-eyebrow">What Members Say</div>
        <h2>Real traders, <span>real results.</span></h2>
      </div>
      <div className="flux-marquee-container">
        <div className="flux-marquee-track">
          {track.map((t, i) => (
            <div key={i} className="flux-test-card">
              <div className="flux-test-stars">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p>"{t.q}"</p>
              <div className="flux-test-author">
                <div className="flux-test-avatar">{t.author[0]}</div>
                <div className="flux-test-author-info">
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
