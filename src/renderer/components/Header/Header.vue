<template>
  <div class="header" v-if="!full">
    <!-- 按钮组 -->
    <v-button-group />
    <div class="active">
      <ActionBar />
      <div class="divider"></div>
      <UserBar />
      <div class="divider"></div>
      <div class="remark">
        <span class="desc">显示备注</span>
        <a-switch defaultChecked size="small" style="background-color:#5F79BF;" @change="change" />
      </div>
      <div class="divider"></div>
      <div class="full-screen" @click="fullScreen()">全屏显示</div>
    </div>
  </div>
</template>

<script>
import UserBar from './components/UserBar';
import ActionBar from './components/ActionBar';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';
export default {
  components: {
    UserBar,
    'v-button-group': ButtonGroup,
    ActionBar
  },
  data() {
    return {
      showRemark: true
    };
  },
  created() {},
  computed: {
    btnState(type) {
      return;
    },
    full() {
      return this.$store.state.user.full;
    }
  },
  methods: {
    change(value) {
      this.$store.commit('SET_REMARK', value);
    },
    fullScreen() {
      this.$store.commit('SET_FULL', true);
      this.$store.commit('SET_CARD1HEIGHT', window.screen.height - 24);
      this.$store.commit('SET_CARD23HEIGHT', (window.screen.height - 36) / 2);
    }
  },
  mounted() {
    this.$store.commit('SET_CARD1HEIGHT', window.screen.height - 100 - 24);
    this.$store.commit(
      'SET_CARD23HEIGHT',
      (window.screen.height - 100 - 36) / 2
    );
  }
};
</script>


<style lang="scss" scoped>
.header {
  // Windows下无法交互
  //-webkit-app-region: drag;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #20232d;
  height: 60px;

  .active {
    display: flex;
    flex: 1;
    flex-direction: row-reverse;
    align-items: center;
    .divider {
      margin: 0 16px;
      width: 1px;
      height: 24px;
      background-color: #353945;
      // opacity: 0.2;
    }
  }
}

.full-screen {
  color: #fff;
  padding: 5px 14px;
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #5f79bf;
}
.remark {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 5px 14px;
  font-size: 16px;
  font-weight: 400;
  .desc {
    margin-right: 8px;
  }
}
</style>
