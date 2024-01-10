<template>
  <div class="verify-dialog" v-if="verifyDialog?.visible">
    <div class="dialog-container">
      <div class="dialog-close" @click="close">
        <i class="icon-close"></i>
      </div>
      <div class="dialog-content">
        <p class="title">请完成短信验证</p>
        <div class="qrcode">
          <div class="qrcode-img">
            <img :src="verifyDialog?.url" alt="" />
          </div>
          <div class="qrcode-tip" v-if="false">
            <div class="img"></div>
            <div class="text">二维码已失效</div>
            <span class="refresh">点击刷新</span>
          </div>
        </div>
        <div class="tip">
          <span>请使用手机登录</span>
          <span class="tip-text">网易云音乐APP</span>
          <span>扫码完成验证，登录账号要和当前账号一致</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const $store = useStore();
const verifyDialog = computed(() => $store.getters.verifyDialog);

function close(): void {
  $store.commit('setVerifyDialog', { visible: false, url: '' });
}
</script>

<style lang="less" scoped>
@import url('./verify-dialog.less');
</style>
