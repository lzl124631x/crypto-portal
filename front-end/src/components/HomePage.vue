<template>
  <div class="home-page page" >
    <div class="nav">
      <router-link class="nav-item" to="order-history">Order History</router-link>
    </div>

    <table>
      <tr class="table-header">
        <th class="coin">Coin</th>
        <th class="price">Price</th>
        <th class="change">Change</th>
      </tr>
        <tr class="tr" v-for="ticker in globalState.tickers" v-bind:key="ticker.symbol">
          <td class="coin">{{ ticker.symbol }}</td>
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
        </tr>
    </table>
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
.nav {
  a.nav-item {
    display: inline-block;
    padding: 0.5em 1em;
    color: var(--text-color);
    text-decoration: none;

    &:hover {
      background-color: var(--hover-background-color);
    }
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: var(--header-color);
  }
  th,
  td {
    padding: 0.5em 0;
  }
}

.colored-text {
  &.up {
    color: var(--green);
  }
  &.down {
    color: var(--red);
  }
}
</style>

