import { Table } from '../Table/Table.js';
import { Portfolio } from '../Portfolio/Portfolio.js';
import { TradeWidget } from '../TradeWidget/TradeWidget.js';
import { DataService } from '../../services/DataService.js';

export class App {

  constructor({ element }) {
    this._el = element;
    this._userBalance = 10000;
    this._userCoins = [];
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
    const foundCoin = this._userCoins.find(curCoin => curCoin.id === coin.id);
    if (foundCoin) {
      foundCoin.amount = +Number(+amount + foundCoin.amount).toFixed(8);
      foundCoin.total = +Number(+total + foundCoin.total).toFixed(2);
      foundCoin.price = +Number(foundCoin.total / foundCoin.amount).toFixed(2);
    } else {
      this._userCoins.push({
        id: coin.id,
        name: coin.name,
        amount,
        total,
        price: coin.price,
      });
    }
  }

  _buyItem(coinId, amount) {
    const coin = this._getCoin(coinId);
    const total = +Number(coin.price * amount).toFixed(2);
    if (total === 0) {
      return { 
        isSuccess: false,
        errorMsg: "Buy operation error: Total sum must be positive!",     
      }
    } else if (total > this._userBalance) {
      return { 
        isSuccess: false,
        errorMsg: "Buy operation error: Insufficient funds in the account!",     
      }
    } else {
      this._userBalance = +Number(this._userBalance - total).toFixed(2);
      this._addUserCoin(coin, amount, total);
      this._portfolio.updatePortfolio({ 
        balance: this._userBalance,
        items: this._userCoins
      });
    }
    return { 
      isSuccess: true
    }
  }

  _initTable() {
    this._table = new Table({
      data: this._data,
      element: this._el.querySelector('[data-element=table]'),
      onRowClick: (coinId) => this._tradeWidget.openTradeWindow(this._getCoin(coinId)),
    });
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
      onBuyClick: (coinId, amount) => this._buyItem(coinId, amount),
    });
  }

  _render() {
    this._el.innerHTML = `
      <div class="row">
        <div class="col s12">
            <h1>Tiny Crypto Market</h1>
        </div>
      </div>
      <div class="row portfolio-row">
          <div class="col s6 offset-s6" data-element="portfolio"></div>
      </div>
      <div class="row">
          <div class="col s12" data-element="table"></div>
      </div>
      <div data-element="trade-widget"></div>
    `;
  }
}
