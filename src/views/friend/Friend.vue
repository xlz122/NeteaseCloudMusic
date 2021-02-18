<template>
  <!-- 登录展示 -->
  <div class="friend" v-if="isLogin">
    朋友 - 登录后
  </div>
  <!-- 未登录展示 -->
  <div class="friend" v-else>
    <div class="friend-login">
      <div class="login-content">
        <button class="login-btn" @click="openLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './friend.less';
</style>
