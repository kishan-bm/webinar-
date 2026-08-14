(function() {
  // Find script element to get page Key
  var scriptTag = document.querySelector('script[data-page]');
  if (!scriptTag) {
    // Attempt fallback to find script via src
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('site-config.js') !== -1) {
        scriptTag = scripts[i];
        break;
      }
    }
  }
  if (!scriptTag) return;
  var pageKey = scriptTag.getAttribute('data-page');
  if (!pageKey) return;

  // Fetch page settings from local API
  var apiEndpoint = '/api/config?page=' + encodeURIComponent(pageKey) + '&t=' + Date.now();
  
  fetch(apiEndpoint)
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      if (!data.success || !data.config) return;
      var config = data.config;

      function normalizeUrl(val) {
        if (!val) return val;
        if (val.indexOf('.') !== -1 && !/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(val)) {
          return 'https://' + val;
        }
        return val;
      }

      function normalizeYouTubeEmbed(val) {
        if (!val) return val;
        // Already an embed URL — pass through
        if (/youtube\.com\/embed\//i.test(val)) return val;
        var videoId = null;
        // youtu.be/ID or youtu.be/ID?...
        var m = val.match(/youtu\.be\/([^?&]+)/);
        if (m) { videoId = m[1]; }
        // youtube.com/watch?v=ID
        if (!videoId) { m = val.match(/[?&]v=([^&]+)/); if (m) videoId = m[1]; }
        // youtube.com/live/ID
        if (!videoId) { m = val.match(/youtube\.com\/live\/([^?&]+)/i); if (m) videoId = m[1]; }
        // youtube.com/shorts/ID
        if (!videoId) { m = val.match(/youtube\.com\/shorts\/([^?&]+)/i); if (m) videoId = m[1]; }
        if (videoId) return 'https://www.youtube.com/embed/' + videoId;
        return val;
      }

      // 1. Dynamic Countdown Target
      if (config.countdownTarget && typeof window.setCountdownTarget === 'function') {
        window.setCountdownTarget(config.countdownTarget);
      }

      // 2. Generic data-config Injector
      Object.keys(config).forEach(function(key) {
        var value = config[key];
        if (value === undefined || value === null || value === '') return;

        var elements = document.querySelectorAll('[data-config="' + key + '"]');
        for (var j = 0; j < elements.length; j++) {
          var el = elements[j];
          if (el.tagName === 'A') {
            if (key === 'contactEmail' || (value.indexOf('@') !== -1 && value.indexOf('/') === -1 && !/^mailto:/i.test(value))) {
              el.href = 'mailto:' + value;
              el.textContent = value;
            } else {
              el.href = normalizeUrl(value);
            }
          } else if (el.tagName === 'IFRAME') {
            var embedSrc = normalizeYouTubeEmbed(value);
            el.src = embedSrc;
            if (embedSrc && el.parentElement) el.parentElement.classList.add('has-video');
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = value;
          } else {
            el.innerHTML = value;
          }
        }
      });

      // 3. 2026 Monthly Trade Results — fully admin-managed list (add/edit/remove any month)
      (function () {
        var sidebar = document.querySelector('.monthly-sidebar');
        if (!sidebar) return;

        var monthEntries = [];
        var usingCustomList = false;

        if (config.monthlyVideos) {
          var parsedMonths = null;
          try { parsedMonths = JSON.parse(config.monthlyVideos); } catch (e) { parsedMonths = null; }
          if (Array.isArray(parsedMonths) && parsedMonths.length) {
            usingCustomList = true;
            sidebar.innerHTML = '';
            parsedMonths.forEach(function(entry) {
              if (!entry || !entry.month) return;
              var videoId = (entry.videoId || '').trim();
              var btn = document.createElement('button');
              btn.className = 'month-btn' + (videoId ? '' : ' empty');
              btn.dataset.videoId = videoId;
              btn.dataset.label = 'Trade Results — ' + entry.month + ' ' + (entry.year || '');
              btn.textContent = entry.month;
              btn.addEventListener('click', function () {
                if (!this.dataset.videoId) return;
                sidebar.querySelectorAll('.month-btn').forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                var lbl = document.getElementById('monthly-video-label');
                if (lbl) lbl.textContent = this.dataset.label || '';
                var frame = document.getElementById('monthly-iframe');
                if (frame) frame.src = 'https://www.youtube.com/embed/' + this.dataset.videoId;
              });
              sidebar.appendChild(btn);
              monthEntries.push({ month: entry.month, year: entry.year, videoId: videoId, btn: btn });
            });
          }
        }

        if (!usingCustomList) {
          sidebar.querySelectorAll('.month-btn').forEach(function(btn) {
            var label = btn.dataset.label || '';
            var yearMatch = label.match(/(\d{4})/);
            monthEntries.push({
              month: btn.textContent.trim(),
              year: yearMatch ? yearMatch[1] : '',
              videoId: (btn.dataset.videoId || '').trim(),
              btn: btn
            });
          });
        }

        // Auto-select the most recent month that actually has a video
        var MONTH_ORDER = ['january','february','march','april','may','june','july','august','september','october','november','december'];
        function monthSortKey(e) {
          var y = parseInt(e.year, 10) || 0;
          var mi = MONTH_ORDER.indexOf((e.month || '').trim().toLowerCase());
          return y * 100 + (mi === -1 ? 0 : mi);
        }
        var withVideo = monthEntries.filter(function(e) { return e.videoId; });
        if (withVideo.length) {
          var latest = withVideo[0];
          withVideo.forEach(function(e) { if (monthSortKey(e) > monthSortKey(latest)) latest = e; });
          monthEntries.forEach(function(e) { e.btn.classList.remove('active'); });
          latest.btn.classList.add('active');
          var lbl2 = document.getElementById('monthly-video-label');
          if (lbl2) lbl2.textContent = latest.btn.dataset.label || '';
          var frame2 = document.getElementById('monthly-iframe');
          if (frame2) frame2.src = 'https://www.youtube.com/embed/' + latest.videoId;
        }
      })();

      // 3c. Annual Performance Reports — fully admin-managed list (add/edit/remove any year)
      (function () {
        var grid = document.getElementById('year-grid');
        if (!grid || !config.yearReports) return;
        var parsedYears = null;
        try { parsedYears = JSON.parse(config.yearReports); } catch (e) { parsedYears = null; }
        if (!Array.isArray(parsedYears) || !parsedYears.length) return;

        grid.innerHTML = '';
        parsedYears.forEach(function(entry) {
          if (!entry || !entry.year) return;
          var a = document.createElement('a');
          a.className = 'year-card';
          a.dataset.year = String(entry.year).slice(-2);
          if (entry.pdfUrl) {
            a.href = normalizeUrl(entry.pdfUrl);
            a.target = '_blank';
          } else {
            a.href = '#';
          }
          a.innerHTML =
            '<span class="year-badge">' + (entry.badge || 'Audited') + '</span>' +
            '<div class="year-num">' + entry.year + '</div>' +
            '<div class="year-sub">' + (entry.sub || 'Full Year') + '</div>' +
            '<div class="view-report">View Report &rarr;</div>';
          grid.appendChild(a);
        });
      })();

      // 4. Exit Intent Popup show/hide toggle
      if (config.exitPopupShow === 'false') {
        window.EXIT_POPUP_DISABLED = true;
        var popup = document.getElementById('exit-popup');
        if (popup) {
          popup.classList.remove('eip-open');
          // Allow restore body scroll
          document.body.style.overflow = '';
        }
      } else if (config.exitPopupShow === 'true') {
        window.EXIT_POPUP_DISABLED = false;
      }

      // 4. Update Inline ActiveCampaign forms
      if (config.formId) {
        var form = document.querySelector('[data-config="activecampaign-form"]') || document.querySelector('form[id^="_form_"]');
        if (form) {
          // Only update the hidden fields (f and u) that determine the ActiveCampaign form identity.
          // Changing the form element's DOM ID or classes dynamically breaks scoped CSS and event listeners.
          var hiddenF = form.querySelector('input[name="f"]');
          if (hiddenF) hiddenF.value = config.formId;
          
          var hiddenU = form.querySelector('input[name="u"]');
          if (hiddenU) hiddenU.value = config.formId;
        }
      }

      // 5. Update Exit Intent ActiveCampaign Popup form parameters
      if (config.exitPopupFormId) {
        var exitForm = document.getElementById('eip-form') || document.getElementById('ep-form');
        if (exitForm) {
          var hiddenF = exitForm.querySelector('input[name="f"]');
          if (hiddenF) hiddenF.value = config.exitPopupFormId;
          
          var hiddenU = exitForm.querySelector('input[name="u"]');
          if (hiddenU) hiddenU.value = config.exitPopupFormId;
        }
      }

      // 6. Update Exit Intent Bullet Points
      if (config.exitPopupBullets) {
        var bulletContainer = document.querySelector('.eip-bullets');
        if (bulletContainer) {
          var bullets = config.exitPopupBullets.split(';').map(function(s) { return s.trim(); }).filter(Boolean);
          bulletContainer.innerHTML = '';
          for (var k = 0; k < bullets.length; k++) {
            var li = document.createElement('li');
            li.innerHTML = '&#10003;&nbsp; ' + bullets[k];
            bulletContainer.appendChild(li);
          }
        }
      }
      
      // 7. Update exit popup redirect buttons (for redirect/link-based exit popups)
      if (config.exitPopupRedirectUrl) {
        var ctaBtn = document.querySelector('.eip-cta-btn');
        if (ctaBtn) ctaBtn.href = normalizeUrl(config.exitPopupRedirectUrl);
      }
    })
    .catch(function(err) {
      console.warn('Failed to load dynamic configurations:', err);
    });
})();
