import { ArrowRight, Play, Star } from "lucide-react";
import { HeroDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero pt-32 pb-24">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[oklch(0.85_0.1495_235/0.35)] blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <a
          href="#features"
          className="animate-rise inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-forest" />
          Introducing Lumina 2.0 — the AI outbound OS
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <h1
          className="animate-rise mx-auto mt-8 max-w-5xl font-display text-5xl leading-[1.02] text-ink text-balance md:text-7xl lg:text-[88px]"
          style={{ animationDelay: "80ms" }}
        >
          AI cold outreach that
          <br className="hidden md:block" />
          actually reaches the{" "}
          <span className="gradient-text italic">inbox.</span>
        </h1>

        <p
          className="animate-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          Lumina finds the leads who need you, writes personalized emails at scale,
          and handles every reply in one Onebox — so your pipeline never sleeps.
        </p>

        <div
          className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-forest-deep"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#product"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-white"
          >
            <Play className="h-4 w-4 fill-ink" />
            Watch demo
          </a>
        </div>

        <div
          className="animate-rise mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          style={{ animationDelay: "320ms" }}
        >
          <div className="flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-[oklch(0.75_0.15_75)] text-[oklch(0.75_0.15_75)]"
              />
            ))}
          </div>
          <span className="font-medium text-ink">4.9</span>
          <span>· Loved by 12,000+ founders and sales teams</span>
        </div>

        <div
          className="animate-rise relative mx-auto mt-20 max-w-6xl"
          style={{ animationDelay: "420ms" }}
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-b from-[oklch(0.9_0.115_235/0.5)] to-transparent blur-2xl" />
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}