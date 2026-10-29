/**
 * Flux Pro value comparison section.
 *
 * Usage:  import { FluxValueComparison } from "@/components/landing/FluxValueComparison";
 *         <FluxValueComparison />
 *
 * Self-contained: all styles are scoped under .fxc, so nothing leaks into the
 * rest of the page. Uses the Satoshi / General Sans fonts the site already loads.
 * The CTA uses the same Pro checkout link as the hero and navbar buttons
 * (admin Site Config "proCheckoutLink", default member.navigationtrading.com/join/pro).
 *
 * Placed on /flux right after the "Every signal in. One trading edge out." section.
 *
 * Competitor prices are monthly-billing list prices checked October 2026.
 * Update the ROWS array below if they change; the total recalculates itself.
 */

import { useCheckoutLink } from "@/hooks/useCheckoutLink";

type Row = {
  tool: string;
  fluxNote: string;
  competitor: string;
  competitorNote?: string;
  /** Monthly price in USD. Omit for rows that don't count toward the total. */
  price?: number;
  /** Shown instead of a price when `price` is omitted. */
  priceLabel?: string;
  exclusive?: boolean;
};

const ROWS: Row[] = [
  {
    tool: "Options Analyzer",
    fluxNote: "Live P&L curves, time and IV scrubbing, send orders to thinkorswim, Tradier or IBKR",
    competitor: "OptionStrat Live Tools",
    price: 39.99,
  },
  {
    tool: "Calendar Spread IV Ratio Monitor",
    fluxNote: "Front vs. back-month IV ratios to spot rich calendar setups",
    competitor: "ORATS Trading Tools",
    competitorNote: "Forward vol & term structure analytics. Also: Market Chameleon Options Trader, $69/mo",
    price: 99,
  },
  {
    tool: "Earnings Calendar & Statistics",
    fluxNote: "Upcoming reports with historical and implied move stats",
    competitor: "Market Chameleon Earnings Trader",
    price: 79,
  },
  {
    tool: "NTT Scanner",
    fluxNote: "Navigation Trading's proprietary setup scanner",
    competitor: "Not available anywhere else",
    priceLabel: "Only in Flux",
    exclusive: true,
  },
  {
    tool: "0 DTE Dashboard",
    fluxNote: "Same-day SPX levels and positioning in real time",
    competitor: "SpotGamma Essential",
    competitorNote: "Intraday flow tools (HIRO) require Alpha at $299/mo",
    price: 99,
  },
  {
    tool: "Live Options Data",
    fluxNote: "Real-time chains, volume and flow",
    competitor: "Unusual Whales",
    price: 50,
  },
  {
    tool: "Real-Time News Feed",
    fluxNote: "Market-moving headlines as they break",
    competitor: "Benzinga Pro Basic",
    competitorNote: "Squawk and faster alerts require Essential at $197/mo",
    price: 37,
  },
  {
    tool: "Positions & Trade Tracking",
    fluxNote: "Import positions from thinkorswim and track every trade",
    competitor: "TraderSync Pro",
    competitorNote: "Also: TradeZella $29/mo, Tradervue Silver $29.95/mo",
    price: 29.95,
  },
  {
    tool: "Prediction Market Odds",
    fluxNote: "Event odds next to your charts",
    competitor: "Kalshi / Polymarket",
    competitorNote: "Free, but on separate sites",
    priceLabel: "Another tab",
  },
];

