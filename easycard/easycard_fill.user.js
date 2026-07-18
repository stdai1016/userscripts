// ==UserScript==
// @name         Fill EasyCard
// @description  Auto fill card numbers
// @version      0.2.0
// @homepage     https://github.com/stdai0a10
// @namespace    https://github.com/stdai0a10/userscripts/easycard
// @icon         https://icons.duckduckgo.com/ip2/easycard.com.tw.ico
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginServlet
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginRecordServlet
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

/* jshint esversion: 13 */

(function () {
  'use strict';

  /**
   * @return {Array.<{txtEasyCard: string[], txtCreditCard: string[]}>}
   */
  const getCardNumbers = () => {
    if (!window.GM_getValue('cards')) window.GM_setValue('cards', []);
    return window.GM_getValue('cards') ?? [];
  };

  const fillCardNumber = (card) => {
    const fill = (prefix, values, tries = 0) => {
      if (!--tries) return true;
      console.debug(`Try to fill "${prefix}"`);
      const filled = values.every((v, i) => {
        const input = document.getElementById(prefix + (i + 1));
        (input ?? document.createElement('input')).value = v;
        return !v || !!input;
      });

      if (!filled) {
        setTimeout(fill, 1000, prefix, values, tries);
      }
    };

    fill('txtEasyCard', card.txtEasyCard);
    if (location.pathname.indexOf('JCBLoginServlet') > 0) {
      document.getElementById('accept')?.click();
      fill('txtCreditCard', card.txtCreditCard);
    }
  };

  const showCardManager = () => {};

  const setup = () => {
    if (!('cmds' in setup)) setup.cmds = [];
    for (const cmd of setup.cmds) window.GM_unregisterMenuCommand(cmd);

    const cards = getCardNumbers();

    cards.forEach((card, index) => {
      const id = `Card ${card.txtEasyCard[3]}`;
      window.GM_registerMenuCommand(
        id,
        (e) => {
          console.info(`Fill ${id}`);
          fillCardNumber(card);
        },
        { id }
      );
      setup.cmds.push(id);
    });

    const id = window.GM_registerMenuCommand('Manage Cards', showCardManager);
    setup.cmds.push(id);

    if (cards.length) fillCardNumber(cards[0]);
  };

  setup();

  // const submit = document.form1?.querySelector('[onclick]');
  // (submit ?? document.createElement('input')).onclick = (e) => {
  //   e.preventDefault();
  //   document.form1.submit();
  // };
})();
