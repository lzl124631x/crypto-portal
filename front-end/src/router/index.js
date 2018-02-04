import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import OrderHistoryPage from '@/components/OrderHistoryPage'
import SnapshotPage from '@/components/SnapshotPage'
import BalancePage from '@/components/BalancePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/order-history',
      name: 'OrderHistoryPage',
      component: OrderHistoryPage
    },
    {
      path: '/snapshot',
      name: 'SnapshotPage',
      component: SnapshotPage
    },
    {
      path: '/balance',
      name: 'BalancePage',
      component: BalancePage
    }
  ]
})
