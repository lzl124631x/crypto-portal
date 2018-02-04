<template>
  <div class="balance-page page">
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
        <th>Price</th>
        <th>Value</th>
      </tr>
      <tr v-for="(balance, symbol) in globalState.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, 'USDT', balance.total, globalState.prices) }">
        <td>{{symbol}}</td>
        <td>{{balance.total}}</td>
        <td>{{balance.available}}</td>
        <td>{{balance.onOrder}}</td>
        <td>{{getPrice(symbol, "USDT", globalState.prices)}}</td>
        <td>{{getPrice(symbol, "USDT", globalState.prices) * balance.total}}</td>
      </tr>
    </table>

    <button class="btn btn-save-snapshot" @click="addSnapshot">Add Snapshot</button>

    <div class="snapshots">
      <div class="header">Snapshots</div>
      <div class="snapshot" v-for="(snapshot, index) in globalState.snapshots" :key="snapshot.timestamp">
        <div class="timestamp">
          {{ moment(snapshot.timestamp).format("YYYY-MM-DD hh:mm:ss")}}
          <button class="btn btn-delete-snapshot" @click="deleteSnapshot(snapshot)">Delete</button>
        </div>
        <table>
          <tr>
            <th>Coin</th>
            <th>Balance</th>
            <th>Balance Change</th>
            <th>Price</th>
            <th>Price Change</th>
            <th>Value</th>
          </tr>
          <tr v-for="(balance, symbol) in snapshot.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, 'USDT', balance.total, snapshot.prices) }">
            <td>{{symbol}}</td>
            <td>{{balance.total}}</td>
            <td>{{ balanceChange(index, symbol) }}</td>
            <td>{{getPrice(symbol, "USDT", snapshot.prices)}}</td>
            <td>{{ priceChange(index, symbol, "USDT") }}</td>
            <td>{{getPrice(symbol, "USDT", snapshot.prices) * balance.total}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import service from "../service";
import moment from "moment";

export default {
  name: "BalancePage",
  data() {
    return {
      moment,
      globalState: store.state,
      isSmallBalanceHidden: true
    };
  },
  mounted() {
    service.balances();
    service.prices();
    service.snapshots();
  },
  methods: {
    getPrice(symbol, target, prices) {
      if (!prices) return 0;
      if (symbol == target) {
        return 1;
      }
      if (symbol == "USDT") {
        return 1 / prices[target + "USDT"];
      }
      let price = prices[symbol + target];
      return price ? +price : 0;
    },
    HideItem(symbol, target, total, prices) {
      let price = this.getPrice(symbol, target, prices);
      let btcPrice = this.getPrice("BTC", target, prices);
      return (
        !price || (this.isSmallBalanceHidden && price * total < 0.01 * btcPrice)
      );
    },
    addSnapshot() {
      let snapshot = {};
      snapshot.prices = store.state.prices;
      snapshot.balances = store.state.balances;
      snapshot.timestamp = Date.now();
      service.addSnapshot(snapshot);
    },
    deleteSnapshot(snapshot) {
      service.deleteSnapshot(snapshot);
    },
    balanceChange(index, symbol) {
      let snapshots = store.state.snapshots;
      if (!snapshots || index == snapshots.length - 1) {
        return "-";
      }
      let curr = snapshots[index].balances[symbol].total;
      let prev = snapshots[index + 1].balances[symbol].total;
      return this.percent((curr - prev) / prev);
    },
    priceChange(index, symbol, target) {
      let snapshots = store.state.snapshots;
      if (!snapshots || index == snapshots.length - 1) {
        return "-";
      }
      let curr = this.getPrice(symbol, target, snapshots[index].prices);
      let prev = this.getPrice(symbol, target, snapshots[index + 1].prices);
      return this.percent((curr - prev) / prev);
    },
    precise(x) {
      return x.toPrecision(4);
    },
    percent(x) {
      return this.precise(x) + "%";
    }
  }
};
</script>

<style scoped lang="less">
@import "../less/common.less";

.hidden {
  display: none;
}

.btn {
  appearance: none;
  border: 0;
  padding: 0.5em 1em;
  color: var(--text-color);
  background-color: var(--btn-background-color);
  &:hover {
    background-color: var(--hover-background-color);
  }
}

.snapshots {
  margin-top: 1em;
  .header {
    padding: 0.5em;
  }
}

.timestamp {
  padding: 0.5em;
}
</style>

