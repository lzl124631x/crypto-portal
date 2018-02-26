<template>
  <div class="balance-page page">
    <div>USD/CNY: {{precise(globalState.usdcny)}}</div>
    <label for="checkbox-hide-small-balance">
      <input type="checkbox" class="switch" id="checkbox-hide-small-balance" v-model="isSmallBalanceHidden" />
      <span class="text">{{ isSmallBalanceHidden ? "Show All Balances" : "Hide Small Balances" }}</span>
    </label>
    <table v-if="globalState.prices && globalState.balances">
      <tr>
        <th>Coin</th>
        <th>Balance</th>
        <th>Available</th>
        <th>On Order</th>
        <th>Price</th>
        <th>Value</th>
      </tr>
      <tr v-for="(balance, symbol) in globalState.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, balance.total, globalState) }">
        <td>{{symbol}}</td>
        <td>{{balance.total}}</td>
        <td>{{balance.available}}</td>
        <td>{{balance.onOrder}}</td>
        <td>{{getPrice(symbol, globalState)}}</td>
        <td>{{getPrice(symbol, globalState) * balance.total}}</td>
      </tr>
    </table>
    <div class="info-row">Grand Total: {{ grandTotal(globalState) }}</div>

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
          <tr v-for="(balance, symbol) in snapshot.balances" v-bind:key="symbol" :class="{ hidden: HideItem(symbol, balance.total, snapshot) }">
            <td>{{symbol}}</td>
            <td>{{balance.total}}</td>
            <td>{{ balanceChange(index, symbol) }}</td>
            <td>{{ getPrice(symbol, snapshot) }}</td>
            <td>{{ priceChange(index, symbol) }}</td>
            <td>{{ getPrice(symbol, snapshot) * balance.total }}</td>
          </tr>
        </table>
        <div class="info-row">Grand Total: {{ grandTotal(snapshot) }}</div>
        <div class="info-row">Grand Total Change: {{ grandTotalChange(index)}}</div>
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
    service.usdcny();
  },
  methods: {
    getBasePrice(symbol, snapshot, target) {
      if (!snapshot || !snapshot.prices) return 0;
      // target must be one of "BTC", "ETH", "USDT"
      let prices = snapshot.prices;
      let price;
      if (symbol == target) {
        price = 1;
      } else if (symbol == "USDT") {
        price = 1 / prices[target + "USDT"];
      } else {
        price = prices[symbol + target];
        if (!price && prices[symbol + "BTC"]) {
          // No direct pair between symbol and target, try to use BTC as intermediate.
          price =
            prices[symbol + "BTC"] * this.getBasePrice("BTC", snapshot, target);
        }
      }
      return price ? +price : 0;
    },
    getPrice(symbol, snapshot, target) {
      if (!snapshot || !snapshot.prices) return 0;

      let prices = snapshot.prices;
      let usdcny = snapshot.usdcny;
      if (!target) {
        // If no explicit target, use default target.
        target = this.target;
      }
      let targetIsCny = target == "CNY";
      if (targetIsCny) {
        target = "USDT";
      }
      let price = this.getBasePrice(symbol, snapshot, target);
      if (targetIsCny) {
        price *= usdcny;
      }
      return price;
    },
    HideItem(symbol, total, snapshot) {
      let price = this.getPrice(symbol, snapshot);
      let btcPrice = this.getPrice("BTC", snapshot);
      return (
        !price || (this.isSmallBalanceHidden && price * total < 0.01 * btcPrice)
      );
    },
    addSnapshot() {
      let snapshot = {};
      snapshot.prices = store.state.prices;
      snapshot.balances = store.state.balances;
      snapshot.timestamp = Date.now();
      snapshot.usdcny = store.state.usdcny;
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
      let prevBalance = snapshots[index + 1].balances[symbol];
      if (!prevBalance) {
        return "-";
      }
      let prev = prevBalance.total;
      return this.percent((curr - prev) / prev);
    },
    priceChange(index, symbol) {
      let snapshots = store.state.snapshots;
      if (!snapshots || index == snapshots.length - 1) {
        return "-";
      }
      let curr = this.getPrice(symbol, snapshots[index]);
      let prev = this.getPrice(symbol, snapshots[index + 1]);
      return this.percent((curr - prev) / prev);
    },
    precise(x) {
      return x.toPrecision(4);
    },
    percent(x) {
      return this.precise(x) * 100 + "%";
    },
    grandTotal(snapshot) {
      return _.reduce(
        snapshot.balances,
        (total, balance, symbol) => {
          return total + this.getPrice(symbol, snapshot) * balance.total;
        },
        0
      );
    },
    grandTotalChange(index) {
      let snapshots = store.state.snapshots;
      if (!snapshots || index == snapshots.length - 1) {
        return "-";
      }
      let curr = this.grandTotal(snapshots[index]);
      let prev = this.grandTotal(snapshots[index + 1]);
      return this.percent((curr - prev) / prev);
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

.info-row,
.timestamp {
  padding: 0.5em;
}
</style>

