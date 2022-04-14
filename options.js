// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { initServices, getOptions, getServicesList, setCurrentService, setOpenInNewTab } from './services.js';
import { getCurrentTranslation } from './translations.js';

function buildServiceDiv(translation, service) {
  const divIcon = document.createElement('div');
  divIcon.className = 'service-item-icon';

  const imgIcon = document.createElement('img');
  divIcon.appendChild(imgIcon);

  imgIcon.src = service.icon;
  imgIcon.alt = service.name;
  imgIcon.title = service.name;

  const divTitle = document.createElement('div');
  divTitle.className = 'service-item-title';
  divTitle.textContent = service.name;

  // set as default option
  const divOptionsSetDefault = document.createElement('div');
  divOptionsSetDefault.className = 'service-item-options';

  if (!service.default) {
    const anchorOptionsSetDefault = document.createElement('a');
    divOptionsSetDefault.appendChild(anchorOptionsSetDefault);

    divOptionsSetDefault.classList.add('hyperlink');

    anchorOptionsSetDefault.textContent = translation.setDefault;
    anchorOptionsSetDefault.onclick = () => setAsDefault(service);
  }
  else {
    divOptionsSetDefault.textContent = translation.setDefault;
  }

  // visit website option
  const divOptionsVisitWebsite = document.createElement('div');
  divOptionsVisitWebsite.className = 'service-item-options hyperlink';
  divOptionsVisitWebsite.textContent = translation.visitWebsite;
  divOptionsVisitWebsite.onclick = () => visitWebsite(service);

  const imgIconExternal = document.createElement('img');
  divOptionsVisitWebsite.appendChild(imgIconExternal);

  imgIconExternal.src = '/assets/arrow-up-right-from-square-solid.svg';
  imgIconExternal.className = 'service-item-icon-external';
  imgIconExternal.alt = service.name;
  imgIconExternal.title = service.name;

  // options container
  const divContainer = document.createElement('div');
  divContainer.className = 'service-item-container';

  divContainer.appendChild(divIcon);
  divContainer.appendChild(divTitle);
  divContainer.appendChild(divOptionsSetDefault);
  divContainer.appendChild(divOptionsVisitWebsite);

  return divContainer;
}

function buildServicesList() {
  const translation = getCurrentTranslation();
  const services = getServicesList();

  document.getElementById('services-list').innerHTML = '';

  services.forEach(s => {
    const divContainer = buildServiceDiv(translation, s);
    document.getElementById('services-list').appendChild(divContainer);
  });
}

function buildAdditionalConfigurations() {
  const options = getOptions();
  const translation = getCurrentTranslation();

  document.getElementById('open-new-tab-label').innerHTML = translation.openInNewTab;
  document.getElementById('open-new-tab').checked = options.openInNewTab;
  document.getElementById('open-new-tab').onchange = () => setOpenInNewTab(document.getElementById('open-new-tab').checked);
}

function setLabels() {
  const translation = getCurrentTranslation();

  document.getElementById('services-title').innerText = translation.services;
  document.getElementById('additional-configuration-title').innerText = translation.additionalConfiguration;
  document.getElementById('footer-rate').innerText = translation.rate;
  document.getElementById('footer-email').innerText = translation.email;
}

function setAsDefault(service) {
  setCurrentService(service, () => buildServicesList());
}

function visitWebsite(service) {
  chrome.tabs.create({ url: service.website });
}

document.addEventListener('DOMContentLoaded', () => {
  initServices().then(() => {
    buildServicesList();
    buildAdditionalConfigurations();
    setLabels();
  });
});
