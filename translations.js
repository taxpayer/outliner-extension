// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var languages;

const translations = {
  'en': {
    link: (serviceName) => `Open this link on ${serviceName}`,
    page: (serviceName, html = false) => `Open this page on ${(html ? serviceName : stripHtml(serviceName))}`,
    services: 'Available Services',
    additionalConfiguration: 'Additional Configurations',
    setDefault: 'set as default',
    visitWebsite: 'visit website',
    openInNewTab: 'Open in a new tab',
    rate: 'Rate',
    email: 'Email Me',
    openPage: 'Open this page on',
    openLink: 'Open this link on',
  },
  'pt': {
    link: (serviceName) => `Abrir este link em ${serviceName}`,
    page: (serviceName, html = false) => `Abrir esta página em ${(html ? serviceName : stripHtml(serviceName))}`,
    services: 'Serviços Disponíveis',
    additionalConfiguration: 'Configurações Adicionais',
    setDefault: 'tornar padrão',
    visitWebsite: 'visitar website',
    openInNewTab: 'Abrir em uma nova aba',
    rate: 'Avaliar',
    email: 'Escreva-me!',
    openPage: 'Abrir esta página em',
    openLink: 'Abrir este link em',
  },
  'es': {
    link: (serviceName) => `Abrir este enlace en ${serviceName}`,
    page: (serviceName, html = false) => `Abrir esta página en ${(html ? serviceName : stripHtml(serviceName))}`,
    services: 'Servicios Disponibles',
    additionalConfiguration: 'Configuraciones Adicionales',
    setDefault: 'establecer por defecto',
    visitWebsite: 'visita el sitio',
    openInNewTab: 'Abrir en nueva pestaña',
    rate: 'Valorar',
    email: 'Envíeme un email',
    openPage: 'Abrir esta página en',
    openLink: 'Abrir este enlace en',
  },
  'de': {
    link: (serviceName) => `Öffnen diesen Link auf ${serviceName}`,
    page: (serviceName, html = false) => `Öffnen diese Seite auf ${(html ? serviceName : stripHtml(serviceName))}`,
    services: 'Verfügbaren Dienstleistungen',
    additionalConfiguration: 'Weitere Konfigurationen',
    setDefault: 'als Standard einstellen',
    visitWebsite: 'besuche die Website',
    openInNewTab: 'Öffnen in neuem Tab',
    rate: 'Bewerten',
    email: 'Schreib mir',
    openPage: 'Öffnen diese Seite auf',
    openLink: 'Öffnen diesen Link auf',
  },
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
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