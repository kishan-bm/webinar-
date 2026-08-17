(function () {
  // ── META PIXEL ID ──
  // Pixel IDs are public (they appear in every page's source on any site that
  // uses Meta ads), so it's safe to hardcode here. Replace this placeholder
  // with the real Pixel ID from Meta Events Manager.
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

  window.metaTrackLead = function (opts) {
    opts = opts || {};
    var eventId = generateEventId();

    // 1. Browser Pixel
    if (window.fbq) {
      fbq('track', 'Lead', {}, { eventID: eventId });
    }

    // 2. Conversions API (server-side) — fire-and-forget, never blocks the
    // page's own redirect/thank-you flow if it's slow or fails.
    try {
      fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Lead',
          event_id: eventId,
          event_source_url: window.location.href,
          email: opts.email || '',
          phone: opts.phone || '',
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc'),
        }),
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  };
})();
