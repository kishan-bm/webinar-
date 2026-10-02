(function () {
  // ── META PIXEL ID ──
  // Pixel IDs are public (they appear in every page's source on any site that
  // uses Meta ads), so it's safe to hardcode here. This is the real Pixel ID
  // from Meta Events Manager -- confirmed with the client directly after an
  // AI-generated message mislabeled the ad account ID as a "Pixel ID" and
  // briefly led this to get changed to the wrong value.
  var META_PIXEL_ID = '365657453766875';

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
            fbc: getCookie('_fbc'),
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

  window.metaStoreLeadForThankYou = function (opts) {
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(opts || {}));
    } catch (e) {}
  };

  window.metaFireStoredLead = function () {
    try {
      var raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return;
      sessionStorage.removeItem(PENDING_KEY);
      window.metaTrackLead(JSON.parse(raw));
    } catch (e) {}
  };

  // Auto-fire on every page load — a no-op unless the previous page actually
  // stored a pending lead, and it self-clears so a refresh can't re-fire it.
  window.metaFireStoredLead();

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
