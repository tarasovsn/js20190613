import { Component } from "../component/Component.js";

export class Table extends Component {
  constructor({ element, data }) {
    super();
    this._el = element;
    this._render(data);
    this.on('click', e => this._onRowClick(e));
  }

  _onRowClick(e) {
    const target = e.target.closest('tbody tr');
    if (!target) return;
    const rowClickEvent = new CustomEvent("rowClick", {
      detail: {
        itemId: target.dataset.id,
      }
    });
    this._el.dispatchEvent(rowClickEvent);
  }

  _render(data) {
    this._el.innerHTML = `
      <table class="data-table highlight"> 
        <thead>
          <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Rank</th>
              <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${
            data.map(coin => `
              <tr data-id="${coin.id}">
                <td>${coin.name}</td>
                <td>${coin.symbol}</td>
                <td>${coin.rank}</td>
                <td>${coin.price}</td>
              </tr>
            `).join('')
          }
        </tbody>
      </table>
    `;
  }
}