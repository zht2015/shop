import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/base.css'
Vue.use(VueAxios, axios)
Vue.use(ElementUI);
Vue.axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1';
Vue.config.productionTip = false
// 添加请求拦截器
Vue.axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers={
    Authorization:sessionStorage.getItem('token')
  }
  return config;
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
