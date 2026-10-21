# NavigationTrading — Repository Guide for Claude

This file is written for any AI agent (or developer) working in this repository
cold, with no prior context. Read it before making changes. Subfolders with
their own `AGENTS.md`/`CLAUDE.md` (`blog-admin/`, `flux/`) have additional,
more specific instructions — read those too before touching code in those
folders.

## What this repository is

A single GitHub repo containing **three separate applications** that deploy
independently to three separate Vercel projects, plus a Cloudflare Worker that
routes traffic between them and a WordPress install. They share this one repo
for convenience, but a change to one does not require (or usually affect) the
others.

| App | Location in repo | What it is | Public URL |
|---|---|---|---|
| Main Website | repo root (`*.html`, `transformer-option-spreads-content/`, `api/`) | Static HTML/CSS/JS marketing + membership site | navigationtrading.com (most paths) |
| Admin Portal | `blog-admin/` | Next.js app — blog CMS, site config, replay video manager, redirects, banners | navigationtrading.com/login, /site-config, /posts, /replay, etc. (proxied) — directly at webinar-neon-one.vercel.app |
| FLUX page | `flux/` | TanStack Start (React) app — standalone product landing page | navigationtrading.com/flux (proxied) — directly at webinar-flux.vercel.app |

### Request routing (how a URL resolves)

1. A request to `navigationtrading.com/*` first hits a **Cloudflare Worker**
   (source lives at `./cloudfare` in this repo — yes, that's the actual
   filename, not a typo to fix). It sends blog paths (`/blog`, `/wp-*`,
   `/feed*`, `/comments*`) to WordPress, and proxies everything else to the
   Main Website's Vercel deployment by rewriting the request's hostname to
   `webclass.navigationtrading.com`.
2. The Main Website's own `vercel.json` then does the rest of the routing:
   - Clean paths like `/pricing` are explicitly mapped via `rewrites` to their
     actual file (e.g. `/pricing` → `/pricing.html` is implicit via
     `cleanUrls: true`, but pages living in a subfolder, like
     `/free-membership` → `/transformer-option-spreads-content/free-membership`,
     need an explicit rewrite entry — see "Adding a new page" below).
   - `/flux` and `/flux/:path*` are rewritten to `https://webinar-flux.vercel.app/...`
   - Admin/blog paths (`/login`, `/posts`, `/site-config`, `/api/config`,
     `/replay`, `/redirects`, `/banners`, `/exit-intent`, `/admin-blog`,
     `/blogs`, `/images/*`, `/_next/*`) are rewritten to
     `https://webinar-neon-one.vercel.app/...`
   - If nothing matches and Vercel would 404, the Cloudflare Worker makes one
     more check against the Admin Portal's redirect lookup API
     (`/api/redirects/lookup/:slug`) before actually returning a 404.

**Implication for code**: because requests to the Main Website are proxied
through `webclass.navigationtrading.com`, any server-side code that tries to
detect "what public domain is this" from request headers (`host`,
`x-forwarded-host`) will see that internal hostname, not
`navigationtrading.com`. If you need the real public domain, hardcode it
rather than deriving it dynamically — this exact mistake caused a production
outage in the Admin Portal before (`blog-admin/src/middleware.ts` has the
working pattern and a comment explaining why).

## Repo structure (Main Website)

- Root-level `*.html` files are full standalone pages — each one has its own
  `<style>` block and inline JS, there is no shared layout file or build step.
  This is intentional for this project; don't try to introduce a bundler or
  framework for the static site.
- `transformer-option-spreads-content/` holds a handful of pages
  (`free-membership.html`, `paid-membership.html`, webinar registration pages,
  thank-you pages) that are served at clean top-level paths via `vercel.json`
  rewrites, even though the files live in this subfolder.
- `api/contact.js` — a Vercel serverless function (Node) handling the contact
  form's email send via `nodemailer`. This is the only backend logic in the
  Main Website app; everything else is static.
- Images/assets live at the repo root alongside the HTML files.
- `vercel.json` is the source of truth for routing — see below.

### Page conventions

Every page follows the same structure: a fixed navbar (`<nav class="navbar">`)
with logo, nav links, a dropdown "Services" menu, a Login link
(`class="nav-login-link"`, plus a duplicate `.nav-mobile-only` li for the
mobile menu), and a "Join Now" button (`class="nav-cta"`), followed by a
footer with contact/legal links. When building a new page, copy the
navbar/footer markup from an existing recent page (e.g. `pricing.html` or
`trade-options-institutional-edge.html`) rather than writing it from scratch —
it needs to stay visually and behaviorally consistent site-wide.

Shared design tokens (CSS custom properties), used across virtually every
page:
- `--navy: #0D2E4E` — primary dark background color
- `--orange` (`#c8420a`) — primary accent/CTA color
- Font: 'DM Sans' for body text, 'DM Mono' for small uppercase labels/eyebrows
- A reusable testimonials marquee component (`.testimonials-marquee`,
  infinite horizontal scroll) — canonical version lives in `podcast.html`,
  copy it rather than reinventing when a new page needs testimonials.
- A reusable "FLUX tool" 6-card grid section (`.flux-combined-card`,
  `.flux-combined-left--6`) — canonical version lives in
  `transformer-option-spreads-content/paid-membership.html`.

### Making CTA/link buttons admin-editable (the `data-config` system)

Buttons whose destination should be editable from the Admin Portal (without a
code deploy) use two things together:

1. An `id`-free `data-config="someKey"` attribute on the `<a>` tag, with a
   real, working URL as the hardcoded `href` fallback.
