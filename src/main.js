import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
// 导入字体图标
import './assets/font/iconfont.css'

if (process.env.NODE_ENV === 'test') {
  const { mockXHR } = require('../mock/static')
  mockXHR()
}
import RemixIcon from '@/components/RemixIcon'
Vue.component('Vab-remix-icon', RemixIcon)
Vue.config.productionTip = false
new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: (h) => h(App),
})
