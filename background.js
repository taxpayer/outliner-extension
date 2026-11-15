'use strict';

import './clean.js'; // Defines globalThis.__outlinerClean

const AUTO_SCRIPT_FILES = ['clean.js', 'content.js'];

function setOutlineInit(tabId, url) {
  chrome.action.setBadgeBackgroundColor({ tabId, color: 'gray' });
  chrome.action.setBadgeText({ tabId, text: '...' });
  chrome.action.setTitle({ tabId, title: chrome.i18n.getMessage('titleOutlining', [url]) });
}

function setOutlineComplete(tabId) {
  chrome.action.setBadgeText({ tabId, text: '' });
  chrome.action.setTitle({ tabId, title: 'Outliner' });
}

async function cleanPage(tabId, url, isAuto = false) {
  setOutlineInit(tabId, url);

  try {
    // executeScript waits for the returned promise, so the badge stays up
    // until the page has actually been replaced.
    await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: globalThis.__outlinerClean,
      args: [isAuto]
    });
  } catch (err) {
    console.error('Outliner error:', err);
  } finally {
    setOutlineComplete(tabId);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'manual_unbrick') {
    // Manually trigger cleaning for the active tab (provided by popup)
    cleanPage(message.tabId, message.url, false);
  }
});

// Auto-unbrick registrations made before clean.js existed only list
// content.js, which now depends on clean.js being loaded first.
chrome.runtime.onInstalled.addListener(async () => {
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    const outdated = scripts.filter(s => s.id.startsWith('outliner-') && !s.js?.includes('clean.js'));
    if (outdated.length) {
      await chrome.scripting.updateContentScripts(
        outdated.map(s => ({ id: s.id, js: AUTO_SCRIPT_FILES }))
      );
    }
  } catch (err) {
    console.error('Outliner: failed to migrate auto-unbrick scripts:', err);
  }
});
