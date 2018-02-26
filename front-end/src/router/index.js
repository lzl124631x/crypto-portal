import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import OrderHistoryPage from '@/components/OrderHistoryPage'
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
      path: '/order-history/:symbol',
      name: 'OrderHistoryPage',
      component: OrderHistoryPage
    },
    {
      path: '/balance',
      name: 'BalancePage',
      component: BalancePage
    }
  ]
})
