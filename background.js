// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { getCurrentService, buildContextMenus, outlineThis } from './services.js';

buildContextMenus();

/*
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
*/