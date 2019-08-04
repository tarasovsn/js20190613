export class Portfolio {

  constructor({ element, balance, items }) {
    this._el = element;
    this._balance = balance;
    this._items = items;
    this._render();
  }

  updatePortfolio({ balance, items }) {
    this._balance = +balance;
    this._items = items;
    this._render();
  }

  _getPortfolioWorth() {
    return Number(this._items.reduce((sum, cur) => sum + cur.total, 0)).toFixed(2);
  }

  _render() {
    this._el.innerHTML = `
      <ul class="collapsible portfolio">
        <li>
          <p class="collapsible-header">
              Current balance: $${this._balance}<br>
              Portfolio Worth: $${this._getPortfolioWorth()}
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
                ${
                  this._items.map(item => `
                    <tr class="portfolio-row">
                      <td>${item.name}</td>
                      <td>${item.amount}</td>
                      <td>${item.price}</td>
                      <td>${item.total}</td>
                    </tr>
                  `).join('')
                }
              </tbody>
            </table>
          </div>
        </li>
      </ul>
    `;
    let elems = this._el.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }
}