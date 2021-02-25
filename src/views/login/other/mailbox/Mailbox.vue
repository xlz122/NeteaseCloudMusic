<template>
  <div class="form-content">
    <input
      class="input"
      :class="{
        'verify-error': mailboxVerify.show && mailboxVerify.type === 'mailbox'
      }"
      v-model="mailboxFormData.mailbox"
      type="text"
      placeholder="请输入账号"
    />
    <input
      class="input input-password"
      :class="{
        'verify-error': mailboxVerify.show && mailboxVerify.type === 'password'
      }"
      v-model="mailboxFormData.password"
      type="password"
      placeholder="请输入密码"
    />
  </div>
  <div class="verification" v-if="mailboxVerify.show">
    <i class="icon-verification"></i>
    <span class="text">{{ mailboxVerify.text }}</span>
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
</template>

<script lang="ts">
import { defineComponent, onUnmounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { mailboxLogin, userInfo } from '@api/login';
import { ResponseDataType } from '@/types/types';

interface MailboxFormData {
  mailbox: string;
  password: string;
}

interface MailboxVerify {
  show: boolean;
  type: string;
  text: string;
}

interface VerifyMethod {
  type?: string;
  text: string;
}

export default defineComponent({
  setup() {
    const $store = useStore();

    // 邮箱表单数据
    const mailboxFormData = reactive<MailboxFormData>({
      mailbox: '',
      password: ''
    });

    // 邮箱登录验证信息
    const mailboxVerify = reactive<MailboxVerify>({
      show: false,
      type: 'mailbox',
      text: ''
    });

    // 邮箱验证方法
    function verifyMethod({ type = '', text }: VerifyMethod): void {
      mailboxVerify.show = true;
      mailboxVerify.type = type;
      mailboxVerify.text = text;
    }

    function mailboxSubmit(): boolean | undefined {
      mailboxVerify.show = false;
      if (!mailboxFormData.mailbox) {
        verifyMethod({ type: 'mailbox', text: '请输入邮箱帐号' });
        return false;
      }
      if (!mailboxFormData.password) {
        verifyMethod({ type: 'password', text: '请输入登录密码' });
        return false;
      }
      mailboxLogin({
        email: mailboxFormData.mailbox,
        password: mailboxFormData.password
      })
        .then((res: ResponseDataType) => {
          console.log(res);
          // 账号或密码错误
          if (res.code === 502) {
            verifyMethod({ text: '帐号或密码错误' });
          }
          // 邮箱未绑定手机号，需先绑定手机号
          if (res.code === 200 && res.account.status === -10) {
            // 需要跳转手机号登录
            verifyMethod({ text: '需要跳转手机号登录' });
          }
          // 登录成功
          if (res.code === 200 && res.account.status === 0) {
            document.cookie = `${res.cookie}`;
            // 存储账户信息
            $store.commit('setAccountInfo', res?.account);
            // 获取用户详情
            getUserInfo(res?.account?.id);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    // 获取用户详情
    function getUserInfo(uid: number): void {
      userInfo({ uid }).then((res: ResponseDataType) => {
        if (res.code === 200) {
          // 存储用户信息
          $store.commit('setUserInfo', res);
          // 关闭登录对话框
          $store.commit('setLoginDialog', false);
        }
      });
    }

    onUnmounted(() => {
      // 清空邮箱登录数据
      mailboxFormData.mailbox = '';
      mailboxFormData.password = '';
      mailboxVerify.type = '';
      mailboxVerify.text = '';
    });
    return {
      mailboxFormData,
      mailboxVerify,
      mailboxSubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import './mailbox.less';
</style>
