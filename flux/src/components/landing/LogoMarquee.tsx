const logos = [
  "Northwind", "Vercel", "Anthropic", "Redis", "Autodesk", "Dolby",
  "Linear", "Ramp", "Notion", "Figma", "Retool", "Framer",
];

export function LogoMarquee() {
  return (
    <section className="relative border-y border-border/60 bg-white/60 py-10 backdrop-blur">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by teams shipping outbound at scale
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-14 pr-14">
          {[...logos, ...logos].map((name, i) => (
            <span key={i} className="font-display text-2xl tracking-tight text-foreground/40 hover:text-ink transition-colors">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}