'use strict';

// Auto mode. Registered per domain by popup.js, in the page's MAIN world,
// right after clean.js (which defines window.__outlinerClean).
(function() {
  const MAX_ATTEMPTS = 3;
  let hasBeenCleaned = false;
  let attempts = 0;

  // The site's main page (root path) usually lists articles rather than
  // showing one, so auto mode leaves it alone. Checked on every call so
  // SPA navigations from the home page to an article still trigger.
  function isRootPath() {
    return location.pathname === '/' || location.pathname === '';
  }

  function cleanPage() {
    if (isRootPath()) return;
    if (hasBeenCleaned || document.getElementById('outliner-bar')) return;
    // Without a cap, the 1s poll below would re-fetch the page every second
    // for as long as the site keeps failing.
    if (attempts >= MAX_ATTEMPTS) return;
    hasBeenCleaned = true;
    attempts++;

    window.__outlinerClean(true).then(ok => {
      if (!ok) hasBeenCleaned = false; // Allow a retry on failure
    });
  }

  // 1. Monitor via Proxy/Setter (Fastest detection)
  let val = window.hasPaywall;
  if (val === true) cleanPage();

  try {
    Object.defineProperty(window, 'hasPaywall', {
      get: () => val,
      set: (newVal) => {
        const wasTrue = (val === true);
        val = newVal;

        if (!wasTrue && newVal === true) {
          cleanPage();
        }
      },
      configurable: true,
      enumerable: true
    });
  } catch (e) {}

  // 2. Polling fallback, in case the page redefines the property.
  setInterval(() => {
    if (window.hasPaywall === true && !hasBeenCleaned) {
      cleanPage();
    }
  }, 1000);
})();
