import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import request from './utils/request'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import Contextmenu from "vue-contextmenujs/dist/contextmenu.umd"
Vue.use(Contextmenu);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$http = request;
Vue.config.productionTip = false

import utils from './utils/utils';
console.log(utils);
Object.keys(utils).forEach(key => {Vue.prototype[key] = utils[key]});

import SqlShowDialog from './views/index/dialog/SqlShowDialog';
Vue.prototype.$SqlShowDialog = SqlShowDialog.install;

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

Vue.directive('highlight',function (el) {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block)=>{hljs.highlightBlock(block)})
})

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')