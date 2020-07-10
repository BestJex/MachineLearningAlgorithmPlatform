import Vue from 'vue'
import axios from 'axios';
import App from './App.vue'
import store from "@/store";
import router from '@/router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.axios = axios;
Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'mini'});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')