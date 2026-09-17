import { LineChart, CalendarClock, TrendingUp, Radar, Gauge, Newspaper } from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Analyzer",
    body: "Model any options position and know what the market is pricing in before every report.",
    points: ["Model any option spread on any ticker", "Real-time P&L and Greeks", "What-if scenarios for adjustments"],
  },
  {
    icon: CalendarClock,
    title: "Calendar Spread IV",
    body: "Multi-expiration IV tool",
    points: ["IV Ratio monitoring", "IV Spread monitoring", "Expiration Pair Scanner"],
  },
  {
    icon: TrendingUp,
    title: "Earnings",
    body: "Quarterly Stock Earnings Data",
    points: ["Expected earnings moves", "5 year earnings statistics", "Pre and Post earnings track record"],
  },
  {
    icon: Radar,
    title: "NTT Scanner",
    body: "Navigation Trend Trading system",
    points: ["Scan stocks, ETFs and Futures", "Top picks each and every day", "Filter by sectors and favorites"],
  },
  {
    icon: Gauge,
    title: "0 DTE Dashboard",
    body: "Intra-day SPX analysis",
    points: ["Daily Expected Move levels", "Dynamic Expected Move levels (updated every minute)", "Support & Resistance levels"],
  },
  {
    icon: Newspaper,
    title: "News & Prediction Markets",
    body: "Live Econ Reports",
    points: ["Scheduled events + statistical probabilities", "Live news feed", "Top equity Gainers & Losers"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-white py-32">
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
              <ul className="mt-4 space-y-2">
                {f.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-forest" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
