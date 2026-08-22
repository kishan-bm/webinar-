const quotes = [
  { q: "Just joined a couple of weeks ago and love it. Winner on my first trade. This trading method is in line with my philosophy on making money in the market with smaller controlled positions.", author: "Michael R.", role: "Verified Member" },
  { q: "After years of trading, I feel that I am not on the bullish side or bearish side of the market, but finally on the profitable side. The strategies taught here are the best. Thank you.", author: "Suresh N.", role: "Pro Member" },
  { q: "The live trade calls changed everything for me. Seeing the reasoning behind every entry — that's the part you can't get from a recorded course. Worth every penny.", author: "James K.", role: "Day Trading Member" },
];

export function Testimonials() {
  return (
    <section id="customers" className="relative overflow-hidden gradient-section py-32">
      {/* Ambient background: soft glows + line-art curves */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full blur-[140px]"
          style={{ background: "oklch(0.85 0.1495 235 / 0.35)" }}
        />
        <div
          className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full blur-[140px]"
          style={{ background: "oklch(0.9 0.1035 235 / 0.4)" }}
        />
      </div>
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="tStroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.55 0.1495 235)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.55 0.1495 235)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.55 0.1495 235)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M -40 180 C 260 60, 520 320, 780 180 S 1120 60, 1260 220"
          fill="none"
          stroke="url(#tStroke)"
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        <path
          d="M -40 760 C 240 640, 520 860, 800 720 S 1080 620, 1260 780"
          fill="none"
          stroke="url(#tStroke)"
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        <circle cx="180" cy="140" r="140" fill="none" stroke="oklch(0.55 0.1495 235 / 0.14)" strokeDasharray="3 6" />
        <circle cx="1040" cy="760" r="180" fill="none" stroke="oklch(0.55 0.1495 235 / 0.14)" strokeDasharray="3 6" />
      </svg>
      {/* Floating category chips like the reference */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute left-[6%] top-[6%] rounded-full border border-forest/20 bg-white/70 px-3 py-1 text-[10px] font-medium text-forest-deep backdrop-blur">deliverability</span>
        <span className="absolute right-[7%] top-[9%] rounded-full border border-forest/20 bg-white/70 px-3 py-1 text-[10px] font-medium text-forest-deep backdrop-blur">onebox</span>
        <span className="absolute left-[10%] bottom-[8%] rounded-full border border-forest/20 bg-white/70 px-3 py-1 text-[10px] font-medium text-forest-deep backdrop-blur">prospecting</span>
        <span className="absolute right-[8%] bottom-[10%] rounded-full border border-forest/20 bg-white/70 px-3 py-1 text-[10px] font-medium text-forest-deep backdrop-blur">personalization</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">What Members Say</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink text-balance md:text-6xl">
            Real traders, <span className="gradient-text italic">real results.</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {quotes.map((t, i) => (
            <figure key={i} className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-white p-8 shadow-elegant">
              <blockquote className="font-display text-2xl leading-snug text-ink text-balance">
                "{t.q}"
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-border/60 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full gradient-forest text-sm font-semibold text-white">
                  {t.author.split(" ").map(n => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}