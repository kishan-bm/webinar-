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
            el.href = value;
          } else if (el.tagName === 'IFRAME') {
            el.src = value;
          } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = value;
          } else {
            el.innerHTML = value;
          }
        }
      });

      // 3. Exit Intent Popup show/hide toggle
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
        if (ctaBtn) ctaBtn.href = config.exitPopupRedirectUrl;
      }
    })
    .catch(function(err) {
      console.warn('Failed to load dynamic configurations:', err);
    });
})();
