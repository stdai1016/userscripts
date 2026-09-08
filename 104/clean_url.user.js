// ==UserScript==
// @name        Clean URL
// @description Clean URL
// @version     0.1.1
// @homepage    https://github.com/stdai0a10
// @namespace   https://github.com/stdai0a10/userscripts/104
// @icon        https://icons.duckduckgo.com/ip2/104.com.tw.ico
// @match       https://www.104.com.tw/*
// @match       https://pda.104.com.tw/*
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  /**
   * @callback anchorFilter
   * @param {HTMLAnchorElement} element
   * @returns {boolean}
   */

  /**
   * @param {string} url
   * @returns {string}
   */
  const cleanUrl = (url) => url.split('?')[0];

  /**
   * @param {Element} element
   * @param {string|string[]} selectors anchor selectors
   * @param {anchorFilter|null} filter
   */
  const cleanAnchors = (element, selectors, filter = null) => {
    selectors = Array.isArray(selectors) ? selectors : [selectors];
    const anchors = [...element.querySelectorAll(selectors.join(','))];
    if (element.tagName === 'A') anchors.push(element);

    anchors
      .filter((anchor) => !filter || filter(anchor))
      .forEach((a) => (a.href = cleanUrl(a.href)));
  };

  /**
   * @param {string|string[]} selectors anchor selectors
   * @param {anchorFilter|null} filter
   * @returns {MutationObserver}
   */
  const observePage = (selectors, filter = null) => {
    const mo = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) cleanAnchors(node, selectors, filter);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanAnchors(document.body, selectors, filter);

    return mo;
  };

  const pages = [
    {
      match: /\/\/www.104.com.tw\/company\/\w+/,
      before: () => {
        if (location.search) location.href = cleanUrl(location.href);
      },
      selectors: [
        '.jb-container .joblist .job-list-container a[class|="info"]',
        '.jb-container .sidebar a'
      ]
    },
    {
      match: /\/\/www.104.com.tw\/job\/apply\/done/,
      selectors: '.apply-done__body .jobs-area .job-card a'
    },
    {
      match: /\/\/www.104.com.tw\/job\/\w+/,
      before: () => {
        if (location.search) location.href = cleanUrl(location.href);
      },
      selectors: [
        '.jb-container .sidebar .browse-history a',
        '.jb-container .sidebar .similar-jobs a'
      ]
    },
    {
      match: /\/\/pda.104.com.tw\/work\/mate\/list\//,
      selectors: '.jb-container--full .job-list-container a[class|="info"]'
    },
    {
      match: /\/\/pda.104.com.tw\/applyRecord\//,
      selectors: [
        '.apply-records__data a.apply-records-list__info__title',
        '.apply-records__data a.apply-records-list__info__cust',
        '.recommend-jobs .job-list-container a[class|="info"]'
      ]
    },
    {
      match: /\/\/pda.104.com.tw\//,
      selectors: ['.jb-container--none .job-list-container a[class|="info"]']
    }
  ];

  for (const page of pages) {
    if (!window.location.href.match(page.match)) continue;
    if (typeof page.before === 'function') page.before();
    observePage(page.selectors, page.filter);
    break;
  }
})();
