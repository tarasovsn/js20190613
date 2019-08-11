import { Component } from '../Component/Component.js';

export class TradeWidget extends Component {

  constructor({ element }) {
    super();
    this._el = element;

    this.on('input', e => {
      this._isBuyActive = false;
      this._total = 0;
      const value = Number(e.target.value);
      if (Number.isNaN(value)) {
        this.showErrorMessage("Please enter the number!");
      } else if (value <= 0) {
        this.showErrorMessage("Please enter the pozitive number!");
      } else {
        this._amount = value;
        this._total = this._amount * this._currentItem.price;
        this._isBuyActive = true;
      }
      this._updateDisplay();
    });

    this.on('click', e => {
      e.preventDefault();
      if (e.target.closest('a.modal-buy')) {
        let buyEvent = new CustomEvent('buy', {
          detail: {
            itemId: this._currentItem.id,
            amount: this._amount,
          }
        });
        this._el.dispatchEvent(buyEvent);
      } else if (e.target.closest('a.modal-close')) {
        this.closeTradeWindow();
      }
    });
  }

  openTradeWindow(item) {
    this._currentItem = item;
    this._total = 0;
    this._render(item);
  }

  closeTradeWindow() {
    this._modalEl.classList.remove('open');
  }

  showErrorMessage(message) {
    this._errorMsgEl.textContent = message;
  }

  _updateDisplay() {
    this._itemTotalEl.textContent = this._total.toFixed(2);
    if (this._isBuyActive) {
      this._buyButtonEl.classList.remove('disabled');
    } else {
      this._buyButtonEl.classList.add('disabled');
    }
  }

  _render(item) {
    this._el.innerHTML = `
      <div id="modal" class="modal open">
        <div class="modal-content">
          <h4>Buying ${item.name}:</h4>
          <p>
            Current price: ${item.price}. Total: <span id="item-total">${this._total.toFixed(2)}</span>
          </p>
          <div id="item-error-msg" class="modal-error-msg"></div>
          <div class="row">
            <form class="col s12">
                <div class="input-field col s4">
                    <input id="amount" type="text">
                    <label for="amount">Amount</label>
                </div>
            </form>
          </div>
        </div>
          
        <div class="modal-footer">
          <a href="#!" class="btn modal-buy green lighten-1 disabled">Buy</a>
          <a href="#!" class="btn modal-close grey lighten-1">Cancel</a>
        </div>
      </div>
    `;
    let elems = this._el.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
    this._buyButtonEl = this._el.querySelector('a.modal-buy');
    this._errorMsgEl = this._el.querySelector('#item-error-msg');
    this._itemTotalEl = this._el.querySelector('#item-total');
    this._modalEl = this._el.querySelector('#modal');
  }
}