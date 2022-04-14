// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

import { initServices, buildContextMenus } from './services.js';

initServices().then(() => buildContextMenus());
