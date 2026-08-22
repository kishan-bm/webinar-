import { useEffect, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categories } from "@/data/suite";

const links = [
  { label: "How it works", href: "/#workflow" },
  { label: "Customers", href: "/#customers" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openSuite, setOpenSuite] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 ${
          scrolled
            ? "border-border/70 bg-white/70 shadow-elegant backdrop-blur-xl"
            : "border-transparent bg-white/30 backdrop-blur-md"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 pl-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-forest text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink">
            Lumina
          </span>
        </Link>
        <ul className="hidden items-center gap-1 md:flex">
          <li
            className="relative"
            onMouseEnter={() => setOpenSuite(true)}
            onMouseLeave={() => setOpenSuite(false)}
          >
            <button
              type="button"
              onClick={() => setOpenSuite(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-ink"
            >
              Explore suite
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${openSuite ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`absolute left-[-6rem] top-full w-[min(60rem,84vw)] origin-top pt-3 transition-all duration-300 ${
                openSuite
                  ? "pointer-events-auto opacity-100 translate-y-0"
                  : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              {/* invisible bridge so the pointer can travel from the trigger into the panel */}
              <div className="rounded-[26px] border border-border/60 bg-white/95 p-6 shadow-elegant backdrop-blur-xl">
                <div className="grid gap-7 md:grid-cols-4">
                  {categories.map((c) => (
                    <div key={c.slug}>
                      <Link
                        to={c.route as "/"}
                        onClick={() => setOpenSuite(false)}
                        className="group block border-b border-border/60 pb-3"
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                          <span className="font-display text-[15px] text-ink group-hover:text-forest">
                            {c.title}
                          </span>
                        </span>
                        <span className="mt-1 block pl-3.5 text-[12px] text-muted-foreground">
                          {c.navBlurb}
                        </span>
                      </Link>
                      <ul className="mt-3 space-y-3">
                        {c.tools.map((t) => (
                          <li key={t.name}>
                            <Link
                              to={c.route as "/"}
                              hash={t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                              onClick={() => setOpenSuite(false)}
                              className="group flex items-start gap-2.5"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-secondary/60 text-forest transition-colors group-hover:bg-secondary">
                                <t.icon className="h-3.5 w-3.5" />
                              </span>
                              <span>
                                <span className="flex items-center gap-1.5">
                                  <span className="text-[13px] font-medium text-ink group-hover:text-forest">
                                    {t.name}
                                  </span>
                                  {t.badge && (
                                    <span className="font-eyebrow rounded-full bg-secondary px-1.5 py-0.5 text-[7px] text-forest">
                                      {t.badge}
                                    </span>
                                  )}
                                </span>
                                <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                                  {t.blurb}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                  <p className="text-[12.5px] text-muted-foreground">
                    Every tool included in one workspace.
                  </p>
                  <Link
                    to="/features"
                    className="text-[12.5px] font-medium text-forest hover:underline"
                  >
                    See the full suite →
                  </Link>
                </div>
              </div>
            </div>
          </li>
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 pr-1">
          <a
            href="#waitlist"
            className="hidden text-sm font-medium text-foreground/70 hover:text-ink sm:inline-flex sm:px-3 sm:py-2"
          >
            Sign in
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 rounded-full gradient-forest px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02]"
          >
            Join waitlist
          </a>
        </div>
      </nav>
    </header>
  );
}