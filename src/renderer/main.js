import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import request from './utils/request'


import AtComponents from 'at-ui'
import 'at-ui-style/css/at.min.css'
Vue.use(AtComponents)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import VueClipboards from 'vue-clipboard2'
Vue.use(VueClipboards);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = request;
Vue.config.productionTip = false

new Vue({
  el: '#app',
  components: { App },
  router,
  store,
  template: '<App/>'
})