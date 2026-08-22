import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Circle } from "lucide-react";
import { Reveal } from "@/components/features/Reveal";
import type { Category, Tool } from "@/data/suite";

export function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/* ══════════════════ HERO VARIANTS ══════════════════ */

/** A — centered editorial with orbiting dashed rings (email-verification) */
export function HeroCentered({ category }: { category: Category }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-20">
      <div className="absolute inset-0 gradient-hero" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.19 235 / 0.3), transparent 65%)" }}
      />
      <svg aria-hidden className="pointer-events-none absolute left-1/2 top-10 h-[46rem] w-[46rem] -translate-x-1/2 opacity-45" viewBox="0 0 800 800">
        {[190, 260, 330, 400].map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} fill="none" stroke="oklch(0.45 0.17 235 / 0.35)" strokeWidth="1" strokeDasharray={i % 2 ? "2 10" : "6 12"} />
        ))}
      </svg>
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="font-eyebrow inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/75 px-3 py-1.5 text-[10px] text-forest backdrop-blur">
          <category.icon className="h-3.5 w-3.5" /> {category.eyebrow}
        </span>
        <h1 className="animate-line-up mt-7 font-display text-[2.7rem] leading-[0.95] tracking-[-0.025em] text-ink text-balance md:text-[4.4rem]">
          {category.headline} <span className="gradient-text">{category.headlineAccent}</span>
        </h1>
        <p className="animate-blur-in mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{category.intro}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="/#waitlist" className="group inline-flex items-center gap-1.5 rounded-full gradient-forest px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]">
            Start free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
        <dl className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-3">
          {category.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 110}>
              <div className="h-full bg-white/85 px-6 py-7 backdrop-blur">
                <dt className="font-display text-[2rem] leading-none text-forest">{m.value}</dt>
                <dd className="font-eyebrow mt-3 text-[9px] text-muted-foreground">{m.label}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** B — dark diagnostics console hero (deliverability) */
