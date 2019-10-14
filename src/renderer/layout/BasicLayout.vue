<template>
  <div class="layout">
    <div class="v-header">
      <v-header />
    </div>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header';
export default {
  components: {
    'v-header': Header
  }
};
</script>




<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100vh;
}
.v-header {
  //height: 60px;
}
.container {
  flex: 1;
  padding: 0px;
  overflow-y: auto;
  background-color: #0c0d13;
}
</style>
