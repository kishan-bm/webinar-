import { useEffect, useState } from "react";
import {
  Linkedin,
  Youtube,
  Instagram,
  MapPin,
  Globe,
  ShieldCheck,
  PenLine,
  Send,
  Inbox,
  Sparkles,
} from "lucide-react";

const sources = [
  { icon: Linkedin, label: "LinkedIn" },
  { icon: MapPin, label: "Google Maps" },
  { icon: Youtube, label: "YouTube" },
  { icon: Instagram, label: "Instagram" },
  { icon: Globe, label: "Company sites" },
];

const outputs = [
  { icon: ShieldCheck, label: "Verified", note: "triple-checked" },
  { icon: PenLine, label: "Personalized", note: "3 facts each" },
  { icon: Send, label: "Campaigns", note: "paced sending" },
  { icon: Inbox, label: "Onebox", note: "replies routed" },
];

const leads = [
  { name: "Bright Smile Dental", email: "hello@brightsmile.com", src: 1, out: 0 },
  { name: "Lumen Studio", email: "studio@lumen.gr", src: 3, out: 1 },
  { name: "Sarah Chen", email: "sarah@northwind.io", src: 0, out: 2 },
  { name: "Cascade Labs", email: "growth@cascade.io", src: 4, out: 3 },
  { name: "Harbor Fitness", email: "team@harborfit.com", src: 2, out: 1 },
];

const inPaths = [
  "M120,52 C300,52 340,225 460,225",
  "M120,138 C300,138 350,225 460,225",
  "M120,225 C280,225 340,225 460,225",
  "M120,312 C300,312 350,225 460,225",
  "M120,398 C300,398 340,225 460,225",
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
    const id = setInterval(() => setI((v) => (v + 1) % leads.length), 2400);
    return () => clearInterval(id);
  }, []);
  const lead = leads[i];

  return (
    <section id="integrations" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 gradient-section" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">One engine, end to end</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] text-ink text-balance md:text-6xl">
            Raw signal in. <span className="gradient-text">Sendable pipeline out.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            Lumina pulls prospects from anywhere on the open web, then does the verification, research, writing and
            sending itself — no third-party stack in the middle.
          </p>
        </div>

        <div className="relative mt-16 h-[470px] w-full">
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
                <path d={d} fill="none" stroke="url(#lfIn)" strokeWidth={k === lead.src ? 2.4 : 1.2} />
                <circle r={k === lead.src ? "5" : "3"} fill="oklch(0.34 0.1455 235)" opacity={k === lead.src ? 1 : 0.45}>
                  <animateMotion dur="2.4s" begin={`${k * 0.3}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                </circle>
              </g>
            ))}

            {outPaths.map((d, k) => (
              <g key={`o${k}`}>
                <path d={d} fill="none" stroke="url(#lfOut)" strokeWidth={k === lead.out ? 2.4 : 1.2} />
                <circle r={k === lead.out ? "5" : "3"} fill="oklch(0.42 0.1455 235)" opacity={k === lead.out ? 1 : 0.45}>
                  <animateMotion dur="2.4s" begin={`${1.2 + k * 0.3}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
                </circle>
              </g>
            ))}
          </svg>

          <div className="absolute left-0 top-0 flex h-full flex-col justify-between">
            {sources.map((s, k) => (
              <Node key={s.label} icon={s.icon} label={s.label} active={k === lead.src} />
            ))}
          </div>

          <div className="absolute right-0 top-0 flex h-full flex-col justify-around">
            {outputs.map((o, k) => (
              <Node key={o.label} icon={o.icon} label={o.label} note={o.note} align="right" active={k === lead.out} />
            ))}
          </div>

          {/* Hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span className="absolute inset-0 -m-12 rounded-full bg-mint/45 blur-3xl" />
              <span className="absolute inset-0 animate-hub-ring rounded-[2rem] border border-forest/25" />
              <span
                className="absolute inset-0 animate-hub-ring rounded-[2rem] border border-forest/20"
                style={{ animationDelay: "1.1s" }}
              />
              <div className="relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-[2rem] border border-border/60 bg-white shadow-elegant md:h-36 md:w-36">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-forest text-white">
                  <Sparkles className="h-5 w-5" />
                </span>
                <span className="font-display text-lg text-ink">Lumina</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">engine</span>
              </div>

              <div className="absolute left-1/2 top-full mt-6 w-64 -translate-x-1/2">
                <div
                  key={i}
                  className="animate-rise rounded-2xl border border-border/70 bg-white px-4 py-3 shadow-elegant"
                >
                  <div className="flex items-center justify-between">
                    <p className="truncate text-[11px] font-semibold text-ink">{lead.name}</p>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-forest">
                      {outputs[lead.out].label}
                    </span>
                  </div>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">{lead.email}</p>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                    <div className="relative h-full w-full gradient-forest"><span className="absolute inset-y-0 -left-1/3 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-white/70 to-transparent" /></div>
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

function Node({
  icon: Icon,
  label,
  note,
  align = "left",
  active,
}: {
  icon: any;
  label: string;
  note?: string;
  align?: "left" | "right";
  active?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${align === "right" ? "items-end" : "items-start"}`}>
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 md:h-14 md:w-14 ${
          active
            ? "border-transparent gradient-forest text-white shadow-glow scale-105"
            : "border-border/60 bg-white text-forest/70 shadow-sm"
        }`}
      >
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      {note && <span className="font-mono text-[9px] text-muted-foreground/70">{note}</span>}
    </div>
  );
}
