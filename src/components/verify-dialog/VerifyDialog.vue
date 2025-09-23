<template>
  <div class="verify-dialog" v-if="verifyDialog.visible">
    <div class="dialog-container">
      <div class="dialog-close" @click="close">
        <i class="icon-close"></i>
      </div>
      <div class="dialog-content">
        <div class="qrcode" v-if="!qrcodeAuthorized">
          <p class="title">请完成短信验证</p>
          <div class="qrcode-img">
            <img :src="qrcodeImgSrc" alt="" />
          </div>
          <div class="qrcode-invalid" v-if="qrcodeInvalid">
            <div class="img"></div>
            <div class="text">二维码已失效</div>
            <span class="refresh" @click="refresh">点击刷新</span>
          </div>
          <div class="tip">
            <span>请使用手机登录</span>
            <span class="tip-text">网易云音乐APP</span>
            <span>扫码完成验证，登录账号要和当前账号一致</span>
          </div>
        </div>
        <div class="qrcode-authorized" v-else>
          <p class="title">账号一致</p>
          <img class="icon-phone" src="../../assets/image/verify/qrcode-authorized.png" alt="" />
          <div class="tip">
            <p class="tip-text">扫描成功</p>
            <p class="tip-text">请在手机上完成验证</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { verifyQrcode, verifyQrcodeStatus } from '@/api/user';
import type { ResponseType } from '@/types';

const store = useStore();
const verifyDialog = computed(() => store.getters.verifyDialog);

// 获取二维码图片
const qrCode = ref('');
const qrcodeImgSrc = ref('');

function getQrcodeImg(): void {
  verifyQrcode({ ...verifyDialog.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      qrCode.value = res.data?.qrCode ?? '';
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
  verifyQrcodeStatus({ qr: qrCode.value })
    .then((res: ResponseType) => {
      if (res?.data?.detailReason !== 0) {
        return;
      }

      // 失效
      if (res.data?.qrCodeStatus === 21) {
        qrcodeAuthorized.value = false;
        qrcodeInvalid.value = true;
      }
      // 等待扫码
      if (res.data?.qrCodeStatus === 0) {
        scanPolling(1000);
      }
      // 待确认 - 账号一致
      if (res.data?.qrCodeStatus === 10) {
        qrcodeAuthorized.value = true;
        scanPolling(1000);
      }
      // 授权成功
      if (res.data?.qrCodeStatus === 20) {
        close();
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

// 刷新
function refresh(): void {
  qrcodeInvalid.value = false;
  getQrcodeImg();
}

function close(): void {
  timer.value && clearTimeout(timer.value);
  store.commit('setVerifyDialog', { visible: false });
}

watch(
  () => verifyDialog.value.visible,
  () => {
    if (!verifyDialog.value.visible) {
      return;
    }

    qrcodeInvalid.value = false;
    qrcodeAuthorized.value = false;
    getQrcodeImg();
  }
);
</script>

<style lang="less" scoped>
@import url('./verify-dialog.less');
</style>
