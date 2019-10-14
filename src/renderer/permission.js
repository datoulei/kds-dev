import Vue from 'vue';
import router from './router';
import store from './store';
import db from '../db';
import { ipcRenderer } from 'electron';

router.beforeEach(async (to, from, next) => {
  // 判断是否进入登录页面
  if (from.fullPath === '/' && to.name === 'login') {
    return next();
  }
  if (db.has('token').value()) {
    const UserInfo = store.getters.UserInfo;
    if (!UserInfo) {
      // 请求用户信息
      await store.dispatch('GetUserInfo');
    }
    next();
  } else {
    // ipcRenderer.send('logout');
  }
});
