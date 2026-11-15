'use strict';

// Shared page-cleaning routine, loaded in two ways:
// - background.js imports this file and passes the function to
//   chrome.scripting.executeScript. Chrome serializes the function's source,
//   so it must stay self-contained: no references to anything outside its body.
// - For auto mode, popup.js registers this file before content.js in the
//   page's MAIN world, where it defines window.__outlinerClean.
//
// Resolves to true when the page is clean (or already was), false on failure.
globalThis.__outlinerClean = function outlinerClean(isAuto) {
  // chrome.i18n is not available in the MAIN world, hence the inline strings.
  const i18n = {
    en: { unbrickedBy: 'Happily unbricked by', dismiss: 'Dismiss', autoMode: 'auto mode', magic: 'Page successfully unbricked.', triggered: 'Triggering Clean Mode...', triggeredAuto: 'Paywall signal detected! Triggering automatic unbrick...' },
    pt: { unbrickedBy: 'Desbloqueado com sucesso pelo', dismiss: 'Fechar', autoMode: 'modo automático', magic: 'Página desbloqueada com sucesso.', triggered: 'Iniciando Modo de Limpeza...', triggeredAuto: 'Sinal de paywall detectado! Iniciando desbloqueio automático...' },
    es: { unbrickedBy: 'Desbloqueado con éxito por', dismiss: 'Cerrar', autoMode: 'modo automático', magic: 'Página desbloqueada con éxito.', triggered: 'Iniciando Modo de Limpieza...', triggeredAuto: '¡Señal de paywall detectada! Iniciando desbloqueo automático...' },
    de: { unbrickedBy: 'Erfolgreich entsperrt von', dismiss: 'Schließen', autoMode: 'Automatikmodus', magic: 'Seite erfolgreich entsperrt.', triggered: 'Reinigungsmodus wird gestartet...', triggeredAuto: 'Paywall-Signal erkannt! Automatisches Entsperren wird gestartet...' }
  };
  const lang = navigator.language.split('-')[0];
  const t = i18n[lang] || i18n.en;

  // The banner doubles as the "already cleaned" marker.
  if (document.getElementById('outliner-bar')) return Promise.resolve(true);

  console.log(`🔓 Outliner: ${isAuto ? t.triggeredAuto : t.triggered}`);

  return fetch(location.href)
    .then(response => response.text())
    .then(html => {
      // Check again in case another run finished while this one was fetching.
      if (document.getElementById('outliner-bar')) return true;

      document.documentElement.innerHTML = html;

      const style = document.createElement('style');
      style.id = 'outliner-styles';
      style.textContent = `
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

      const banner = document.createElement('div');
      banner.id = 'outliner-bar';
      banner.innerHTML = `
        <span>🔓 ${t.unbrickedBy} <strong>Outliner</strong>${isAuto ? ` (${t.autoMode})` : ''}</span>
        <button type="button">${t.dismiss}</button>
      `;
      document.body.prepend(banner);

      banner.querySelector('button').onclick = () => {
        banner.remove();
        document.body.style.paddingTop = '0px';
      };

      console.log(`🔓 Outliner: ${t.magic}`);
      return true;
    })
    .catch(err => {
      console.error('🔓 Outliner: Error fetching page content:', err);
      return false;
    });
};
