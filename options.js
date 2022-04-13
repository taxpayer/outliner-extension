// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { getServicesList, getServiceByName, setCurrentService } from './services.js';
import { getCurrentTranslation } from './translations.js';

function buildServiceDiv (translation, service) {
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
    anchorOptionsSetDefault.onclick = () => setAsDefault(service.name);
  }
  else {
    divOptionsSetDefault.textContent = translation.setDefault;
  }

  // visit website option
  const divOptionsVisitWebsite = document.createElement('div');
  divOptionsVisitWebsite.className = 'service-item-options hyperlink';
  divOptionsVisitWebsite.textContent = translation.visitWebsite;
  divOptionsVisitWebsite.onclick = () => visitWebsite(service.name);

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

function buildServicesList () {
  const translation = getCurrentTranslation();
  const services = getServicesList();

  document.getElementById('services-list').innerHTML = '';

  services.forEach(s => {
    const divContainer = buildServiceDiv(translation, s);
    document.getElementById('services-list').appendChild(divContainer);
  });
}

function setLabels() {
  const translation = getCurrentTranslation();

  document.getElementById('services-title').innerText = translation.services;
  document.getElementById('additional-configuration-title').innerText = translation.additionalConfiguration;
}

function setAsDefault(serviceName) {
  setCurrentService(serviceName, () => buildServicesList());
}

function visitWebsite(serviceName) {
  const service = getServiceByName(serviceName);
  if (service) chrome.tabs.create({ url: service.website });
}

// Saves options to chrome.storage
function save_options() {
	var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;

  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor,
  },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get(
		{
			favoriteColor: 'red',
			likesColor: true,
		},
		function (items) {
			document.getElementById('color').value = items.favoriteColor;
			document.getElementById('like').checked = items.likesColor;
		}
	);
}

document.addEventListener('DOMContentLoaded', () => {
  buildServicesList();
  setLabels();
});

// document.getElementById('save').addEventListener('click', save_options);