2. A matching field added to `PAGES_CONFIG` in
   `blog-admin/src/app/(admin)/site-config/page.tsx`, under that page's entry
   (keyed by a `pageKey` — e.g. `'pricing'`, `'podcast'`).

At runtime, `site-config.js` (loaded on every Main Website page via
`<script src="/site-config.js" data-page="pageKey">`) fetches
`/api/config?page=pageKey` and, for every key present in the response,
overwrites the `href` (or text/src, depending on element type) of every
element on the page with that `data-config` value. If nothing is set for a
given key, the page's hardcoded `href` is used as-is — so a page never breaks
from a missing admin value.

**When adding a new page with CTA buttons**: give each button a sensible
`data-config` key (reuse an existing key like `navCtaLink`/`loginLink` if the
button plays the same role as on other pages, for consistency), and add the
corresponding field(s) to that page's `PAGES_CONFIG` entry in `site-config/page.tsx`
(create a new entry if the page doesn't have one yet — copy an existing
similar page's entry as a template). Without this, the admin team cannot
change that link without a developer.

### Standard CTA destinations (current defaults, as of this writing — these are
admin-editable per page, so treat this as a starting point, not a permanent
fact)

- Login → `https://member.navigationtrading.com/`
- Generic "Join Now" → `/pricing`
- Pro checkout → `https://member.navigationtrading.com/join/pro`
- Day Trading checkout → `https://member.navigationtrading.com/join/day-trading`
  (note: `/join/daytrading`, no hyphen, 404s — always use the hyphenated form)
- Join Free Membership → `/free-membership`
- Free Membership page's own join buttons → `https://member.navigationtrading.com/login?mode=join`

`member.navigationtrading.com` is a third-party membership/checkout portal,
not part of this repo.

### Adding a new page

1. Create the `.html` file (copy an existing similar page as a starting
   point — navbar/footer markup, CSS variable usage, font setup).
2. Add an entry to `vercel.json`'s `rewrites` array for a clean URL if the
   file isn't already servable at the desired path (anything at repo root
   with a matching filename works automatically via `cleanUrls: true`; files
   in a subfolder, or if you want a URL that doesn't match the filename,
   need an explicit rewrite — see existing entries for the pattern).
3. If the page has CTA buttons that should be admin-editable, wire up
   `data-config` + a `PAGES_CONFIG` entry (see above).
4. Commit and push to `main` — Vercel deploys automatically (see Deployment
   below).

## Deployment

- All three apps deploy from pushes to the `main` branch of this repo, each
  to its own Vercel project, independently.
- There is no manual build step for the Main Website (pure static files).
  `blog-admin/` (Next.js) and `flux/` (Vite/TanStack Start) build normally on
  Vercel.
- **A push to `main` triggers a deploy attempt for all three projects**, even
  if your change only touched one of them.
- Typical deploy time is under 2 minutes. If a change isn't showing up live
  well past that, don't assume it's just slow — check the actual deployment
  status before waiting longer (see "Verifying a deploy" below).

### Known deployment pitfalls

- **A vulnerable dependency can silently block all future deploys.** Vercel's
  registry proxy will outright refuse to install a package version with a
  known CVE, and the project will then fail to deploy *every subsequent
  commit* with no obvious user-facing symptom other than "my change isn't
  live." This actually happened to the `flux/` app — it had not successfully
  deployed for weeks before anyone noticed, because the failure was silent
  from the outside. If a change to one of the three apps isn't going live,
  check that app's Vercel deployment logs directly rather than assuming a
  caching delay.
- **The `concurrentBuilds: 1` setting on `blog-admin/`** means rapid
  successive pushes queue rather than deploy in parallel — a burst of commits
  can look "stuck" when it's really just queued behind earlier ones.
- **Vercel's GitHub integration can serve a stale commit ref.** If you
  trigger a deployment via the Vercel API using `gitSource: { ref: "main" }`
  and it resolves to a surprisingly old commit, don't trust it — deploy
  directly from the local working tree instead
  (`cd <app-dir> && npx vercel deploy --prod --token=...`, using that app's
  own `.vercel/project.json` which is already committed and correctly linked).
- **Multiple Vercel accounts/teams are involved across the three projects.**
  A personal access token that works for one app's project will not
  necessarily have access to another. If deploy/project API calls return
  empty results or "forbidden" for a project you expect to see, you likely
  have a token for the wrong account — this is not a sign the project is
  misconfigured.

### Verifying a deploy

The fastest reliable check is comparing GitHub's posted commit status against
what the live page actually serves:

```
curl -s "https://api.github.com/repos/kishan-bm/webinar-/commits/<SHA>/status"
```

This lists each connected Vercel project's deployment state for that commit.
Cross-reference against `curl`-ing the live URL for a string unique to your
change. If the GitHub status shows success but the live site still shows old
content, suspect a stale alias/promotion issue or (for `flux/` specifically) a
silently blocked build — check logs directly rather than waiting indefinitely.

## Safety notes

- Do not force-push or rewrite published history on `main` — `flux/` in
  particular is connected to Lovable, and rewriting history there will mess
  up that connection (see `flux/AGENTS.md`).
- `blog-admin/`'s `AGENTS.md` warns that its Next.js version may have
  breaking changes from what you'd expect from training data — check
  `blog-admin/node_modules/next/dist/docs/` before relying on assumptions
  about Next.js APIs in that app.
- The git remote for this repo currently has a Personal Access Token embedded
  directly in the URL (visible via `git remote -v`). Treat this as a live
  credential — don't print it, log it, or commit it anywhere else in the
  repo.
- Changes to CTA/checkout links, pricing, or anything touching the
  Login/Join/checkout flow are revenue-sensitive — verify the actual
  destination URLs work (not just that the code change is syntactically
  correct) before considering the task done.
