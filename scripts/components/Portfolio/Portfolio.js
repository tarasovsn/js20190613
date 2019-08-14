import { Component } from "../Component/Component.js";

export class Portfolio extends Component {

  constructor({ element, balance, items = [] }) {
    super();
    this._el = element;
    this._balance = balance;
    this._items = [ ...items.values() ];
    this._render();
  }

  updatePortfolio({ balance, items }) {
    this._balance = +balance;
    this._items = [ ...items.values() ];
    this._headerEl.innerHTML = this._renderHeader();
    this._tableBodyEl.innerHTML = this._renderTableBody();
  }

  _getPortfolioWorth() {
    return this._items.reduce((sum, cur) => sum + cur.total, 0);
  }

  _render() {
    this._el.innerHTML = `
      <ul class="collapsible portfolio">
        <li>
          <p class="collapsible-header">
            ${this._renderHeader()}
          </p>
          <div class="collapsible-body">
            <table class="highlight striped">
              <thead>
                  <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Total</th>
                  </tr>
              </thead>
              <tbody>
                ${this._renderTableBody()}
              </tbody>
            </table>
          </div>
        </li>
      </ul>
    `;
    let elems = this._el.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
    this._headerEl = this._el.querySelector('.collapsible-header');
    this._tableBodyEl = this._el.querySelector('tbody');
  }

  _renderHeader() {
    return `
      Current balance: $${this._balance.toFixed(2)}<br>
      Portfolio Worth: $${this._getPortfolioWorth().toFixed(2)}
    `;
  }

  _renderTableBody() {
    return `
      ${
        this._items.map(item => `
          <tr class="portfolio-row">
            <td>${item.name}</td>
            <td>${item.amount.toFixed(8)}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${item.total.toFixed(2)}</td>
          </tr>
        `).join('')
      }
    `;
  }
}