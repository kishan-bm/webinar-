'use client';

import { useEffect, useState, useTransition } from 'react';
import { Search, Save, Globe, Loader2, CheckCircle2, AlertCircle, Calendar, Link as LinkIcon, Hash, Sliders, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'datetime-local' | 'number' | 'boolean' | 'url' | 'textarea';
  placeholder?: string;
  description?: string;
  group?: string;
}

interface PageConfig {
  key: string;
  title: string;
  path: string;
  deployedUrl: string;
  description: string;
  fields: FieldConfig[];
}

const PAGES_CONFIG: PageConfig[] = [
  {
    key: 'day-trading',
    title: 'Day Trading Live Webinar',
    path: '/day-trading',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading',
    description: 'Main landing/registration page for the live day trading webinar.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local', description: 'When the webinar countdown timer expires', group: 'Countdown & Date Settings' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. March 19', description: 'Brief date shown in tags', group: 'Countdown & Date Settings' },
      { key: 'timeLabel', label: 'Time Badge Text', type: 'text', placeholder: 'e.g. 3:30 PM CT', description: 'Brief time shown in tags', group: 'Countdown & Date Settings' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · March 19', description: 'Subtitle of session details card', group: 'Countdown & Date Settings' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. March 19, 2026', description: 'Overview section tag text', group: 'Countdown & Date Settings' },
      { key: 'fullDateSubtext', label: 'Register Button Subtext', type: 'text', placeholder: 'e.g. Wednesday, March 19 · 7:00 PM ET · Free & Live', description: 'Extended subtext under the register button', group: 'Countdown & Date Settings' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 126', description: 'The registration form identifier', group: 'Form Settings' },
    ]
  },
  {
    key: 'day-trading-offer',
    title: 'Day Trading Offer Page',
    path: '/day-trading-offer',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading-offer',
    description: '48-hour offer deadline page giving 30% discount.',
    fields: [
      { key: 'countdownTarget', label: 'Offer Expiry Date & Time', type: 'datetime-local', description: 'When the 48-hour discount window expires', group: 'Countdown & Date Settings' },
      { key: 'whopOfferUrl', label: 'Whop Checkout Promo Link', type: 'url', placeholder: 'https://whop.com/...', description: 'Checkout URL applied to checkout buttons', group: 'URLs & Links' },
      { key: 'promoPercent', label: 'Promo Discount Percentage', type: 'text', placeholder: 'e.g. 30%', description: 'Discount percentage shown on the page', group: 'Promo Settings' },
      { key: 'promoCode', label: 'Promo Code Text', type: 'text', placeholder: 'e.g. DAY', description: 'Promo code displayed to copy/use', group: 'Promo Settings' },
    ]
  },
  {
    key: 'dtt-6',
    title: 'Variant Webinar (dtt-6)',
    path: '/dtt-6/16',
    deployedUrl: 'https://webclass.navigationtrading.com/dtt-6/16',
    description: 'Variant registration page for the June 16 webinar edition.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local', group: 'Countdown & Date Settings' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. June 16', group: 'Countdown & Date Settings' },
      { key: 'timeLabel', label: 'Time Badge Text', type: 'text', placeholder: 'e.g. 3:30 PM CT', group: 'Countdown & Date Settings' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · June 16', group: 'Countdown & Date Settings' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. June 16, 2026', group: 'Countdown & Date Settings' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 134', group: 'Form Settings' },
    ]
  },
  {
    key: 'transformer-option-spreads',
    title: 'Option Spreads Webinar',
    path: '/transformer-option-spreads',
    deployedUrl: 'https://webclass.navigationtrading.com/transformer-option-spreads',
    description: 'Option Spreads registration page and exit intent settings.',
    fields: [
      { key: 'countdownTarget', label: 'Countdown Target Date & Time', type: 'datetime-local', group: 'Countdown & Date Settings' },
      { key: 'dateLabel', label: 'Date Badge Text', type: 'text', placeholder: 'e.g. May 6', group: 'Countdown & Date Settings' },
      { key: 'timeLabel', label: 'Time Badge Text', type: 'text', placeholder: 'e.g. 3:30 PM CST', group: 'Countdown & Date Settings' },
      { key: 'liveSessionLabel', label: 'Live Session Card Subtitle', type: 'text', placeholder: 'e.g. Live session · May 6th', group: 'Countdown & Date Settings' },
      { key: 'overviewDateLabel', label: 'Overview Date Badge', type: 'text', placeholder: 'e.g. May 6, 2026', group: 'Countdown & Date Settings' },
      { key: 'fullDateSubtext', label: 'Register Button Subtext', type: 'text', placeholder: 'e.g. Wednesday, March 19 · 7:00 PM ET · Free & Live', description: 'Extended subtext under the register button', group: 'Countdown & Date Settings' },
      { key: 'formId', label: 'ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 132', description: 'Inline registration form ID', group: 'Form Settings' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', description: 'Whether to show the exit intent popup when visitors leave', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', placeholder: 'Turn Any Options Trade Into a Risk-Free Position', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', placeholder: 'Using the DC TimeMachine strategy — live, with real trades.', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', placeholder: 'See FLUX signal a real entry live; Learn the Double Calendar setup; Get the $200/mo FLUX tool free', description: 'Semicolon (;) separated bullet points', group: 'Exit Intent Popup' },
      { key: 'exitPopupDate', label: 'Exit Popup Webinar Date Text', type: 'text', placeholder: 'Tuesday, May 6 | 8 PM IST', group: 'Exit Intent Popup' },
      { key: 'exitPopupFormId', label: 'Exit Popup ActiveCampaign Form ID', type: 'number', placeholder: 'e.g. 132', group: 'Exit Intent Popup' },
    ]
  },
  {
    key: 'home',
    title: 'Homepage',
    path: '/home',
    deployedUrl: 'https://webclass.navigationtrading.com/home',
    description: 'Navigation Trading Homepage, containing free signups and join links.',
    fields: [
      { key: 'whopLink', label: 'Hero Join Room Whop URL', type: 'url', placeholder: 'https://whop.com/...', description: 'Whop checkout link when clicking hero Get Free Access button', group: 'URLs & Links' },
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: 'https://whop.com/...', description: 'Checkout URL for Navbar Join Now button', group: 'URLs & Links' },
      { key: 'viewResultsLink', label: 'See Our Performance / View Results URL', type: 'url', placeholder: 'e.g. /performance', description: 'Redirect path/URL for See Our Performance / View Track Record / View Results buttons', group: 'URLs & Links' },
      { key: 'explorePlansLink', label: 'Explore Plans URL', type: 'url', placeholder: 'e.g. pricing.html', description: 'Redirect path/URL for Explore Plans/Explore All Plans buttons', group: 'URLs & Links' },
      { key: 'bookCallLink', label: 'Book Calendly Call URL', type: 'url', placeholder: 'https://calendly.com/...', description: 'Redirect URL for Book Call buttons', group: 'URLs & Links' },
      { key: 'joinFreeLink', label: 'Join for Free URL', type: 'url', placeholder: 'e.g. /free-membership', description: 'Redirect path/URL for Join for Free button', group: 'URLs & Links' },

      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', group: 'Exit Intent Popup' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number', group: 'Exit Intent Popup' },

      { key: 'youtubeVideoUrl', label: 'Welcome Video Embed URL (YouTube)', type: 'url', placeholder: 'https://www.youtube.com/embed/...', description: 'YouTube embed src URL for welcome video', group: 'Video & Podcast Embeds' },
      { key: 'spotifyPodcastEmbedUrl', label: 'Podcast Embed URL (Spotify Player)', type: 'url', placeholder: 'https://open.spotify.com/embed/...', description: 'Spotify embed src URL for podcast player', group: 'Video & Podcast Embeds' },
      { key: 'spotifyLink', label: 'Spotify Podcast Page Link', type: 'url', placeholder: 'https://open.spotify.com/...', description: 'Listen on Spotify external button link', group: 'Video & Podcast Embeds' },
      { key: 'applePodcastsLink', label: 'Apple Podcasts Page Link', type: 'url', placeholder: 'https://podcasts.apple.com/...', description: 'Listen on Apple Podcasts external button link', group: 'Video & Podcast Embeds' },
    ]
  },
  {
    key: 'pricing',
    title: 'Pricing & Plans',
    path: '/pricing',
    deployedUrl: 'https://webclass.navigationtrading.com/pricing',
    description: 'Pricing grid displaying Free, Day Trading, and Pro memberships.',
    fields: [
      { key: 'whopFree', label: 'Free Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Redirects' },
      { key: 'whopDay', label: 'Day Trading Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Redirects' },
      { key: 'whopPro', label: 'Pro Trading Plan Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Redirects' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', group: 'Exit Intent Popup' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number', group: 'Exit Intent Popup' },
    ]
  },
  {
    key: 'free-membership',
    title: 'Free Membership Welcome',
    path: '/free-membership',
    deployedUrl: 'https://webclass.navigationtrading.com/free-membership',
    description: 'Welcome and overview page for Free members.',
    fields: [
      { key: 'freeJoinLink', label: 'Start Learning Free Button Link', type: 'url', placeholder: 'https://whop.com/...', description: 'URL for the main Start Learning Free button', group: 'URLs & Links' },
      { key: 'navCtaLink', label: 'Navbar Join Now Link', type: 'url', placeholder: '../pricing.html', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },

      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', group: 'Exit Intent Popup' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number', group: 'Exit Intent Popup' },

      { key: 'youtubeVideoUrl', label: 'Welcome Video Embed URL (YouTube)', type: 'url', placeholder: 'https://www.youtube.com/embed/...', description: 'YouTube embed src URL for welcome video', group: 'Video Settings' },
    ]
  },
  {
    key: 'paid-membership',
    title: 'Paid Membership Welcome',
    path: '/paid-membership',
    deployedUrl: 'https://webclass.navigationtrading.com/paid-membership',
    description: 'Welcome and details page for Paid/Pro members.',
    fields: [
      { key: 'whopLink', label: 'Pro Join Link', type: 'url', placeholder: 'https://whop.com/...', description: 'URL for main Get Pro Access and Join Pro buttons', group: 'URLs & Links' },
      { key: 'navCtaLink', label: 'Navbar Join Now Link', type: 'url', placeholder: 'https://whop.com/...', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'heroVideoUrl', label: 'Hero Section Video — YouTube Embed URL', type: 'url', placeholder: 'https://www.youtube.com/embed/...', description: 'YouTube embed URL for the video shown on the right side of the hero section', group: 'Hero Section' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', group: 'Exit Intent Popup' },
      { key: 'exitPopupDate', label: 'Exit Popup Date Text', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupFormId', label: 'Exit Popup Form ID', type: 'number', group: 'Exit Intent Popup' },
    ]
  },
  {
    key: 'day-trading-replay-noshow',
    title: 'Replay NoShow Page',
    path: '/day-trading-replay-noshow',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading-replay-noshow',
    description: 'Replay page for registered users who missed the live webinar.',
    fields: [
      { key: 'whopLink', label: 'Main CTA Offer Link', type: 'url', placeholder: 'e.g. day-trading-offer.html', description: 'Redirect URL for Claim Offer and Claim Discount buttons', group: 'URLs & Links' },
      { key: 'exitPopupShow', label: 'Enable Exit Intent Popup', type: 'boolean', group: 'Exit Intent Popup' },
      { key: 'exitPopupHeadline', label: 'Exit Popup Headline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupTagline', label: 'Exit Popup Tagline', type: 'text', group: 'Exit Intent Popup' },
      { key: 'exitPopupBullets', label: 'Exit Popup Bullets (Semicolon-separated)', type: 'textarea', group: 'Exit Intent Popup' },
      { key: 'exitPopupRedirectUrl', label: 'Exit Popup Button Link', type: 'url', placeholder: 'e.g. day-trading-offer.html', description: 'Redirect URL when clicking Join Now inside exit popup', group: 'Exit Intent Popup' },
    ]
  },
  {
    key: 'day-trading-replay-v2',
    title: 'Day Trading Replay V2',
    path: '/day-trading-replay-v2',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading-replay-v2',
    description: 'Variant replay page showing different CTAs.',
    fields: [
      { key: 'whopReplayUrl', label: 'Main Replay Join Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'whopOfferUrl', label: 'Middle Offer Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'whopFinalUrl', label: 'Final Bottom Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'freeOnePagersLink', label: 'Access Free One Pagers Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'promoPercent', label: 'Promo Discount Percentage', type: 'text', placeholder: 'e.g. 30%', group: 'Promo Settings' },
      { key: 'promoCode', label: 'Promo Code Text', type: 'text', placeholder: 'e.g. DAY', group: 'Promo Settings' },
    ]
  },
  {
    key: 'day-trading-replay',
    title: 'Day Trading Replay',
    path: '/day-trading-replay',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading-replay',
    description: 'Standard day trading replay page.',
    fields: [
      { key: 'whopLink', label: 'Join Room Whop Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'freeOnePagersLink', label: 'Access Free One Pagers Link', type: 'url', placeholder: 'https://whop.com/...', group: 'URLs & Links' },
      { key: 'promoPercent', label: 'Promo Discount Percentage', type: 'text', placeholder: 'e.g. 30%', group: 'Promo Settings' },
      { key: 'promoCode', label: 'Promo Code Text', type: 'text', placeholder: 'e.g. DAY', group: 'Promo Settings' },
    ]
  },
  {
    key: 'day-trading-membership',
    title: 'Day Trading Membership Welcome',
    path: '/day-trading-membership',
    deployedUrl: 'https://webclass.navigationtrading.com/day-trading-membership',
    description: 'Overview and detail page for Day Trading members.',
    fields: [
      { key: 'whopLink', label: 'Day Trading Join Link', type: 'url', placeholder: 'https://whop.com/navigationtrading/ntday/', description: 'URL for main Join Day Trading buttons', group: 'URLs & Links' },
      { key: 'navCtaLink', label: 'Navbar Join Now Link', type: 'url', placeholder: 'https://whop.com/navigationtrading/ntday/', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'whopProLink', label: 'Pro Membership Text Link (In comparison & FAQ)', type: 'url', placeholder: 'https://whop.com/navigationtrading/ntpro/', description: 'URL for the textual links pointing to Pro Membership (located in the Comparison box and FAQ answers)', group: 'URLs & Links' },
      { key: 'heroVideoUrl', label: 'Hero Section Video — YouTube Embed URL', type: 'url', placeholder: 'https://www.youtube.com/embed/...', description: 'YouTube embed URL for the video shown on the right side of the hero section', group: 'Hero Section' }
    ]
  },
  {
    key: 'contact',
    title: 'Contact Us',
    path: '/contact',
    deployedUrl: 'https://webclass.navigationtrading.com/contact',
    description: 'Contact us form page with support channels and FAQ.',
    fields: [
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: 'https://whop.com/navigationtrading/', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'freeJoinLink', label: 'Get Started Now Bottom CTA URL', type: 'url', placeholder: 'https://whop.com/navigationtrading/ntfree/', description: 'URL for the bottom Get Started Now button', group: 'URLs & Links' },
      { key: 'discordLink', label: 'Discord Community Link', type: 'url', placeholder: '/pricing', description: 'URL pointing to the Whop/Discord community pricing or room link', group: 'Other Support Links' },
      { key: 'calendlyLink', label: 'Schedule Calendly Call URL', type: 'url', placeholder: 'https://calendly.com/navigationtrading', description: 'URL for the Coaching Call Calendly booking page', group: 'Other Support Links' },
      { key: 'blogLink', label: 'Read Blog URL', type: 'url', placeholder: 'https://navigationtrading.com/blog/', description: 'URL for the Blog link', group: 'Other Support Links' },
      { key: 'contactLocation', label: 'Location Text', type: 'text', placeholder: 'Online — Trading Worldwide', description: 'Location text displayed in details', group: 'Details & Support Info' },
      { key: 'contactResponseTime', label: 'Response Time Text', type: 'text', placeholder: 'Mon – Fri · < 24 hours', description: 'Expected response time text', group: 'Details & Support Info' },
      { key: 'contactEmail', label: 'Support Email', type: 'text', placeholder: 'support@navigationtrading.com', description: 'Support contact email address (both mailto: links and visible texts will update)', group: 'Details & Support Info' }
    ]
  },
  {
    key: 'brokers',
    title: 'Preferred Brokers',
    path: '/brokers',
    deployedUrl: 'https://webclass.navigationtrading.com/brokers',
    description: 'Broker recommendations with referral links and comparison sheet.',
    fields: [
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: 'https://whop.com/navigationtrading/', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'ibReferralUrl', label: 'Interactive Brokers Referral URL', type: 'url', placeholder: 'https://www.interactivebrokers.com/referral/navigationtrading', description: 'Referral link for Interactive Brokers account opening', group: 'Broker Links' },
      { key: 'tradierReferralUrl', label: 'Tradier Referral URL', type: 'url', placeholder: 'https://tradier.com/individuals/options-trading', description: 'Referral link for Tradier account opening', group: 'Broker Links' },
      { key: 'schwabReferralUrl', label: 'Charles Schwab Referral URL', type: 'url', placeholder: 'https://www.schwab.com/', description: 'Referral link for Charles Schwab account opening', group: 'Broker Links' },
      { key: 'commissionSheetUrl', label: 'Spreadsheet Download URL', type: 'url', placeholder: '#', description: 'Download link for the Broker Commission Comparison spreadsheet', group: 'Broker Links' }
    ]
  },
  {
    key: 'podcast',
    title: 'Podcast',
    path: '/podcast',
    deployedUrl: 'https://webclass.navigationtrading.com/podcast',
    description: 'Listen to the Tradehacker Mindset podcast and subscribe to various platforms.',
    fields: [
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: 'pricing.html', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'spotifyPodcastEmbedUrl', label: 'Spotify Podcast Embed URL', type: 'url', placeholder: 'https://open.spotify.com/embed/...', description: 'Spotify embedded player URL', group: 'Embed Settings' },
      { key: 'spotifyLink', label: 'Spotify Subscribe Link', type: 'url', placeholder: 'https://open.spotify.com/...', description: 'Listen on Spotify link', group: 'Platform Links' },
      { key: 'applePodcastsLink', label: 'Apple Podcasts Subscribe Link', type: 'url', placeholder: 'https://podcasts.apple.com/...', description: 'Listen on Apple Podcasts link', group: 'Platform Links' },
      { key: 'youtubeLink', label: 'YouTube Subscribe Link', type: 'url', placeholder: 'https://www.youtube.com/...', description: 'Subscribe on YouTube link', group: 'Platform Links' },
      { key: 'freeJoinLink', label: 'Free Membership Access Link', type: 'url', placeholder: 'https://whop.com/...', description: 'Get started link for free courses', group: 'Call to Actions' },
      { key: 'paidJoinLink', label: 'Premium Membership Learn More Link', type: 'url', placeholder: 'pricing.html', description: 'Learn More link for Premium memberships', group: 'Call to Actions' },
      { key: 'proJoinLink', label: 'Pro Membership Learn More Link', type: 'url', placeholder: 'pricing.html', description: 'Learn More link for Pro memberships', group: 'Call to Actions' },
      { key: 'calendlyLink', label: 'Schedule Coaching Call Link', type: 'url', placeholder: 'https://calendly.com/...', description: 'Calendly booking link', group: 'Call to Actions' },
      { key: 'pricingLink', label: 'View Membership Plans Link', type: 'url', placeholder: 'pricing.html', description: 'Redirect URL for bottom CTA', group: 'Call to Actions' }
    ]
  },
  {
    key: 'performance',
    title: 'Performance & Track Record',
    path: '/performance',
    deployedUrl: 'https://webclass.navigationtrading.com/performance',
    description: 'Documented performance history and annual trade reports.',
    fields: [
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: 'pricing.html', description: 'URL for the Navbar Join Now button', group: 'URLs & Links' },
      { key: 'pricingLink', label: 'Explore Memberships URL', type: 'url', placeholder: 'pricing.html', description: 'Explore Memberships bottom CTA button', group: 'URLs & Links' },
      { key: 'featuredYearPdfUrl', label: '2025 Featured Year Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for the current year performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2024', label: '2024 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2024 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2023', label: '2023 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2023 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2022', label: '2022 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2022 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2021', label: '2021 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2021 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2020', label: '2020 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2020 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2019', label: '2019 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2019 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2018', label: '2018 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2018 annual performance report', group: 'Year Report Links' },
      { key: 'yearPdfUrl2017', label: '2017 Report PDF URL', type: 'url', placeholder: 'https://navigationtrading.com/...pdf', description: 'PDF link for 2017 inception year performance report', group: 'Year Report Links' },
      { key: 'video1Url', label: 'Live Stream — Latest Replay Embed URL', type: 'url', placeholder: 'https://www.youtube.com/embed/VIDEO_ID', description: 'YouTube embed URL for the Day Trading Live Stream latest replay (single video card)', group: 'Live Execution Videos' },
      { key: 'video2026Jun', label: 'June 2026 — YouTube Video ID', type: 'text', placeholder: 'e.g. abc123XYZ', description: 'YouTube video ID for June 2026 Trade Results (add when published)', group: '2026 Monthly Videos' },
      { key: 'video2026May', label: 'May 2026 — YouTube Video ID', type: 'text', placeholder: 'Qfx4XipgSAU', description: 'YouTube video ID for May 2026 Trade Results', group: '2026 Monthly Videos' },
      { key: 'video2026Apr', label: 'April 2026 — YouTube Video ID', type: 'text', placeholder: 'e.g. abc123XYZ', description: 'YouTube video ID for April 2026 Trade Results (add when published)', group: '2026 Monthly Videos' },
      { key: 'video2026Mar', label: 'March 2026 — YouTube Video ID', type: 'text', placeholder: '66jFo1mil58', description: 'YouTube video ID for March 2026 Trade Results', group: '2026 Monthly Videos' },
      { key: 'video2026Feb', label: 'February 2026 — YouTube Video ID', type: 'text', placeholder: 'pDSgzEA9cEU', description: 'YouTube video ID for February 2026 Trade Results', group: '2026 Monthly Videos' },
      { key: 'video2026Jan', label: 'January 2026 — YouTube Video ID', type: 'text', placeholder: 'WNYu-z02mfg', description: 'YouTube video ID for January 2026 Trade Results', group: '2026 Monthly Videos' }
    ]
  },
  {
    key: 'thank-you-dtt',
    title: 'Webinar Thank You Page',
    path: '/thank-you-dtt',
    deployedUrl: 'https://webclass.navigationtrading.com/thank-you-dtt',
    description: 'Registration confirmation page showing webinar meeting access details.',
    fields: [
      { key: 'navCtaLink', label: 'Navbar Join Now URL', type: 'url', placeholder: '/day-trading', description: 'URL for the Navbar CTA button', group: 'URLs & Links' },
      { key: 'zoomLink', label: 'Zoom Join URL', type: 'url', placeholder: 'https://us06web.zoom.us/...', description: 'URL to join the Zoom webinar session', group: 'Zoom Access Details' },
      { key: 'meetingId', label: 'Zoom Meeting ID', type: 'text', placeholder: 'e.g. 845 1534 7195', description: 'Webinar Zoom Meeting ID text', group: 'Zoom Access Details' },
      { key: 'meetingPasscode', label: 'Zoom Meeting Passcode', type: 'text', placeholder: 'e.g. 615280', description: 'Webinar Zoom Meeting Passcode text', group: 'Zoom Access Details' },
      { key: 'googleCalLink', label: 'Google Calendar Link', type: 'url', placeholder: 'https://calendar.google.com/...', description: 'Add event to Google Calendar URL', group: 'Calendar Add Buttons' },
      { key: 'outlookCalLink', label: 'Outlook Calendar Link', type: 'url', placeholder: 'https://outlook.live.com/...', description: 'Add event to Outlook Calendar URL', group: 'Calendar Add Buttons' },
      { key: 'dateLabel', label: 'Webinar Date Label', type: 'text', placeholder: 'e.g. March 19th, 2026', description: 'Webinar date text in Details card', group: 'Webinar Date & Time' },
      { key: 'timeLabel', label: 'Webinar Time Label', type: 'text', placeholder: 'e.g. 3:30 PM Central Time', description: 'Webinar time text in Details card', group: 'Webinar Date & Time' }
    ]
  }
];

