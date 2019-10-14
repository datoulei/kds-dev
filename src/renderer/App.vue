<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import db from '../db';
export default {
  name: 'kds-desktop',
  sockets: {
    connect() {
      console.log('连接成功');
    },
    disconnect() {
      console.log('断开连接');
    }
  },
  created() {},
  mounted() {
    this.connectSocket();
  },
  methods: {
    connectSocket() {
      const token = db.get('token').value();
      console.log('token:', token);
      if (token) {
        this.$socket.io.opts.query = {
          token
        };
        this.$socket.open();
      } else {
        this.$socket.close();
      }
    }
  }
};
</script>

<style lang="less">
@import '~normalize.css/normalize.css';
/* CSS */
body {
  background-color: #f5f5f5 !important;
  font-family: 'Microsoft Yahei';
}
</style>
