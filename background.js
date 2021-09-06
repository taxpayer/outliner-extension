// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function linkTitle(languages) {
  if (languages && (languages.length > 0)) {
    const language = languages[0];
    
    switch (language) {
      case 'pt':
      case 'pt-BR':
      case 'pt-PT':
        return 'Abrir este link no Outline.com';
      
      case 'de':
        return 'Öffnen diesen Link auf Outline.com';
      
      case 'es':
        return 'Abrir este enlace en Outline.com';
    }
  }
  
  return 'Open this link on Outline.com';
}

function pageTitle(languages) {
  if (languages && (languages.length > 0)) {
    const language = languages[0];
    
    switch (language) {
      case 'pt':
      case 'pt-BR':
      case 'pt-PT':
        return 'Abrir esta página no Outline.com';
      
      case 'de':
        return 'Öffnen diese Seite auf Outline.com';
      
      case 'es':
        return 'Abrir esta página en Outline.com';
    }
  }
  
  return 'Open this page on Outline.com';
}

function setInit(url) {
  chrome.action.setBadgeBackgroundColor({ color: 'gray' });
  chrome.action.setBadgeText({ text: '...' });
  chrome.action.setTitle({ title: "Outline'ing [" + url + "]" });
}

function setComplete() {
  chrome.action.setBadgeText({ text: '' });
  chrome.action.setTitle({ title: '' });
}

function outlineThis(url) {
  console.log('[Outliner] outlineThis(' + url + ')');
  
  const outlineUrl = 'https://outline.com/';
  
  if (!url || (url.length == 0) || !/^http(s)?:\/\//i.test(url) || (url.substring(0, outlineUrl.length) == outlineUrl))
    return;
  
  setInit(url);
  
  chrome.tabs.create({ url: outlineUrl + url }, () => setComplete());
}

chrome.i18n.getAcceptLanguages(languages => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      title: linkTitle(languages),
      id: 'outlinerExt',
      contexts: ['link'],
    });
    
    chrome.contextMenus.create({
      title: pageTitle(languages),
      id: 'outlinerExtPage',
      contexts: ['page'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  console.log(`[Outliner] contextMenus.onClicked(info): ${JSON.stringify(info)}`);
  
  switch (info.menuItemId) {
    case 'outlinerExt':
      outlineThis(info.linkUrl);
      break;
      
    case 'outlinerExtPage':
      outlineThis(info.pageUrl);
      break;
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    console.log(`[Outliner] action.onClicked(tabs): ${JSON.stringify(tabs)}`);
    
    if (tabs && (tabs.length > 0)) {
      const url = tabs[0].url;
      outlineThis(url);
    }
  });
});

