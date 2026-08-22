import { CalendarClock, Newspaper, Percent } from "lucide-react";

const features = [
  { icon: CalendarClock, title: "Calendar IV", body: "Time your calendar and double-calendar entries around real volatility signals instead of guesswork. FLUX tracks the implied-volatility relationship between any two expirations, charts the term structure over time, and scans every front/back combination to surface pairs whose IV has dropped furthest from its recent high." },
  { icon: Newspaper, title: "News", body: "The market backdrop in one place: a live economic calendar and real-time news feed, the day's top S&P 500 gainers and losers, and CNN's Fear & Greed Index — so you always know what's moving and how the market feels before you trade." },
  { icon: Percent, title: "Prediction Markets", body: "Live, market-implied odds — sourced from the regulated exchange Kalshi — on the macro events that move markets: Fed rate decisions, inflation prints, jobs data, and more. See what traders are actually pricing in, not just what they're saying." },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-white py-32">
      {/* Line-art infographic background */}
      <FeatureInfographic />
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-1/2 top-0 h-96 w-[900px] -translate-x-1/2 rounded-full bg-mint/40 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Everything you need</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-ink text-balance md:text-6xl">
              One dashboard.<br />
              <span className="gradient-text italic">Every edge in reach.</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-muted-foreground md:text-lg">
            FLUX brings volatility signals, market news and prediction markets together in one live view — so you always know what's moving and why.
          </p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative bg-white/95 p-8 backdrop-blur transition-all hover:bg-[oklch(0.99_0.0172_235)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest-deep transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureInfographic() {
  // Decorative line-art with orbiting dashed curves, dots and mini pill labels.
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.55]"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.161 235)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.85 0.1035 235)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.88 0.1035 235)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.88 0.1035 235)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft green blooms */}
      <circle cx="200" cy="220" r="260" fill="url(#rg1)" />
      <circle cx="1240" cy="720" r="300" fill="url(#rg1)" />

      {/* dashed orbits */}
      <g fill="none" stroke="url(#lg1)" strokeWidth="1.2" strokeDasharray="4 8">
        <path d="M 120 480 C 260 260, 520 200, 720 340 S 1180 640, 1340 420" />
        <path d="M 200 780 C 380 900, 720 820, 900 640 S 1240 300, 1360 180" />
        <path d="M 60 260 C 240 200, 460 380, 620 260 S 1000 60, 1200 160" />
      </g>

      {/* concentric ring cluster left */}
      <g fill="none" stroke="oklch(0.55 0.161 235)" strokeOpacity="0.28">
        <circle cx="200" cy="500" r="60" strokeDasharray="2 6" />
        <circle cx="200" cy="500" r="110" strokeDasharray="2 10" />
        <circle cx="200" cy="500" r="170" strokeDasharray="2 14" />
      </g>

      {/* right side hex-ish nodes */}
      <g fill="oklch(0.55 0.161 235)" fillOpacity="0.45">
        <circle cx="1200" cy="200" r="3" />
        <circle cx="1080" cy="140" r="2.4" />
        <circle cx="1300" cy="300" r="2.4" />
        <circle cx="960" cy="240" r="2" />
        <circle cx="1140" cy="360" r="2" />
        <circle cx="240" cy="220" r="3" />
        <circle cx="360" cy="140" r="2" />
        <circle cx="140" cy="340" r="2" />
      </g>

      {/* thin cross-hair markers */}
      <g stroke="oklch(0.45 0.1265 235)" strokeOpacity="0.35" strokeWidth="1">
        <path d="M 720 120 v 14 M 713 127 h 14" />
        <path d="M 1320 560 v 14 M 1313 567 h 14" />
        <path d="M 120 700 v 14 M 113 707 h 14" />
      </g>

      {/* floating pill labels */}
      <g fontFamily="Inter, sans-serif" fontSize="10" fill="oklch(0.35 0.1035 235)" fillOpacity="0.55">
        <g transform="translate(90 130)">
          <rect width="72" height="20" rx="10" fill="oklch(0.96 0.046 235)" fillOpacity="0.7" stroke="oklch(0.55 0.161 235)" strokeOpacity="0.25" />
          <text x="10" y="13">calendar IV</text>
        </g>
        <g transform="translate(1180 90)">
          <rect width="46" height="20" rx="10" fill="oklch(0.96 0.046 235)" fillOpacity="0.7" stroke="oklch(0.55 0.161 235)" strokeOpacity="0.25" />
          <text x="10" y="13">news</text>
        </g>
        <g transform="translate(60 810)">
          <rect width="112" height="20" rx="10" fill="oklch(0.96 0.046 235)" fillOpacity="0.7" stroke="oklch(0.55 0.161 235)" strokeOpacity="0.25" />
          <text x="10" y="13">prediction markets</text>
        </g>
        <g transform="translate(1260 820)">
          <rect width="70" height="20" rx="10" fill="oklch(0.96 0.046 235)" fillOpacity="0.7" stroke="oklch(0.55 0.161 235)" strokeOpacity="0.25" />
          <text x="10" y="13">volatility</text>
        </g>
      </g>
    </svg>
  );
}