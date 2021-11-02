import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import AtComponents from 'at-ui'
import 'at-ui-style/css/at.min.css'
Vue.use(AtComponents)

import VueClipboards from 'vue-clipboard2'
Vue.use(VueClipboards);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>'
})