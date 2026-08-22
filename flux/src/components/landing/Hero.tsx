import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24" style={{ background: "#0D2E4E" }}>
      <img
        src="/WhatsApp Image 2026-03-10 at 5.35.08 PM.jpeg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.45 }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(13,46,78,0.88) 0%, rgba(13,46,78,0.72) 50%, rgba(13,46,78,0.88) 100%)" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 700, height: 700, top: -200, right: -100, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,66,10,0.18) 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ width: 500, height: 500, bottom: -100, left: -50, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,100,200,0.22) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <a
          href="#features"
          className="animate-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 shadow-sm backdrop-blur"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-forest" />
          Introducing FLUX — Our Exclusive Trading Tool
          <ArrowRight className="h-3.5 w-3.5" />
        </a>

        <h1
          className="animate-rise mx-auto mt-8 max-w-5xl font-display text-5xl leading-[1.02] text-white text-balance md:text-7xl lg:text-[88px]"
          style={{ animationDelay: "80ms" }}
        >
          Trade the market with{" "}
          <span style={{ color: "#e04d10" }}>precision.</span>
        </h1>

        <p
          className="animate-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          FLUX gives you a real-time edge on market direction and timing, so you
          can trade with confidence instead of guesswork.
        </p>

        <div
          className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#waitlist"
            className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-medium text-white shadow-glow transition-all hover:bg-forest-deep"
          >
            Get Access to FLUX
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#product"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <Play className="h-4 w-4 fill-white" />
            See How It Works
          </a>
        </div>

        <div
          className="animate-rise relative mx-auto mt-20 max-w-6xl"
          style={{ animationDelay: "420ms" }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl">
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
