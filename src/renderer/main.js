import Vue from 'vue';


import App from './App';
import router from './router';
import store from './store';
import './permission';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import VueStorage from 'vue-ls';
import http from '@/plugin/$http';
import db from '../db';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';


Vue.use(Antd);
Vue.use(http);
Vue.use(VueStorage, {
  namespace: 'uniecloud__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
});
Vue.db = Vue.prototype.$db = db;
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

// var client = SocketIO(process.env.VUE_APP_API, { autoConnect: false })

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: client,
//   vuex: {
//     store,
//     actionPrefix: "SOCKET_",
//     mutationPrefix: "SOCKET_"
//   }
// }))

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app');



