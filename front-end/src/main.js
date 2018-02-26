// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import _ from 'lodash'

const baseCoins = ["USDT", "BTC", "ETH", "BNB"];

Vue.config.productionTip = false

function formatSymbol(symbol) {
  _.forEach(baseCoins, (base) => {
    if (symbol.endsWith(base)) {
      symbol = symbol.substr(0, symbol.length - base.length) + "/" + base;
      return false;
    }
  });
  return symbol;
}

window.store = {
  state: {
    prices: {},
    tickers: {},
    orders: [],
    snapshots: [],
    balances: {},
    usdcny: 1,
    basePrices: {}
  },
  updatePrices (prices) {
    this.state.prices = prices;
    Vue.set(this.state.basePrices, "BTC", this.state.prices["BTCUSDT"]);
    Vue.set(this.state.basePrices, "ETH", this.state.prices["ETHUSDT"]);
  },
  updateTicker (ticker) {
    ticker.symbol = formatSymbol(ticker.symbol);
    let prevTicker = this.state.tickers[ticker.symbol];
    if (prevTicker) {
      ticker.lastClose = prevTicker.close
    }

    Vue.set(this.state.tickers, ticker.symbol, ticker);
    
    let btc = this.state.tickers["BTC/USDT"];
    if (btc) {
      document.title = +btc.close;
    }
  },
  updateOrders (orders) {
    orders.forEach(order => {
      order.symbol = formatSymbol(order.symbol);
    });
    orders = _.orderBy(orders, [ 'time' ], [ 'desc' ]);
    this.state.orders = orders;
  },
  addSnapshot(snapshot) {
    this.state.snapshots.unshift(snapshot);
  },
  deleteSnapshot(snapshot) {
    let index = this.state.snapshots.findIndex(s => s.timestamp === snapshot.timestamp);
    this.state.snapshots.splice(index, 1);
  },
  updateSnapshots (snapshots) {
    this.state.snapshots = snapshots;
  },
  updateBalances (balances) {
    _.forOwn(balances, b => {
      b.available = +b.available;
      b.onOrder = +b.onOrder;
      b.total = b.available + b.onOrder;
    });
    this.state.balances = balances;
  },
  updateusdcny (usdcny) {
    this.state.usdcny = usdcny;
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
