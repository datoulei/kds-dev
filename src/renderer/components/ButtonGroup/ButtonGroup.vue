<template>
  <div class="btn-group">
    <div :class="['btn',btn1]" @click="HandleEvent(0)">未划菜</div>
    <div :class="['btn',btn2]" @click="HandleEvent(1)">已划菜</div>
  </div>
</template>

<script>
export default {
  Props: {},
  data() {
    return {
      type: 0
    };
  },
  computed: {
    btn1() {
      if (this.type === 0) {
        return 'btn-style-1';
      } else {
        return 'btn-style-2';
      }
    },
    btn2() {
      if (this.type === 0) {
        return 'btn-style-2';
      } else {
        return 'btn-style-1';
      }
    }
  },
  methods: {
    HandleEvent(type) {
      this.type = type;
      this.$store.commit('SET_TYPE', type);
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group {
  margin: 12px;
  display: flex;
  flex-direction: row;
  border: 1px solid #5f79bf;
  border-radius: 2px;
  .btn {
    padding: 7px 24px;
    width: 102px;
  }

  .btn-style-1 {
    background-color: #5f79bf;
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .btn-style-2 {
    font-size: 18px;
    font-weight: 400;
    color: #d0e0ff;
  }
}
</style>