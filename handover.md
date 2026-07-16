# NavigationTrading Platform — Handover Document

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [Repository & Deployments](#4-repository--deployments)
5. [External Services & Credentials](#5-external-services--credentials)
6. [URL Routing Map](#6-url-routing-map)
7. [Static Website — Pages & Features](#7-static-website--pages--features)
8. [Blog Admin System — Features & Pages](#8-blog-admin-system--features--pages)
9. [Database Schema](#9-database-schema)
10. [API Reference](#10-api-reference)
11. [Authentication](#11-authentication)
12. [Site Config System](#12-site-config-system)
13. [Getting Started (Local Development)](#13-getting-started-local-development)
14. [Developer Guide](#14-developer-guide)
15. [Deployment Guide](#15-deployment-guide)

---

## 1. Project Overview

NavigationTrading is an options trading education platform. The product consists of:

- **A static marketing site** — all the public-facing pages (landing, pricing, podcast, brokers, webinar registration, replay, etc.) hosted on Vercel.
- **A blog admin + public blog system** — a Next.js app with a protected admin panel to create/manage blog posts, which also serves the public blog at `/blogs`.
- **A dynamic site config system** — lets non-engineers update page content (countdown timers, form IDs, links, exit popups) without touching code.

The live domain is **`webclass.navigationtrading.com`**. Both the static site and the blog app are deployed to Vercel and stitched together via URL rewrites in `vercel.json`.

---

## 2. Architecture Overview

```
User Browser
     │
     ▼
webclass.navigationtrading.com  (Vercel — "webinar-" project, account: kishanbm)
     │
     ├── /                    → redirects to /day-trading
     ├── /day-trading         → day-trading.html (static)
     ├── /pricing             → pricing.html (static)
     ├── /podcast             → podcast.html (static)
     ├── /performance         → performance.html (static)
     ├── /brokers             → brokers.html (static)
     ├── /contact             → contact.html (static)
     ├── ... (other static pages)
     │
     └── /blogs/**            ┐
         /admin-blog          │  → Proxied via vercel.json rewrites to:
         /posts/**            │     webinar-neon-one.vercel.app
         /api/posts/**        │     (Next.js blog-admin app, account: kishan-bm)
         /api/authors/**      │
         /api/config/**       │
         /api/banners/**      │
         /settings            │
         /banners             │
         /site-config         │
         /exit-intent         │
         /replay              ┘

webinar-neon-one.vercel.app  (Vercel — "blog-admin" Next.js project, account: kishan-bm)
     │
     ├── / (admin dashboard)         — protected, requires login
     ├── /login                      — admin login page
     ├── /posts/new                  — create blog post
     ├── /posts/edit/[id]            — edit blog post
     ├── /banners                    — sidebar banner manager
     ├── /exit-intent                — exit-intent popup config
     ├── /replay                     — replay video manager
     ├── /site-config                — per-page site config editor
     ├── /settings                   — author management
     ├── /blogs                      — public blog listing (SSR)
     ├── /blogs/[slug]               — public blog post (SSR)
     └── /api/**                     — REST API (Prisma → Supabase PostgreSQL)
```

**Key insight:** Everything is served from `webclass.navigationtrading.com`. The Next.js app never needs to be accessed directly by end users — the static site's `vercel.json` transparently proxies blog and admin traffic to it.

---

## 3. Tech Stack

### Static Site
| Layer | Technology |
|---|---|
| Pages | Plain HTML + CSS + vanilla JavaScript |
| Hosting | Vercel (static file serving) |
| Routing | `vercel.json` (cleanUrls, rewrites, redirects) |
| Dynamic config | `site-config.js` — fetches `/api/config` at page load |

### Blog Admin (Next.js App — `/blog-admin` folder)
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Custom CSS (`globals.css`, `public.css`) + Lucide React icons |
| Rich Text Editor | TipTap 3 (with custom resizable image node) |
| ORM | Prisma 6 |
| Database | PostgreSQL via Supabase |
| File Storage | Supabase Storage (bucket: `images`) |
| Auth | Custom JWT-style session cookie (HMAC-SHA256 via Web Crypto API) |
| AI Summary | Google Gemini API (`gemini-2.5-flash`) or Claude API (fallback) |
| Deployment | Vercel (account: `kishan-bm`) |

---

## 4. Repository & Deployments

### GitHub
- **Repo:** `https://github.com/kishan-bm/webinar-`
- **Branch:** `main` (auto-deploys to Vercel)

### Vercel Projects

| Project | Account | URL | What it serves | Auto-deploy |
|---|---|---|---|---|
| `webinar-` | `kishanbm` | `webclass.navigationtrading.com` | Static HTML pages | Must be triggered manually (not auto-deploying as of last check) |
| `blog-admin` | `kishan-bm` | `webinar-neon-one.vercel.app` | Next.js blog app | Yes — auto-deploys on push to `main` |

> **Important:** The static site Vercel project (`kishanbm` account) was not auto-deploying as of the last known state. Deployments may need to be triggered manually from the Vercel dashboard, or the GitHub connection needs to be verified/reconnected.

---

## 5. External Services & Credentials

### Supabase (Database + File Storage)
- **Project URL:** `https://kcpzsodctgrcsybskuyr.supabase.co`
- **Region:** `aws-1-ap-northeast-1` (Asia Pacific Northeast)
- **Storage bucket:** `images` (public) — stores blog cover images and sidebar banners
- **Database:** PostgreSQL via Prisma

Required environment variables (set in Vercel for the blog-admin project):
```
NEXT_PUBLIC_SUPABASE_URL=https://kcpzsodctgrcsybskuyr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
DATABASE_URL=postgresql://... (pooler URL — pgbouncer=true)
DIRECT_URL=postgresql://... (direct URL — for Prisma Migrate only)
```

### AI Summary (optional)
The blog post AI summary feature uses either Gemini or Claude. Set one of:
```
GEMINI_API_KEY=<your Gemini API key>
CLAUDE_API_KEY=<your Claude API key>
```
If neither is set, the AI summary button in the blog post page will show an error. The feature still works fine for existing posts (cached summaries are stored in the `SiteConfig` table).

### Session Security
```
JWT_SECRET=<a random 32+ character string>
```
If not set, falls back to a hardcoded default (insecure for production — set this in Vercel env vars).

### ActiveCampaign (Email Forms)
Form IDs are configured per-page via the Site Config admin panel (not hardcoded). The forms embed via the standard ActiveCampaign embed script already present in each HTML page.

### Replay Video
The webinar replay video URL is stored in `replay-config.json` at the repo root. It can be updated either:
- By pushing a new `replay-config.json` via GitHub (using the Replay admin page inside the admin panel)
- Via the Google Sheet fallback (the Replay admin page has a Google Sheet tab option)

Current replay video: `https://vimeo.com/1201949424/baa9f18443`

---

## 6. URL Routing Map

All routes are handled by `vercel.json` at the repo root.

| Public URL | Source |
|---|---|
| `/` | Redirects → `/day-trading` |
| `/home` | `index.html` |
| `/day-trading` | `day-trading.html` |
| `/day-trading-offer` | `day-trading-offer.html` |
| `/day-trading-replay` | `day-trading-replay.html` |
| `/day-trading-replay-v2` | `day-trading-replay-v2.html` |
| `/day-trading-replay-noshow` | `day-trading-replay-noshow.html` |
| `/day-trading-membership` | `day-trading-membership.html` |
| `/pricing` | `pricing.html` |
| `/podcast` | `podcast.html` |
| `/performance` | `performance.html` |
| `/brokers` | `brokers.html` |
| `/contact` | `contact.html` |
| `/transformer-option-spreads` | `transformer-option-spreads-content/transformer-option-spreads.html` |
| `/free-membership` | `transformer-option-spreads-content/free-membership.html` |
| `/paid-membership` | `transformer-option-spreads-content/paid-membership.html` |
| `/tos-thank-you` | `transformer-option-spreads-content/tos-thankyou.html` |
| `/dtt-6/16` | `may-16.html/dtt-6.html` |
| `/thank-you-dtt-6-16` | `may-16.html/thank-you-dtt-6-16.html` |
| `/admin-replay` | `admin-replay.html` (standalone replay admin) |
| `/blogs` | Proxied → `webinar-neon-one.vercel.app/blogs` |
| `/blogs/:slug` | Proxied → `webinar-neon-one.vercel.app/blogs/:slug` |
| `/admin-blog` | Proxied → `webinar-neon-one.vercel.app/` |
| `/posts/**` | Proxied → `webinar-neon-one.vercel.app/posts/**` |
| `/settings` | Proxied → `webinar-neon-one.vercel.app/settings` |
| `/banners` | Proxied → `webinar-neon-one.vercel.app/banners` |
| `/site-config` | Proxied → `webinar-neon-one.vercel.app/site-config` |
| `/exit-intent` | Proxied → `webinar-neon-one.vercel.app/exit-intent` |
| `/replay` | Proxied → `webinar-neon-one.vercel.app/replay` |
| `/login` | Proxied → `webinar-neon-one.vercel.app/login` |
| `/api/posts/**` | Proxied → `webinar-neon-one.vercel.app/api/posts/**` |
| `/api/authors/**` | Proxied → `webinar-neon-one.vercel.app/api/authors/**` |
| `/api/config/**` | Proxied → `webinar-neon-one.vercel.app/api/config/**` |
| `/api/banners/**` | Proxied → `webinar-neon-one.vercel.app/api/banners/**` |
| `/api/auth/**` | Proxied → `webinar-neon-one.vercel.app/api/auth/**` |

---

## 7. Static Website — Pages & Features

All pages are plain HTML files. Each page includes `site-config.js` with a `data-page` attribute that matches a key in the database — this is how dynamic values (dates, links, form IDs) are injected at load time without redeploying.

### Key Pages

**`/day-trading` (`day-trading.html`)**
Main webinar registration page. Features:
- Countdown timer (target date set via Site Config: `countdownTarget`)
- ActiveCampaign registration form (form ID set via Site Config: `formId`)
- Date/time badges (set via Site Config: `dateLabel`, `timeLabel`, etc.)
- Exit intent popup (configured via admin Exit Intent panel)

**`/day-trading-offer` (`day-trading-offer.html`)**
48-hour post-webinar offer page with a 30% discount. Features:
- Countdown timer for offer expiry
- Whop checkout URL (set via Site Config: `whopOfferUrl`)
- Promo code and discount % (set via Site Config: `promoCode`, `promoPercent`)

**`/day-trading-replay` (`day-trading-replay.html`)**
Webinar replay page. The video URL is loaded from `replay-config.json` (managed via the Replay admin page).

**`/day-trading-replay-noshow` (`day-trading-replay-noshow.html`)**
Variant replay page for registrants who didn't attend. Has exit intent popup support.

**`/pricing` (`pricing.html`)**
Membership pricing page with Free/Pro/Day Trading plan comparison table and card CTAs.

**`/podcast` (`podcast.html`)**
TradeHacker Mindset Podcast page with episode listings and an infinite-scroll testimonials marquee.

**`/performance` (`performance.html`)**
Monthly trade results page.

**`/brokers` (`brokers.html`)**
Broker comparison/commission tool page.

**`/contact` (`contact.html`)**
Contact page.

**`/transformer-option-spreads`**
Webinar registration page for the Option Spreads course. Has countdown and ActiveCampaign form.

**`/free-membership`, `/paid-membership`**
Post-signup welcome pages for free and paid memberships respectively.

**`/indexV3.html`, `/indexV4.html`**
Homepage variants (older iterations, kept for reference).

### How Dynamic Content Works (site-config.js)

Each HTML page loads `site-config.js` like this:
```html
<script src="/site-config.js" data-page="day-trading"></script>
```

The script fetches `/api/config?page=day-trading`, then:
- For `<a>` tags with `data-config="whopOfferUrl"` → sets `href`
- For `<iframe>` tags with `data-config="youtubeEmbed"` → sets `src`
- For form IDs → calls `window.setFormId()` if defined on the page
- For countdown → calls `window.setCountdownTarget()` if defined on the page
- For text elements → sets `textContent`

To update any of these values without a code deployment, use the **Site Config** panel in the admin.

---

## 8. Blog Admin System — Features & Pages

Access at: `webclass.navigationtrading.com/admin-blog`

Login with the admin account credentials (email + password stored in the database `User` table).

### Admin Sidebar Navigation

**Blog section**
- **Dashboard** (`/admin-blog`) — lists all posts with status badges, preview modal, edit, delete, and CSV export
- **New Post** (`/posts/new`) — create a new blog post
- **Sidebar Banners** (`/banners`) — manage image banners shown in blog post sidebars

**Video section**
- **Replay Video** (`/replay`) — update the webinar replay video URL; pushes change to `replay-config.json` via GitHub API or Google Sheet

**Popups section**
- **Exit Intent Popups** (`/exit-intent`) — configure per-page exit popups (headline, tagline, bullets, date text, ActiveCampaign form ID, optional redirect URL)

**System section**
- **Site Config** (`/site-config`) — per-page dynamic config editor for all configurable fields across all pages
- **Settings** (`/settings`) — author management (add/delete authors used on blog posts)

### Dashboard (`/admin-blog`)
- Table of all posts with: title, author, status badge (Draft/Published), creation date
- **Preview button** — opens a full-fidelity post preview modal (renders the actual blog HTML including cover image, headings, tags, content)
- **Edit button** — navigates to the post editor
- **Delete button** — deletes the post with confirmation
- **Export dropdown** — select All / Draft / Published, then download a CSV file with columns: S.No, URL, Status

### Create Post (`/posts/new`)
Form fields:
- Post Title (auto-generates slug from title)
- Content (TipTap rich text editor)
- Excerpt
- Publish Status (Draft / Published)
- Author (dropdown from Settings)
- Featured Image (upload to Supabase Storage) + Alt Text
- Category (free text, auto-created if new)
- Tags (comma-separated, auto-created if new)
- URL Slug
- SEO Title
- Meta Description

### Edit Post (`/posts/edit/[id]`)
Same fields as Create. Additional features:
- **Auto-save** — saves a DRAFT automatically every 10 seconds if there are unsaved changes. Shows "Auto-saving…" / "✓ Draft auto-saved" / "Auto-save failed" status
- **Remove cover image** — × button overlaid on the cover image thumbnail
- Manual save via "Update Post" button (saves with the selected status)

### TipTap Editor
Rich text editor with a toolbar that teleports into a portal (`#editor-toolbar-portal`) above the content area.

Supported formatting:
- Bold, Italic, Underline, Strikethrough
- Headings H1–H4
- Bullet list, Ordered list
- Blockquote
- Code block
- Text alignment (left/center/right/justify)
- Text color
- Links (click selected text → insert link)
- Images (upload to Supabase, then insert resizable image into editor)
- Tables
- Raw HTML blocks (embed arbitrary HTML without the editor escaping it)

**Image behavior:** Clicking an image in the editor selects it and opens a panel on the right showing Alt Text and Link URL fields. The image is resizable by dragging the right edge handle.

### Public Blog (`/blogs` and `/blogs/[slug]`)
Publicly accessible (no login required).

**Blog listing (`/blogs`):**
- Shows all PUBLISHED posts, newest first
- Filter bar to filter by category or tag
- Cards showing cover image, title, excerpt, author, date

**Blog post (`/blogs/[slug]`):**
- Full article rendering with cover image hero, author avatar, tags
- **Table of Contents** — sticky sidebar ToC auto-generated from H1–H4 headings in the content, with active-section highlighting
- **Inline TOC** — collapsible ToC block shown inline before the article body on mobile
- **AI Summary panel** — shows an AI-generated quote and key moments. Generated on first request via Gemini (or Claude), then cached permanently in the `SiteConfig` table under key `blog-summary:{postId}`
- **Sidebar banners** — image banners managed via the Banners admin panel, shown in the article sidebar
- Dynamic SEO metadata (title, description, OpenGraph tags) generated from post fields

### Sidebar Banners (`/banners`)
Upload banner images to Supabase Storage, add an optional title, alt text, and link URL. Banners can be reordered (up/down arrows) and deleted. They appear in the sidebar of all public blog post pages.

### Exit Intent Popups (`/exit-intent`)
Select a page from the list and configure:
- Enable/disable the popup
- Headline and tagline text
- Bullet points (semicolon-separated)
- Webinar date text
- ActiveCampaign form ID
- Optional redirect URL (for pages using a button instead of a form)

Supported pages: transformer-option-spreads, home, pricing, free-membership, paid-membership, day-trading-replay-noshow, day-trading, dtt-6.

### Site Config (`/site-config`)
Configure dynamic values for each page without redeployment. Each page has specific configurable fields. Example fields for the Day Trading page:
- Countdown Target Date & Time
- Date/Time badge text
- Live Session Card subtitle
- Overview Date Badge
- Register button subtext
- ActiveCampaign Form ID

Saves are persisted to the `SiteConfig` database table and immediately applied the next time the page is loaded (via `site-config.js`).

### Replay Video Manager (`/replay`)
Two methods to update the webinar replay video URL:
1. **GitHub method** — enter a GitHub Personal Access Token + new Vimeo URL → pushes an update to `replay-config.json` in the repo → Vercel auto-deploys within ~60 seconds
2. **Google Sheet method** — reads the video URL from a published Google Sheet CSV (fallback for when GitHub token is not available)

The replay pages (`/day-trading-replay`, `/day-trading-replay-v2`) read `replay-config.json` to embed the correct video.

### Settings — Author Management (`/settings`)
Add and delete authors (name + email). Authors appear in the dropdown on the Create/Edit Post pages. Author name and avatar initial are shown on published blog posts.

---

## 9. Database Schema

All tables live in Supabase PostgreSQL, managed by Prisma.

### `User`
Stores admin users and blog post authors.
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Display name |
| email | String | Unique, used for login |
| passwordHash | String? | bcrypt hash (optional — authors added via Settings may have no password) |
| avatarUrl | String? | Optional avatar image URL |
| createdAt / updatedAt | DateTime | Auto-managed |

### `Post`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | String | |
| slug | String | Unique, indexed — used as the URL path |
| content | String | Raw HTML from TipTap editor |
| excerpt | String? | Short summary shown on listing page |
| coverImage | String? | Supabase Storage URL |
| coverImageAlt | String? | Alt text for cover image |
| seoTitle | String? | Used in `<title>` tag |
| seoDescription | String? | Used in meta description |
| status | PostStatus | DRAFT / PUBLISHED / ARCHIVED |
| authorId | String | FK → User |
| categoryId | String? | FK → Category |
| tags | Tag[] | Many-to-many |
| publishedAt | DateTime? | Optional scheduled publish time |
| createdAt / updatedAt | DateTime | Auto-managed |

### `Category`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Unique |
| slug | String | Unique |

### `Tag`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Unique |
| slug | String | Unique |

### `Banner`
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | String? | Optional display title |
| imageUrl | String | Supabase Storage URL |
| imageAlt | String? | Alt text |
| linkUrl | String? | Click destination |
| order | Int | Ordering index for display |

### `SiteConfig`
Flexible key-value store for all dynamic site configuration.
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| pageKey | String | e.g. `"day-trading"`, `"pricing"`, `"blog-summary:{postId}"` |
| key | String | e.g. `"countdownTarget"`, `"formId"`, `"exitPopupHeadline"` |
| value | String (Text) | The stored value |

Unique constraint: `(pageKey, key)` — upserted on save.

---

## 10. API Reference

All API routes live under `/api/` on the blog-admin Next.js app (proxied from the main domain).

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login with email + password. Sets `admin_session` cookie |
| GET | `/api/auth/logout` | No | Clears session cookie and redirects to `/login` |

### Posts

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/posts` | No | List all posts (supports `?status=PUBLISHED`, `?authorId=`) |
| POST | `/api/posts` | Yes | Create a new post (auto-increments slug on conflict) |
| GET | `/api/posts/:id` | No | Get a single post by ID |
| PUT | `/api/posts/:id` | Yes | Update a post (returns 409 if new slug conflicts with another post) |
| DELETE | `/api/posts/:id` | Yes | Delete a post |
| GET | `/api/posts/:id/ai-summary` | No | Get cached AI summary for a post |
| POST | `/api/posts/:id/ai-summary` | No | Generate (or return cached) AI summary via Gemini/Claude |

### Authors

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/authors` | No | List all authors (id, name) |
| POST | `/api/authors` | Yes | Create a new author |
| DELETE | `/api/authors?id=` | Yes | Delete an author |

### Banners

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/banners` | No | List all banners ordered by `order` |
| POST | `/api/banners` | Yes | Create a banner |
| PUT | `/api/banners/:id` | Yes | Update a banner |
| DELETE | `/api/banners/:id` | Yes | Delete a banner |

### Site Config

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/config` | No | Returns all configs grouped by pageKey |
| GET | `/api/config?page=day-trading` | No | Returns config map for a specific page |
| POST | `/api/config` | Yes | Upsert config values for a pageKey `{ pageKey, config: {key: value} }` |

---

## 11. Authentication

The admin panel uses a custom session system (no NextAuth or third-party auth library).

**How it works:**
1. Login POSTs to `/api/auth/login` with email + password
2. Server verifies against `User.passwordHash` (bcrypt)
3. On success, creates a signed JWT-style token using HMAC-SHA256 via the browser's Web Crypto API, containing `{ userId, email, name, expiresAt }`
4. Token is set as an `httpOnly` cookie named `admin_session` with 7-day expiry
5. Next.js middleware (`middleware.ts`) checks and verifies this cookie on every request to protected routes
6. On expiry or invalid token, redirects to `/login`

**Protected admin routes:** `/`, `/posts/**`, `/banners`, `/settings`, `/site-config`, `/exit-intent`, `/replay`

**Public API routes (no auth):** GET requests to `/api/config`, `/api/posts`, `/api/banners`, and all `/api/posts/:id/ai-summary` requests

**To reset admin password:** Update the `passwordHash` field in the `User` table directly via Supabase dashboard (use bcrypt to generate the hash).

---

## 12. Site Config System

The site config system lets non-technical team members update page content from the admin panel without needing a code deployment.

**How values reach the page:**

1. Admin saves a value in `/site-config` → stored in `SiteConfig` database table
2. HTML page loads → `<script src="/site-config.js" data-page="day-trading"></script>` runs
3. `site-config.js` fetches `/api/config?page=day-trading`
4. For each key-value pair, it finds matching DOM elements via `[data-config="key"]` attributes and applies the value:
   - `<a data-config="whopOfferUrl">` → sets `href`
   - `<iframe data-config="youtubeEmbed">` → sets `src` (auto-converts YouTube watch URLs to embed format)
   - `<span data-config="dateLabel">` → sets `textContent`
   - Special handlers call `window.setCountdownTarget()` and `window.setFormId()` if defined

**Exit intent popup values** are also stored in the same `SiteConfig` table (under `pageKey = "day-trading"`, with keys like `exitPopupHeadline`, `exitPopupShow`, etc.) and applied by the exit intent JavaScript already present in each HTML page.

---

## 13. Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/kishan-bm/webinar-.git
cd webinar-
```

### 2. Set up the blog-admin Next.js app
```bash
cd blog-admin
npm install
```

### 3. Create environment variables
Create `blog-admin/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://kcpzsodctgrcsybskuyr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get from Supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase dashboard>
DATABASE_URL=postgresql://postgres.kcpzsodctgrcsybskuyr:<password>@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.kcpzsodctgrcsybskuyr:<password>@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
JWT_SECRET=<any random 32+ character string>
GEMINI_API_KEY=<optional, for AI summary feature>
```

### 4. Generate Prisma client
```bash
npx prisma generate
```

### 5. Run the dev server
```bash
npm run dev
```

The blog admin runs on `http://localhost:3000`.

### 6. Access the admin panel
Open `http://localhost:3000` → redirects to login. Use an admin account from the database.

### Static site
The static HTML files in the repo root can be opened directly in a browser, but `site-config.js` will fail to load (since `/api/config` isn't running locally). To test the full experience, either use the live site or set up a local proxy.

---

## 14. Developer Guide

### Adding a New Static Page

1. Create a new `.html` file in the repo root (e.g., `new-page.html`)
2. Add a rewrite in `vercel.json`:
   ```json
   { "source": "/new-page", "destination": "/new-page" }
   ```
3. Add no-cache headers for it in `vercel.json` (add the route slug to the second `headers` source pattern)
4. If the page needs dynamic config, include `site-config.js` with the appropriate `data-page` attribute, and add a matching page config in `/blog-admin/src/app/(admin)/site-config/page.tsx`

### Adding a New Site Config Field

1. Open `/blog-admin/src/app/(admin)/site-config/page.tsx`
2. Find the relevant `PageConfig` entry in `PAGES_CONFIG`
3. Add a new field object to the `fields` array
4. In the HTML page, add `data-config="yourFieldKey"` to the target DOM element
5. `site-config.js` will automatically apply it — no code changes needed in `site-config.js` for standard elements

### Adding a New Exit Intent Page

1. Open `/blog-admin/src/app/(admin)/exit-intent/page.tsx`
2. Add an entry to the `PAGES_WITH_EXIT` array:
   ```typescript
   { key: 'new-page', title: 'New Page', path: '/new-page' }
   ```
3. Add the exit intent JavaScript to the HTML page (copy the pattern from `day-trading.html`)
4. Add the page to the Site Config system if needed

### Slug Conflict Handling

**Create (POST):** Automatically resolves conflicts by appending `-2`, `-3`, etc. Never returns an error to the user.

**Edit (PUT):** Returns a `409` error if the slug is manually changed to one that already exists on a different post. The user sees an alert and must choose a different slug. This is intentional — changing a published post's slug is a significant action.

### Database Migrations

If you change `prisma/schema.prisma`:
```bash
cd blog-admin
npx prisma migrate dev --name describe-your-change
```
For production, run:
```bash
npx prisma migrate deploy
```

### Prisma Client Regeneration
After any schema change or after pulling new code that includes schema changes:
```bash
cd blog-admin
npx prisma generate
```

---

## 15. Deployment Guide

### Blog Admin (Next.js)
The blog-admin project auto-deploys from the `main` branch on the `kishan-bm` Vercel account. To deploy:
1. Push to `main` on GitHub
2. Vercel picks it up automatically
3. Build command: `npm run build` (Prisma generate runs automatically via `postinstall`)
4. Environment variables must be set in the Vercel project settings (not committed to the repo)

### Static Site
The static site deploys from the same `main` branch but on the `kishanbm` Vercel account. It may require a manual redeploy from the Vercel dashboard if auto-deploy is not configured. To deploy:
1. Push changes to `main`
2. Go to the `webinar-` project in the `kishanbm` Vercel account
3. Click "Redeploy" if it hasn't auto-triggered

No build step needed — Vercel serves the HTML files directly.

### Cache Behaviour
HTML pages and clean URL routes are served with `Cache-Control: no-cache, no-store, must-revalidate` headers (configured in `vercel.json`). This prevents Vercel's CDN from serving stale HTML after a redeploy.

### Domain Migration (Planned)
A migration plan exists in `deployment.md` to move the site from `webclass.navigationtrading.com` to `navigationtrading.com`, proxying the existing WordPress blog at `/blog` via a Cloudflare Worker. This migration has not been completed as of this handover.