export function HeroConsole({ category }: { category: Category }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 gradient-forest" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="font-eyebrow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] text-white/85 backdrop-blur">
            <category.icon className="h-3.5 w-3.5" /> {category.eyebrow}
          </span>
          <h1 className="animate-line-up mt-6 font-display text-[2.6rem] leading-[0.95] tracking-[-0.025em] text-white text-balance md:text-[4.1rem]">
            {category.headline} <span className="text-mint">{category.headlineAccent}</span>
          </h1>
          <p className="animate-blur-in mt-6 max-w-lg text-[15px] leading-relaxed text-white/70">{category.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/#waitlist" className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-forest-deep transition-transform hover:scale-[1.02]">
              Run a free audit <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
            {category.metrics.map((m) => (
              <div key={m.label}>
                <dt className="font-display text-[1.9rem] leading-none text-mint">{m.value}</dt>
                <dd className="font-eyebrow mt-2 text-[9px] text-white/55">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal delay={140} y={30}>
          <div className="overflow-hidden rounded-[26px] border border-white/15 bg-forest-deep/70 shadow-glow backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
              {["oklch(0.75 0.16 25)", "oklch(0.85 0.15 90)", "oklch(0.8 0.15 160)"].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="font-eyebrow ml-3 text-[9px] text-white/45">lumina audit — {category.slug}</span>
            </div>
            <div className="space-y-3 p-6 font-mono text-[12.5px]">
              {[
                ["SPF", "pass", "1 lookup left"],
                ["DKIM", "pass", "2048-bit"],
                ["DMARC", "warn", "p=none → p=quarantine"],
                ["MX", "pass", "google workspace"],
                ["Blacklists", "clean", "0 / 92 listings"],
                ["Placement", "94%", "primary inbox"],
              ].map(([k, v, note], i) => (
                <div key={k} className="animate-blur-in flex items-center justify-between gap-4" style={{ animationDelay: `${200 + i * 120}ms` }}>
                  <span className="text-white/50">{k}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-white/40">{note}</span>
                    <span className={`rounded-md px-2 py-0.5 text-[11px] ${v === "warn" ? "bg-white/15 text-white" : "bg-mint/20 text-mint"}`}>{v}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** C — oversized index hero with marquee (cold-email-tools) */
export function HeroMarquee({ category }: { category: Category }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
          <div className="lg:border-r lg:border-border/60 lg:pr-8">
            <span className="font-eyebrow text-[10px] text-forest">{category.eyebrow}</span>
            <p className="mt-6 font-display text-[5.5rem] leading-none text-forest/15">{String(category.tools.length).padStart(2, "0")}</p>
            <p className="font-eyebrow mt-2 text-[9px] text-muted-foreground">tools in this module</p>
            <p className="mt-8 max-w-xs text-[14px] leading-relaxed text-muted-foreground">{category.intro}</p>
            <a href="/#waitlist" className="group mt-8 inline-flex items-center gap-1.5 rounded-full gradient-forest px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]">
              Start free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <div>
            <h1 className="animate-line-up font-display text-[2.8rem] leading-[0.92] tracking-[-0.03em] text-ink text-balance md:text-[5rem]">
              {category.headline} <span className="gradient-text">{category.headlineAccent}</span>
            </h1>
            <dl className="mt-12 grid gap-6 sm:grid-cols-3">
              {category.metrics.map((m, i) => (
                <Reveal key={m.label} delay={i * 110}>
                  <div className="border-t border-forest/25 pt-4">
                    <dt className="font-display text-[1.9rem] leading-none text-forest">{m.value}</dt>
                    <dd className="font-eyebrow mt-2 text-[9px] text-muted-foreground">{m.label}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="relative mt-16 overflow-hidden border-y border-border/60 bg-white/50 py-4 backdrop-blur">
        <div className="animate-marquee flex w-max items-center gap-10">
          {[...category.tools, ...category.tools, ...category.tools].map((t, i) => (
            <span key={i} className="font-eyebrow flex items-center gap-3 text-[10px] text-forest/70">
              <t.icon className="h-3.5 w-3.5" /> {t.name}
              <Circle className="h-1 w-1 fill-current" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** D — data-counter hero with stacked record cards (lead-databases) */
export function HeroData({ category }: { category: Category }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="absolute inset-0 gradient-hero" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-16 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.2 235 / 0.32), transparent 65%)" }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <span className="font-eyebrow inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/75 px-3 py-1.5 text-[10px] text-forest backdrop-blur">
            <category.icon className="h-3.5 w-3.5" /> {category.eyebrow}
          </span>
          <h1 className="animate-line-up mt-6 font-display text-[2.7rem] leading-[0.95] tracking-[-0.025em] text-ink text-balance md:text-[4.3rem]">
            {category.headline} <span className="gradient-text">{category.headlineAccent}</span>
          </h1>
          <p className="animate-blur-in mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{category.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="/#waitlist" className="group inline-flex items-center gap-1.5 rounded-full gradient-forest px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]">
              Search the databases <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
        <Reveal delay={140} y={30}>
          <div className="relative">
            {category.metrics.map((m, i) => (
              <div
                key={m.label}
                className="animate-pop-down mb-3 flex items-center justify-between gap-6 rounded-2xl border border-border/60 bg-white/85 px-6 py-5 shadow-elegant backdrop-blur transition-transform duration-300 hover:-translate-y-1"
                style={{ marginLeft: `${i * 1.75}rem`, animationDelay: `${180 + i * 140}ms` }}
              >
                <span className="font-display text-[1.9rem] leading-none text-forest">{m.value}</span>
                <span className="font-eyebrow text-right text-[9px] text-muted-foreground">{m.label}</span>
              </div>
            ))}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 bg-white/85 shadow-elegant">
              {["Head of Growth · SaaS · 120 emp", "Owner · Dental clinic · 4.8★", "Creator · Fitness · 180k subs"].map((r, i) => (
                <div key={r} className="flex items-center justify-between gap-4 border-b border-border/50 px-5 py-3.5 last:border-0">
                  <span className="text-[13px] text-ink">{r}</span>
                  <span className="font-eyebrow rounded-full bg-secondary px-2 py-0.5 text-[8px] text-forest">verified</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════ TOOL SECTION VARIANTS ══════════════════ */

/** Auto-advancing interactive carousel */
export function ToolCarousel({ category }: { category: Category }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const tools = category.tools;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % tools.length), 5200);
    return () => clearInterval(t);
  }, [paused, tools.length]);

  const t = tools[i];
  return (
    <section id="tools" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-section opacity-90" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-eyebrow text-[10px] text-forest">What you get</span>
          <h2 className="mt-4 max-w-2xl font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-ink text-balance md:text-[2.9rem]">
            {tools.length} tools, one clean list.
          </h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {tools.map((tt, ti) => (
            <button
              key={tt.name}
              type="button"
              onClick={() => setI(ti)}
              className={`relative overflow-hidden rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all duration-300 ${
                ti === i ? "border-transparent gradient-forest text-white shadow-glow" : "border-border/60 bg-white/70 text-foreground/70 hover:bg-white"
              }`}
            >
              {tt.name}
              {ti === i && !paused && (
                <span key={i} className="animate-rail-fill absolute bottom-0 left-0 h-[2px] w-full origin-left bg-white/70" style={{ animationDuration: "5.2s" }} />
              )}
            </button>
          ))}
        </div>

        <div
          className="mt-8 grid items-stretch gap-px overflow-hidden rounded-[30px] border border-border/60 bg-border/60 lg:grid-cols-[1fr_0.85fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div key={t.name} className="animate-blur-in bg-white/90 p-9 md:p-11">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-forest text-white">
              <t.icon className="h-5 w-5" />
            </span>
            <div className="mt-6 flex items-center gap-2">
              <h3 className="font-display text-[1.7rem] leading-tight text-ink">{t.name}</h3>
              {t.badge && <span className="font-eyebrow rounded-full bg-secondary px-2 py-0.5 text-[8px] text-forest">{t.badge}</span>}
            </div>
            <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">{t.detail}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {t.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary text-forest">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div key={`${t.name}-panel`} className="animate-pop-down relative overflow-hidden gradient-forest p-9">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <span aria-hidden className="animate-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-xl" />
            <div className="relative flex h-full flex-col justify-between">
              <span className="font-eyebrow text-[9px] text-white/55">step {String(i + 1).padStart(2, "0")} / {String(tools.length).padStart(2, "0")}</span>
              <div className="mt-10">
                {t.stat ? (
                  <>
                    <p className="font-display text-[3.4rem] leading-none text-white">{t.stat.value}</p>
                    <p className="font-eyebrow mt-3 text-[9px] text-white/60">{t.stat.label}</p>
                  </>
                ) : (
                  <p className="font-display text-[1.5rem] leading-snug text-white">{t.blurb}</p>
                )}
              </div>
              <div className="mt-10 space-y-2.5">
                {[94, 76, 61].map((w) => (
                  <div key={w} className="h-[6px] overflow-hidden rounded-full bg-white/15">
                    <span className="block h-full rounded-full bg-mint" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Dark accordion-style diagnostics list */
export function ToolAccordion({ category }: { category: Category }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="tools" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-forest" />
      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <span className="font-eyebrow text-[10px] text-mint">Inside the module</span>
          <h2 className="mt-4 max-w-2xl font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-white text-balance md:text-[2.9rem]">
            Every check, in one audit.
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {category.tools.map((t, i) => {
            const isOpen = open === i;
            return (
              <div key={t.name} id={slugify(t.name)} className="scroll-mt-40">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center gap-5 py-6 text-left">
                  <span className="font-eyebrow w-8 text-[9px] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${isOpen ? "bg-mint text-forest-deep" : "bg-white/10 text-mint"}`}>
                    <t.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-display text-[1.15rem] text-white">{t.name}</span>
                      {t.badge && <span className="font-eyebrow rounded-full bg-white/15 px-2 py-0.5 text-[8px] text-mint">{t.badge}</span>}
                    </span>
                    <span className="mt-1 block text-[13px] text-white/55">{t.blurb}</span>
                  </span>
                  <ArrowUpRight className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-500 ${isOpen ? "rotate-90" : ""}`} />
                </button>
                <div className="grid transition-all duration-500 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}>
                  <div className="overflow-hidden">
                    <div className="grid gap-8 pb-8 pl-[4.6rem] md:grid-cols-[1.1fr_0.9fr]">
                      <div>
                        <p className="max-w-lg text-[14px] leading-relaxed text-white/70">{t.detail}</p>
                        <ul className="mt-5 space-y-2.5">
                          {t.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-[13px] text-white/85">
                              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/5 p-6">
                        {t.stat ? (
                          <>
                            <p className="font-display text-[2.6rem] leading-none text-mint">{t.stat.value}</p>
                            <p className="font-eyebrow mt-2 text-[9px] text-white/50">{t.stat.label}</p>
                          </>
                        ) : (
                          <p className="font-display text-[1.2rem] leading-snug text-white/90">{t.blurb}</p>
                        )}
                        <div className="mt-6 space-y-2">
                          {[88, 66].map((w) => (
                            <div key={w} className="h-[5px] overflow-hidden rounded-full bg-white/12">
                              <span className="block h-full rounded-full bg-mint" style={{ width: `${w}%` }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Horizontal drag/snap slider of numbered slides */
export function ToolSlider({ category }: { category: Category }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const go = (n: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[n] as HTMLElement | undefined;
    if (card) rail.scrollTo({ left: card.offsetLeft - 8, behavior: "smooth" });
    setIdx(n);
  };

  return (
    <section id="tools" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-section opacity-80" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal className="max-w-xl">
            <span className="font-eyebrow text-[10px] text-forest">The toolkit</span>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-ink text-balance md:text-[2.9rem]">
              Swipe through the stack.
            </h2>
          </Reveal>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(Math.max(0, idx - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-white/80 text-forest transition-colors hover:bg-white">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" onClick={() => go(Math.min(category.tools.length - 1, idx + 1))} className="flex h-10 w-10 items-center justify-center rounded-full gradient-forest text-white shadow-glow">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={railRef} className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {category.tools.map((t, i) => (
            <article
              key={t.name}
              id={slugify(t.name)}
              className="group relative w-[84vw] shrink-0 snap-start scroll-mt-40 overflow-hidden rounded-[26px] border border-border/60 bg-white/88 p-8 shadow-elegant backdrop-blur transition-all duration-500 hover:-translate-y-1 sm:w-[22rem]"
            >
              <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle, oklch(0.7 0.19 235 / 0.35), transparent 70%)" }} />
              <div className="relative flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-forest text-white">
                  <t.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-[2.4rem] leading-none text-forest/15">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="relative mt-7 flex items-center gap-2">
                <h3 className="font-display text-[1.3rem] leading-tight text-ink">{t.name}</h3>
                {t.badge && <span className="font-eyebrow rounded-full bg-secondary px-2 py-0.5 text-[8px] text-forest">{t.badge}</span>}
              </div>
              <p className="relative mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{t.detail}</p>
              <ul className="relative mt-6 space-y-2.5 border-t border-border/60 pt-5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary text-forest">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              {t.stat && (
                <p className="relative mt-6 font-display text-[1.6rem] leading-none text-forest">
                  {t.stat.value} <span className="font-eyebrow align-middle text-[9px] text-muted-foreground">{t.stat.label}</span>
                </p>
              )}
            </article>
          ))}
        </div>

        <div className="flex gap-1.5">
          {category.tools.map((t, i) => (
            <button key={t.name} type="button" onClick={() => go(i)} aria-label={t.name} className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-10 bg-forest" : "w-4 bg-forest/25"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bento grid of database cards */
export function ToolBento({ category }: { category: Category }) {
  return (
    <section id="tools" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-section opacity-85" />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-eyebrow text-[10px] text-forest">The databases</span>
          <h2 className="mt-4 max-w-2xl font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-ink text-balance md:text-[2.9rem]">
            Three sources, one search bar.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {category.tools.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className={i === 0 ? "lg:col-span-4" : i === 1 ? "lg:col-span-2" : "lg:col-span-6"}>
              <article id={slugify(t.name)} className={`group relative h-full scroll-mt-40 overflow-hidden rounded-[26px] border border-border/60 p-8 shadow-elegant transition-all duration-500 hover:-translate-y-1 ${i === 1 ? "gradient-forest" : "bg-white/88 backdrop-blur"}`}>
                {i === 1 && <span aria-hidden className="animate-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/20 blur-xl" />}
                <div className={`relative flex flex-wrap items-start justify-between gap-6 ${i === 2 ? "lg:flex-nowrap" : ""}`}>
                  <div className="max-w-xl">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${i === 1 ? "bg-white/15 text-mint" : "gradient-forest text-white"}`}>
                      <t.icon className="h-5 w-5" />
                    </span>
                    <h3 className={`mt-6 font-display text-[1.35rem] leading-tight ${i === 1 ? "text-white" : "text-ink"}`}>{t.name}</h3>
                    <p className={`mt-3 text-[13.5px] leading-relaxed ${i === 1 ? "text-white/70" : "text-muted-foreground"}`}>{t.detail}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {t.bullets.map((b) => (
                        <li key={b} className={`rounded-full px-3 py-1.5 text-[12px] ${i === 1 ? "bg-white/10 text-white/85" : "bg-secondary text-secondary-foreground"}`}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {t.stat && (
                    <div className="text-right">
                      <p className={`font-display text-[2.8rem] leading-none ${i === 1 ? "text-mint" : "text-forest"}`}>{t.stat.value}</p>
                      <p className={`font-eyebrow mt-2 text-[9px] ${i === 1 ? "text-white/55" : "text-muted-foreground"}`}>{t.stat.label}</p>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export type ToolSectionProps = { category: Category };
export type { Tool };
