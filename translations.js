// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var languages;

const translations = {
  'en': {
    link: (serviceName) => `Open this link on ${serviceName}`,
    page: (serviceName) => `Open this page on ${serviceName}`,
    services: 'Services',
    additionalConfiguration: 'Additional Configurations',
    setDefault: 'set as default',
    visitWebsite: 'visit website',
  },
  'pt': {
    link: (serviceName) => `Abrir este link no ${serviceName}`,
    page: (serviceName) => `Abrir esta página no ${serviceName}`,
    services: 'Serviços',
    additionalConfiguration: 'Configurações Adicionais',
    setDefault: 'tornar padrão',
    visitWebsite: 'visitar website',
  },
  'es': {
    link: (serviceName) => `Abrir este enlace en ${serviceName}`,
    page: (serviceName) => `Abrir esta página en ${serviceName}`,
    services: 'Servicios',
    additionalConfiguration: 'Configuraciones Adicionales',
    setDefault: 'establecer por defecto',
    visitWebsite: 'visita el sitio',
  },
  'de': {
    link: (serviceName) => `Öffnen diesen Link auf ${serviceName}`,
    page: (serviceName) => `Öffnen diese Seite auf ${serviceName}`,
    services: 'Dienstleistungen',
    additionalConfiguration: 'Weitere Konfigurationen',
    setDefault: 'als Standard einstellen',
    visitWebsite: 'besuche die Website',
  },
}

export function getCurrentTranslation() {
  var language = (languages && (languages.length > 0)) ? languages[0] : 'en';

  switch (language) {
    case 'pt':
    case 'pt-BR':
    case 'pt-PT':
      language = 'pt';
      break;
  }

  const fallbackLanguage = translations['en'];
  const translation = translations[language];

  return translation || fallbackLanguage;
}

chrome.i18n.getAcceptLanguages(l => languages = l);