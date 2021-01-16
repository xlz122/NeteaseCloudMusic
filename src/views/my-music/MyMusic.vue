<template>
  <div class="my-music" v-if="isLogin">
    我的音乐 - 登录后
  </div>
  <div class="my-music" v-else>
    <div class="my-music-login">
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
@import './my-music.less';
</style>
