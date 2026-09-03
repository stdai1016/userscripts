// ==UserScript==
// @name        Clean URL
// @description Clean URL
// @version     0.1.0
// @homepage    https://github.com/stdai0a10
// @namespace   https://github.com/stdai0a10/userscripts/104
// @icon        https://icons.duckduckgo.com/ip2/104.com.tw.ico
// @match       https://www.104.com.tw/*
// @match       https://pda.104.com.tw/*
// @grant       none
// ==/UserScript==

(function () {
  'use strict';

  const cleanUrl = (url) => url.split('?')[0];

  const cleanAnchors = (element, selectors) => {
    selectors = Array.isArray(selectors) ? selectors : [selectors];
    const anchors = [...element.querySelectorAll(selectors.join(','))];
    if (element.tagName === 'A') anchors.push(element);
    anchors.forEach((a) => (a.href = cleanUrl(a.href)));
  };

  const observePage = (selectors) => {
    const mo = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) cleanAnchors(node, selectors);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    cleanAnchors(document.body, selectors);

    return mo;
  };

  const pages = [
    {
      match: /\/\/www.104.com.tw\/company\/\w+/,
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
    }
  ];

  for (const page of pages) {
    if (!window.location.href.match(page.match)) continue;
    observePage(page.selectors);
    break;
  }
})();
