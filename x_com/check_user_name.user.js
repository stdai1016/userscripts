// ==UserScript==
// @name        Check User Name
// @description Check case of username in URL
// @version     0.1.0c
// @license     MIT
// @homepage    https://github.com/stdai0a10
// @namespace   https://github.com/stdai0a10/userscripts/x_com
// @icon        https://icons.duckduckgo.com/ip2/x.com.ico
// @match       https://x.com/*
// @exclude     https://x.com/account*
// @exclude     https://x.com/compose/*
// @exclude     https://x.com/home
// @exclude     https://x.com/explore
// @exclude     https://x.com/i/*
// @exclude     https://x.com/notifications
// @exclude     https://x.com/privacy
// @exclude     https://x.com/search*
// @exclude     https://x.com/settings*
// @exclude     https://x.com/tos
// @grant       none
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  const P_PATH_TWEET = /^\/(\w+)\/status\/(\d+)(?:\/(\w+)\/(\d+))?/;
  const P_URL_USER = /^https:\/\/(?:mobile\.|)x\.com\/(\w+)?/;
  const S_TWEET = '[data-testid="tweet"]:not(.r-1loqt21)';
  const S_USER_AVATAR = '[data-testid="Tweet-User-Avatar"]';
  const S_USER_JOIN_DATE = 'a[data-testid="UserJoinDate"]';

  const getUserName = async () => {
    await sleep(1000);
    const link = location.pathname.match(P_PATH_TWEET)
      ? await element(`${S_TWEET} ${S_USER_AVATAR} a[role="link"]`)
      : await element(S_USER_JOIN_DATE);
    return (link?.href || location.href).match(P_URL_USER)?.[1] || '';
  };

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const element = async (selectors, tries = 10, wait = 500) => {
    const node = document.querySelector(selectors);
    return node || !tries
      ? node
      : sleep(wait).then(() => element(selectors, tries - 1, wait));
  };

  const match = location.href.match(P_URL_USER);
  if (match && match[1] !== 'i') {
    getUserName().then((user) => {
      if (user && match[1] !== user) {
        console.debug(`replace name to "${user}"`);
        const url = location.href.replace(`/${match[1]}`, `/${user}`);
        window.history.replaceState(null, document.title, url);
      }
    });
  }
})();
