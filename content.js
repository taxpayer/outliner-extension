'use strict';

// Auto mode. Registered per domain by popup.js, in the page's MAIN world,
// right after clean.js (which defines window.__outlinerClean and
// window.__outlinerRemoveAds).
(function() {
  // Ad removal runs on every page of the site, home page included, whether
  // or not it gets unbricked. Sites often add ad slots late (lazy loading,
  // on scroll), so watch the document for the whole page lifetime: elements
  // added with a matching id, or given one later, are removed right away.
  // This also covers the page swap done by an unbrick.
  function hasAdContainer(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    // getAttribute, not .id: a <form> with a field named "id" shadows .id
    // with that field, which would throw here.
    return (node.getAttribute('id') || '').toLowerCase().includes('ad-container') ||
      node.querySelector('[id*="ad-container" i]') !== null;
  }

  new MutationObserver(mutations => {
    const found = mutations.some(m => m.type === 'attributes'
      ? hasAdContainer(m.target)
      : Array.from(m.addedNodes).some(hasAdContainer));
    // __outlinerRemoveAds applies the exact id rule (so "thread-container"
    // survives); the check above only decides whether it is worth calling.
    if (found) window.__outlinerRemoveAds();
  }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] });

  // Safety net for anything already in place before the observer started.
  document.addEventListener('DOMContentLoaded', () => window.__outlinerRemoveAds());

  const MAX_ATTEMPTS = 3;
  let hasBeenCleaned = false;
  let attempts = 0;
  let pollId;

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
      // Nothing left for the poll to do once cleaned or out of attempts.
      // (It keeps running on the home page, which never gets here.)
      if (ok || attempts >= MAX_ATTEMPTS) clearInterval(pollId);
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
  pollId = setInterval(() => {
    if (window.hasPaywall === true && !hasBeenCleaned) {
      cleanPage();
    }
  }, 1000);
})();
