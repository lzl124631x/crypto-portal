<template>
    <div class="open-orders-page page">
        <div class="header">Open Orders</div>
        <div class="card">
            <table>
                <tr>
                    <th>Pair</th>
                    <th>Avg. / Price</th>
                    <th>Filled / Amount</th>
                </tr>
                <tr class="order" v-for="order in globalState.openOrders" :key="order.orderId">
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
                        <div class="avg-price">{{ order.price }}</div>
                        <div class="price">{{ order.price }} / {{ order.type }}</div>
                    </td>

                    <td class="filled-amount">
                        <div class="filled">{{ order.executedQty}}</div>
                        <div class="amount">{{ order.origQty}} </div>
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
  name: "OpenOrdersPage",
  data() {
    return {
      globalState: store.state,
      isCanceledOrderHidden: true
    };
  },
  mounted() {
    service.openOrders(this.$route.params.symbol);
  },
  methods: {}
};
</script>

<style scoped lang="less">
@import "../less/common.less";
</style>