// ==UserScript==
// @name        Tweet Grid Layout
// @description Display tweet images in a grid layout
// @version     0.1.0
// @license     MIT
// @homepage    https://github.com/stdai0a10
// @namespace   https://github.com/stdai0a10/userscripts/x_com
// @icon        https://icons.duckduckgo.com/ip2/x.com.ico
// @match       *://x.com/*
// @match       *://mobile.x.com/*
// @match       *://twitter.com/*
// @match       *://mobile.twitter.com/*
// @grant       GM_addStyle
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';
  const style = String.raw`
  article[data-testid="tweet"]
  [data-testid="ScrollSnap-SwipeableList"]
  {
    overflow: hidden;
  }

  article[data-testid="tweet"]
  [data-testid="ScrollSnap-SwipeableList"]
  [data-testid="ScrollSnap-List"]
  {
    display: grid;
    grid-auto-rows: minmax(0,100%);
    grid-template-columns: calc(50% - 2px) calc(50% - 2px);
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  article[data-testid="tweet"]
  [data-testid="ScrollSnap-nextButtonWrapper"],
  article[data-testid="tweet"]
  [data-testid="ScrollSnap-prevButtonWrapper"]
  {
    display: none !important;
  }
  `;

  window.GM_addStyle(style);
})();
