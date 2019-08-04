export class TradeWidget {

  constructor({ element, onBuyClick }) {
    this._el = element;
    this._onBuyClickCallback = onBuyClick;

    this._el.addEventListener('input', e => {
      this._isBuyActive = false;
      this._total = 0;
      const value = Number(e.target.value);
      if (Number.isNaN(value)) {
        this._errorMsg = "Please enter the number!";
      } else if (value <= 0) {
        this._errorMsg = "Please enter the pozitive number!";
      } else {
        this._amount = value;
        this._total = +Number(this._amount * this._currentItem.price).toFixed(2);
        this._errorMsg = null;
        this._isBuyActive = true;
      }
      this._updateDisplay();
    });

    this._el.addEventListener('click', e => {
      if (e.target.closest('a.modal-buy')) {
        let { isSuccess, errorMsg } = this._onBuyClickCallback(this._currentItem.id, this._amount);
        if(isSuccess) {
          this.closeTradeWindow();
        } else {
          this._errorMsg = errorMsg;
          this._updateDisplay();
        }
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
    this._el.innerHTML = '';
  }

  _updateDisplay() {
    this._el.querySelector('#item-total').textContent = this._total;
    if (this._errorMsg) {
      this._el.querySelector('#item-error-msg').textContent = this._errorMsg;
    } else {
      this._el.querySelector('#item-error-msg').textContent = '';
    }
    if (this._isBuyActive) {
      this._el.querySelector('a.modal-buy').classList.remove('disabled');
    } else {
      this._el.querySelector('a.modal-buy').classList.add('disabled');
    }
  }

  _render(item) {
    this._el.innerHTML = `
      <div id="modal" class="modal open">
        <div class="modal-content">
          <h4>Buying ${item.name}:</h4>
          <p>
            Current price: ${item.price}. Total: <span id="item-total">${this._total}</span>
          </p>
          <div id="item-error-msg" class="modal-error-msg"></div>
          <div class="row">
            <form class="col s12">
                <div class="input-field col s4">
                    <input id="amount" type="number">
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
  }
}