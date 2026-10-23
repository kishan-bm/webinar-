NavigationTrading x OptionStrat page - developer package
=======================================================

Contents
- optionstrat-page.html  The page as one self-contained code block (HTML + scoped CSS, no JavaScript).
- images/optionstrat-calculator.png  Screenshot for the "Options profit calculator" section.

Setup
1. Upload images/optionstrat-calculator.png to the site's media library.
2. In optionstrat-page.html, set the calculator <img src> to the uploaded image's URL
   (search for "optionstrat-calculator.png", there is one spot).
3. Paste the full contents of optionstrat-page.html into a custom HTML / code block on the page.

Notes
- All styles are scoped under the .ntos class, so they will not affect the rest of the site.
- Font: Plus Jakarta Sans via Google Fonts (link tag at the top of the file). If the site already loads
  Satoshi or General Sans, those are used first.
- Hero video: Vimeo embed 801054429 (autoplay, muted, loop, background mode) in a responsive 16:9 wrapper.
- Logo is loaded from the existing ActiveCampaign S3 URL; swap for the site's own hosted logo if preferred.
- All "20% off" buttons link to https://optionstrat.com/flow?ref=navigationtrading (affiliate link, keep the ref parameter).
- Anchor links in the page nav: #ntos-features, #ntos-calculator, #ntos-strategies.
- Responsive: the page menu links hide below 720px wide and the hero buttons go full width.
