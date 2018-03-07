// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import _ from "lodash";
import moment from "moment";

const BaseCoins = ["USDT", "BTC", "ETH", "BNB"];

Vue.config.productionTip = false

window.store = {
  state: {
    prices: {},
    tickers: {},
    orders: {},
    snapshots: [],
    balances: {},
    usdcny: 1,
    basePrices: {},
    openOrders: {}
  },
  updatePrices (prices) {
    this.state.prices = prices;
    Vue.set(this.state.basePrices, "BTC", this.state.prices["BTCUSDT"]);
    Vue.set(this.state.basePrices, "ETH", this.state.prices["ETHUSDT"]);
  },
  updateTicker (ticker) {
    let prevTicker = this.state.tickers[ticker.symbol];
    if (prevTicker) {
      ticker.lastClose = prevTicker.close
    }

    Vue.set(this.state.tickers, ticker.symbol, ticker);
    
    let btc = this.state.tickers["BTCUSDT"];
    if (btc) {
      document.title = +btc.close;
    }
  },
  updateOrders (symbol, orders) {
    orders = _.orderBy(orders, [ "time" ], [ "desc" ]);
    Vue.set(this.state.orders, symbol, orders);
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
  },
  updateOpenOrders (symbol, openOrders) {
    if (symbol) {
      Vue.set(this.state.openOrders, symbol, openOrders);
    } else {
      openOrders = _.orderBy(openOrders, [ "time" ], [ "desc" ]);
      Vue.set(this.state, "openOrders", openOrders);
    }
  }
};

Vue.filter("formatSymbol", (symbol) => {
  _.forEach(BaseCoins, (base) => {
    if (symbol.endsWith(base)) {
      symbol = symbol.substr(0, symbol.length - base.length) + "/" + base;
      return false;
    }
  });
  return symbol;
});

function formatDecimal (decimal) {
  return +(+decimal).toPrecision(5);
}
Vue.filter("formatDecimal", formatDecimal);

Vue.filter("formatPercentage", (decimal) => {
  let val = formatDecimal(decimal * 100);
  return isNaN(val) ? "-" : `${val}%`;
});

Vue.filter("formatTime", (time) => {
  return moment(time).format("MM-DD hh:mm:ss");
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
