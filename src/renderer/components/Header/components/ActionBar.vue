<template>
  <div class="box">
    <a-icon class="btn minimize" type="minus" @click="handleClick('minimize')"></a-icon>
    <!-- <a-icon class="btn maximize" type="border" @click="handleClick('maximize')"></a-icon> -->
    <a-icon class="btn close" type="close" @click="handleClick('close')"></a-icon>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
export default {
  methods: {
    handleClick(type) {
      if ('maximize' === type) {
        let width = this.$store.state.user.windowWidth;
      }
      ipcRenderer.sendSync('window', type);
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  align-items: center;
  display: flex;
  margin-right: 8px;
}
.btn {
  -webkit-app-region: no-drag;
  display: inline-block;
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.4);
  margin-right: 8px;
  cursor: pointer;
}
</style>
