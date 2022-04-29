// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { getCurrentTranslation } from './translations.js';

const services = [
  {
    id: '12ft',
    name: '12ft.io',
    icon: '/assets/12ft.png',
    website: 'https://12ft.io',
    url: 'https://12ft.io/proxy?q=',
    outline: (service, url) => {
      if (/(http(s?)):\/\//i.test(url)) url = url.replace(/(http(s?)):\/\//i, '');
      return `${service.url}${encodeURIComponent(url)}`;
    }
  },
  {
    id: 'outlinetts',
    name: 'OutlineTTS',
    icon: '/assets/outlinetts.ico',
    website: 'https://outlinetts.com',
    url: 'https://outlinetts.com/article',
    outline: (service, url) => {
      const uri = new URL(url);
      const protocol = uri.protocol.slice(0, -1);

      url = url.replace(/(http(s?)):\/\//i, '');
      return `${service.url}/${protocol}/${url}`;
    }
  }
];

// user's options
const options = { };

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.outlinerOptions?.newValue)
    Object.assign(options, changes.outlinerOptions.newValue);
});

export function getOptions() {
  const key = 'outlinerOptions';

  return new Promise((resolve, reject) =>
    chrome.storage.sync.get(key, data => {
      if (chrome.runtime.lastError)
        reject(Error(chrome.runtime.lastError.message));
      else {
        Object.assign(options, data.outlinerOptions);
        resolve(data.outlinerOptions);
      }
    })
  );
}

export function getCurrentService() {
  const fallbackService = services[0];
  const service = services.find(x => x.id === options.currentService);

  return service || fallbackService;
}

function setOptions(callbackFn) {
  const outlinerOptions = {};
  outlinerOptions.outlinerOptions = options;

  chrome.storage.sync.set(outlinerOptions, callbackFn);
}

export function setCurrentService(service, callbackFn) {
  options.currentService = service.id;
  setOptions(callbackFn);

  buildContextMenus();
}

export function setOpenInNewTab(openInNewTab) {
  options.openInNewTab = openInNewTab;
  setOptions();
}

export function getServicesList() {
  const currentService = getCurrentService();
  services.forEach(s => s.default = (s.id === currentService.id));

  return services;
}

export function linkTitle(service) {
  const translation = getCurrentTranslation();
  return translation.link(service.name);
}

export function pageTitle(service) {
  const translation = getCurrentTranslation();
  return translation.page(service.name);
}

export function buildContextMenus() {
  chrome.contextMenus.removeAll(() => {
    const service = getCurrentService();

    chrome.contextMenus.create({
      id: 'outliner-default-link',
      title: linkTitle(service),
      contexts: ['link'],
    });

    chrome.contextMenus.create({
      id: 'outliner-default-page',
      title: pageTitle(service),
      contexts: ['page'],
    });
  });
}

chrome.contextMenus.onClicked.addListener((info) => {
  const service = getCurrentService();

  switch (info.menuItemId) {
    case 'outliner-default-link':
      outlineThis(service, info.linkUrl);
      break;

    case 'outliner-default-page':
      outlineThis(service, info.pageUrl);
      break;
  }
});

function setOutlineInit(url) {
  chrome.action.setBadgeBackgroundColor({color: 'gray'});
  chrome.action.setBadgeText({text: '...'});
  chrome.action.setTitle({title: `Outlining [${url}]`});
}

function setOutlineComplete() {
  chrome.action.setBadgeText({text: ''});
  chrome.action.setTitle({title: ''});
}

export function outlineThis(service, url) {
  if (!url || (url.length == 0) || !/^http(s)?:\/\//i.test(url) || (url.substring(0, service.url.length) == service.url))
    return;

  const outlineUrl = service.outline(service, url);

  setOutlineInit(url);

  if (options.openInNewTab)
    chrome.tabs.create({url: outlineUrl}, () => setOutlineComplete());
  else
    chrome.tabs.update(null, {url: outlineUrl}, () => setOutlineComplete());
}
