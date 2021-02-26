<template>
  <my-dialog
    class="my-dialog"
    :visible="loginDialog"
    :title="'登录'"
    @cancel="dialogCancel"
  >
    <div class="login">
      <!-- 扫码登录 -->
      <qrcode v-if="qrcodeLoginShow" @otherLogin="otherLogin" />
      <!-- 其他登录方式 -->
      <other v-else @qrcodeLogin="qrcodeLogin" />
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
  components: {
    MyDialog,
    Qrcode,
    Other
  },
  setup() {
    const $store = useStore();
    const isLogin = computed(() => $store.getters.isLogin);
    const loginDialog = computed(() => $store.getters.loginDialog);

    // 扫码/其他登录方式切换
    const qrcodeLoginShow = ref<boolean>(true);

    // 切换扫码登录
    function qrcodeLogin(): void {
      qrcodeLoginShow.value = true;
    }

    // 切换其他方式登录
    function otherLogin(): void {
      qrcodeLoginShow.value = false;
    }

    // 关闭登录对话框
    function dialogCancel(): void {
      qrcodeLoginShow.value = true;
      $store.commit('setLoginDialog', false);
    }

    // 监听登录重置
    watch(
      () => isLogin.value,
      () => {
        qrcodeLoginShow.value = true;
      }
    );

    onUnmounted(() => {
      qrcodeLoginShow.value = true;
    });
    return {
      loginDialog,
      qrcodeLoginShow,
      qrcodeLogin,
      otherLogin,
      dialogCancel
    };
  }
});
</script>
