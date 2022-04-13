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
      const protocol = uri.getProtocol();

      url = url.replace(/(http(s?)):\/\//i, '');
      return `${service.url}/${protocol}/${url}`;
    }
  }
];

// user's options
const options = {};

chrome.storage.sync.get('options', (data) => {
  Object.assign(options, data.options);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.options) Object.assign(options, changes.options);
});

export function getServicesList() {
  const currentService = getCurrentService();
  services.forEach(s => s.default = (s.name === currentService.name));

  return services;
}

export function getServiceByName(name) {
  const fallbackService = services[0];
  const service = services.find(x => x.name === name);

  return service || fallbackService;
}

export function getCurrentService() {
  const fallbackServiceName = '12ft.io';
  return getServiceByName(options.currentService || fallbackServiceName);
}

export function setCurrentService(serviceName, callbackFn) {
  options.currentService = serviceName;
  buildContextMenus();

  chrome.storage.sync.set({ 'options': options }, callbackFn);
}

export function linkTitle(service) {
  const translation = getCurrentTranslation();
  return translation.link(service.name);
}

export function pageTitle(service) {
  const translation = getCurrentTranslation();
  return translation.page(service.name);
}

export function buildContextMenus () {
  chrome.contextMenus.removeAll(() => {
    // context-menu default
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
  chrome.action.setBadgeBackgroundColor({ color: 'gray' });
  chrome.action.setBadgeText({ text: '...' });
  chrome.action.setTitle({ title: `Outline'ing [${url}]` });
}

function setOutlineComplete() {
  chrome.action.setBadgeText({ text: '' });
  chrome.action.setTitle({ title: '' });
}

export function outlineThis(service, url) {
  console.log(`[Outliner] outlineThis(${service.url}/${url})`);

  if (!url || (url.length == 0) || !/^http(s)?:\/\//i.test(url) || (url.substring(0, service.url.length) == service.url))
    return;

  setOutlineInit(url);

  chrome.tabs.create({ url: service.outline(service, url) }, () => setOutlineComplete());
}
