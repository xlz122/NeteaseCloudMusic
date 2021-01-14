<template>
  <div class="login">
    <!-- 扫码登录 -->
    <qrcode @success="qrcodeSuccess" />
    <button class="other-btn" @click="otherLogin">选择其他登录模式</button>
    <div class="other"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Qrcode from '@views/login/Qrcode.vue';

export default defineComponent({
  components: {
    Qrcode
  },
  setup(props, ctx) {
    // 扫码登录成功
    function qrcodeSuccess() {
      // 关闭弹框
      ctx.emit('cancel');
    }
    // 切换其他方式登录
    function otherLogin() {
      console.log('切换其他方式登录');
    }
    return {
      qrcodeSuccess,
      otherLogin
    };
  }
});
</script>

<style lang="less" scoped>
.login {
  position: relative;
  margin: 0 auto;
  .other-btn {
    display: block;
    width: 118px;
    height: 100%;
    margin: 20px auto 0;
    padding-right: 0;
    font-size: 12px;
    border: 1px solid #979797;
    border-radius: 15px;
    line-height: 28px;
    text-align: center;
    color: rgba(0, 0, 0, 0.8);
    background-color: #fff;
    outline: none;
    cursor: pointer;
  }
}
</style>
