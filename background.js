'use strict';

function setOutlineInit(tabId, url) {
  chrome.action.setBadgeBackgroundColor({ tabId, color: 'gray' });
  chrome.action.setBadgeText({ tabId, text: '...' });
  chrome.action.setTitle({ tabId, title: `Outlining [${url}]` });
}

function setOutlineComplete(tabId) {
  chrome.action.setBadgeText({ tabId, text: '' });
  chrome.action.setTitle({ tabId, title: 'Outliner' });
}

async function cleanPage(tabId, url, isAuto = false) {
  setOutlineInit(tabId, url);

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (isAuto) => {
        const i18n = {
          en: { unbrickedBy: 'Happily unbricked by', dismiss: 'Dismiss', magic: 'Page successfully unbricked.', triggered: 'Triggering Clean Mode...' },
          pt: { unbrickedBy: 'Desbloqueado com sucesso pelo', dismiss: 'Fechar', magic: 'Página desbloqueada com sucesso.', triggered: 'Iniciando Modo de Limpeza...' },
          es: { unbrickedBy: 'Desbloqueado con éxito por', dismiss: 'Cerrar', magic: 'Página desbloqueada con éxito.', triggered: 'Iniciando Modo de Limpieza...' },
          de: { unbrickedBy: 'Erfolgreich entsperrt von', dismiss: 'Schließen', magic: 'Seite erfolgreich entsperrt.', triggered: 'Reinigungsmodus wird gestartet...' }
        };
        const lang = navigator.language.split('-')[0];
        const t = i18n[lang] || i18n.en;

        console.log(`🔓 Outliner: ${t.triggered}`);
        fetch(location.href)
          .then(response => response.text())
          .then(html => {
            // Check again for the banner just in case (to prevent race conditions)
            if (document.getElementById('outliner-bar')) return;

            // Set the new content
            document.documentElement.innerHTML = html;

            const style = document.createElement('style');
            style.id = 'outliner-styles';
            style.innerHTML = `
              html, body { overflow: auto !important; height: auto !important; position: static !important; display: block !important; }
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
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              #outliner-bar button {
                background: rgba(255,255,255,0.2);
                border: 1px solid #fff;
                color: #fff;
                cursor: pointer;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 11px;
                transition: background 0.2s;
              }
              #outliner-bar button:hover {
                background: rgba(255,255,255,0.4);
              }
              body { padding-top: 60px !important; }
              * { white-space: normal !important; }
            `;
            document.head.appendChild(style);

            // Create banner using localized strings
            const banner = document.createElement('div');
            banner.id = 'outliner-bar';
            banner.innerHTML = `
              <span>🔓 ${t.unbrickedBy} <strong>Outliner</strong>${isAuto ? ' (auto)' : ''}</span>
              <button id="close-outliner">${t.dismiss}</button>
            `;
            document.body.prepend(banner);

            document.getElementById('close-outliner').onclick = () => {
              banner.remove();
              document.body.style.paddingTop = '0px';
            };
          });
      },
      args: [isAuto]
    });
  } catch (err) {
    console.error('Outliner error:', err);
  } finally {
    setOutlineComplete(tabId);
  }
}

chrome.action.onClicked.addListener((tab) => {
  const url = tab.url;
  if (!url || !/^http(s)?:\/\//i.test(url)) return;
  cleanPage(tab.id, url, false);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'manual_unbrick') {
    // Manually trigger cleaning for the active tab (provided by popup)
    cleanPage(message.tabId, message.url, false);
  }
});
