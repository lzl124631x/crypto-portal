<template>
  <div class="order-history-page page">
    <div class="row">
      <label for="checkbox-hide-canceled">
        <input type="checkbox" class="switch" id="checkbox-hide-canceled" v-model="isCanceledOrderHidden" />
        <span class="text">{{ isCanceledOrderHidden ? "Show All Orders" : "Hide All Canceled" }}</span>
      </label>
    </div>
    <div class="card">
      <table>
        <tr>
          <th>Pair</th>
          <th>Avg. / Price</th>
          <th>Filled / Amount</th>
        </tr>
        <tr class="order" v-for="order in globalState.orders[$route.params.symbol]" :key="order.orderId" :class="{ canceled: order.status == 'CANCELED', 'hide-canceled': isCanceledOrderHidden }">
          <td class="pair">
            <div class="side-symbol">
              <div class="side-badge" :class="{ green: order.side == 'BUY', red: order.side == 'SELL' }">{{ order.side == 'BUY' ? "B" : "S" }}</div>
              <div class="symbol">{{ order.symbol | formatSymbol }}</div>
            </div>
            <div class="time">
              {{ order.time | formatTime }}
            </div>
          </td>

          <td class="avg-price">
            <div class="avg-price">{{ order.price | formatDecimal }}</div>
            <div class="price">{{ order.price | formatDecimal }} / {{ order.type }}</div>
          </td>

          <td class="filled-amount">
            <div class="filled">{{ order.executedQty | formatDecimal }}</div>
            <div class="amount">{{ order.origQty | formatDecimal }} </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import service from "../service";
import moment from "moment";
export default {
  name: "OrderHistoryPage",
  data() {
    return {
      globalState: store.state,
      isCanceledOrderHidden: true
    };
  },
  mounted() {
    service.orders(this.$route.params.symbol);
  },
  methods: {}
};
</script>

<style scoped lang="less">
@import "../less/common.less";
</style>