import { useEffect, useRef, useState } from "react";
import {
  Search, Sparkles, Inbox, ShieldCheck, MapPin, Mail, ArrowRight,
  Zap, BarChart3, Bot, CalendarCheck, Target, Send,
} from "lucide-react";

type Scene = {
  key: string;
  tab: string;
  title: string;
  bullets: { icon: any; text: string }[];
  tint: string;
  panel: string;
};

const scenes: Scene[] = [
  {
    key: "prospect",
    tab: "Prospecting",
    title: "Turn hours of prospecting into minutes",
    bullets: [
      { icon: Target, text: "275M+ verified contacts and 30M+ companies" },
      { icon: Search, text: "Filter by intent, tech stack and hiring signals" },
      { icon: Sparkles, text: "AI builds the list from a single prompt" },
      { icon: BarChart3, text: "Lead scoring that ranks who to email first" },
    ],
    tint: "oklch(0.885 0.0794 235)",
    panel: "oklch(0.24 0.0794 235)",
  },
  {
    key: "write",
    tab: "Personalization",
    title: "Write like a human, at machine scale",
    bullets: [
      { icon: Bot, text: "A unique opener for every single prospect" },
      { icon: Sparkles, text: "Researched from role, news and recent activity" },
      { icon: Mail, text: "Multi-step sequences generated in one click" },
      { icon: Zap, text: "Spam-score checks before anything sends" },
    ],
    tint: "oklch(0.855 0.1058 235)",
    panel: "oklch(0.23 0.0926 235)",
  },
  {
    key: "deliver",
    tab: "Deliverability",
    title: "Land in the inbox, not the promotions tab",
    bullets: [
      { icon: ShieldCheck, text: "Automatic warmup across every mailbox" },
      { icon: BarChart3, text: "Live inbox placement and spam monitoring" },
      { icon: Zap, text: "SPF, DKIM and DMARC checked continuously" },
      { icon: Send, text: "Smart sending limits that protect reputation" },
    ],
    tint: "oklch(0.8 0.1323 235)",
    panel: "oklch(0.2 0.1058 235)",
  },
  {
    key: "reply",
    tab: "Deal execution",
    title: "Every reply. One inbox. Zero chaos.",
    bullets: [
      { icon: Inbox, text: "All mailboxes unified into one Onebox" },
      { icon: Bot, text: "Replies auto-categorised by intent" },
      { icon: CalendarCheck, text: "Hot leads routed straight to your calendar" },
      { icon: BarChart3, text: "Pipeline reporting on every conversation" },
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
      className="relative gradient-section"
      style={{ height: `${scenes.length * 110 + 70}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-12">
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
                  style={{ background: isActive ? s.tint : "oklch(0.955 0.0132 235 / 0.75)" }}
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
                    className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-forest-deep hover:shadow-glow"
                  >
                    Get started for free
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
                <div className="h-full overflow-hidden p-5">
                  <SceneCard which={scene.key} accent={scene.tab} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SceneCard({ which, accent }: { which: string; accent: string }) {
  if (which === "prospect") {
    return (
      <div className="grid h-full grid-rows-[auto_1fr] gap-4">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/90 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" /> Head of Growth · SaaS · 50–200 · US
          </div>
          <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-semibold text-forest-deep">{accent}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 overflow-hidden">
          {[
            { name: "Sarah Chen", role: "VP Marketing", co: "Northwind", city: "Austin, TX", score: 94 },
            { name: "Marcus Reyes", role: "Head of Growth", co: "Cascade", city: "SF, CA", score: 91 },
            { name: "Priya Patel", role: "Director of RevOps", co: "Fern Labs", city: "NYC", score: 88 },
            { name: "Liam O'Neill", role: "Growth Lead", co: "Baseline", city: "Boston", score: 86 },
          ].map((p) => (
            <div key={p.name} className="rounded-xl border border-border/60 bg-white p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-ink">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.role} · {p.co}</p>
                </div>
                <span className="rounded-md bg-mint px-1.5 py-0.5 text-[10px] font-semibold text-forest-deep">{p.score}</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="h-3 w-3" /> {p.city}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (which === "write") {
    return (
      <div className="grid h-full grid-rows-[auto_1fr] gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/90 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> To: sarah@northwind.io
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-forest-deep">
            <Sparkles className="h-3 w-3" /> Smart draft
          </span>
        </div>
        <div className="rounded-2xl border border-border/60 bg-white p-5 text-left text-sm leading-relaxed text-ink">
          <p className="text-xs font-medium text-muted-foreground">Subject</p>
          <p className="mb-3 text-sm font-semibold">Northwind's Q4 pricing test — quick idea</p>
          <p className="text-sm">Hi Sarah,</p>
          <p className="mt-2 text-sm">
            Saw the <span className="rounded bg-mint px-1 text-forest-deep">pricing revamp you shipped last week</span> — clean move on the annual tier.
          </p>
          <p className="mt-2 text-sm">
            We help teams like <span className="rounded bg-mint px-1 text-forest-deep">Northwind</span> add a second outbound motion without hiring more SDRs. Open to a 15-min walkthrough Thursday?
          </p>
          <p className="mt-2 text-sm">— Alex, Lumina</p>
          <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
            <span>Personalized from 6 signals</span>
            <span className="font-semibold text-forest">Spam score 0.4 / 10</span>
          </div>
        </div>
      </div>
    );
  }
  if (which === "deliver") {
    return (
      <div className="grid h-full grid-rows-[auto_1fr_auto] gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/90 px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> alex@lumina.ai
          </div>
          <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-forest-deep">Inbox placement</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Inbox rate", v: "97.2%", trend: "+2.4%" },
            { label: "Spam rate", v: "0.3%", trend: "-1.1%" },
            { label: "Warmup score", v: "A+", trend: "stable" },
            { label: "DNS health", v: "100%", trend: "SPF · DKIM · DMARC" },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border/60 bg-white p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-display text-2xl text-ink">{k.v}</p>
              <p className="mt-0.5 text-[10px] font-medium text-forest">{k.trend}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-white p-3">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Placement · last 30 days</p>
          <div className="flex h-14 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-sm gradient-forest opacity-80" style={{ height: `${50 + Math.sin(i * 0.7) * 20 + (i % 5) * 4}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid h-full grid-rows-[auto_1fr] gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/90 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Inbox className="h-3.5 w-3.5" /> Onebox · 24 unread
        </div>
        <span className="rounded-full bg-mint px-2 py-0.5 text-[10px] font-semibold text-forest-deep">All mailboxes</span>
      </div>
      <div className="space-y-2 overflow-hidden">
        {[
          { from: "Sarah Chen", co: "Northwind", msg: "Interested — Thursday 2pm works.", tag: "Interested", tone: "hot" },
          { from: "Marcus Reyes", co: "Cascade", msg: "Not the right time, try in Q1.", tag: "Not now", tone: "cool" },
          { from: "Priya Patel", co: "Fern Labs", msg: "Can you send a one-pager first?", tag: "Info request", tone: "warm" },
          { from: "Liam O'Neill", co: "Baseline", msg: "Let's book a call — send times.", tag: "Meeting", tone: "hot" },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white p-3">
            <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[11px] font-semibold ${r.tone === "hot" ? "bg-mint text-forest-deep" : r.tone === "warm" ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>
              {r.from.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-ink">{r.from} · <span className="font-normal text-muted-foreground">{r.co}</span></p>
              <p className="truncate text-[11px] text-muted-foreground">{r.msg}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.tone === "hot" ? "bg-mint text-forest-deep" : r.tone === "warm" ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>{r.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
