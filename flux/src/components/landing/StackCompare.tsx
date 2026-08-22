import { Check } from "lucide-react";

const oldTools = [
  { name: "Apollo.io", sub: "B2B database", price: 149 },
  { name: "ListKit", sub: "Niche lists", price: 597 },
  { name: "Clay", sub: "Enrichment + scraping", price: 495 },
  { name: "NeverBounce", sub: "Email verification", price: 400 },
];

const total = oldTools.reduce((a, t) => a + t.price, 0);
const lumina = 97;
const max = 700;

const included = [
  "B2B, local and creator databases",
  "Triple email verification",
  "AI research + personalization",
  "Campaigns, warmup and Onebox",
  "MCP access for any LLM",
];

export function StackCompare() {
  return (
    <section id="pricing" className="relative overflow-hidden py-24">
      <div className="absolute inset-0 gradient-hero opacity-80" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-eyebrow text-[10px] text-forest">Cost of the old stack</span>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.03] text-ink text-balance md:text-[3rem]">
              Four invoices, or <span className="gradient-text">one line item.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            A typical outbound stack, billed monthly — next to Lumina.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
          {/* Old stack */}
          <div className="rounded-[26px] border border-border/60 bg-white/55 p-6 backdrop-blur md:p-7">
            <div className="flex items-baseline justify-between">
              <p className="font-eyebrow text-[10px] text-muted-foreground">Old stack</p>
              <p className="font-display text-2xl text-ink/40 line-through decoration-ink/20">
                ${total.toLocaleString()}<span className="font-sans text-[11px]">/mo</span>
              </p>
            </div>
            <ul className="mt-5 divide-y divide-border/60">
              {oldTools.map((t) => (
                <li key={t.name} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink/65 line-through decoration-ink/20">{t.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{t.sub}</p>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-secondary/80 sm:block">
                      <span className="block h-full rounded-full bg-ink/20" style={{ width: `${(t.price / max) * 100}%` }} />
                    </span>
                    <span className="w-16 text-right font-mono text-[11px] text-muted-foreground">${t.price}/mo</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Lumina */}
          <div className="relative overflow-hidden rounded-[26px] border border-forest/20 bg-white p-6 shadow-elegant md:p-7">
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-mint/35 to-transparent" />
            <div className="relative flex items-baseline justify-between">
              <p className="font-eyebrow text-[10px] text-forest">You pay</p>
              <p className="font-display text-5xl leading-none text-ink">
                ${lumina}
                <span className="font-sans text-xs text-muted-foreground">/mo</span>
              </p>
            </div>
            <p className="relative mt-2 text-right font-mono text-[11px] text-forest">
              saves ${(total - lumina).toLocaleString()}/mo · 94% less
            </p>
            <ul className="relative mt-5 grid gap-2.5 border-t border-border/60 pt-5">
              {included.map((v) => (
                <li key={v} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-forest" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
