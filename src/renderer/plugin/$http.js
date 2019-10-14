import Vue from 'vue';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import Message from 'ant-design-vue/es/message';
import { ipcRenderer } from 'electron';


console.log('VUE_APP_API=', process.env.VUE_APP_API)

// 创建 axios 实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_API, // api base_url
  timeout: 10 * 1000, // 请求超时时间10s
  adapter: httpAdapter
});

const err = async error => {
  if (error.response) {
    const data = error.response.data;
    const token = Vue.db.has('token').value();

    let silent = false;

    if (error.config.params) {
      silent = !!error.config.params.silent;
    }

    if (error.response.status === 403 && !silent) {
      Message.error(data.message);
    }
    if (error.response.status === 401) {
      if (!silent) {
        await Message.error('登录状态过期，请重新登录', 2);
      }
      if (token) {
        // 退出登录
        ipcRenderer.send('logout');
      }
    }
    if (error.response.status === 400 && !silent) {
      Message.error(data.message || data.error || '未知错误');
    }
    if (error.response.status === 422 && !silent) {
      Message.error({
        message: '请求错误',
        description: error.response.data.error,
        duration: 4
      });
    }
    if (error.response.status === 500 && !silent) {
      Message.error({
        message: '服务器异常',
        description: error.response.data.error,
        duration: 4
      });
    }
    if (error.response.status === 404 && !silent) {
      Message.error({
        message: data.message || data.error || '未知错误',
        description: error.response.data.error,
        duration: 4
      });
    }
  }
  return Promise.reject(error);
};

instance.interceptors.request.use(config => {
  if (Vue.db.has('token').value()) {
    const token = Vue.db.get('token').value();
    config.headers['Authorization'] = `Bearer ${token}`; // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config;
}, err);

instance.interceptors.response.use(response => {
  return response.data;
}, err);

export default {
  install(Vue) {
    Vue.http = instance;
    Object.defineProperties(Vue.prototype, {
      $http: {
        get: function get() {
          return instance;
        }
      }
    });
  }
};
