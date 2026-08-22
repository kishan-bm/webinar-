import { ListPlus, ShieldCheck, Telescope, PenLine, Rocket } from "lucide-react";

const stages = [
  {
    icon: ListPlus,
    kicker: "Intake",
    title: "Raw list in",
    body: "CSV, CRM export or a live Lumina search.",
    metric: "10,000",
    metricLabel: "rows in",
  },
  {
    icon: ShieldCheck,
    kicker: "Hygiene",
    title: "Verified twice",
    body: "SMTP handshake, catch-all and role filtering.",
    metric: "8,760",
    metricLabel: "deliverable",
  },
  {
    icon: Telescope,
    kicker: "Research",
    title: "Company read",
    body: "Site, funding and hiring signals, condensed.",
    metric: "3 facts",
    metricLabel: "per lead",
  },
  {
    icon: PenLine,
    kicker: "Writing",
    title: "One email per human",
    body: "An opener built from those facts. No spintax.",
    metric: "1:1",
    metricLabel: "copy",
  },
  {
    icon: Rocket,
    kicker: "Launch",
    title: "Paces itself",
    body: "Warm inboxes, ramped volume, replies routed.",
    metric: "1,000",
    metricLabel: "sends / day",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-eyebrow inline-flex items-center gap-2 text-[10px] text-forest">
              <span className="h-1 w-1 rounded-full bg-forest" /> The Lumina pipeline
            </span>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.03] text-ink text-balance md:text-[3rem]">
              A raw list in. <span className="gradient-text">A booked calendar out.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Five stages on one rail — nothing to export, re-upload or reconcile.
          </p>
        </div>

        {/* Self-playing rail — all five stages readable at a glance */}
        <div className="mt-14 rounded-[26px] border border-border/60 bg-white/70 p-5 shadow-elegant backdrop-blur md:p-8">
          {/* rail */}
          <div className="relative mx-auto h-[3px] w-[calc(100%-2rem)] rounded-full bg-secondary md:w-[calc(100%-4rem)]">
            <span className="absolute inset-0 origin-left animate-rail-fill rounded-full gradient-forest" />
            <span className="absolute -top-[5px] h-[13px] w-[13px] -translate-x-1/2 animate-packet rounded-full bg-forest shadow-glow" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-5 md:gap-x-3">
            {stages.map((s, i) => (
              <div
                key={s.title}
                className="animate-stage relative flex flex-col items-center text-center"
                style={{ animationDelay: `${i * 2}s` }}
              >
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl gradient-forest text-white">
                  <s.icon className="h-4 w-4" />
                  <span
                    className="animate-stage-chip absolute -inset-1.5 rounded-[1.1rem] border border-forest/30"
                    style={{ animationDelay: `${i * 2}s` }}
                  />
                </span>
                <span className="font-eyebrow mt-3 text-[9px] text-forest">{s.kicker}</span>
                <p className="mt-2 font-display text-base leading-tight text-ink">{s.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-snug text-muted-foreground">{s.body}</p>
                <span className="mt-3 font-display text-xl leading-none text-forest">{s.metric}</span>
                <span className="font-eyebrow mt-1 text-[8px] text-muted-foreground">{s.metricLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
