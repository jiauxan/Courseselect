// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import global_ from '../src/global'
Vue.prototype.GLOBAL = global_

// import VueResource from 'vue-resource';
// Vue.use(VueResource);
import 'iview/dist/styles/iview.css';
var echarts = require('echarts')
Vue.prototype.$echarts = echarts
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:8080/api'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.use(iView)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
