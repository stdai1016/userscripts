// ==UserScript==
// @name         GM_fetch
// @description  GM_fetch
// @version      0.1.0a
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/**
 *  @param {RequestInfo} resource
 *  @param {RequestInit} init
 *  @returns {Promise<Response>}
 */
async function GM_fetch (input, init = null) { // eslint-disable-line
  function cvtHeaders (headers) {
    const h = {};
    for (const pair of headers.entries()) h[pair[0]] = pair[1];
    return h;
  }
  function parseHeaders (strHeaders) {
    const h = new Headers();
    strHeaders.trim().split('\r\n').forEach(line => {
      const i = line.indexOf(':');
      h.append(line.substr(0, i).trim(), line.substr(i + 1).trim());
    });
    return h;
  }

  const request = new Request(input, init);
  const data = await request.blob();
  return new Promise(function (resolve, reject) {
    GM_xmlhttpRequest({
      method: request.method,
      url: request.url,
      headers: cvtHeaders(request.headers),
      data: data,
      binary: true,
      responseType: 'blob',
      onabort: () => reject(new DOMException('Aborted', 'AbortError')),
      onerror: () => reject(new TypeError('fetch error')),
      ontimeout: () => reject(new TypeError('fetch timeout')),
      onload: function (resp) {
        const response = new Response(resp.response, {
          status: resp.status,
          statusText: resp.statusText,
          headers: parseHeaders(resp.responseHeaders),
          url: resp.finalUrl
        });
        response.url = resp.finalUrl;
        resolve(response);
      }
    });
  });
}
