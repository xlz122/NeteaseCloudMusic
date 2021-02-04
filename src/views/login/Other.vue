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
      <li class="item first-item">
        <i class="icon wechat"></i>
        <span class="text">微信登录</span>
      </li>
      <li class="item">
        <i class="icon qq"></i>
        <span class="text">QQ登录</span>
      </li>
      <li class="item">
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
  <!-- 邮箱表单 -->
  <div class="mailbox-form" v-if="mailboxLoginShow">
    <div class="form-content">
      <input
        class="input"
        v-model="mailboxFormData.mailbox"
        type="text"
        placeholder="请输入账号"
      />
      <input
        class="input input-password"
        v-model="mailboxFormData.password"
        type="password"
        placeholder="请输入密码"
      />
    </div>
    <div class="verification" v-if="mailboxVerify">
      <i class="icon-verification"></i>
      <span class="text">{{ mailboxVerify }}</span>
    </div>
    <div class="mailbox-checkbox">
      <label for="mailbox-checkbox">
        <input class="checkbox" id="mailbox-checkbox" type="checkbox" />
        <span class="text">自动登录</span>
        <a
          class="forget-password"
          href="https://reg.163.com/naq/findPassword#/verifyAccount"
          target="_blank"
        >
          忘记密码？
        </a>
      </label>
    </div>
    <div class="mailbox-submit" @click="mailboxSubmit">
      <i class="icon-mailbox-submit">登 录</i>
    </div>
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
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { mailboxLogin, userInfo } from '@api/login';
import { ResponseDataType } from '@/types/types';

interface MailboxFormData {
  mailbox: string;
  password: string;
}

export default defineComponent({
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
    // 邮箱表单数据
    const mailboxFormData = reactive<MailboxFormData>({
      mailbox: '',
      password: ''
    });
    // 邮箱登录验证信息
    const mailboxVerify = ref<string>('');
    function mailboxSubmit(): boolean | undefined {
      if (!mailboxFormData.mailbox) {
        mailboxVerify.value = '请输入邮箱帐号';
        return false;
      }
      if (!mailboxFormData.password) {
        mailboxVerify.value = '请输入登录密码';
        return false;
      }
      mailboxLogin({
        email: mailboxFormData.mailbox,
        password: mailboxFormData.password
      }).then((res: ResponseDataType) => {
        if (res.code === 200) {
          document.cookie = `${res.cookie}`;
          // 存储账户信息
          localStorage.setItem('accountInfo', JSON.stringify(res?.account));
          $store.commit('setAccountInfo', res?.account);
          // 获取用户详情
          getUserInfo(res?.account?.id);
        } else {
          alert(res?.msg);
        }
      });
    }

    // 获取用户详情
    // 未完成，用户邮箱未绑定手机号，需先绑定手机号
    function getUserInfo(uid: number): void {
      // 使用测试uid
      uid = 32953014;
      userInfo({ uid }).then((res: ResponseDataType) => {
        if (res.code === 200) {
          // 存储用户信息
          localStorage.setItem('userInfo', JSON.stringify(res));
          $store.commit('setUserInfo', res);
          // 关闭登录对话框
          $store.commit('setLoginDialog', false);
        } else {
          alert(res?.msg);
        }
      });
    }

    // 返回其他登录
    function returnOtherLogin(): void {
      allOtherLogin.value = true;
      mailboxLoginShow.value = false;
      // 清空邮箱登录数据
      mailboxFormData.mailbox = '';
      mailboxFormData.password = '';
      mailboxVerify.value = '';
    }
    return {
      qrcodeLogin,
      allOtherLogin,
      officialCheckbox,
      phoneLogin,
      register,
      mailbox,
      mailboxLoginShow,
      mailboxFormData,
      mailboxVerify,
      mailboxSubmit,
      returnOtherLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './other.less';
</style>
