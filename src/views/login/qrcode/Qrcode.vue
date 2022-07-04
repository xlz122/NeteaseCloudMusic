<template>
  <div class="qrcode" v-if="!qrcodeAuthorized">
    <img
      class="icon-phone"
      src="../../../assets/image/login/qrcode-phone.png"
      alt=""
    />
    <div class="qrcode-right">
      <p class="title">扫码登录</p>
      <div class="qrcode-img">
        <div class="img">
          <img :src="qrcodeImgSrc" alt="Scan me!" />
        </div>
        <div class="tip" v-if="qrcodeInvalid">
          <div class="text">二维码已失效</div>
          <span class="refresh" @click="refresh">点击刷新</span>
        </div>
      </div>
      <div class="text">
        使用
        <router-link class="link" to="/download" target="_blank">
          网易云音乐APP
        </router-link>
        扫码登录
      </div>
    </div>
  </div>
  <div class="qrcode-authorized" v-else>
    <img
      class="icon-phone"
      src="../../../assets/image/login/qrcode-phone-authorized.png"
      alt=""
    />
    <p class="title">扫描成功</p>
    <p class="text">请在手机上确认登录</p>
  </div>
  <button class="other-btn" @click="otherLogin">选择其他登录模式</button>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {
  qrcodeKey,
  qrcodeImg,
  qrcodeStatus,
  accountInfo,
  userInfo
} from '@api/login';
import type { ResponseType } from '@/types/types';

export default defineComponent({
  name: 'LoginQrcode',
  emits: ['otherLogin'],
  setup(props, ctx) {
    const $store = useStore();

    // 获取二维码登录key
    const qrcodeImgKey = ref<string>('');
    function getQrcodeImgKey() {
      qrcodeKey()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            qrcodeImgKey.value = res.data.unikey;
            getQrcodeImg();
          }
        })
        .catch(() => ({}));
    }
    getQrcodeImgKey();

    // 二维码图片路径
    const qrcodeImgSrc = ref<string>('');
    function getQrcodeImg() {
      qrcodeImg({
        key: qrcodeImgKey.value,
        qrimg: true
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            qrcodeImgSrc.value = res.data.qrimg;
            getQrcodeStatus();
          }
        })
        .catch(() => ({}));
    }

    // 二维码失效
    const qrcodeInvalid = ref<boolean>(false);
    // 二维码待确认
    const qrcodeAuthorized = ref<boolean>(false);

    function getQrcodeStatus() {
      qrcodeStatus({
        key: qrcodeImgKey.value
      })
        .then((res: ResponseType) => {
          // 800失效，
          if (res.code === 800) {
            qrcodeInvalid.value = true;
          }
          // 801等待扫码，
          if (res.code === 801) {
            scanPolling(1000);
          }
          // 802待确认
          if (res.code === 802) {
            scanPolling(1000);
            qrcodeAuthorized.value = true;
          }
          // 803授权成功
          if (res.code === 803) {
            const cookie = res.cookie as string;
            const cookieArr: string[] = cookie.split(';;');
            cookieArr.forEach(item => {
              document.cookie = item;
            });
            // 存储用户cookie
            $store.commit('setCookie', res.cookie);
            getAccount();
          }
        })
        .catch(() => ({}));
    }

    // 轮询扫码状态
    const timer = ref<number>(0);
    function scanPolling(time: number): void {
      if (timer.value) {
        clearTimeout(timer.value);
      }
      timer.value = setTimeout(() => {
        getQrcodeStatus();
      }, time);
    }

    // 获取账号信息
    function getAccount(): void {
      accountInfo()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 获取用户详情
            getUserInfo(res?.account?.id);
          }
        })
        .catch(() => ({}));
    }

    // 获取用户详情
    function getUserInfo(uid: number): void {
      userInfo({ uid })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 存储用户信息
            $store.commit('setUserInfo', res);
            // 关闭登录对话框
            $store.commit('setLoginDialog', false);
          }
        })
        .catch(() => ({}));
    }

    // 刷新
    function refresh(): void {
      getQrcodeImgKey();
      qrcodeInvalid.value = false;
    }

    // 其他登录
    function otherLogin(): void {
      ctx.emit('otherLogin');
    }

    onUnmounted(() => {
      if (timer.value) {
        clearTimeout(timer.value);
      }
      qrcodeImgKey.value = '';
      qrcodeImgSrc.value = '';
    });

    return {
      qrcodeImgSrc,
      qrcodeInvalid,
      qrcodeAuthorized,
      refresh,
      otherLogin
    };
  }
});
</script>

<style lang="less">
@import './qrcode.less';
</style>
