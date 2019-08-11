import { Table } from '../Table/Table.js';
import { Portfolio } from '../Portfolio/Portfolio.js';
import { TradeWidget } from '../TradeWidget/TradeWidget.js';
import { DataService } from '../../services/DataService.js';
import { Component } from "../component/Component.js";

export class App extends Component {

  constructor({ element }) {
    super();
    this._el = element;
    this._userBalance = 10000;
    this._userCoins = new Map();
    this._render();
    this._data = DataService.getCurrencies();
    this._initTable();
    this._initPortfolio();
    this._initTradeWidget();
  }

  _getCoin(coinId) {
    return this._data.find(coin => coin.id === coinId);
  }

  _addUserCoin(coin, amount, total) {
    const foundCoin = this._userCoins.get(coin.id);
    if (foundCoin) {
      foundCoin.amount = foundCoin.amount + (+amount);
      foundCoin.total = foundCoin.total + (+total);
      foundCoin.price = foundCoin.total / foundCoin.amount;
    } else {
      this._userCoins.set(coin.id , {
        name: coin.name,
        amount,
        total,
        price: coin.price,
      });
    }
  }

  _buyItem(coinId, amount) {
    const coin = this._getCoin(coinId);
    const total = coin.price * amount;
    if (total < 0.01) {
      this._tradeWidget.showErrorMessage("Buy operation error: Total sum must be positive!");
    } else if (total > this._userBalance) {
      this._tradeWidget.showErrorMessage("Buy operation error: Insufficient funds in the account!");
    } else {
      this._userBalance = this._userBalance - total;
      this._addUserCoin(coin, amount, total);
      this._portfolio.updatePortfolio({ 
        balance: this._userBalance,
        items: this._userCoins
      });
      this._tradeWidget.closeTradeWindow();
    }
  }

  _initTable() {
    this._table = new Table({
      data: this._data,
      element: this._el.querySelector('[data-element=table]'),
    });
    this._table.on('rowClick', e => this._tradeWidget.openTradeWindow(this._getCoin(e.detail.itemId)));
  }

  _initPortfolio() {
    this._portfolio = new Portfolio({
      element: this._el.querySelector('[data-element="portfolio"]'),
      balance: this._userBalance,
      items: this._userCoins,
    });
  }

  _initTradeWidget() {
    this._tradeWidget = new TradeWidget({
      element: this._el.querySelector('[data-element="trade-widget"]'),
    });
    this._tradeWidget.on('buy', e => {
      this._buyItem(e.detail.itemId, e.detail.amount)
    })
  }

  _render() {
    this._el.innerHTML = `
      <div class="row">
        <div class="col s12">
            <h1>Tiny Crypto Market</h1>
        </div>
      </div>
      <div class="row">
          <div class="col s12" data-element="table"></div>
      </div>
      <div class="col s6 offset-s6" data-element="portfolio"></div>
      <div data-element="trade-widget"></div>
    `;
  }
}
