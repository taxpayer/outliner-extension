'use strict';

document.addEventListener('DOMContentLoaded', async () => {
  const btnUnbrick = document.getElementById('btn-unbrick');
  const btnAuto = document.getElementById('btn-auto');
  const statusText = document.getElementById('status-text');
  const domainText = document.getElementById('current-domain');
  const autoText = document.getElementById('auto-text');
  const autoIcon = document.getElementById('auto-icon');

  // 1. Get current active tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Set static translations
  document.getElementById('unbrick-text').textContent = chrome.i18n.getMessage('btnUnbrick');
  document.getElementById('footer-text').textContent = chrome.i18n.getMessage('footerNotice');

  if (!tab || !tab.url.startsWith('http')) {
    btnUnbrick.disabled = true;
    btnAuto.disabled = true;
    domainText.textContent = 'Invalid site';
    return;
  }

  const url = new URL(tab.url);
  const hostname = url.hostname;
  const originMatch = `*://${hostname}/*`;
  
  domainText.textContent = hostname;

  // 2. Check if this domain is already auto-enabled
  let isEnabled = false;
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    isEnabled = scripts.some(s => s.matches.includes(originMatch));
  } catch (e) {
    console.error('Error checking registered scripts:', e);
  }

  function updateUI(active) {
    isEnabled = active;
    if (active) {
      statusText.textContent = chrome.i18n.getMessage('statusActive');
      statusText.style.color = '#4ade80';
      autoText.textContent = chrome.i18n.getMessage('btnDisableAuto');
      autoIcon.textContent = '🚫';
      btnAuto.classList.add('active');
    } else {
      statusText.textContent = chrome.i18n.getMessage('statusNotActive');
      statusText.style.color = '';
      autoText.textContent = chrome.i18n.getMessage('btnEnableAuto');
      autoIcon.textContent = '⚙️';
      btnAuto.classList.remove('active');
    }
  }

  updateUI(isEnabled);

  // 3. Button Clean Page Once
  btnUnbrick.onclick = async () => {
    btnUnbrick.disabled = true;
    btnUnbrick.textContent = chrome.i18n.getMessage('working');
    
    // Send message to background to execute cleanPage on activeTab
    chrome.runtime.sendMessage({ 
      action: 'manual_unbrick', 
      tabId: tab.id, 
      url: tab.url 
    });
    
    // Close popup soon
    setTimeout(() => window.close(), 1000);
  };

  // 4. Button Toggle Auto-Unbrick
  btnAuto.onclick = async () => {
    if (!isEnabled) {
      // Toggle ON: Request permission first (required for registerContentScripts)
      try {
        const granted = await chrome.permissions.request({ origins: [originMatch] });
        if (granted) {
          // Register content script dynamically for this domain
          const scriptId = `outliner-${hostname.replace(/\./g, '-')}`;
          
          await chrome.scripting.registerContentScripts([{
            id: scriptId,
            js: ['content.js'],
            matches: [originMatch],
            runAt: 'document_start',
            world: 'MAIN',
            persistAcrossSessions: true
          }]);
          
          updateUI(true);
        }
      } catch (err) {
        console.error('Failed to enable auto-unbrick:', err);
        alert('Error: ' + err.message);
      }
    } else {
      // Toggle OFF: Unregister
      try {
        const scriptId = `outliner-${hostname.replace(/\./g, '-')}`;
        await chrome.scripting.unregisterContentScripts({ ids: [scriptId] });
        
        // Optionally keep permission (Chrome doesn't easily allow optional permission removal via API without origin)
        updateUI(false);
      } catch (err) {
        console.error('Failed to disable auto-unbrick:', err);
      }
    }
  };
});
