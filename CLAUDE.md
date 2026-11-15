# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Outliner is a Chrome Manifest V3 extension written in plain JavaScript (no build step, no package manager, no tests, no linter). It "unbricks" pages with client-side paywalls or overlays: it re-fetches the current URL, swaps the original server HTML into the document, and injects CSS that restores scrolling.

## Development

- **Run locally:** open `chrome://extensions`, turn on Developer mode, choose "Load unpacked" and pick the repo root. After editing, click reload on the extension card. Changes to `content.js` / `clean.js` only apply to pages loaded afterwards. Chrome won't load the folder if any file or directory name starts with `_` (only `_locales` is allowed).
- **Package:** zip the extension files into `outliner-extension.zip` at the repo root (the zip is gitignored). Leave out `images/`, `README.md`, `CLAUDE.md`, `jsconfig.json` and `.git`.
- **Version:** bump `version` in `manifest.json` and add an entry to the History section of `README.md` (newest first, with a `[DD-Mon-YYYY]` date).

## Architecture

All cleaning happens in **`clean.js`**, which defines one self-contained function, `globalThis.__outlinerClean(isAuto)`. It fetches `location.href`, replaces `document.documentElement.innerHTML`, injects `#outliner-styles` and `#outliner-banner-space`, and prepends the `#outliner-bar` banner. It resolves to `true` when the page is clean and `false` on failure. The banner also serves as the "already cleaned" marker. The function always runs in the page's **MAIN world**, and it is loaded in two ways:

1. **Manual unbrick:** `popup.js` sends `{action: 'manual_unbrick', tabId, url}`. `background.js` (a module service worker) imports `clean.js` and passes the function as `func` to `chrome.scripting.executeScript`. Chrome serializes the function's source, so it **must not reference anything outside its own body**. This is also why its translated strings are inline (`chrome.i18n` isn't available in the MAIN world either). `executeScript` waits for the returned promise, and the toolbar badge stays up until it settles.
2. **Auto mode:** the popup toggle requests the optional host permission `*://<hostname>/*` at runtime, then calls `chrome.scripting.registerContentScripts` with id `outliner-<hostname with dots→dashes>`, `js: ['clean.js', 'content.js']`, `world: 'MAIN'`, `runAt: 'document_start'` and `persistAcrossSessions: true`. Whether auto mode is on is worked out from `getRegisteredContentScripts()`; no storage is used. `content.js` watches `window.hasPaywall === true` (a setter trap plus a 1s poll). It skips the site's root path, and it gives up after 3 failed attempts.

Ad removal is separate from unbricking: `clean.js` also defines `__outlinerRemoveAds()`, which removes elements whose id contains `ad-container` at the start or after a non-letter (so `thread-container` survives). Manual unbrick runs it after the swap. Auto mode runs it on **every** page of the site, home page included and with or without `hasPaywall`: on `DOMContentLoaded`, on `load`, and again after a successful unbrick.

Notes:
- If the auto-mode file list changes, update it in both `popup.js` and `AUTO_SCRIPT_FILES` in `background.js`. Existing registrations persist across updates, so the `onInstalled` handler in `background.js` migrates them.
- Popup and manifest strings come from `_locales/*/messages.json` (`en` is the default locale; there are also `de`, `es`, `pt_BR` and `pt_PT`). When you add a message key, add it to every locale file.
