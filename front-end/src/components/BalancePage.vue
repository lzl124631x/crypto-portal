<template>
  <div class="balance-page page">
    <div>USD/CNY: {{precise(globalState.cnyusd)}}</div>
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
      <tr v-for="(balance, symbol) in globalState.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, balance.total, globalState.prices) }">
        <td>{{symbol}}</td>
        <td>{{balance.total}}</td>
        <td>{{balance.available}}</td>
        <td>{{balance.onOrder}}</td>
        <td>{{getPrice(symbol, globalState.prices)}}</td>
        <td>{{getPrice(symbol, globalState.prices) * balance.total}}</td>
      </tr>
    </table>
    <div>Grand Total: {{ grandTotal() }}</div>

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
          <tr v-for="(balance, symbol) in snapshot.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, balance.total, snapshot.prices) }">
            <td>{{symbol}}</td>
            <td>{{balance.total}}</td>
            <td>{{ balanceChange(index, symbol) }}</td>
            <td>{{ getPrice(symbol, snapshot.prices) }}</td>
            <td>{{ priceChange(index, symbol) }}</td>
            <td>{{ getPrice(symbol, snapshot.prices) * balance.total }}</td>
          </tr>
        </table>
        <div>Grand Total: {{ grandTotal(snapshot) }}</div>
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
      isSmallBalanceHidden: true,
      target: "CNY"
    };
  },
  mounted() {
    service.balances();
    service.prices();
    service.snapshots();
    service.cnyusd();
  },
  methods: {
    getPrice(symbol, prices, target) {
      if (!prices) return 0;

      if (!target) {
        target = this.target;
      }
      let cny = target == "CNY";
      if (cny) target = "USDT";
      let price;
      if (symbol == target) {
        price = 1;
      } else if (symbol == "USDT") {
        price = 1 / prices[target + "USDT"];
      } else {
        price = prices[symbol + target];
        if (!price) {
          // No USDT pair
          price = prices[symbol + "BTC"] * this.getPrice("BTC", prices, target);
        }
      }
      price = price ? +price : 0;
      if (cny) price *= store.state.cnyusd;
      return price;
    },
    HideItem(symbol, total, prices) {
      let price = this.getPrice(symbol, prices);
      let btcPrice = this.getPrice("BTC", prices);
      return (
        !price || (this.isSmallBalanceHidden && price * total < 0.01 * btcPrice)
      );
    },
    addSnapshot() {
      let snapshot = {};
      snapshot.prices = store.state.prices;
      snapshot.balances = store.state.balances;
      snapshot.timestamp = Date.now();
      snapshot.cnyusd = store.state.cnyusd;
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
    priceChange(index, symbol) {
      let snapshots = store.state.snapshots;
      if (!snapshots || index == snapshots.length - 1) {
        return "-";
      }
      let curr = this.getPrice(symbol, snapshots[index].prices);
      let prev = this.getPrice(symbol, snapshots[index + 1].prices);
      return this.percent((curr - prev) / prev);
    },
    precise(x) {
      return x.toPrecision(4);
    },
    percent(x) {
      return this.precise(x) + "%";
    },
    grandTotal(snapshot) {
      if (!snapshot) {
        snapshot = store.state;
      }
      return _.reduce(
        snapshot.balances,
        (total, balance, symbol) => {
          return total + this.getPrice(symbol, snapshot.prices) * balance.total;
        },
        0
      );
    }
  }
};
</script>

<style scoped lang="less">
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

