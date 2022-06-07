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

const deepClone = (a) => {
  return JSON.parse(JSON.stringify(a));
}
const equals = (a,b) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

const isEmpty = (a) => {
  return a===''||a===undefined||a===null;
}

Vue.prototype.equals = equals;
Vue.prototype.deepClone = deepClone;
Vue.prototype.isEmpty = isEmpty;

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')