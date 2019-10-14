<template>
  <div class="page">
    <div class="main">
      <div class="header">
        <a-icon class="btn close-btn" type="close" @click="handleClose" />
      </div>
      <div class="body">
        <div class="logo-div">
          <img src="~@/assets/logo.png" />
        </div>
        <div class="system-name">遇见小面厨房显示系统</div>
        <div class="login-div">
          <a-form ref="form" :form="form">
            <a-form-item>
              <a-input
                v-decorator="['mobile', { rules: [{ required: true, message: '该项不能为空'}]}]"
                class="input"
                placeholder="请输入手机号码/签到账号"
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                v-decorator="['password', { rules: [{ required: true, message: '该项不能为空'}]}]"
                type="password"
                class="input"
                placeholder="请输入密码"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
              </a-input>
            </a-form-item>
          </a-form>
          <a-button class="login-btn" type="primary" @click="handleSubmit">登录</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
  data() {
    return {
      form: this.$form.createForm(this)
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const form = await this.form.validateFields();
        const { token } = await this.$http.post('/login', {
          ...form,
          type: 4
        });
        await this.$message.success('登录成功！', 1);
        ipcRenderer.sendSync('login', token);
      } catch (error) {
        console.log(error);
      }
    },
    handleClose() {
      ipcRenderer.send('window', 'close');
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: row;
  & > div {
    flex: 1;
  }

  .main {
    height: 434px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .header {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      .close-btn {
        margin-top: 16px;
        margin-right: 16px;
        width: 12px;
        height: 12px;
        cursor: pointer;
      }
    }
    .body {
      display: flex;
      flex: 1;
      margin: 0 48px;
      flex-direction: column;
      align-items: center;
      .logo-div {
        margin-top: 28px;
      }
      .system-name {
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 18px;
        font-weight: 600;
        color: rgba(34, 34, 34, 1);
        line-height: 24px;
      }

      .login-div {
        margin-top: 16px;
      }

      .input {
        width: 282px;
        height: 40px;
        background: rgba(247, 247, 247, 1);
        border-radius: 8px;
        border: 1px solid rgba(229, 229, 229, 1);
        & + .input {
          margin-top: 8px;
        }
      }
      .login-btn {
        margin-top: 24px;
        width: 282px;
        height: 40px;
        background: rgba(246, 15, 15, 1);
        border-radius: 2px;
      }
    }
  }
}
</style>


<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 8px;
}
</style>
