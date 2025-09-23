<template>
  <Dialog :visible="loginDialog" :title="'登录'" @cancel="dialogCancel">
    <div class="login">
      <!-- 扫码登录 -->
      <qrcode v-if="loginType === 'qrcode'" @otherLogin="otherLogin" />
      <!-- 其他登录 -->
      <other v-if="loginType === 'other'" @qrcodeLogin="qrcodeLogin" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import Dialog from '@/components/Dialog.vue';
import Qrcode from './qrcode/Qrcode.vue';
import Other from './other/Other.vue';

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const loginDialog = computed(() => store.getters.loginDialog);

// 扫码/其他登录切换
const loginType = ref('qrcode');

function qrcodeLogin(): void {
  loginType.value = 'qrcode';
}

function otherLogin(): void {
  loginType.value = 'other';
}

// 关闭登录
function dialogCancel(): void {
  loginType.value = 'qrcode';
  store.commit('setLoginDialog', false);
}

// 登录方式重置
watch(
  () => isLogin.value,
  () => {
    loginType.value = 'qrcode';
  }
);

onUnmounted(() => {
  loginType.value = 'qrcode';
});
</script>
