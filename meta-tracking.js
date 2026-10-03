(function () {
  // ── META PIXEL ID ──
  // Pixel IDs are public (they appear in every page's source on any site that
  // uses Meta ads), so it's safe to hardcode here. This is the real Pixel ID
  // from Meta Events Manager -- confirmed with the client directly after an
  // AI-generated message mislabeled the ad account ID as a "Pixel ID" and
  // briefly led this to get changed to the wrong value.
  var META_PIXEL_ID = '365657453766875';

  // ── CLICK-ID CAPTURE (fbclid -> _fbc) ──
  // Meta attributes a conversion to an ad click through the _fbc cookie,
  // which is built from the ?fbclid= on the landing URL. fbevents.js normally
  // sets it, but only if it loads (ad blockers, slow in-app browsers and
  // early redirects all stop that) -- and then the CAPI event reaches Meta
  // with no click ID, so it shows in Events Manager but never in Ads Manager.
  // Set it ourselves, synchronously, before anything else can lose the param.
  (function captureFbclid() {
    try {
      var fbclid = new URLSearchParams(window.location.search).get('fbclid');
      if (!fbclid) return;
      var existing = document.cookie.match(/(?:^|;\s*)_fbc=([^;]*)/);
      if (existing && decodeURIComponent(existing[1]).slice(-fbclid.length) === fbclid) return;
      var fbc = 'fb.1.' + Date.now() + '.' + fbclid;
      var host = window.location.hostname;
      var parts = host.split('.');
      var domain = parts.length > 2 ? '; domain=.' + parts.slice(-2).join('.') : '';
      document.cookie = '_fbc=' + fbc + '; path=/; max-age=7776000; SameSite=Lax' + domain;
      try { localStorage.setItem('_fbc', fbc); } catch (e) {}
    } catch (e) {}
  })();

  // ── TEST MODE (for Events Manager → Test events only) ──
  // Visit any page with ?test_event_code=TESTxxxx to tag THIS browser's
  // server events for the session. Real visitors never have the param, so
  // live conversions are never diverted into the Test events tab.
  (function captureTestCode() {
    try {
      var code = new URLSearchParams(window.location.search).get('test_event_code');
      if (code && /^TEST[A-Z0-9]{1,20}$/i.test(code)) sessionStorage.setItem('_metaTestCode', code);
    } catch (e) {}
  })();

  // ── META PIXEL BASE CODE (standard snippet from Meta Events Manager) ──
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');

  // ── SHARED LEAD TRACKING HELPER ──
  // Fires the browser Pixel AND the server-side Conversions API together,
  // using the same event_id so Meta de-duplicates instead of double-counting.
  // The browser Pixel alone under-reports (ad blockers, Safari ITP, Firefox
  // ETP all block it); the Conversions API call reaches Meta directly from
  // our own server regardless of the visitor's browser/extensions.
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[2]) : '';
  }

  function generateEventId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  }

  // Meta Pixel standard event names — anything not in this list is a custom
  // event and must be sent via fbq('trackCustom', ...) instead of fbq('track', ...).
  var STANDARD_EVENTS = {
    Lead: 1, Purchase: 1, CompleteRegistration: 1, Contact: 1, Subscribe: 1,
    StartTrial: 1, ViewContent: 1, AddToCart: 1, InitiateCheckout: 1,
  };

  window.metaTrackLead = function (opts) {
    opts = opts || {};
    var eventName = opts.eventName || 'Lead';
    var eventId = opts.eventId || generateEventId();

    // 1. Browser Pixel
    if (window.fbq) {
      if (STANDARD_EVENTS[eventName]) {
        fbq('track', eventName, {}, { eventID: eventId });
      } else {
        fbq('trackCustom', eventName, {}, { eventID: eventId });
      }
    }

    // 2. Conversions API (server-side) — fire-and-forget, never blocks the
    // page's own redirect/thank-you flow if it's slow or fails.
    //
    // _fbp is set by fbevents.js itself, which loads asynchronously — on a
    // freshly-loaded page (like the thank-you page right after redirect) it
    // may not have finished setting the cookie yet. Wait briefly for it
    // (capped) before reading, so server-side events carry the same browser
    // identifiers as the Pixel call and match quality doesn't suffer.
    function getUtm(key) {
      try { return sessionStorage.getItem(key) || ''; } catch (e) { return ''; }
    }

    function sendCapi() {
      try {
        fetch('/api/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: eventName,
            event_id: eventId,
            event_source_url: window.location.href,
            email: opts.email || '',
            phone: opts.phone || '',
            first_name: opts.firstName || '',
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc') || (function () { try { return localStorage.getItem('_fbc') || ''; } catch (e) { return ''; } })(),
            utm_source: getUtm('utm_source'),
            utm_medium: getUtm('utm_medium'),
            utm_campaign: getUtm('utm_campaign'),
            utm_content: getUtm('utm_content'),
            utm_term: getUtm('utm_term'),
            test_event_code: getUtm('_metaTestCode'),
          }),
          keepalive: true,
        }).catch(function () {});
      } catch (e) {}
    }

    var waitedMs = 0;
    (function waitForFbp() {
      if (getCookie('_fbp') || waitedMs >= 1500) {
        sendCapi();
      } else {
        waitedMs += 100;
        setTimeout(waitForFbp, 100);
      }
    })();
  };

  // ── STORE-THEN-FIRE ON THANK-YOU PAGE (fallback path) ──
  // The form page stores the lead's details in sessionStorage right before
  // redirecting, and the thank-you page reads it back and fires the event
  // once there. This exists as a BACKUP ONLY -- relying on it as the only
  // firing point under-counted real conversions, because sessionStorage
  // does not reliably survive a full page navigation inside the in-app
  // browsers Facebook/Instagram open ad clicks in (a very common path for
  // this exact traffic). See metaTrackLeadDual below for the primary path.
  var PENDING_KEY = '_metaPendingLead';
  var LEAD_USER_KEY = '_metaLeadUser';

  window.metaStoreLeadForThankYou = function (opts) {
    opts = opts || {};
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(opts));
    } catch (e) {}
    // Contact details for the confirmed-Lead event on the thank-you page.
    try {
      localStorage.setItem(LEAD_USER_KEY, JSON.stringify({
        email: opts.email || '', phone: opts.phone || '', firstName: opts.firstName || '', t: Date.now(),
      }));
    } catch (e) {}
  };

  window.metaFireStoredLead = function () {
    try {
      var raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return;
      sessionStorage.removeItem(PENDING_KEY);
      var pending = JSON.parse(raw) || {};
      window.metaTrackLead(pending);
      // Remember which event this page load already fired, so the
      // thank-you-page Lead below doesn't count the same person twice.
      window.__metaStoredFired = pending.eventName || 'Lead';
    } catch (e) {}
  };

  // Auto-fire on every page load — a no-op unless the previous page actually
  // stored a pending lead, and it self-clears so a refresh can't re-fire it.
  window.metaFireStoredLead();

  // ── CONFIRMED LEAD: fires only when our own thank-you page actually loads ──
  // Standard 'Lead' event (browser Pixel + CAPI, shared event_id), fired on
  // the funnel's thank-you page so any Custom Conversion rule keyed to a
  // thank-you URL has a matching event to see, independent of W5TY.
  // Scoped to tos-thankyou* specifically (not a site-wide "thank-you" match)
  // so this doesn't affect the separate DTT funnel's thank-you page.
  // Requires real contact details stored within the last hour, so a bare
  // direct visit / crawler / link-preview fetch with no real submission
  // behind it does not get counted as a Lead.
  (function fireThankYouLead() {
    try {
      var path = window.location.pathname.toLowerCase();
      if (path.indexOf('tos-thankyou') === -1) return;

      var user = {};
      try {
        user = JSON.parse(localStorage.getItem(LEAD_USER_KEY) || '{}') || {};
      } catch (e) { user = {}; }
      if (!user.t || Date.now() - user.t > 3600000 || !user.email) return;

      // Refresh / back-button guard: one Lead per thank-you page per 24h.
      var guard = '_tyLead_' + path.replace(/[^a-z0-9]/g, '');
      if (document.cookie.indexOf(guard + '=1') !== -1) return;
      document.cookie = guard + '=1; path=/; max-age=86400; SameSite=Lax';

      // If metaFireStoredLead already fired a 'Lead'-named event above for
      // this same visit, don't send a second one.
      if (window.__metaStoredFired === 'Lead') return;

      var userOpts = {
        email: user.email || '',
        phone: user.phone || '',
        firstName: user.firstName || '',
      };
      window.metaTrackLead(Object.assign({ eventName: 'Lead' }, userOpts));

      // Page-specific confirmed event, e.g. TY_tos_thankyou_10_15.
      // Meta strips URL paths for this pixel, so a custom conversion can't use
      // "URL contains tos-thankyou-10-15" -- but it CAN use the event name.
      // One custom conversion per webinar: Event = TY_<page>.
      var pageEvent = 'TY_' + path.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/g, '_');
      window.metaTrackLead(Object.assign({ eventName: pageEvent }, userOpts));
    } catch (e) {}
  })();

  // ── PRIMARY PATH: fire immediately, with a thank-you-page backup ──
  // Call this instead of metaStoreLeadForThankYou directly from a form's
  // success handler, right before redirecting to the thank-you page.
  //
  // It fires the real event NOW (via metaTrackLead's keepalive fetch, which
  // is specifically designed to complete even though the page is about to
  // navigate away -- unlike sessionStorage, which several in-app/mobile
  // browsers do not reliably carry across a full-page navigation) AND also
  // stores the same event_id for the thank-you page to re-fire as a backup.
  // Both paths share one event_id, so if both succeed Meta deduplicates them
  // into a single conversion instead of double-counting.
  window.metaTrackLeadDual = function (opts) {
    opts = opts || {};
    var eventId = generateEventId();
    var withId = Object.assign({}, opts, { eventId: eventId });
    window.metaTrackLead(withId);
    window.metaStoreLeadForThankYou(withId);
  };
})();
