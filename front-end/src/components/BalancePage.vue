<template>
    <div class="home-page page">
        <label for="checkbox-hide-small-balance">
            <input type="checkbox" class="switch" id="checkbox-hide-small-balance" v-model="isSmallBalanceHidden" />
            <span class="text">{{ isSmallBalanceHidden ? "Show All Balances" : "Hide Small Balances" }}</span>
        </label>
        <table>
            <tr>
                <th>Coin</th>
                <th>Balance</th>
                <th>Available</th>
                <th>On Order</th>
                <th>Value</th>
            </tr>
            <tr v-for="(balance, symbol) in globalState.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, balance.total) }">
                <td>{{symbol}}</td>
                <td>{{balance.total}}</td>
                <td>{{balance.available}}</td>
                <td>{{balance.onOrder}}</td>
                <td>{{getPrice(symbol) * balance.total}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import service from "../service";

export default {
  name: "BalancePage",
  data() {
    return {
      globalState: store.state,
      isSmallBalanceHidden: false
    };
  },
  mounted() {
    service.balances();
    service.prices();
  },
  methods: {
    getPrice(symbol) {
      if (symbol == "BTC") {
        return 1;
      }
      if (symbol == "USDT") {
        return 1 / this.globalState.prices["BTCUSDT"];
      }
      let price = this.globalState.prices[symbol + "BTC"];
      return price ? price : 0;
    },
    HideItem(symbol, total) {
      let price = this.getPrice(symbol);
      return !price || (this.isSmallBalanceHidden && price * total < 0.01);
    }
  }
};
</script>

<style scoped lang="less">
@import "../less/common.less";

.hidden {
  display: none;
}
</style>

