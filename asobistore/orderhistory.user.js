// ==UserScript==
// @name         Orderhistory Helper
// @description  Help to navigate to product pages from order history
// @version      2025-11-28
// @license      MIT
// @homepage     https://github.com/stdai1016
// @namespace    https://github.com/stdai1016/userscripts/asobistore
// @icon         https://icons.duckduckgo.com/ip2/asobistore.jp.ico
// @match        https://shop.asobistore.jp/mypage/orderhistory/detail/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const idCells = document.querySelectorAll('table.cart_table td.td04');
  [...idCells].forEach((cell) => {
    cell.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = cell.innerText.trim();
      const href = `https://shop.asobistore.jp/products/detail/${text}`;
      console.debug(`Navigating to: ${href}`);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    });
  });
})();