const monthlyTotal = ROWS.reduce((sum, r) => sum + (r.price ?? 0), 0);
const fmtPrice = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const fmtMoney = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
// Rounded down to the nearest $10 / $100 so headline claims stay conservative.
const headlineMonthly = Math.floor(monthlyTotal / 10) * 10;
const headlineYearly = Math.floor((monthlyTotal * 12) / 100) * 100;

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#0D2E4E" />
      <path d="M5.5 10.5l3 3 6-6.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FluxValueComparison() {
  const checkoutUrl = useCheckoutLink();

  return (
    <section className="fxc" id="flux-value" aria-labelledby="fxc-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="fxc-wrap">
        <p className="fxc-eyebrow">The Pro Membership Value</p>
        <h2 className="fxc-title" id="fxc-title">
          Over <span>${headlineMonthly} a month</span> in trading tools. One login.
        </h2>
        <p className="fxc-lede">
          Most traders piece together a stack of subscriptions to get what Flux puts on one screen. Here&apos;s what
          each Flux tool would cost you on its own, and it all comes with your Pro membership.
        </p>

        <div className="fxc-table" role="table" aria-label="Flux compared with standalone tools">
          <div className="fxc-row fxc-head" role="row">
            <div className="fxc-cell" role="columnheader">Tool</div>
            <div className="fxc-cell fxc-flux" role="columnheader">Flux (Pro)</div>
            <div className="fxc-cell" role="columnheader">Closest standalone tool</div>
            <div className="fxc-cell fxc-price" role="columnheader">Their price</div>
          </div>

          {ROWS.map((r) => (
            <div className={`fxc-row${r.exclusive ? " fxc-excl" : ""}`} role="row" key={r.tool}>
              <div className="fxc-cell fxc-feature" role="cell">
                <h3>
                  {r.tool}
                  {r.exclusive && <span className="fxc-badge">Exclusive</span>}
                </h3>
              </div>
              <div className="fxc-cell fxc-flux" role="cell">
                <span className="fxc-check">
                  <Check />
                  Included
                </span>
                <p>{r.fluxNote}</p>
              </div>
              <div className="fxc-cell fxc-comp" role="cell">
                <strong>{r.competitor}</strong>
                {r.competitorNote && <p className="fxc-alt">{r.competitorNote}</p>}
              </div>
              <div className="fxc-cell fxc-price" role="cell">
                {r.price !== undefined ? (
                  <>
                    {fmtPrice(r.price)}
                    <small>/month</small>
                  </>
                ) : (
                  <span className="fxc-na">{r.priceLabel}</span>
                )}
              </div>
            </div>
          ))}

          <div className="fxc-total">
            <div>
              <div className="fxc-total-label">Buying these separately</div>
              <div className="fxc-total-compare">
                <span className="fxc-strike">
                  {fmtMoney(monthlyTotal)}
                  <small>/mo</small>
                </span>
                <span className="fxc-incl">
                  <em>Included</em> with Pro
                </span>
              </div>
              <p className="fxc-sub">
                That&apos;s more than ${headlineYearly.toLocaleString("en-US")} a year in subscriptions, plus the NTT
                Scanner you can&apos;t buy anywhere else.
              </p>
            </div>
            <a className="fxc-cta" href={checkoutUrl} target="_blank" rel="noopener noreferrer">
              Get FLUX with Pro
            </a>
          </div>
        </div>

        <p className="fxc-notes">
          Competitor prices are publicly listed monthly-billing rates as of October 2026 and may change. Some providers
          offer annual discounts or free tiers with delayed data. Comparisons pair each Flux tool with the closest
          standalone product and aren&apos;t claims of identical features. All trademarks belong to their respective
          owners, and Navigation Trading isn&apos;t affiliated with any of the companies listed.
        </p>
      </div>
    </section>
  );
}

