'use strict';

(function() {
  let hasBeenCleaned = false;

  function cleanPage() {
    if (hasBeenCleaned || document.getElementById('outliner-bar')) return;
    hasBeenCleaned = true;

    console.log('🔓 Outliner: Paywall signal detected! Triggering automatic unbrick...');

    fetch(location.href)
      .then(response => response.text())
      .then(html => {
        document.documentElement.innerHTML = html;

        const style = document.createElement('style');

        style.id = 'outliner-styles';
        style.innerHTML = `
          html, body {
            overflow: auto !important;
            height: auto !important;
            position: static !important;
            display: block !important;
          }
          #outliner-bar {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            color: #fff;
            padding: 14px 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 2147483647;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.4s ease-out;
          }
          @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
          #outliner-bar button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.4);
            color: #fff;
            cursor: pointer;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 11px;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          #outliner-bar button:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }
          body { padding-top: 60px !important; }
          * { white-space: normal !important; }
        `;
        document.head.appendChild(style);

        // Create the Outliner banner
        const banner = document.createElement('div');
        banner.id = 'outliner-bar';
        banner.innerHTML = `
          <span>🔓 Happily unbricked by <strong>Outliner</strong> (auto mode)</span>
          <button id="close-outliner">Dismiss</button>
        `;
        document.body.prepend(banner);

        document.getElementById('close-outliner').onclick = () => {
          banner.remove();
          document.body.style.paddingTop = '0px';
        };

        console.log('🔓 Outliner: Page successfully unbricked.');
      })
      .catch(err => {
        hasBeenCleaned = false; // Allow retry on failure
        console.error('🔓 Outliner: Error fetching page content:', err);
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

  setInterval(() => {
    if (window.hasPaywall === true && !hasBeenCleaned) {
      cleanPage();
    }
  }, 1000);
})();
