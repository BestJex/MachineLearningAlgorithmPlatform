import App from './App'
import Vue from 'vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueIconFont from 'vue-icon-font'
import axios from 'axios'
import VeLine from 'v-charts/lib/line.common'
import VeScatter from 'v-charts/lib/scatter.common'
import Contextmenu from 'vue-contextmenujs'
import './permission'

Vue.config.productionTip = false
Vue.use(ElementUI,{size:'mini'})
Vue.use(VueIconFont)
Vue.use(Contextmenu)
Vue.component(VeLine.name, VeLine)
Vue.component(VeScatter.name, VeScatter)
Vue.prototype.axios = axios

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

