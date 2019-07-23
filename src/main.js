import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import 'normalize.css'
import '@/assets/css/common.scss'
import '@/assets/iconfont/iconfont.js'
import '@/assets/iconfont/iconfont.css'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
