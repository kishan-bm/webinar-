import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero pt-32 pb-24">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[oklch(0.85_0.1495_235/0.35)] blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 text-left lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col items-start">
          <a
            href="#features"
            className="animate-rise inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/70 px-4 py-1.5 text-xs font-medium text-foreground/70 shadow-sm backdrop-blur"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-forest" />
            Introducing FLUX — Our Exclusive Trading Tool
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          <h1
            className="animate-rise mt-8 font-display text-5xl leading-[1.02] text-ink text-balance md:text-6xl lg:text-[64px]"
            style={{ animationDelay: "80ms" }}
          >
            Trade the market with{" "}
            <span className="gradient-text italic">precision.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            FLUX gives you a real-time edge on market direction and timing, so you
            can trade with confidence instead of guesswork.
          </p>

          <div
            className="animate-rise mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#waitlist"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-forest-deep"
            >
              Get Access to FLUX
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-white"
            >
              <Play className="h-4 w-4 fill-ink" />
              See How It Works
            </a>
          </div>
        </div>

        <div
          className="animate-rise relative flex items-center justify-center lg:justify-end"
          style={{ animationDelay: "320ms" }}
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-b from-[oklch(0.9_0.115_235/0.5)] to-transparent blur-2xl" />
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
            <img
              src="/newflux.jpeg"
              alt="FLUX trading tool"
              className="block h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}