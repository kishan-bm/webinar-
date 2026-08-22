import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/features/Reveal";
import {
  HeroCentered,
  HeroConsole,
  HeroData,
  HeroMarquee,
  ToolAccordion,
  ToolBento,
  ToolCarousel,
  ToolSlider,
} from "@/components/features/variants";
import { categories, type Category } from "@/data/suite";

export function FeaturePage({ category }: { category: Category }) {
  const others = categories.filter((c) => c.slug !== category.slug);

  const hero =
    category.slug === "deliverability" ? (
      <HeroConsole category={category} />
    ) : category.slug === "cold-email-tools" ? (
      <HeroMarquee category={category} />
    ) : category.slug === "lead-databases" ? (
      <HeroData category={category} />
    ) : (
      <HeroCentered category={category} />
    );

  const tools =
    category.slug === "deliverability" ? (
      <ToolAccordion category={category} />
    ) : category.slug === "cold-email-tools" ? (
      <ToolSlider category={category} />
    ) : category.slug === "lead-databases" ? (
      <ToolBento category={category} />
    ) : (
      <ToolCarousel category={category} />
    );

  const stepsVertical = category.slug === "lead-databases" || category.slug === "deliverability";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <div className="relative">
          {hero}
          <nav className="absolute left-0 right-0 top-[6.5rem] mx-auto flex max-w-6xl items-center gap-2 px-6 text-[11px]">
            <Link to="/" className={`transition-colors ${category.slug === "deliverability" ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-forest"}`}>Home</Link>
            <span className={category.slug === "deliverability" ? "text-white/35" : "text-muted-foreground"}>/</span>
            <Link to="/features" className={`transition-colors ${category.slug === "deliverability" ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-forest"}`}>Suite</Link>
            <span className={category.slug === "deliverability" ? "text-white/35" : "text-muted-foreground"}>/</span>
            <span className={category.slug === "deliverability" ? "text-white" : "text-ink"}>{category.title}</span>
          </nav>
        </div>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="relative py-24">
          <div className="mx-auto max-w-6xl px-6">
            {stepsVertical ? (
              <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
                <Reveal>
                  <span className="font-eyebrow text-[10px] text-forest">How it works</span>
                  <h2 className="mt-4 font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-ink text-balance md:text-[2.9rem]">
                    {category.steps.length} steps, one surface.
                  </h2>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Nothing to export, re-upload or reconcile between tools.
                  </p>
                </Reveal>
                <ol className="relative border-l border-dashed border-forest/30 pl-8">
                  {category.steps.map((s, i) => (
                    <Reveal key={s.step} delay={i * 120}>
                      <li className="group relative pb-10 last:pb-0">
                        <span className="absolute -left-[2.55rem] flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-white font-display text-[11px] text-forest shadow-elegant transition-transform duration-300 group-hover:scale-110">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="font-display text-lg leading-tight text-ink">{s.title}</p>
                        <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            ) : (
              <>
                <Reveal className="max-w-xl">
                  <span className="font-eyebrow text-[10px] text-forest">How it works</span>
                  <h2 className="mt-4 font-display text-[2.1rem] leading-[1.02] tracking-[-0.02em] text-ink text-balance md:text-[2.9rem]">
                    {category.steps.length} steps, one surface.
                  </h2>
                </Reveal>
                <div className="relative mt-14">
                  <div
                    aria-hidden
                    className="absolute left-0 right-0 top-7 hidden h-px lg:block"
                    style={{ backgroundImage: "repeating-linear-gradient(to right, oklch(0.45 0.1725 235 / 0.35) 0 8px, transparent 8px 16px)" }}
                  />
                  <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {category.steps.map((s, i) => (
                      <Reveal key={s.step} delay={i * 130}>
                        <li className="group relative">
                          <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-white font-display text-lg text-forest shadow-elegant transition-transform duration-300 group-hover:-translate-y-1">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="mt-6 font-display text-lg leading-tight text-ink">{s.title}</p>
                          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
                          <span className="mt-5 block h-px w-10 bg-forest/40 transition-all duration-500 group-hover:w-20" />
                        </li>
                      </Reveal>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        </section>

        {tools}

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-24">
          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <span className="font-eyebrow text-[10px] text-forest">FAQ</span>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.04] tracking-[-0.02em] text-ink md:text-[2.5rem]">
                Questions, answered.
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Still unsure? Everything is included in one plan — try it before you commit.
              </p>
            </Reveal>
            <div className="divide-y divide-border/60 border-y border-border/60">
              {category.faq.map((f, i) => (
                <Faq key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA + cross links ────────────────────────────── */}
        <section className="pb-28">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[32px] border border-border/60 gradient-hero px-8 py-12 text-center shadow-elegant md:px-16">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="relative">
                  <h2 className="mx-auto max-w-2xl font-display text-[2rem] leading-[1.04] tracking-[-0.02em] text-ink text-balance md:text-[2.7rem]">
                    Put {category.title.toLowerCase()} on autopilot.
                  </h2>
                  <a
                    href="/#waitlist"
                    className="mt-8 inline-flex items-center gap-1.5 rounded-full gradient-forest px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
                  >
                    Start with 1,000 free leads <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>

            <span className="font-eyebrow mt-20 block text-[10px] text-forest">Keep exploring</span>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {others.map((c, i) => (
                <Reveal key={c.slug} delay={i * 110}>
                  <Link
                    to={c.route as "/"}
                    className="group block rounded-2xl border border-border/60 bg-white/70 p-6 shadow-elegant backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-forest text-white">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <p className="mt-5 font-display text-base text-ink">{c.title}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{c.navBlurb}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-forest">
                      View tools
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Faq({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  return (
    <div className="py-1">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-6 py-5 text-left">
        <span className="font-display text-[16.5px] leading-snug text-ink">{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/70 bg-white text-forest">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div className="grid transition-all duration-500 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}>
        <p className="overflow-hidden pb-5 pr-10 text-[13.5px] leading-relaxed text-muted-foreground">{a}</p>
      </div>
    </div>
  );
}
