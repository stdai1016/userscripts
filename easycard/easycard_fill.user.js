// ==UserScript==
// @name         Fill EasyCard
// @description  Auto fill card numbers
// @version      0.3.1
// @homepage     https://github.com/stdai0a10
// @namespace    https://github.com/stdai0a10/userscripts/easycard
// @icon         https://icons.duckduckgo.com/ip2/easycard.com.tw.ico
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginServlet
// @match        https://ezweb.easycard.com.tw/Event01/JCBLoginRecordServlet
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

/* jshint esversion: 13 */

(function () {
  'use strict';

  const formCss = String.raw`
    .cardManager {
      z-index: 3000000000;
      border: 1px solid #000;
      background-color: #fff;
      position: fixed;
      max-width: 100%;
      width: 1000px;
      height: 50%;
      overflow-x: auto;
      margin: auto;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 30px 0
    }
    @media screen and (max-width: 997px) {
      .cardManager { width: 768px }
    }
    @media screen and (max-width: 767px) {
      .cardManager { width: 100% }
    }
    .cardManager table {
      border-collapse: collapse;
      margin: auto;
    }
    .cardManager table .align-right {
      text-align: right;
    }
    .cardManager table #txtCreditCard2 {
      width: 22px;
    }
  `;
  const formHtml = String.raw`
    <form class="cardManager">
      <table>
        <tbody>
          <tr>
            <td>
              <button type="button" name="add">增加</button>
            </td>
            <td colspan=7 class="align-right" >
              <button type="button" name="cancel">取消</button>
              <button type="button" name="submit">送出</button>
            </td>
          </tr>
        </tbody>
      <table>
    </form>
  `;
  const cardHtml = String.raw`
    <tbody data-card="0">
      <tr>
        <th>信用卡排序：</th>
        <td class="tf"><input type="number" class="text_field" name="txtCard" value="1" min=1></td>
        <td colspan=8 class="align-right"><button type="button" name="del">刪除</button></td>
      </tr>
      <tr>
        <th>信用卡卡號：</th>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtCreditCard1" name="txtCreditCard1"></td>
        <td class="tf_line" >-</td>
        <td class="tf pass"><input type="text" class="text_field" maxlength="2" id="txtCreditCard2" name="txtCreditCard2">**</td>
        <td class="tf_line" >-</td>
        <td class="tf pass"><input type="hidden" class="text_field" maxlength="4" id="txtCreditCard3" name="txtCreditCard3" disabled>****</td>
        <td class="tf_line" >-</td>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtCreditCard4" name="txtCreditCard4"></td>
      <tr>
      <tr>
        <th>悠遊卡卡號：</th>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtEasyCard1" name="txtEasyCard1"></td>
        <td class="tf_line" >-</td>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtEasyCard2" name="txtEasyCard2"></td>
        <td class="tf_line" >-</td>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtEasyCard3" name="txtEasyCard3"></td>
        <td class="tf_line" >-</td>
        <td class="tf"><input type="text" class="text_field" maxlength="4" id="txtEasyCard4" name="txtEasyCard4"></td>
      <tr>
      <tr><td colspan=8><hr></td></tr>
    <tbody>
  `;

  /**
   * @return {Array.<{txtEasyCard: string[], txtCreditCard: string[]}>}
   */
  const getCardNumbers = () => {
    const cards = window.GM_getValue('cards');
    if (!cards || !Array.isArray(cards)) setCardNumbers([]);
    return cards ?? [];
  };
  /**
   * @param {Array.<{txtEasyCard: string[], txtCreditCard: string[]}>} cards
   */
  const setCardNumbers = (cards) => window.GM_setValue('cards', [...cards]);

  /**
   * @param {HTMLElement} element
   * @param {{txtEasyCard: string[], txtCreditCard: string[]}} card
   */
  const fillCardNumber = (element, card) => {
    const fill = (prefix, values) => {
      console.debug(`Try to fill "${prefix}"`);
      return values.every((v, i) => {
        const input = element.querySelector(`#${prefix}${i + 1}`);
        (input ?? {}).value = v;
        return !v || !!input;
      });
    };

    element.querySelector('#accept')?.click();
    fill('txtCreditCard', card.txtCreditCard);
    const filled = fill('txtEasyCard', card.txtEasyCard);
    if (!filled) {
      setTimeout(fillCardNumber, 1000, element, card);
    }
  };
  /**
   * @param {HTMLElement} element
   * @return {{txtEasyCard: string[], txtCreditCard: string[]}}
   */
  const readCardNumber = (element) => {
    const read = (prefix) => {
      const values = [];
      let i = 0;
      while (++i) {
        const input = element.querySelector(`#${prefix}${i}`);
        if (!input) break;
        values.push(input.value);
      }
      return values;
    };

    const txtCreditCard = read('txtCreditCard');
    const txtEasyCard = read('txtEasyCard');
    return { txtCreditCard, txtEasyCard };
  };

  const showCardManager = () => {
    const addCard = (container, card = null) => {
      container.insertAdjacentHTML('afterbegin', cardHtml);
      const element = container.querySelector('[data-card="0"]');
      element.dataset.card = 1;
      element.querySelector(['button']).onclick = () => element.remove();

      if (card) fillCardNumber(element, card);
    };

    document.body.insertAdjacentHTML('beforeend', formHtml);

    const form = document.querySelector('body > form.cardManager');
    const table = form.querySelector('table');

    form.querySelector('button[name="add"]').onclick = () => addCard(table);
    form.querySelector('button[name="cancel"]').onclick = () => form.remove();
    form.querySelector('button[name="submit"]').onclick = () => {
      const cards = [...document.querySelectorAll('tbody[data-card]')]
        .filter((i) => i.dataset.card)
        .sort((a, b) => {
          a = a.querySelector('input[type="number"]').value;
          b = b.querySelector('input[type="number"]').value;
          return a - b;
        })
        .map((i) => readCardNumber(i));
      form.remove();
      setCardNumbers(cards);
      setup();
    };

    const cards = getCardNumbers();
    let n = cards.length || 1;
    while (n--) {
      addCard(table, cards.pop());
    }
  };

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
          fillCardNumber(document, card);
        },
        { id }
      );
      setup.cmds.push(id);
    });

    const id = window.GM_registerMenuCommand('Manage Cards', showCardManager);
    setup.cmds.push(id);

    if (cards.length) fillCardNumber(document, cards[0]);
  };

  window.GM_addStyle(formCss);
  setup();
})();