const CSS = `
.fxc{--navy:#0D2E4E;--navy-deep:#0a1828;--orange:#c8420a;--orange-lt:#e87040;--ink:#0D2E4E;--muted:#5b6b7d;--line:#e3e8ef;--bg:#f4f6fa;--card:#fff;
  background:var(--bg);color:var(--ink);font-family:"General Sans","Satoshi",system-ui,sans-serif;padding:96px 16px;}
.fxc *{box-sizing:border-box}
.fxc-wrap{max-width:1120px;margin:0 auto}
.fxc-eyebrow{font:600 13px/1 "General Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--orange);margin:0}
.fxc-title{font-family:"Satoshi",sans-serif;font-weight:900;font-size:clamp(2rem,4.6vw,3.4rem);line-height:1.05;margin:16px 0 0;text-wrap:balance}
.fxc-title span{color:var(--orange)}
.fxc-lede{font-size:18px;line-height:1.55;color:var(--muted);max-width:640px;margin:20px 0 0}

.fxc-table{margin-top:48px;background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 20px 50px -30px rgba(13,46,78,.35)}
.fxc-row{display:grid;grid-template-columns:1.25fr 1.35fr 1.35fr .7fr;border-top:1px solid var(--line)}
.fxc-row:first-child{border-top:0}
.fxc-cell{padding:22px 24px}
.fxc-head .fxc-cell{font:600 12px/1.2 "General Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);padding-top:18px;padding-bottom:18px;background:#f8fafc}
.fxc-head .fxc-flux{background:var(--navy);color:#fff}
.fxc-head .fxc-price{text-align:right}

.fxc-feature h3{font-family:"Satoshi",sans-serif;font-weight:700;font-size:18px;margin:0;line-height:1.25}
.fxc-flux{background:rgba(13,46,78,.04);border-left:3px solid var(--navy)}
.fxc-check{display:inline-flex;align-items:center;gap:8px;font-weight:600;color:var(--navy);font-size:15px}
.fxc-check svg{flex:none}
.fxc-flux p,.fxc-comp p{margin:6px 0 0;font-size:14px;line-height:1.5;color:var(--muted)}
.fxc-comp strong{font-weight:600;font-size:15px}
.fxc-alt{font-size:13px!important}
.fxc-price{text-align:right;font-family:"Satoshi",sans-serif;font-weight:700;font-size:20px;white-space:nowrap;font-variant-numeric:tabular-nums}
.fxc-price small{display:block;font:500 12px/1.3 "General Sans",sans-serif;color:var(--muted)}
.fxc-excl .fxc-comp strong{color:var(--orange)}
.fxc-badge{display:inline-block;background:var(--orange);color:#fff;font:600 11px/1 "General Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:6px 9px;border-radius:999px;margin-left:8px;vertical-align:middle}
.fxc-na{color:var(--muted);font-weight:500;font-size:15px}

.fxc-total{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center;background:linear-gradient(135deg,var(--navy) 0%,var(--navy-deep) 100%);color:#fff;padding:32px}
.fxc-total-label{font:600 13px/1 "General Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.fxc-total-compare{display:flex;flex-wrap:wrap;align-items:baseline;gap:12px 28px;margin-top:12px}
.fxc-strike{font-family:"Satoshi",sans-serif;font-weight:900;font-size:clamp(1.8rem,3.6vw,2.6rem);text-decoration:line-through;text-decoration-color:var(--orange-lt);text-decoration-thickness:3px;color:rgba(255,255,255,.85)}
.fxc-strike small{font-size:.5em;font-weight:500}
.fxc-incl{font-family:"Satoshi",sans-serif;font-weight:900;font-size:clamp(1.8rem,3.6vw,2.6rem);color:#fff}
.fxc-incl em{font-style:normal;color:var(--orange-lt)}
.fxc-sub{margin:10px 0 0;color:rgba(255,255,255,.75);font-size:15px}
.fxc-cta{display:inline-block;background:var(--orange);color:#fff;text-decoration:none;font:600 16px/1 "General Sans",sans-serif;padding:18px 28px;border-radius:999px;white-space:nowrap;transition:background .2s}
.fxc-cta:hover{background:#e04d10}
.fxc-cta:focus-visible{outline:3px solid var(--orange-lt);outline-offset:3px}

.fxc-notes{margin:20px 4px 0;font-size:12px;line-height:1.6;color:var(--muted)}

@media (max-width:860px){
  .fxc{padding:64px 16px}
  .fxc-head{display:none}
  .fxc-row{grid-template-columns:1fr auto;grid-template-areas:"feat price" "flux flux" "comp comp";padding:20px;gap:12px 16px}
  .fxc-cell{padding:0}
  .fxc-feature{grid-area:feat;align-self:center}
  .fxc-price{grid-area:price;align-self:center}
  .fxc-flux{grid-area:flux;border-left:3px solid var(--navy);background:rgba(13,46,78,.04);padding:12px 14px;border-radius:0 10px 10px 0}
  .fxc-comp{grid-area:comp;padding:0 2px}
  .fxc-comp::before{content:"Elsewhere";display:block;font:600 11px/1 "General Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
  .fxc-total{grid-template-columns:1fr;padding:28px 20px}
  .fxc-cta{text-align:center}
}
@media (prefers-reduced-motion:reduce){.fxc-cta{transition:none}}
`;