function getOffsetString(timezone: string, localDateTimeStr: string): string {
  try {
    const naiveDate = new Date(localDateTimeStr + ':00Z');
    if (isNaN(naiveDate.getTime())) return '-05:00';

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(naiveDate);
    const p: Record<string, string> = {};
    parts.forEach(part => {
      p[part.type] = part.value;
    });

    let hour = parseInt(p.hour || '0', 10);
    if (hour === 24) hour = 0;

    const tzLocal = new Date(Date.UTC(
      parseInt(p.year || '0', 10),
      parseInt(p.month || '1', 10) - 1,
      parseInt(p.day || '1', 10),
      hour,
      parseInt(p.minute || '0', 10),
      parseInt(p.second || '0', 10)
    ));

    const offsetMs = tzLocal.getTime() - naiveDate.getTime();
    const offsetMin = Math.round(offsetMs / 60000);

    const sign = offsetMin >= 0 ? '+' : '-';
    const absOffsetMin = Math.abs(offsetMin);
    const hours = String(Math.floor(absOffsetMin / 60)).padStart(2, '0');
    const mins = String(absOffsetMin % 60).padStart(2, '0');
    return `${sign}${hours}:${mins}`;
  } catch (e) {
    console.error('Error calculating timezone offset:', e);
    return '-05:00';
  }
}

