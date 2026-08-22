import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { categories } from "@/data/suite";

export const Route = createFileRoute("/features/")({
  head: () => ({
    meta: [
      { title: "The Lumina Suite — Every Cold Outreach Tool in One Place" },
      {
        name: "description",
        content:
          "Explore the Lumina suite: email verification, deliverability audits, AI cold email tools and verified lead databases — 18 tools on one surface.",
      },
      { property: "og:title", content: "The Lumina Suite — Every Cold Outreach Tool in One Place" },
      {
        property: "og:description",
        content:
          "Email verification, deliverability, AI cold email tools and verified lead databases. See exactly what each Lumina tool does.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SuiteIndex,
});

function SuiteIndex() {
  const toolCount = categories.reduce((n, c) => n + c.tools.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-36 pb-20">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative mx-auto max-w-5xl px-6">
            <span className="font-eyebrow inline-flex items-center gap-2 text-[10px] text-forest">
              <span className="h-1 w-1 rounded-full bg-forest" /> The Lumina Suite
            </span>
            <h1 className="animate-line-up mt-5 max-w-3xl font-display text-[2.6rem] leading-[0.98] text-ink text-balance md:text-[4.2rem]">
              {toolCount} tools.{" "}
              <span className="gradient-text">One outbound engine.</span>
            </h1>
            <p className="animate-blur-in mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">
              Find the lead, verify the address, fix the deliverability, write the email and run the
              campaign — without stitching five subscriptions together.
            </p>
            <a
              href="/#waitlist"
              className="mt-9 inline-flex items-center gap-1.5 rounded-full gradient-forest px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start with 1,000 free leads <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-5xl space-y-6 px-6">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="rounded-[26px] border border-border/60 bg-white/70 p-6 shadow-elegant backdrop-blur md:p-9"
              >
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="max-w-lg">
                    <span className="font-eyebrow inline-flex items-center gap-2 text-[10px] text-forest">
                      <c.icon className="h-3.5 w-3.5" /> {c.eyebrow}
                    </span>
                    <h2 className="mt-3 font-display text-[1.7rem] leading-tight text-ink md:text-[2.1rem]">
                      {c.headline} <span className="gradient-text">{c.headlineAccent}</span>
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{c.intro}</p>
                  </div>
                  <Link
                    to={c.route as "/"}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-secondary"
                  >
                    Explore <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {c.tools.map((t) => (
                    <Link
                      key={t.name}
                      to={c.route as "/"}
                      hash={t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                      className="group flex items-start gap-3 rounded-2xl border border-border/50 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-forest">
                        <t.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[15px] text-ink">{t.name}</span>
                          {t.badge && (
                            <span className="font-eyebrow rounded-full bg-secondary px-2 py-0.5 text-[8px] text-forest">
                              {t.badge}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-[12.5px] leading-snug text-muted-foreground">
                          {t.blurb}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}