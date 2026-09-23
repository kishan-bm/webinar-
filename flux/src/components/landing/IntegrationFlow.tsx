import { useEffect, useState } from "react";
import {
  SlidersHorizontal,
  CalendarClock,
  TrendingUp,
  Radar,
  Timer,
  Percent,
  Activity,
  Newspaper,
} from "lucide-react";

const sources = [
  { icon: SlidersHorizontal, label: "Unparalleled Analyze Tab" },
  { icon: CalendarClock, label: "Calendar Spread IV Ratio Monitor" },
  { icon: TrendingUp, label: "Earnings Calendar & Statistics" },
  { icon: Radar, label: "NTT Scanner" },
];

const outputs = [
  { icon: Timer, label: "0 DTE Dashboard" },
  { icon: Percent, label: "Prediction Market Odds" },
  { icon: Activity, label: "Live Options Data" },
  { icon: Newspaper, label: "Live News Feed" },
];

const signals = [
  { name: "SPX Calendar", note: "IV ratio 0.92 · 3 DTE", src: 1, out: 0 },
  { name: "AAPL Earnings", note: "Expected move ±3.4%", src: 2, out: 3 },
  { name: "NTT Trend Flip", note: "Buy the Dip → confirmed", src: 3, out: 2 },
  { name: "0DTE Gamma", note: "Dealers short gamma", src: 0, out: 0 },
  { name: "Fed Rate Odds", note: "83% hold, per Kalshi", src: 2, out: 1 },
];

const inPaths = [
  "M120,70 C300,70 340,225 460,225",
  "M120,173 C300,173 350,225 460,225",
  "M120,277 C300,277 350,225 460,225",
  "M120,380 C300,380 340,225 460,225",
];
const outPaths = [
  "M540,225 C660,225 700,70 880,70",
  "M540,225 C660,225 700,173 880,173",
  "M540,225 C660,225 700,277 880,277",
  "M540,225 C660,225 700,380 880,380",
];

export function IntegrationFlow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % signals.length), 2400);
    return () => clearInterval(id);
  }, []);
  const signal = signals[i];

  return (
    <section id="integrations" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 gradient-section" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">One engine, end to end</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] text-ink text-balance md:text-6xl">
            Every signal in. <span className="gradient-text">One trading edge out.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            FLUX pulls together volatility, earnings, trend, and market-wide data, then models and surfaces it
            all in one live dashboard. No switching between tools mid-trade.
          </p>
        </div>

        <div className="relative mt-10 h-[560px] w-full sm:h-[500px] md:mt-16 md:h-[470px]">
          <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 1000 450" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lfIn" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.06 235)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="oklch(0.38 0.1455 235)" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="lfOut" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.38 0.1455 235)" stopOpacity="0.75" />
                <stop offset="100%" stopColor="oklch(0.72 0.06 235)" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {inPaths.map((d, k) => (
              <g key={`i${k}`}>
                <path d={d} fill="none" stroke="url(#lfIn)" strokeWidth={k === signal.src ? 2.4 : 1.2} />
                <circle r={k === signal.src ? "5" : "3"} fill="oklch(0.34 0.1455 235)" opacity={k === signal.src ? 1 : 0.45}>
                  <animateMotion dur="2.4s" begin={`${k * 0.3}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                </circle>
              </g>
            ))}

            {outPaths.map((d, k) => (
              <g key={`o${k}`}>
                <path d={d} fill="none" stroke="url(#lfOut)" strokeWidth={k === signal.out ? 2.4 : 1.2} />
                <circle r={k === signal.out ? "5" : "3"} fill="oklch(0.42 0.1455 235)" opacity={k === signal.out ? 1 : 0.45}>
                  <animateMotion dur="2.4s" begin={`${1.2 + k * 0.3}s`} repeatCount="indefinite" path={d} keyPoints="1;0" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                </circle>
              </g>
            ))}
          </svg>

          <div className="absolute left-0 top-0 flex h-full flex-col justify-around">
            {sources.map((s, k) => (
              <Node key={s.label} icon={s.icon} label={s.label} active={k === signal.src} />
            ))}
          </div>

          <div className="absolute right-0 top-0 flex h-full flex-col justify-around">
            {outputs.map((o, k) => (
              <Node key={o.label} icon={o.icon} label={o.label} align="right" active={k === signal.out} />
            ))}
          </div>

          {/* Hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span className="absolute inset-0 -m-6 rounded-full bg-mint/45 blur-2xl sm:-m-8 sm:blur-3xl md:-m-12" />
              <span className="absolute inset-0 animate-hub-ring rounded-[2rem] border border-forest/25" />
              <span
                className="absolute inset-0 animate-hub-ring rounded-[2rem] border border-forest/20"
                style={{ animationDelay: "1.1s" }}
              />
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl shadow-elegant max-[380px]:h-16 max-[380px]:w-16 min-[381px]:h-20 min-[381px]:w-20 min-[381px]:rounded-3xl sm:h-28 sm:w-28 md:h-36 md:w-36 md:rounded-[2rem] lg:h-40 lg:w-40"
                style={{ background: "#0D2E4E" }}
              >
                <img src="/compass-icon.png" alt="NavigationTrading" className="h-9 w-auto object-contain min-[381px]:h-11 sm:h-16 md:h-20 lg:h-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({
  icon: Icon,
  label,
  align = "left",
  active,
}: {
  icon: any;
  label: string;
  align?: "left" | "right";
  active?: boolean;
}) {
  return (
    <div className={`flex max-w-[100px] flex-col gap-1 min-[381px]:max-w-[104px] min-[381px]:gap-1.5 sm:max-w-[120px] md:max-w-[140px] ${align === "right" ? "items-end text-right" : "items-start"}`}>
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-500 min-[381px]:h-11 min-[381px]:w-11 min-[381px]:rounded-2xl sm:h-12 sm:w-12 md:h-14 md:w-14 ${
          active
            ? "border-transparent gradient-forest text-white shadow-glow scale-105"
            : "border-border/60 bg-white text-forest/70 shadow-sm"
        }`}
      >
        <Icon className="h-4 w-4 min-[381px]:h-5 min-[381px]:w-5 md:h-6 md:w-6" />
      </span>
      <span className="text-[8.5px] font-semibold uppercase leading-snug tracking-[0.04em] text-muted-foreground min-[381px]:text-[9.5px] min-[381px]:tracking-[0.06em] md:text-[10px] md:tracking-[0.08em]">{label}</span>
    </div>
  );
}
