import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="waitlist" className="relative overflow-hidden py-32">
      <div className="absolute inset-0 gradient-forest" />
      <div className="pointer-events-none absolute inset-0 opacity-30 grid-bg" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-mint/30 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-mint/20 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint">Early access</p>
        <h2 className="mt-4 font-display text-5xl leading-[1.02] text-white text-balance md:text-7xl">
          Want in? Get access to <span className="italic bg-gradient-to-r from-mint to-white bg-clip-text text-transparent">FLUX.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          Spots are limited as we onboard new traders. Drop your email and we'll send you access details and a walkthrough of how FLUX works.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur sm:flex-row">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none" />
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-forest-deep transition-transform hover:scale-[1.02]">
            {submitted ? (<><Check className="h-4 w-4" /> You're on the list</>) : (<>Get Access <ArrowRight className="h-4 w-4" /></>)}
          </button>
        </form>
        <p className="mt-5 text-xs text-white/50">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}