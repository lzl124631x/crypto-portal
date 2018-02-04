import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import OrderHistoryPage from '@/components/OrderHistoryPage'

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
    }
  ]
})
