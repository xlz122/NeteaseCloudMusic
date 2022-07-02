<template>
  <div class="abnormal-modal" v-if="abnormal?.visible">
    <div class="modal-container">
      <div class="modal-close" @click="close">X</div>
      <div class="modal-content">
        <p class="title">请完成短信验证</p>
        <div class="qrcode">
          <div class="qrcode-img">
            <img :src="abnormal?.url" alt="" />
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

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AbnormalModal',
  setup() {
    const $store = useStore();

    const abnormal = computed(() => $store.getters.abnormal);

    function close(): void {
      $store.commit('setAbnormal', { visible: false });
    }

    return {
      abnormal,
      close
    };
  }
});
</script>

<style lang="less" scoped>
@import './abnormal-modal.less';
</style>
