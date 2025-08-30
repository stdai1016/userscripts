// ==UserScript==
// @name         Clear View
// @namespace    https://github.com/stdai1016/userscripts/outlook
// @version      2025-08-24
// @description  Clear View for Outlook Web
// @match        https://outlook.live.com/mail/*
// @icon         https://icons.duckduckgo.com/ip2/live.com.ico
// @license      MIT
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  const style = String.raw`
    #MainModule .LBktY > .GssDD { display: none !important }
    /* .yg0l0, .cbNn0, { font-weight: 900; background-color: var(--themeLighter);} */
    .DLvHz { background-color: var(--messageWebWarning) !important }
  `;

  GM_addStyle(style);
})();
