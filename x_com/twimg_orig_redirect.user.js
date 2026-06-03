/** twimg:orig Redirect - Go to orignal size URL of Twitter image
 *  @note The legacy format is deprecated
 */
// ==UserScript==
// @name        twimg:orig Redirect
// @description Go to orignal size URL of Twitter image
// @version     0.3.3a
// @license     MIT
// @homepage    https://github.com/stdai0a10
// @namespace   https://github.com/stdai0a10/userscripts/x_com
// @match       https://pbs.twimg.com/media/*
// @run-at      document-start
// @grant       none
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  const fmtLegacy = window.localStorage.getItem('fmtLegacy');
  const f = fmtLegacy ? ['.', ':'] : ['?format=', '&name='];
  const href = window.location.href;
  const m = href.match(
    /^(https?:\/\/pbs\.twimg\.com\/media\/\w+)(?:\?(?:[\w=]+&)*format=|\.)(jpg|png)/
  );
  const url = m[1] + f[0] + m[2] + f[1] + 'orig';

  if (window.sessionStorage.getItem('url') !== url && url !== href) {
    window.sessionStorage.setItem('url', url);
    // left history every time with this way
    const a = document.createElement('A');
    a.href = url;
    a.click();
  }
})();
