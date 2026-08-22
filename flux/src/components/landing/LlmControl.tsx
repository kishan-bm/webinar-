import { useEffect, useState } from "react";
import { Terminal, Check, Copy, KeyRound, Command } from "lucide-react";

const clients = ["Claude", "Claude Code", "ChatGPT", "Codex", "Gemini", "Cursor"];

const script = [
  { cmd: "lumina search --niche \"med spas\" --city austin", out: "312 businesses matched", ms: "1.2s" },
  { cmd: "lumina verify --mode triple", out: "287 deliverable · 25 dropped", ms: "4.8s" },
  { cmd: "lumina enrich --facts 3", out: "861 research facts written", ms: "9.1s" },
  { cmd: "lumina push --campaign \"Austin Med Spas\"", out: "287 leads queued · sending", ms: "0.6s" },
];

export function LlmControl() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (script.length + 1)), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="mcp" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 gradient-section" />
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-hub-ring rounded-full bg-forest" />
                <span className="h-1.5 w-1.5 rounded-full bg-forest" />
              </span>
              MCP server · 85 tools exposed
            </span>
            <h2 className="mt-6 font-display text-4xl leading-[1.02] text-ink text-balance md:text-5xl">
              Lumina takes <span className="gradient-text">instructions, not clicks.</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground">
              Point any model at our MCP endpoint and it can run the whole motion — search, verify, enrich, launch —
              while you stay in the chat window you already live in.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: Copy, t: "Copy the endpoint", s: "One line. Paste into your client config." },
                { icon: KeyRound, t: "Mint an API key", s: "Scoped per workspace, revocable anytime." },
                { icon: Command, t: "Start giving orders", s: "Every dashboard action has a tool behind it." },
              ].map((r, i) => (
                <div key={r.t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg border border-border/60 bg-white font-mono text-[11px] font-semibold text-forest">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.t}</p>
                    <p className="text-xs text-muted-foreground">{r.s}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {clients.map((c) => (
                <span
                  key={c}
                  className="rounded-lg border border-border/60 bg-white/80 px-3 py-1.5 font-mono text-[11px] text-ink shadow-sm backdrop-blur"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Dark console */}
          <div className="relative">
            <span className="absolute -inset-6 rounded-[2.5rem] bg-mint/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-elegant" >
              <div className="gradient-forest">
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
                  <Terminal className="h-4 w-4 text-white/70" />
                  <span className="font-mono text-[11px] text-white/70">lumina-mcp — connected</span>
                  <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" /> live
                  </span>
                </div>

                <div className="space-y-3 px-5 py-6 md:px-7">
                  <p className="font-mono text-[11px] leading-relaxed text-mint/90">
                    &gt; find me austin med spas, verify them, write openers and start the campaign
                  </p>

                  {script.map((l, i) => {
                    const shown = i < step;
                    return (
                      <div
                        key={l.cmd}
                        className={`rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-500 ${
                          shown ? "opacity-100 translate-y-0" : "opacity-25 translate-y-1"
                        }`}
                      >
                        <p className="truncate font-mono text-[11px] text-white/90">
                          <span className="text-mint">$</span> {l.cmd}
                        </p>
                        <p className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-white/55">
                          {shown ? (
                            <Check className="h-3 w-3 text-mint" />
                          ) : (
                            <span className="h-3 w-3 rounded-full border border-white/25" />
                          )}
                          {shown ? l.out : "queued"}
                          <span className="ml-auto">{shown ? l.ms : "—"}</span>
                        </p>
                      </div>
                    );
                  })}

                  <div className="h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-mint transition-[width] duration-500 ease-out"
                      style={{ width: `${(step / script.length) * 100}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-white/60">
                    {step >= script.length ? "✓ campaign live — 287 leads sending" : "working…"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
