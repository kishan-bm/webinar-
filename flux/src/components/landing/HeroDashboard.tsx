import { useEffect, useState } from "react";
import {
  Inbox,
  Users,
  Send,
  BarChart3,
  Search,
  Sparkles,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";

const views = ["campaigns", "onebox", "deliverability"] as const;
type View = (typeof views)[number];

const navItems: { key: View | "other"; icon: any; label: string; count: string | null }[] = [
  { key: "other", icon: Search, label: "Prospects", count: null },
  { key: "campaigns", icon: Send, label: "Campaigns", count: "8" },
  { key: "onebox", icon: Inbox, label: "Onebox", count: "24" },
  { key: "deliverability", icon: ShieldCheck, label: "Deliverability", count: null },
  { key: "other", icon: Users, label: "Accounts", count: null },
  { key: "other", icon: BarChart3, label: "Analytics", count: null },
];

export function HeroDashboard() {
  const [active, setActive] = useState<View>("campaigns");
  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => views[(views.indexOf(v) + 1) % views.length]);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-white shadow-elegant">
      <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-b from-[oklch(0.98_0.023_235)] to-white px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.15_25)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.13_85)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.1725_235)]" />
        </div>
        <div className="flex h-6 w-64 items-center justify-center rounded-md border border-border/60 bg-white/70 text-[10px] text-muted-foreground">
          app.lumina.ai / {active}
        </div>
        <div className="w-14" />
      </div>

      <div className="grid grid-cols-[220px_1fr]">
        <aside className="border-r border-border/60 bg-[oklch(0.98_0.0172_235)] p-4">
          <div className="flex items-center gap-2 px-2 pb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-md gradient-forest text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-semibold text-ink">Lumina</span>
          </div>
          <nav className="space-y-1 text-sm">
            {navItems.map((item, i) => {
              const isActive = item.key === active;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-300 ${
                    isActive
                      ? "bg-white text-ink shadow-sm ring-1 ring-border/60"
                      : "text-foreground/70"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {item.count && (
                    <span className="rounded-full bg-mint px-1.5 py-0.5 text-[10px] font-medium text-forest-deep">
                      {item.count}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="relative p-6 min-h-[420px]">
          {active === "campaigns" && <CampaignsView key="c" />}
          {active === "onebox" && <OneboxView key="o" />}
          {active === "deliverability" && <DeliverabilityView key="d" />}
          {/* Minimal view indicator */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border/60 bg-white/80 px-2.5 py-1 backdrop-blur">
            {views.map((v) => {
              const isActive = v === active;
              return (
                <span
                  key={v}
                  className={`h-1 rounded-full transition-all duration-500 ${isActive ? "w-6 bg-forest" : "w-1.5 bg-border"}`}
                />
              );
            })}
          </div>
        </main>
      </div>

      <div className="pointer-events-none absolute -right-4 top-24 hidden w-72 rounded-2xl border border-border/70 bg-white p-3 shadow-elegant animate-float-slow md:block">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-mint text-forest-deep">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-ink">278 leads enriched</p>
            <p className="text-[11px] text-muted-foreground">LinkedIn + firmographic data appended.</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -left-4 bottom-16 hidden w-72 rounded-2xl border border-border/70 bg-white p-3 shadow-elegant animate-float-slow md:block" style={{ animationDelay: "-2s" }}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg gradient-forest text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold text-ink">320 personalized emails ready</p>
            <p className="text-[11px] text-muted-foreground">"Cold Outreach" draft is queued to send.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsView() {
  return (
    <div className="animate-rise">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-lg font-semibold text-ink">Campaigns</h3>
          <p className="text-xs text-muted-foreground">Live pipeline · updated 2s ago</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white">
          <Zap className="h-3 w-3" /> New campaign
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Emails sent", value: "128,942", d: "+12%" },
          { label: "Reply rate", value: "18.4%", d: "+3.2%" },
          { label: "Meetings booked", value: "342", d: "+41" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-white p-3 text-left">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{k.value}</p>
            <p className="text-[10px] font-medium text-forest">{k.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-white">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_0.6fr] items-center border-b border-border/60 bg-[oklch(0.98_0.0172_235)] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Campaign</span><span>Progress</span><span>Contacted</span><span>Replies</span><span>Status</span>
        </div>
        {[
          { name: "Q4 SaaS Founders", progress: 82, contacted: "1,204 / 1,500", replies: "218", status: "Active" },
          { name: "Enterprise CTOs", progress: 46, contacted: "830 / 1,800", replies: "94", status: "Active" },
          { name: "Agency Partners", progress: 100, contacted: "900 / 900", replies: "176", status: "Done" },
        ].map((row) => (
          <div key={row.name} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_0.6fr] items-center px-4 py-3 text-xs text-foreground/80">
            <div className="flex items-center gap-2 font-medium text-ink">
              <Mail className="h-3.5 w-3.5 text-forest" /> {row.name}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full gradient-forest" style={{ width: `${row.progress}%` }} />
              </div>
              <span className="text-[10px] tabular-nums text-muted-foreground">{row.progress}%</span>
            </div>
            <span className="tabular-nums">{row.contacted}</span>
            <span className="tabular-nums font-medium text-ink">{row.replies}</span>
            <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${row.status === "Active" ? "bg-mint text-forest-deep" : "bg-secondary text-muted-foreground"}`}>
              <span className="h-1 w-1 rounded-full bg-current" />
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OneboxView() {
  const replies = [
    { from: "Sarah Chen", co: "Northwind", msg: "Interested — Thursday 2pm works.", tag: "Interested", tone: "hot", time: "2m" },
    { from: "Marcus Reyes", co: "Cascade", msg: "Not the right time, try in Q1.", tag: "Not now", tone: "cool", time: "12m" },
    { from: "Priya Patel", co: "Fern Labs", msg: "Can you send a one-pager first?", tag: "Info request", tone: "warm", time: "38m" },
    { from: "Liam O'Neill", co: "Baseline", msg: "Let's book a call — send times.", tag: "Meeting", tone: "hot", time: "1h" },
    { from: "Ava Nakamura", co: "Halcyon", msg: "Forwarded to our head of ops.", tag: "Referral", tone: "warm", time: "3h" },
  ];
  return (
    <div className="animate-rise">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-lg font-semibold text-ink">Onebox</h3>
          <p className="text-xs text-muted-foreground">24 unread · auto-tagged</p>
        </div>
        <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-semibold text-forest-deep">All mailboxes</span>
      </div>
      <div className="space-y-2">
        {replies.map((r, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white p-3">
            <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[11px] font-semibold ${r.tone === "hot" ? "bg-mint text-forest-deep" : r.tone === "warm" ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>
              {r.from.split(" ").map(n=>n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-ink">{r.from} <span className="text-muted-foreground font-normal">· {r.co}</span></p>
              <p className="truncate text-[11px] text-muted-foreground">{r.msg}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{r.time}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.tone === "hot" ? "bg-mint text-forest-deep" : r.tone === "warm" ? "bg-secondary text-ink" : "bg-muted text-muted-foreground"}`}>{r.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliverabilityView() {
  return (
    <div className="animate-rise">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-lg font-semibold text-ink">Deliverability</h3>
          <p className="text-xs text-muted-foreground">alex@lumina.ai · 12 mailboxes healthy</p>
        </div>
        <span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-semibold text-forest-deep">Inbox Placement</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Inbox rate", v: "97.2%", trend: "+2.4%" },
          { label: "Spam rate", v: "0.3%", trend: "-1.1%" },
          { label: "Warmup", v: "A+", trend: "stable" },
          { label: "DNS health", v: "100%", trend: "SPF · DKIM" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-white p-3 text-left">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{k.v}</p>
            <p className="mt-0.5 text-[10px] font-medium text-forest">{k.trend}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-border/60 bg-white p-4">
        <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground">Placement · last 30 days</p>
        <div className="flex h-24 items-end gap-1">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex-1 rounded-sm gradient-forest opacity-80" style={{ height: `${50 + Math.sin(i * 0.7) * 20 + (i % 5) * 4}%` }} />
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-[10px]">
        {["SPF ✓ verified", "DKIM ✓ verified", "DMARC ✓ enforced"].map((t) => (
          <div key={t} className="rounded-lg bg-mint/60 px-3 py-2 font-medium text-forest-deep text-center">{t}</div>
        ))}
      </div>
    </div>
  );
}