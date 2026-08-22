import {
  BadgeCheck,
  Building2,
  CircleCheck,
  Compass,
  Database,
  Fingerprint,
  Gauge,
  Globe,
  Inbox,
  Layers,
  Magnet,
  MailSearch,
  PenLine,
  Radar,
  Server,
  ShieldAlert,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Stethoscope,
  Upload,
  UserSearch,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  name: string;
  icon: LucideIcon;
  blurb: string;
  badge?: string;
  detail: string;
  bullets: string[];
  stat?: { value: string; label: string };
};

export type Category = {
  slug: string;
  route: string;
  eyebrow: string;
  navBlurb: string;
  icon: LucideIcon;
  title: string;
  headline: string;
  headlineAccent: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  metrics: { value: string; label: string }[];
  steps: { step: string; title: string; body: string }[];
  tools: Tool[];
  faq: { q: string; a: string }[];
};

export const categories: Category[] = [
  {
    slug: "email-verification",
    route: "/features/email-verification",
    eyebrow: "Email Verification",
    navBlurb: "Validate and find emails",
    icon: BadgeCheck,
    title: "Email Verification",
    headline: "Send to real people,",
    headlineAccent: "never to a bounce.",
    intro:
      "Lumina validates every address twice — syntax, domain, MX and a live SMTP handshake — then strips catch-alls, role inboxes and duplicates before a single send leaves your account.",
    metaTitle: "Email Verification Tools — Lumina",
    metaDescription:
      "Verify single emails or bulk lists with real SMTP handshakes, find verified work emails, dedupe with HyperCleaner and score spam risk before you send.",
    metrics: [
      { value: "99.4%", label: "verification accuracy" },
      { value: "<0.6%", label: "average bounce rate" },
      { value: "120k", label: "rows / minute" },
    ],
    steps: [
      { step: "01", title: "Bring your list", body: "Paste one address, drop a CSV, or pull straight from your CRM and Lumina lead databases." },
      { step: "02", title: "Multi-layer checks", body: "Syntax, DNS, MX, disposable domains and a real SMTP handshake run in parallel per record." },
      { step: "03", title: "Risk grading", body: "Every row lands as Deliverable, Risky, Catch-all or Invalid with the exact reason attached." },
      { step: "04", title: "Clean list out", body: "Export the safe segment or push it into a Lumina campaign in one click — no re-upload." },
    ],
    tools: [
      {
        name: "Single Verify",
        icon: CircleCheck,
        blurb: "Verify any email instantly",
        detail:
          "Paste an address and get a verdict in under a second, with the full trace of every check we ran so you can see why it passed or failed.",
        bullets: ["Live SMTP handshake, not a guess", "Catch-all and role-inbox flags", "Sub-second response, API included"],
        stat: { value: "0.8s", label: "median verdict" },
      },
      {
        name: "Bulk Upload",
        icon: Upload,
        blurb: "Verify CSV lists in bulk",
        detail:
          "Drop up to a million rows and watch the run progress live. Column mapping is automatic, and results keep every original field intact.",
        bullets: ["CSV, XLSX and CRM exports", "Live progress with per-status counts", "Segmented export by risk grade"],
        stat: { value: "1M", label: "rows per run" },
      },
      {
        name: "Email Finder",
        icon: MailSearch,
        blurb: "Find emails by name + domain",
        detail:
          "Give us a first name, last name and company domain and Lumina reconstructs the most probable pattern, then verifies it before handing it over.",
        bullets: ["Pattern inference across 40M+ domains", "Only verified addresses are returned", "Bulk find from a name list"],
        stat: { value: "94%", label: "hit rate" },
      },
      {
        name: "HyperCleaner",
        icon: Sparkles,
        badge: "BETA",
        blurb: "Clean & dedupe your lists",
        detail:
          "Normalizes names and companies, merges duplicate humans across sources, and removes competitors, customers and suppression lists automatically.",
        bullets: ["Fuzzy dedupe across CSV + CRM", "Suppression and do-not-contact lists", "Name and job-title normalization"],
      },
      {
        name: "Spam Checker",
        icon: ShieldAlert,
        blurb: "Get your spam score instantly",
        detail:
          "Runs your copy through spam filters and rewrites the lines that trip them, so your score is fixed before the campaign goes live.",
        bullets: ["Filter-by-filter score breakdown", "Trigger-word and link-ratio flags", "One-click rewrite suggestions"],
      },
    ],
    faq: [
      { q: "Do you charge for invalid emails?", a: "No. Credits are only consumed for records that return a conclusive verdict." },
      { q: "How do you treat catch-all domains?", a: "They are graded separately as Risky so you can decide whether to include them per campaign." },
    ],
  },
  {
    slug: "deliverability",
    route: "/features/deliverability",
    eyebrow: "Deliverability",
    navBlurb: "Test your email setup",
    icon: ShieldCheck,
    title: "Deliverability",
    headline: "Fix the inbox math",
    headlineAccent: "before you press send.",
    intro:
      "Records, blacklists and placement — the three things that quietly kill outbound. Lumina audits all of them continuously and tells you exactly what to change.",
    metaTitle: "Deliverability Tools — DNS, Blacklists & Inbox Placement | Lumina",
    metaDescription:
      "Audit SPF, DKIM and DMARC, generate correct records, scan 90+ blacklists and run seed tests to see whether your mail lands in the inbox or in spam.",
    metrics: [
      { value: "94%", label: "average inbox rate" },
      { value: "90+", label: "blacklists monitored" },
      { value: "24/7", label: "record monitoring" },
    ],
    steps: [
      { step: "01", title: "Connect a domain", body: "Add the sending domain and mailbox. Lumina reads its live DNS in seconds." },
      { step: "02", title: "Audit everything", body: "SPF, DKIM, DMARC, MX, rDNS, MTA-STS and blacklist presence are checked together." },
      { step: "03", title: "Apply the fix", body: "Copy generated records straight into your DNS host, with a verify button beside each one." },
      { step: "04", title: "Prove placement", body: "Seed tests across Gmail, Outlook and Workspace show where your mail actually lands." },
    ],
    tools: [
      {
        name: "DNS Checker",
        icon: Globe,
        blurb: "Check SPF, DKIM, DMARC",
        detail:
          "A full authentication audit of your sending domain with plain-English explanations of every failure and the exact record that fixes it.",
        bullets: ["SPF, DKIM, DMARC, MX, rDNS", "Alignment and lookup-limit warnings", "Continuous re-checks with alerts"],
        stat: { value: "12", label: "records audited" },
      },
      {
        name: "Blacklist Checker",
        icon: Radar,
        blurb: "Scan domain across blacklists",
        detail:
          "Checks your domain and sending IPs against 90+ major RBLs, and tells you which listings actually matter for cold email.",
        bullets: ["90+ RBLs and reputation feeds", "Severity ranking per listing", "Delisting instructions per provider"],
      },
      {
        name: "DNS Generator",
        icon: Wand2,
        blurb: "Generate SPF, DKIM, DMARC",
        detail:
          "Answer a few questions about your providers and Lumina writes valid, lookup-safe records you can paste directly into your host.",
        bullets: ["Provider-aware SPF flattening", "Staged DMARC policy rollout", "Copy-ready host / value pairs"],
      },
      {
        name: "Inbox Placement",
        icon: Inbox,
        badge: "BETA",
        blurb: "Test inbox vs spam",
        detail:
          "Send to a seed network and see per-provider placement — Primary, Promotions or Spam — before you point a campaign at real prospects.",
        bullets: ["Gmail, Outlook, Workspace, Yahoo", "Per-mailbox folder results", "Trend line across warmup weeks"],
        stat: { value: "40", label: "seed mailboxes" },
      },
    ],
    faq: [
      { q: "Will Lumina change my DNS for me?", a: "No — we generate the exact records and verify them once you add them, so you stay in control of your zone." },
      { q: "How often are checks re-run?", a: "Connected domains are re-audited daily, and you get an alert the moment a record breaks." },
    ],
  },
  {
    slug: "cold-email-tools",
    route: "/features/cold-email-tools",
    eyebrow: "Cold Email Tools",
    navBlurb: "AI-powered cold email",
    icon: PenLine,
    title: "Cold Email Tools",
    headline: "One email per human,",
    headlineAccent: "at ten thousand humans.",
    intro:
      "Infrastructure, copy and pacing in one place. Lumina researches each account, writes the opener from real facts, and diagnoses a campaign the moment its numbers slip.",
    metaTitle: "AI Cold Email Tools — Copy, Infrastructure & Campaigns | Lumina",
    metaDescription:
      "Done-for-you domains and inboxes, an AI copywriter that writes from real research, a campaign doctor for underperforming sequences, and volume planning tools.",
    metrics: [
      { value: "3.1x", label: "reply-rate lift" },
      { value: "1,000", label: "sends / day / workspace" },
      { value: "48h", label: "infrastructure setup" },
    ],
    steps: [
      { step: "01", title: "Stand up infrastructure", body: "Domains, mailboxes, records and warmup are provisioned and paced for you." },
      { step: "02", title: "Research the account", body: "Site, funding, headcount and hiring signals are condensed into three usable facts per lead." },
      { step: "03", title: "Write from those facts", body: "The AI copywriter drafts a genuinely specific opener — no spintax, no mail-merge tells." },
      { step: "04", title: "Launch and diagnose", body: "Volume ramps automatically and Campaign Doctor flags what to change while it still matters." },
    ],
    tools: [
      {
        name: "Infrastructure Setup",
        icon: Server,
        blurb: "Done-for-you domains & inboxes",
        detail:
          "We buy the domains, create the mailboxes, set the records and warm everything on a schedule that looks like a human team, not a blast.",
        bullets: ["Domain purchase and DNS handled", "Graduated warmup per mailbox", "Rotation across the whole pool"],
        stat: { value: "48h", label: "to first send" },
      },
      {
        name: "AI Copywriter",
        icon: PenLine,
        blurb: "AI-powered email copywriting",
        detail:
          "Give it your offer and it writes a full sequence — first touch, two follow-ups and a close — personalized per lead from live research.",
        bullets: ["Research-grounded openers", "Full sequence, not just line one", "Tone presets and brand rules"],
        stat: { value: "1:1", label: "copy per lead" },
      },
      {
        name: "Campaign Doctor",
        icon: Stethoscope,
        blurb: "Optimize your sequences",
        detail:
          "Reads open, reply, bounce and unsubscribe curves against benchmarks and tells you the single highest-impact change to make next.",
        bullets: ["Benchmarks by industry and volume", "Step-level drop-off analysis", "Prioritized fix list"],
      },
      {
        name: "Scaling Calculator",
        icon: Gauge,
        blurb: "Plan domains & mailboxes",
        detail:
          "Enter a monthly send target and get the exact number of domains, mailboxes and warmup days it takes to hit it safely.",
        bullets: ["Safe per-mailbox volume caps", "Warmup timeline and cost view", "Scenario compare side by side"],
      },
      {
        name: "Spintax Generator",
        icon: Shuffle,
        blurb: "Create unique variations",
        detail:
          "For the lines that must repeat, generate natural variants that read like a person wrote them — with a preview of every combination.",
        bullets: ["Nested spintax with live preview", "Readability scoring per variant", "Duplicate-content detection"],
      },
      {
        name: "Lead Magnet Builder",
        icon: Magnet,
        badge: "BETA",
        blurb: "Build a reverse lead magnet",
        detail:
          "Turn your data into a personalized mini-report per prospect, hosted on your domain, so the click is the pitch.",
        bullets: ["Per-prospect hosted pages", "Tracked opens and scroll depth", "Auto-linked from your sequence"],
      },
    ],
    faq: [
      { q: "Do I need my own domains?", a: "You can bring them, or let Infrastructure Setup provision and warm a fresh pool for you." },
      { q: "Is the copy actually unique?", a: "Yes — every opener is generated from that account's own research, not from a template with slots." },
    ],
  },
  {
    slug: "lead-databases",
    route: "/features/lead-databases",
    eyebrow: "Lead Databases",
    navBlurb: "Search verified leads",
    icon: Database,
    title: "Lead Databases",
    headline: "Your next thousand buyers,",
    headlineAccent: "already verified.",
    intro:
      "Three databases, one search bar. Filter by firmographics, location or creator niche, then push a verified segment straight into a campaign.",
    metaTitle: "Verified Lead Databases — B2B, Local & Creators | Lumina",
    metaDescription:
      "Search 10M+ B2B contacts, 5M+ local businesses and 2.6M+ creators. Filter, verify and push straight into a Lumina campaign without a single export.",
    metrics: [
      { value: "17.6M", label: "total records" },
      { value: "60+", label: "search filters" },
      { value: "0", label: "exports required" },
    ],
    steps: [
      { step: "01", title: "Pick a database", body: "B2B contacts, local businesses or creators — or search across all three at once." },
      { step: "02", title: "Filter it down", body: "Industry, headcount, revenue, tech stack, geography, follower count and hiring signals." },
      { step: "03", title: "Verify in place", body: "Every selected record runs through verification before it is added to your list." },
      { step: "04", title: "Push to campaign", body: "Send the segment straight into a sequence, or sync it to your CRM." },
    ],
    tools: [
      {
        name: "B2B Leads",
        icon: Users,
        blurb: "10M+ verified contacts",
        detail:
          "Decision-maker contacts with title, seniority, department, company size, revenue band and tech stack — refreshed continuously.",
        bullets: ["Title and seniority targeting", "Tech-stack and hiring filters", "Verified work email on every row"],
        stat: { value: "10M+", label: "contacts" },
      },
      {
        name: "Local Businesses",
        icon: Building2,
        blurb: "5M+ local businesses",
        detail:
          "Map-sourced businesses with category, rating, review count, website status and owner contact where available.",
        bullets: ["Radius and city-level search", "Rating and review thresholds", "No-website and no-ads signals"],
        stat: { value: "5M+", label: "businesses" },
      },
      {
        name: "Creator Leads",
        icon: UserSearch,
        blurb: "2.6M+ creators",
        detail:
          "Creators and channels with audience size, niche, engagement rate, posting cadence and business contact.",
        bullets: ["Niche and platform filters", "Engagement-rate ranges", "Business inbox, not DMs"],
        stat: { value: "2.6M+", label: "creators" },
      },
    ],
    faq: [
      { q: "Where does the data come from?", a: "Public sources plus licensed feeds, re-verified on access so you never pay for stale rows." },
      { q: "Can I search all three at once?", a: "Yes — a unified search runs across every database and dedupes overlapping records." },
    ],
  },
];

export const suiteExtras = {
  icon: Layers,
  compass: Compass,
  fingerprint: Fingerprint,
};

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}