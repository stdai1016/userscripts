/**
 *  隱藏 Google 搜尋結果中的 AI 摘要
 */
// ==UserScript==
// @name         No AI Summary
// @description  Hide AI Summary in search results
// @version      2025-08-31
// @license      MIT
// @namespace    https://github.com/stdai1016/userscripts/google
// @match        *://google.com/search?*
// @match        *://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    #Odp5De { display: none !important;}
  `);
})();
