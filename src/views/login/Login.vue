<template>
  <my-dialog
    class="my-dialog"
    :visible="loginDialog"
    :title="'登录'"
    @cancel="dialogCancel"
  >
    <div class="login">
      <!-- 扫码登录 -->
      <qrcode v-if="loginType === 'qrcode'" @otherLogin="otherLogin" />
      <!-- 其他登录方式 -->
      <other v-if="loginType === 'other'" @qrcodeLogin="qrcodeLogin" />
    </div>
  </my-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
// 使用setup语法糖，没有export default爆红，不是语法问题
import MyDialog from '@/components/MyDialog.vue';
import Qrcode from '@views/login/qrcode/Qrcode.vue';
import Other from '@views/login/other/Other.vue';

export default defineComponent({
  name: 'LoginView',
  components: {
    MyDialog,
    Qrcode,
    Other
  },
  setup() {
    const $store = useStore();
    const isLogin = computed(() => $store.getters.isLogin);
    // 登录框
    const loginDialog = computed(() => $store.getters.loginDialog);

    // 扫码/其他登录方式切换
    const loginType = ref<string>('qrcode');

    // 扫码登录
    function qrcodeLogin(): void {
      loginType.value = 'qrcode';
    }

    // 其他方式登录
    function otherLogin(): void {
      loginType.value = 'other';
    }

    // 关闭登录对话框
    function dialogCancel(): void {
      loginType.value = 'qrcode';
      $store.commit('setLoginDialog', false);
    }

    // 监听登录重置
    watch(
      () => isLogin.value,
      () => {
        loginType.value = 'qrcode';
      }
    );

    onUnmounted(() => {
      loginType.value = 'qrcode';
    });
    return {
      loginDialog,
      loginType,
      qrcodeLogin,
      otherLogin,
      dialogCancel
    };
  }
});
</script>
