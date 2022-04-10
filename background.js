// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const services = [
  {
    name: '12ft.io',
    website: 'https://12ft.io',
    url: 'https://12ft.io/proxy?q=',
    outline: (service, url) => {
      if (/(http(s?)):\/\//i.test(url)) url = url.replace(/(http(s?)):\/\//i, '');
      return `${service.url}${encodeURIComponent(url)}`;
    }
  }
];

const currentServiceName = '12ft.io';

function getServiceByName(name) {
  return services.find(x => x.name === name);
}

function linkTitle(service, languages) {
  if (languages && (languages.length > 0)) {
    const language = languages[0];

    switch (language) {
      case 'pt':
      case 'pt-BR':
      case 'pt-PT':
        return `Abrir este link no ${service.name}`;

      case 'de':
        return `Öffnen diesen Link auf ${service.name}`;

      case 'es':
        return `Abrir este enlace en ${service.name}`;
    }
  }

  return `Open this link on ${service.name}`;
}

function pageTitle(service, languages) {
  if (languages && (languages.length > 0)) {
    const language = languages[0];

    switch (language) {
      case 'pt':
      case 'pt-BR':
      case 'pt-PT':
        return `Abrir esta página no ${service.name}`;

      case 'de':
        return `Öffnen diese Seite auf ${service.name}`;

      case 'es':
        return `Abrir esta página en ${service.name}`;
    }
  }

  return `Open this page on ${service.name}`;
}

function setInit(url) {
  chrome.action.setBadgeBackgroundColor({ color: 'gray' });
  chrome.action.setBadgeText({ text: '...' });
  chrome.action.setTitle({ title: `Outline'ing [${url}]` });
}

function setComplete() {
  chrome.action.setBadgeText({ text: '' });
  chrome.action.setTitle({ title: '' });
}

function outlineThis(service, url) {
  console.log(`[Outliner] outlineThis(${service.url}/${url})`);

  if (!url || (url.length == 0) || !/^http(s)?:\/\//i.test(url) || (url.substring(0, service.url.length) == service.url))
    return;

  setInit(url);

  chrome.tabs.create({ url: service.outline(service, url) }, () => setComplete());
}

chrome.i18n.getAcceptLanguages(languages => {
  const service = getServiceByName(currentServiceName);

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      title: linkTitle(service, languages),
      id: 'outlinerExt',
      contexts: ['link'],
    });

    chrome.contextMenus.create({
      title: pageTitle(service, languages),
      id: 'outlinerExtPage',
      contexts: ['page'],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  console.log(`[Outliner] contextMenus.onClicked(info): ${JSON.stringify(info)}`);

  const service = getServiceByName(currentServiceName);

  switch (info.menuItemId) {
    case 'outlinerExt':
      outlineThis(service, info.linkUrl);
      break;

    case 'outlinerExtPage':
      outlineThis(service, info.pageUrl);
      break;
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    console.log(`[Outliner] action.onClicked(tabs): ${JSON.stringify(tabs)}`);

    const service = getServiceByName(currentServiceName);

    if (tabs && (tabs.length > 0)) {
      const url = tabs[0].url;
      outlineThis(service, url);
    }
  });
});

