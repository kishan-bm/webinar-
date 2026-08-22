import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categories } from "@/data/suite";

export function Footer() {
  const cols = [
    { title: "Compare", items: ["Instantly Alternative", "Smartlead Alternative", "Lemlist Alternative", "Reply Alternative", "Woodpecker Alternative"] },
    { title: "Legal", items: ["Terms & Conditions", "Fair Use Policy", "Privacy Policy", "Refund Policy"] },
    { title: "Product", items: ["Pricing", "Affiliate", "Roadmap", "Lumina for Startups", "Integrations"] },
    { title: "Company", items: ["Team", "Help & Support", "Blog", "Careers"] },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-white">
      {/* Giant background wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden"
        style={{ height: "70%" }}
      >
        <span
          className="translate-y-[18%] font-display leading-[0.8] tracking-tight text-transparent bg-clip-text"
          style={{
            fontSize: "clamp(8rem, 30vw, 28rem)",
            backgroundImage:
              "linear-gradient(to bottom, oklch(0.72 0.1725 235 / 0.16), oklch(0.45 0.1725 235 / 0.28))",
          }}
        >
          Lumina
        </span>
      </div>
      {/* Gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to top, oklch(0.85 0.1495 235 / 0.35), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          {/* Left: brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg gradient-forest text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-base font-semibold text-ink">Lumina</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Cold Emailing, Simplified.
            </p>
            <p className="mt-8 text-xs text-muted-foreground">
              © All Rights Reserved. Lumina Labs {new Date().getFullYear()}
            </p>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Suite</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink">
                <li>
                  <Link to="/features" className="transition-colors hover:text-forest">All features</Link>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link to={c.route as "/"} className="transition-colors hover:text-forest">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {cols.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{c.title}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-ink">
                  {c.items.map((i) => (
                    <li key={i}>
                      <a href="#" className="transition-colors hover:text-forest">{i}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Spacer so the background wordmark is visible below the columns */}
        <div className="h-40 sm:h-56 md:h-72" />
      </div>
    </footer>
  );
}