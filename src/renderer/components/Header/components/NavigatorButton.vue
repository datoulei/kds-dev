<template>
  <div class="box">
    <a-icon class="btn back-btn" type="left" @click="handleTapBack"></a-icon>
    <div class="divider"></div>
    <a-icon class="btn forward-btn" type="right" @click="handleTapForward"></a-icon>
  </div>
</template>

<script>
export default {
  methods: {
    handleTapBack() {
      this.$router.go(-1);
    },
    handleTapForward() {
      this.$router.go(1);
    }
  }
};
</script>


<style lang="scss" scoped>
.box {
  margin-left: 48px;
  width: 49px;
  height: 22px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  .btn {
    -webkit-app-region: no-drag;
    flex: 1;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    &.disable {
      color: rgba(255, 255, 255, 0.2);
      cursor: default;
    }
  }
  .divider {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
