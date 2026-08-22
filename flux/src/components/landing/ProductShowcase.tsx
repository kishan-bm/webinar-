import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, SlidersHorizontal, CalendarClock, Radar, Timer,
  LineChart, History, ListFilter, Gauge, Repeat, TrendingUp, Send,
} from "lucide-react";

type Scene = {
  key: string;
  tab: string;
  title: string;
  bullets: { icon: any; text: string }[];
  icon: any;
  tint: string;
  panel: string;
};

const scenes: Scene[] = [
  {
    key: "analyzer",
    tab: "Analyzer",
    title: "Model any options position before you risk a dollar",
    icon: SlidersHorizontal,
    bullets: [
      { icon: SlidersHorizontal, text: "Single legs, spreads, calendars, iron condors and more" },
      { icon: LineChart, text: "P&L curve at expiration and in real time" },
      { icon: Repeat, text: "Scrub forward through time or shift implied volatility" },
      { icon: Send, text: "Send a pre-filled order to ThinkorSwim, Tradier or IBKR" },
    ],
    tint: "oklch(0.885 0.0794 235)",
    panel: "oklch(0.24 0.0794 235)",
  },
  {
    key: "earnings",
    tab: "Earnings",
    title: "Know what the market is pricing in before every report",
    icon: CalendarClock,
    bullets: [
      { icon: CalendarClock, text: "Weekly calendar of expected earnings moves" },
      { icon: TrendingUp, text: "See what the options market is pricing in" },
      { icon: History, text: "20-quarter track record of post-earnings moves" },
      { icon: ListFilter, text: "Fundamentals behind every ticker, in one view" },
    ],
    tint: "oklch(0.855 0.1058 235)",
    panel: "oklch(0.23 0.0926 235)",
  },
  {
    key: "ntt",
    tab: "NTT Scanner",
    title: "A live trend-signal feed across your whole watchlist",
    icon: Radar,
    bullets: [
      { icon: Radar, text: "Every symbol tagged with its current setup" },
      { icon: TrendingUp, text: "Buy the Dip, Sell the Rip, and more" },
      { icon: Gauge, text: "Volatility and next earnings date at a glance" },
      { icon: ListFilter, text: "Filter, sort and star the names worth watching" },
    ],
    tint: "oklch(0.8 0.1323 235)",
    panel: "oklch(0.2 0.1058 235)",
  },
  {
    key: "0dte",
    tab: "0 DTE",
    title: "A live, intraday view built for same-day SPX decisions",
    icon: Timer,
    bullets: [
      { icon: LineChart, text: "Price tracked against expected-move bands" },
      { icon: Gauge, text: "VIX movement alongside price, in real time" },
      { icon: Radar, text: "Gamma exposure to see where dealers are positioned" },
      { icon: Timer, text: "Replay the session minute by minute" },
    ],
    tint: "oklch(0.745 0.1587 235)",
    panel: "oklch(0.17 0.119 235)",
  },
];

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const p = total > 0 ? scrolled / total : 0;
      const HEAD = 0.1;
      const TAIL = 0.14;
      const eased = Math.max(0, Math.min(0.9999, (p - HEAD) / (1 - HEAD - TAIL)));
      const raw = eased * scenes.length;
      const idx = Math.min(scenes.length - 1, Math.floor(raw));
      setActive(idx);
      setProgress(Math.min(1, raw - idx));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scene = scenes[active];

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative"
      style={{ height: `${scenes.length * 110 + 70}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-white py-12">
        <div className="absolute inset-0 grid-bg opacity-70 pointer-events-none" />

        <div className="relative mx-auto w-full max-w-6xl px-6">
          {/* Tab strip */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {scenes.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.key}
                  onClick={() => {
                    const el = sectionRef.current;
                    if (!el) return;
                    const total = el.offsetHeight - window.innerHeight;
                    const target = el.offsetTop + (total * (i + 0.5)) / scenes.length;
                    window.scrollTo({ top: target, behavior: "smooth" });
                  }}
                  className="relative overflow-hidden rounded-full px-4 py-3 text-center transition-all duration-700 ease-out"
                  style={{ background: isActive ? "#ffffff" : "oklch(0.955 0.0132 235 / 0.75)" }}
                >
                  <span
                    className={`font-eyebrow relative z-10 text-[10px] transition-colors duration-500 ${
                      isActive ? "text-forest-deep" : "text-muted-foreground/80"
                    }`}
                  >
                    {s.tab}
                  </span>
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left gradient-forest transition-[width] duration-150"
                    style={{ width: isActive ? `${Math.max(3, progress * 100)}%` : i < active ? "100%" : "0%" }}
                  />
                </button>
              );
            })}
          </div>

          {/* Content: text left, popping panel right */}
          <div className="mt-16 grid items-start gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
            <div className="flex min-h-[420px] flex-col pt-2">
              <div>
                <div className="overflow-hidden">
                  <h2
                    key={`t-${scene.key}`}
                    className="animate-line-up font-display text-[2.1rem] leading-[1.02] text-ink text-balance md:text-[3.4rem]"
                  >
                    {scene.title}
                  </h2>
                </div>
                <div key={`c-${scene.key}`} className="animate-blur-in mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "160ms" }}>
                  <a
                    href="#waitlist"
                    className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-forest-deep hover:shadow-glow"
                  >
                    Get Access to FLUX
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-white"
                  >
                    Learn more
                  </a>
                </div>
              </div>

              <ul key={`b-${scene.key}`} className="mt-auto space-y-4 pt-16">
                {scene.bullets.map((b, bi) => (
                  <li
                    key={b.text}
                    className="animate-blur-in flex items-center gap-3.5 text-[0.95rem] text-foreground/80"
                    style={{ animationDelay: `${220 + bi * 90}ms` }}
                  >
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border/60 bg-white/70">
                      <b.icon className="h-3.5 w-3.5 text-forest" />
                    </span>
                    {b.text}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative flex h-[440px] items-end justify-center overflow-hidden rounded-[28px] transition-[background-color] duration-[900ms] ease-out md:h-[540px]"
              style={{ backgroundColor: scene.panel }}
            >
              <div className="pointer-events-none absolute inset-0 opacity-30 grid-bg" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 transition-opacity duration-700"
                style={{ background: `radial-gradient(ellipse 70% 100% at 50% 0%, ${scene.tint}22, transparent 70%)` }}
              />
              <div
                key={`p-${scene.key}`}
                className="animate-pop-down relative mx-8 mb-0 w-full max-w-[560px] overflow-hidden rounded-t-[20px] border border-white/15 bg-white shadow-elegant"
                style={{ height: "82%" }}
              >
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/60 px-3 py-2 text-xs font-semibold text-forest-deep">
                    <scene.icon className="h-4 w-4" /> {scene.tab}
                  </div>
                  <div className="mt-5 grid flex-1 grid-cols-2 gap-3">
                    {scene.bullets.map((b) => (
                      <div key={b.text} className="flex flex-col justify-center rounded-xl border border-border/60 bg-white p-4">
                        <b.icon className="h-4 w-4 text-forest" />
                        <p className="mt-2 text-[11px] leading-snug text-ink">{b.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
