<template>
  <div class="verify-modal" v-if="verifyDialog?.visible">
    <div class="modal-container">
      <div class="modal-close" @click="close">
        <i class="icon-close"></i>
      </div>
      <div class="modal-content">
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
  $store.commit('setVerifyDialog', { visible: false });
}
</script>

<style lang="less" scoped>
@import url('./verify-modal.less');
</style>
