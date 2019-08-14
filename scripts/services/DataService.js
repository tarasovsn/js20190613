const COINS_URL = 'https://api.coinpaprika.com/v1/coins';
const getSingleCoinUrl = id => `${COINS_URL}/${id}/ohlcv/latest`;


const HttpService = {
  sendRequest(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url);

      xhr.send();

      xhr.onload = () => {
        if (xhr.status != 200) {
          reject(new Error(xhr.statusText));
          return;
        } else {
          let responseData = JSON.parse(xhr.responseText);
          resolve(responseData);
        }
      }

      xhr.onerror = () => {
        reject(xhr.statusText);
      }
    })
  },

  sendMultipleRequests(urls) {
    let requests = urls.map(url => HttpService.sendRequest(url));
    return Promise.all(requests);
  }
};

export const DataService = {
  getCurrencies(filter = '') {
    let promise = HttpService.sendRequest(COINS_URL);

    return promise.then(data => {
      data = data.filter(item => {
        return item.name.toLowerCase().includes(filter);
      }).slice(0, 10);
      return DataService.getCurrenciesPrices(data);
    }).catch(err => {
      console.error(err);
    });
  },

  getCurrenciesPrices(data) {
    let coinsUrls = data.map(coin => getSingleCoinUrl(coin.id));

    return HttpService.sendMultipleRequests(coinsUrls).then(coins => {
      const dataWithPrice = data.map((item, index) => {
        let coinPrice = coins[index][0] || {close: 0};
        item.price = coinPrice.close;
        return item;
      });

      return dataWithPrice;
    })
  }
}