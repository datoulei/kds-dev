<template>
  <a-dropdown placement="bottomRight" :trigger="['click']">
    <div class="ant-dropdown-link">
      <span class="nickname">{{username}}</span>
      <a-icon class="caret" type="caret-down" />
    </div>
    <a-menu class="custom-dropmenu" slot="overlay">
      <a-menu-divider />
      <a-menu-item>
        <p class="logout-btn" @click="logout">退出登录</p>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';
import { ipcRenderer } from 'electron';

export default {
  computed: {
    ...mapGetters(['UserInfo']),
    avatar() {
      try {
        return this.UserInfo.avatar;
      } catch (error) {
        return '';
      }
    },
    nickname() {
      try {
        return this.UserInfo.nickname;
      } catch (error) {
        return '';
      }
    },
    username() {
      try {
        return this.UserInfo.username;
      } catch (error) {
        return '';
      }
    }
  },
  methods: {
    logout() {
      this.$confirm({
        title: '提示',
        content: '是否确认退出？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          ipcRenderer.send('logout');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-dropdown-link {
  -webkit-app-region: no-drag;
  cursor: default;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  font-family: PingFangTC-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 16px;
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 8px;
  }
  .nickname {
    margin-right: 6px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-weight: 400;
  }
  .caret {
    font-size: 6px;
  }
}
.custom-dropmenu {
  -webkit-app-region: no-drag;
  width: 212px;
  padding: 0 16px;
  box-sizing: border-box;
  .user-detail {
    display: flex;
    flex-direction: row;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      margin-right: 8px;
    }
    .column {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .nickname {
        height: 20px;
        font-size: 14px;
        font-family: PingFangTC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        margin-bottom: 4px;
        display: inline-block;
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .label {
        height: 16px;
        background: rgba(255, 62, 62, 1);
        border-radius: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 4px;
        font-size: 10px;
        font-family: PingFangTC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 14px;
        &::before {
          display: block;
          content: '';
          width: 12px;
          height: 12px;
          background-image: url('~@/assets/label.png');
          background-size: contain;
          margin-right: 2px;
        }
      }
    }
  }
  .item {
    label {
      height: 16px;
      font-size: 12px;
      font-family: PingFangTC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 16px;
      margin-bottom: 6px;
    }
    p {
      margin: 0;
      height: 16px;
      font-size: 12px;
      font-family: PingFangTC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 16px;
    }
  }
  .logout-btn {
    text-align: center;
    height: 16px;
    font-size: 12px;
    font-family: PingFangTC-Regular;
    font-weight: 400;
    color: rgba(246, 15, 15, 1);
    line-height: 16px;
    margin: 0;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.custom-dropmenu {
  .ant-dropdown-menu-item {
    cursor: default;
    padding: 10px 0;
    &:hover {
      background-color: transparent;
    }
  }
}
</style>
