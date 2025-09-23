<template>
  <!-- 其他登录 -->
  <div class="other" v-if="loginMode.allOtherLogin">
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
        <input class="checkbox" id="official-checkbox" v-model="officialCheckbox" type="checkbox" />
        <span class="text">同意</span>
      </label>
      <ul class="left-nav">
        <li class="item">
          <a class="link" href="https://st.music.163.com/official-terms/service" target="_blank">
            《服务条款》
          </a>
        </li>
        <li class="item">
          <a class="link" href="https://st.music.163.com/official-terms/privacy" target="_blank">
            《隐私政策》
          </a>
        </li>
        <li class="item">
          <a class="link" href="https://st.music.163.com/official-terms/children" target="_blank">
            《儿童隐私政策》
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- 右下角二维码 -->
  <i class="icon-qrcode-login" v-if="loginMode.allOtherLogin" @click="qrcodeLogin"></i>
  <!-- 手机登录 -->
  <div class="mobile-phone-form" v-if="loginMode.mobileLogin">
    <MobilePhoneLogin />
  </div>
  <!-- 手机注册 -->
  <div class="mobile-phone-form" v-if="loginMode.mobileRegister">
    <MobilePhoneRegister />
  </div>
  <!-- 邮箱登录 -->
  <div class="mailbox-form" v-if="loginMode.mailboxLogin">
    <Mailbox />
  </div>
  <!-- 返回其他登录 -->
  <div class="return-other-login" v-if="!loginMode.allOtherLogin">
    <!-- 手机号注册 -->
    <template v-if="loginMode.mobileRegister">
      <span class="text" @click="returnOtherLogin"> &LT; 返回登录 </span>
    </template>
    <template v-else>
      <span class="text" @click="returnOtherLogin">&LT; 返回其他登录</span>
    </template>
    <span class="register" v-if="loginMode.mobileLogin" @click="mobileTypeSwitch">
      没有帐号？免费注册 >
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { setMessage } from '@/hooks/useMessage';
import MobilePhoneLogin from './mobile-login/MobileLogin.vue';
import MobilePhoneRegister from './mobile-register/MobileRegister.vue';
import Mailbox from './mailbox/Mailbox.vue';

const emits = defineEmits(['qrcodeLogin']);

// 扫码登录
function qrcodeLogin(): void {
  emits('qrcodeLogin');
}

// 登录方式
const loginMode = reactive({
  mobileLogin: false,
  mobileRegister: false,
  mailboxLogin: false,
  allOtherLogin: true
});
// 协议勾选
const officialCheckbox = ref(false);

// 手机号登录
function phoneLogin(): void {
  if (!officialCheckbox.value) {
    alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
    return;
  }

  loginMode.allOtherLogin = false;
  loginMode.mobileLogin = true;
}

// 注册
function register(): void {
  if (!officialCheckbox.value) {
    alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
    return;
  }

  loginMode.allOtherLogin = false;
  loginMode.mobileRegister = true;
}

// 登录切换注册
function mobileTypeSwitch(): void {
  loginMode.allOtherLogin = false;
  loginMode.mobileLogin = false;
  loginMode.mobileRegister = true;
}

// 邮箱登录部分
function mailbox(): void {
  if (!officialCheckbox.value) {
    alert('请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》');
    return;
  }

  loginMode.allOtherLogin = false;
  loginMode.mailboxLogin = true;
}

// 微信登录
function weChatLogin(): void {
  setMessage({ type: 'error', title: '暂不支持微信登录' });
}

// qq登录
function qqLogin(): void {
  setMessage({ type: 'error', title: '暂不支持QQ登录' });
}

// 微博登录
function microBlogLogin(): void {
  setMessage({ type: 'error', title: '暂不支持微博登录' });
}

// 返回其他登录
function returnOtherLogin(): void {
  loginMode.mailboxLogin = false;
  loginMode.mobileRegister = false;
  loginMode.mobileLogin = false;
  loginMode.allOtherLogin = true;
}
</script>

<style lang="less" scoped>
@import url('./other.less');
</style>