export default function SiteConfigPage() {
  const [selectedPage, setSelectedPage] = useState<PageConfig>(PAGES_CONFIG[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isPending, startTransition] = useTransition();

  // Load all configurations
  useEffect(() => {
    fetchConfigs();
  }, []);

  // Update current form fields and open accordions when selected page or configs change
  useEffect(() => {
    if (selectedPage) {
      const pageValues = configs[selectedPage.key] || {};
      const newFormState: Record<string, string> = {};
      const initialExpanded: Record<string, boolean> = {};

      selectedPage.fields.forEach(field => {
        if (field.type === 'datetime-local') {
          const rawValue = pageValues[field.key] || '';
          const tzValue = pageValues[field.key + '_tz'] || 'America/Chicago';
          const localValue = rawValue ? rawValue.substring(0, 16) : '';
          newFormState[field.key + '_local'] = localValue;
          newFormState[field.key + '_tz'] = tzValue;
        } else {
          newFormState[field.key] = pageValues[field.key] || '';
        }
        initialExpanded[field.group || 'General Settings'] = true;
      });

      setFormState(newFormState);
      setExpandedGroups(initialExpanded);
      setStatus({ type: null, message: '' });
    }
  }, [selectedPage, configs]);

  const fetchConfigs = () => {
    setLoading(true);
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setConfigs(data.data || {});
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching configs:', err);
        setLoading(false);
      });
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });

    try {
      const payload: Record<string, string> = {};
      selectedPage.fields.forEach(field => {
        if (field.type === 'datetime-local') {
          const localVal = formState[field.key + '_local'] || '';
          const tzVal = formState[field.key + '_tz'] || 'America/Chicago';
          if (localVal) {
            const offset = getOffsetString(tzVal, localVal);
            payload[field.key] = `${localVal}:00${offset}`;
          } else {
            payload[field.key] = '';
          }
          payload[field.key + '_tz'] = tzVal;
        } else {
          payload[field.key] = formState[field.key] || '';
        }
      });

      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: selectedPage.key,
          config: payload
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: 'Configuration saved successfully! All updates are live.' });
        setConfigs(prev => ({
          ...prev,
          [selectedPage.key]: {
            ...(prev[selectedPage.key] || {}),
            ...payload
          }
        }));
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to save configuration.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = PAGES_CONFIG.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'datetime-local':
        return <Calendar size={15} style={{ color: 'var(--accent-color)' }} />;
      case 'url':
        return <LinkIcon size={15} style={{ color: 'var(--accent-color)' }} />;
      case 'number':
        return <Hash size={15} style={{ color: 'var(--accent-color)' }} />;
      default:
        return <Sliders size={15} style={{ color: 'var(--accent-color)' }} />;
    }
  };

  // Group fields for the selected page
  const groupedFields: Record<string, FieldConfig[]> = {};
  selectedPage.fields.forEach(field => {
    const groupName = field.group || 'General Settings';
    if (!groupedFields[groupName]) {
      groupedFields[groupName] = [];
    }
    groupedFields[groupName].push(field);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Website Configuration</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', margin: '4px 0 0 0' }}>
            Manage countdown clocks, checkout/Whop redirects, form IDs, and exit-intent popup content for all pages.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', flexDirection: 'column', gap: '16px' }}>
          <Loader2 className="animate-spin" size={32} style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading configurations...</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left panel: page search and listing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search marketing pages..."
                style={{ paddingLeft: '40px', width: '100%', borderRadius: '10px' }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="table-container" style={{ padding: 0, overflow: 'hidden', borderRadius: '12px' }}>
              <div style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                Pages ({filteredPages.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px', overflowY: 'auto' }}>
                {filteredPages.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                    No pages matched search.
                  </div>
                ) : (
                  filteredPages.map(page => {
                    const isSelected = selectedPage.key === page.key;
                    return (
                      <button
                        key={page.key}
                        onClick={() => setSelectedPage(page)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          padding: '16px',
                          textAlign: 'left',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: isSelected ? 'rgba(200,66,10,0.06)' : 'transparent',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.2s',
                          borderLeft: isSelected ? '4px solid var(--accent-color)' : '4px solid transparent',
                          paddingLeft: isSelected ? '12px' : '16px',
                        }}
                        onMouseOver={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                        }}
                        onMouseOut={e => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '14px', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)' }}>
                          {page.title}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10.5px', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {page.path}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right panel: settings editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '28px', boxShadow: 'var(--shadow-sm)' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(200,66,10,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Globe size={18} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{selectedPage.title}</h2>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Serving path: <code style={{ background: 'var(--bg-main)', padding: '2px 4px', borderRadius: '4px', color: 'var(--accent-color)' }}>{selectedPage.path}</code>
                    </span>
                  </div>
                  <a
                    href={selectedPage.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      padding: '8px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      backgroundColor: 'rgba(200,66,10,0.06)',
                      color: 'var(--accent-color)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(200,66,10,0.1)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(200,66,10,0.06)'}
                  >
                    <ExternalLink size={14} />
                    View Live Page
                  </a>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '-8px', marginBottom: '28px', lineHeight: 1.5 }}>
                {selectedPage.description}
              </p>

              {/* Status Banner */}
              {status.type && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                  marginBottom: '24px',
                  border: '1px solid',
                  backgroundColor: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  borderColor: status.type === 'success' ? '#10b981' : '#fca5a5',
                  color: status.type === 'success' ? '#065f46' : '#991b1b',
                }}>
                  {status.type === 'success' ? (
                    <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                  ) : (
                    <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {Object.entries(groupedFields).map(([groupName, fields]) => {
                    const isExpanded = !!expandedGroups[groupName];
                    return (
                      <div key={groupName} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--bg-main)', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '18px 24px',
                            backgroundColor: 'rgba(0,0,0,0.015)',
                            border: 'none',
                            borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                            fontWeight: 700,
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.8px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.015)'}
                        >
                          <span>{groupName}</span>
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {isExpanded && (
                          <div style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'white' }}>
                            {fields.map(field => {
                              const value = formState[field.key];
                              return (
                                <div key={field.key} className="form-group" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {getFieldIcon(field.type)}
                                    <label className="form-label" style={{ marginBottom: 0, fontWeight: 600, fontSize: '13.5px' }}>
                                      {field.label}
                                    </label>
                                  </div>

                                  {field.type === 'boolean' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                                      <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                                        <input
                                          type="checkbox"
                                          checked={value === 'true'}
                                          onChange={e => handleFieldChange(field.key, e.target.checked ? 'true' : 'false')}
                                          style={{
                                            width: '18px',
                                            height: '18px',
                                            accentColor: 'var(--accent-color)',
                                            cursor: 'pointer'
                                          }}
                                        />
                                        <span style={{ fontSize: '13.5px', color: value === 'true' ? 'var(--accent-color)' : 'var(--text-secondary)', fontWeight: 600 }}>
                                          {value === 'true' ? 'Active' : 'Disabled'}
                                        </span>
                                      </label>
                                    </div>
                                  ) : field.type === 'textarea' ? (
                                    <textarea
                                      className="form-control"
                                      rows={3}
                                      placeholder={field.placeholder}
                                      value={value || ''}
                                      onChange={e => handleFieldChange(field.key, e.target.value)}
                                      style={{ width: '100%', fontFamily: 'inherit', fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                                    />
                                  ) : field.type === 'datetime-local' ? (
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                                      <input
                                        type="datetime-local"
                                        className="form-control"
                                        value={formState[field.key + '_local'] || ''}
                                        onChange={e => handleFieldChange(field.key + '_local', e.target.value)}
                                        style={{ flex: 1, fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                                      />
                                      <select
                                        className="form-control"
                                        value={formState[field.key + '_tz'] || 'America/Chicago'}
                                        onChange={e => handleFieldChange(field.key + '_tz', e.target.value)}
                                        style={{ width: '220px', fontSize: '14px', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer', backgroundColor: '#fff', border: '1px solid var(--border-color)' }}
                                      >
                                        <option value="America/Chicago">Central Time (CST/CDT)</option>
                                        <option value="America/New_York">Eastern Time (EST/EDT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                                        <option value="America/Denver">Mountain Time (MST/MDT)</option>
                                        <option value="Asia/Kolkata">India Time (IST)</option>
                                        <option value="UTC">UTC / GMT</option>
                                      </select>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder={field.placeholder}
                                      value={value || ''}
                                      onChange={e => handleFieldChange(field.key, e.target.value)}
                                      style={{ width: '100%', fontSize: '14px', borderRadius: '8px', padding: '10px 12px' }}
                                    />
                                  )}

                                  {field.description && (
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '2px' }}>
                                      {field.description}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={saving}
                    style={{ minWidth: '140px', justifyContent: 'center' }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
