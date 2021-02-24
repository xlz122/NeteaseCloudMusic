<template>
  <!-- 所有其他登录方式 -->
  <div class="other" v-if="allOtherLogin">
    <div class="phone-login">
      <i class="icon-phone"></i>
      <div class="phone-login-btn">
        <i class="icon-phone-login" @click="phoneLogin">手机号登录</i>
      </div>
      <div class="phone-register-btn">
        <i class="icon-register-login" @click="register">注册</i>
      </div>
    </div>
    <ul class="other-login">
      <li class="item first-item" @click="weChatLogin">
        <i class="icon wechat"></i>
        <span class="text">微信登录</span>
      </li>
      <li class="item" @click="qqLogin">
        <i class="icon qq"></i>
        <span class="text">QQ登录</span>
      </li>
      <li class="item" @click="microBlogLogin">
        <i class="icon micro-blog"></i>
        <span class="text">微博登录</span>
      </li>
      <li class="item" @click="mailbox">
        <i class="icon mailbox"></i>
        <span class="text">网易邮箱帐号登录</span>
      </li>
    </ul>
    <div class="official">
      <label class="official-checkbox" for="official-checkbox">
        <input
          class="checkbox"
          id="official-checkbox"
          v-model="officialCheckbox"
          type="checkbox"
        />
        <span class="text">同意</span>
      </label>
      <ul class="left-nav">
        <li class="item">
          <a
            class="link"
            href="https://st.music.163.com/official-terms/service"
            target="_blank"
          >
            《服务条款》
          </a>
        </li>
        <li class="item">
          <a
            class="link"
            href="https://st.music.163.com/official-terms/privacy"
            target="_blank"
          >
            《隐私政策》
          </a>
        </li>
        <li class="item">
          <a
            class="link"
            href="https://st.music.163.com/official-terms/children"
            target="_blank"
          >
            《儿童隐私政策》
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- 右下角二维码  -->
  <i class="icon-qrcode-login" v-if="allOtherLogin" @click="qrcodeLogin"></i>
  <!-- 邮箱登录 -->
  <div class="mailbox-form" v-if="mailboxLoginShow">
    <mailbox />
  </div>
  <div
    class="return-other-login"
    v-if="!allOtherLogin"
    @click="returnOtherLogin"
  >
    <span class="text">&LT; 返回其他登录</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import Mailbox from './mailbox/Mailbox.vue';
// import { userInfo } from '@api/login';
// import { ResponseDataType } from '@/types/types';

export default defineComponent({
  components: {
    Mailbox
  },
  emits: ['qrcodeLogin'],
  setup(props, ctx) {
    const $store = useStore();

    // 扫码登录
    function qrcodeLogin() {
      ctx.emit('qrcodeLogin');
    }

    // 勾选协议
    const officialCheckbox = ref<boolean>(false);
    // 所有其他登录方式
    const allOtherLogin = ref<boolean>(true);

    // 手机号登录
    function phoneLogin(): boolean | undefined {
      if (!officialCheckbox.value) {
        alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
        return false;
      }
    }

    // 注册
    function register(): boolean | undefined {
      if (!officialCheckbox.value) {
        alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
        return false;
      }
    }

    // 邮箱登录部分
    const mailboxLoginShow = ref<boolean>(false);
    function mailbox(): boolean | undefined {
      if (!officialCheckbox.value) {
        alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
        return false;
      }
      allOtherLogin.value = false;
      mailboxLoginShow.value = true;
    }

    // 获取用户详情
    // function getUserInfo(uid: number): void {
    //   // 使用测试uid
    //   uid = 32953014;
    //   userInfo({ uid }).then((res: ResponseDataType) => {
    //     if (res.code === 200) {
    //       // 存储用户信息
    //       $store.commit('setUserInfo', res);
    //       // 关闭登录对话框
    //       $store.commit('setLoginDialog', false);
    //     } else {
    //       alert(res?.msg);
    //     }
    //   });
    // }

    // 微信登录
    function weChatLogin() {
      $store.commit('setMessage', {
        type: 'error',
        title: '暂不支持微信登录'
      });
    }

    // qq登录
    function qqLogin() {
      $store.commit('setMessage', {
        type: 'error',
        title: '暂不支持QQ登录'
      });
    }

    // 微博登录
    function microBlogLogin() {
      $store.commit('setMessage', {
        type: 'error',
        title: '暂不支持微博登录'
      });
    }

    // 返回其他登录
    function returnOtherLogin(): void {
      allOtherLogin.value = true;
      mailboxLoginShow.value = false;
    }
    return {
      qrcodeLogin,
      allOtherLogin,
      officialCheckbox,
      phoneLogin,
      register,
      mailbox,
      mailboxLoginShow,
      weChatLogin,
      qqLogin,
      microBlogLogin,
      returnOtherLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './other.less';
</style>
