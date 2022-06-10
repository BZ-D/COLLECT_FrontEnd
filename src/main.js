import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"
import store from './store'
import * as echarts from 'echarts'
import globalWs from './global/globalWebSocket'

Vue.prototype.$globalWs=globalWs
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(ElementUI)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
