import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="waitlist" className="relative overflow-hidden bg-white py-32">
      <div className="pointer-events-none absolute inset-0 opacity-40 grid-bg" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-mint/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.1495_235/0.35)] blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Early access</p>
        <h2 className="mt-4 font-display text-5xl leading-[1.02] text-ink text-balance md:text-7xl">
          Want in? Get access to <span className="gradient-text italic">FLUX.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Spots are limited as we onboard new traders. Drop your email and we'll send you access details and a walkthrough of how FLUX works.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-2 rounded-2xl border border-border/60 bg-secondary/40 p-2 backdrop-blur sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none" />
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-forest-deep">
            {submitted ? (<><Check className="h-4 w-4" /> You're on the list</>) : (<>Get Access <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>
        <p className="mt-5 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}