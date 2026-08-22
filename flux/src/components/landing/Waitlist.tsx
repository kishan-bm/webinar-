import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="waitlist" className="relative overflow-hidden bg-white py-32">
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16" style={{ background: "#0D2E4E" }}>
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-15" />
          <div
            className="pointer-events-none absolute"
            style={{ width: 500, height: 500, top: -180, right: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,66,10,0.18) 0%, transparent 65%)" }}
          />
          <div
            className="pointer-events-none absolute"
            style={{ width: 400, height: 400, bottom: -140, left: -80, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,100,200,0.22) 0%, transparent 65%)" }}
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#e87040" }}>Early access</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] text-white text-balance md:text-6xl">
              Want in? Get access to <span className="italic" style={{ color: "#e04d10" }}>FLUX.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              Spots are limited as we onboard new traders. Drop your email and we'll send you access details and a walkthrough of how FLUX works.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} className="mx-auto mt-10 flex max-w-xl flex-col items-stretch gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 backdrop-blur sm:flex-row">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-forest-deep">
                {submitted ? (<><Check className="h-4 w-4" /> You're on the list</>) : (<>Get Access <ArrowRight className="h-4 w-4" /></>)}
              </button>
            </form>
            <p className="mt-5 text-xs text-white/50">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
