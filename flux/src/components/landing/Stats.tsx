export function Stats() {
  const stats = [
    { v: "500M+", l: "Emails delivered" },
    { v: "18.4%", l: "Avg. reply rate" },
    { v: "97%", l: "Inbox placement" },
    { v: "$2.5B+", l: "Pipeline generated" },
  ];
  const notes = [
    { t: "Prospecting that finds real buyers.", x: "6%", y: "18%" },
    { t: "Emails that actually sound human.", x: "72%", y: "10%" },
    { t: "Inbox placement, not promotions.", x: "78%", y: "62%" },
    { t: "Replies handled in one place.", x: "4%", y: "70%" },
  ];
  return (
    <section id="how" className="relative overflow-hidden py-32" style={{ background: "#0D2E4E" }}>
      <div className="absolute inset-0 grid-bg opacity-15" />
      {/* Line-art infographic */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="statsStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.1495 235)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="oklch(0.75 0.1495 235)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M 80 220 C 240 60, 520 60, 620 260 S 980 500, 1100 260"
          fill="none"
          stroke="url(#statsStroke)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M 100 720 C 320 820, 560 640, 680 720 S 980 820, 1120 640"
          fill="none"
          stroke="url(#statsStroke)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <circle cx="200" cy="180" r="180" fill="none" stroke="oklch(0.55 0.1495 235 / 0.18)" strokeWidth="1.2" strokeDasharray="4 6" />
        <circle cx="1000" cy="720" r="220" fill="none" stroke="oklch(0.55 0.1495 235 / 0.18)" strokeWidth="1.2" strokeDasharray="4 6" />
        {[["120","240"],["620","260"],["1080","280"],["180","700"],["700","720"],["1080","640"]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="oklch(0.55 0.1495 235)" opacity="0.5" />
        ))}
      </svg>
      {/* Floating pain-point notes */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {notes.map((n, i) => (
          <p
            key={i}
            className="absolute max-w-[180px] text-center font-display text-base italic leading-snug text-white/40"
            style={{ left: n.x, top: n.y }}
          >
            "{n.t}"
          </p>
        ))}
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">By the numbers</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] text-white text-balance md:text-6xl">
            Outbound results, <span className="gradient-text italic">quantified.</span>
          </h2>
        </div>
        <div className="relative mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="group relative bg-[#0D2E4E] p-8 backdrop-blur transition-colors hover:bg-white/5">
              <p className="font-display text-5xl leading-none text-white md:text-6xl">{s.v}</p>
              <p className="mt-3 text-sm text-white/60">{s.l}</p>
              <span className="absolute inset-x-8 bottom-6 h-px scale-x-0 gradient-forest transition-transform duration-500 group-hover:scale-x-100 origin-left" />
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { title: "70% more meetings booked", who: "Northwind · GTM Ops" },
            { title: "4× SDR efficiency", who: "Cascade · Head of Growth" },
            { title: "64% lower tech stack cost", who: "Fern Labs · CFO" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="font-display text-2xl leading-tight text-white">{c.title}</p>
              <p className="mt-4 text-xs uppercase tracking-wider text-white/50">{c.who}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}