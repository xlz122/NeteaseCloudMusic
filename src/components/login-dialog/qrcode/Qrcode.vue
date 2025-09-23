<template>
  <div class="qrcode" v-if="!qrcodeAuthorized">
    <img class="icon-phone" src="../../../assets/image/login/qrcode-phone.png" alt="" />
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
        <router-link class="link" to="/download" target="_blank"> 网易云音乐APP </router-link>
        扫码登录
      </div>
    </div>
  </div>
  <div class="qrcode-authorized" v-else>
    <img class="icon-phone" src="../../../assets/image/login/qrcode-authorized.png" alt="" />
    <p class="title">扫描成功</p>
    <p class="text">请在手机上确认登录</p>
  </div>
  <button class="other-btn" @click="otherLogin">选择其他登录模式</button>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { qrcodeKey, qrcodeImg, qrcodeStatus, accountInfo, userInfo } from '@/api/login';
import type { ResponseType } from '@/types';

const emits = defineEmits(['otherLogin']);

const store = useStore();

// 获取二维码登录key
const qrcodeImgKey = ref('');

function getQrcodeImgKey(): void {
  qrcodeKey()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      qrcodeImgKey.value = res.data?.unikey ?? '';
      getQrcodeImg();
    })
    .catch(() => ({}));
}
getQrcodeImgKey();

// 获取二维码图片
const qrcodeImgSrc = ref('');

function getQrcodeImg(): void {
  qrcodeImg({
    key: qrcodeImgKey.value,
    qrimg: true
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      qrcodeImgSrc.value = res.data?.qrimg ?? '';
      getQrcodeStatus();
    })
    .catch(() => ({}));
}

// 二维码失效
const qrcodeInvalid = ref(false);
// 二维码待确认
const qrcodeAuthorized = ref(false);

function getQrcodeStatus(): void {
  qrcodeStatus({ key: qrcodeImgKey.value })
    .then((res: ResponseType) => {
      // 失效
      if (res?.code === 800) {
        qrcodeAuthorized.value = false;
        qrcodeInvalid.value = true;
      }
      // 等待扫码
      if (res?.code === 801) {
        scanPolling(1000);
      }
      // 待确认
      if (res?.code === 802) {
        qrcodeAuthorized.value = true;
        scanPolling(1000);
      }
      // 授权成功
      if (res?.code === 803) {
        const cookie = res.cookie as string;
        const cookieArr: string[] = cookie.split(';;');
        cookieArr.forEach?.((item) => {
          document.cookie = item;
        });
        store.commit('setCookie', res.cookie);
        getAccount();
      }
    })
    .catch(() => ({}));
}

// 扫描状态轮询
const timer = ref<number | null>(null);

function scanPolling(time: number): void {
  timer.value && clearTimeout(timer.value);

  timer.value = setTimeout(() => {
    getQrcodeStatus();
  }, time);
}

// 获取账号信息
function getAccount(): void {
  accountInfo()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      getUserInfo(res.account?.id);
    })
    .catch(() => ({}));
}

// 获取用户详情
function getUserInfo(uid: number): void {
  userInfo({ uid })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      store.commit('setUserInfo', res);
      store.commit('setLoginDialog', false);
    })
    .catch(() => ({}));
}

// 刷新
function refresh(): void {
  qrcodeInvalid.value = false;
  getQrcodeImgKey();
}

// 其他登录
function otherLogin(): void {
  timer.value && clearTimeout(timer.value);

  emits('otherLogin');
}

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }

  qrcodeImgKey.value = '';
  qrcodeImgSrc.value = '';
});
</script>

<style lang="less">
@import url('./qrcode.less');
</style>
