<template>
  <div class="order-history-page page">
    <table>
      <tr>
        <th>Pair</th>
        <th>Avg. / Price</th>
        <th>Filled / Amount</th>
      </tr>
      <tr class="order" v-for="order in globalState.orders" :key="order.orderId" :class="{ canceled: order.status == 'CANCELED' }">
        <td class="pair">
          <div class="side-symbol">
            <div class="side-badge" :class="{ green: order.side == 'BUY', red: order.side == 'SELL' }">{{ order.side == 'BUY' ? "B" : "S" }}</div>
            <div class="symbol">{{ order.symbol }}</div>
          </div>
          <div class="time">
            {{ formatTime(order.time) }}
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
</template>

<script>
import moment from "moment";
export default {
  name: "OrderHistoryPage",
  data() {
    return {
      globalState: store.state
    };
  },
  methods: {
    formatTime(time) {
      return moment(time).format("MM-DD hh:mm:ss");
    }
  }
};
</script>

<style scoped lang="less">
table {
  width: 100%;
  border-collapse: collapse;
  td,
  th {
    padding: 0.5em;
  }
  tr + tr {
    td {
      border-bottom: 1px solid var(--border-color);
    }
  }
  th {
    color: var(--secondary-text-color);
    font-weight: normal;
    font-size: 0.8em;
  }
}
.pair {
  .side-badge {
    display: inline-block;
    font-size: 0.8em;
    border-radius: 0.4em;
    padding: 0.1em 0.3em;
    &.green {
      background-color: var(--green);
    }
    &.red {
      background-color: var(--red);
    }
  }
  .symbol {
    display: inline-block;
  }

  .time {
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
}

.price,
.amount {
  color: var(--secondary-text-color);
}

.order {
  &:not(.canceled) {
    background-color: var(--highlight-background-color);
  }
  &.canceled {
    opacity: 0.6;
  }
}
</style>