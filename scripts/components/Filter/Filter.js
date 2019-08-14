import { Component } from "../Component/Component.js";

export class Filter extends Component {
    constructor({ element }) {
        super();
        this._el = element;
        this._render();

        this.on("input", debounce(e => {
            const filterEvent = new CustomEvent("filter", {
                detail: {
                    value: e.target.value,
                }
            });
            this._el.dispatchEvent(filterEvent);
        }, 300));
    }

    _render() {
        this._el.innerHTML = `
        <div class="input-field col s6">
            <input placeholder="Filter..." id="first_name" type="text" class="validate">
        </div>
        `;
    }
}

function debounce(f, delay) {
  let timerId;
  return function wrapper(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => { f.apply(this, args); }, delay);
  }
}