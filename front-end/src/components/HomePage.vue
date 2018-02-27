<template>
  <div class="home-page page">
    <div class="nav">
      <router-link class="btn" to="balance">Balance</router-link>
    </div>
    <div class="card">
      <table>
        <tr class="table-header">
          <th class="coin">Coin</th>
          <th class="price">Price</th>
          <th class="change">Change</th>
          <th class="order-history">Order History</th>
        </tr>
        <tr class="tr" v-for="ticker in globalState.tickers" v-bind:key="ticker.symbol">
          <td class="coin">{{ ticker.symbol | formatSymbol }}</td>
          <td class="close colored-text" v-bind:class="{
              up: ticker.close > ticker.lastClose,
              down: ticker.close < ticker.lastClose
            }">
            {{ ticker.close }}
          </td>
          <td class="percent-change colored-text" v-bind:class="{
              up: ticker.percentChange > 0,
              down : ticker.percentChange < 0
            }">
            {{ ticker.percentChange + "%" }}
          </td>
          <td class="order-history">
            <router-link class="btn" :to="{ name: 'OrderHistoryPage', params: { symbol: ticker.symbol }}">View</router-link>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      globalState: store.state
    };
  },
  methods: {}
};
</script>

<style scoped lang="less">
@import "../less/common.less";

.colored-text {
  &.up {
    color: var(--green);
  }
  &.down {
    color: var(--red);
  }
}

.order-history {
  font-size: 0.8em;
}
</style>

