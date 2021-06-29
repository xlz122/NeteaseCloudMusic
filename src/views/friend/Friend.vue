<template>
  <!-- 登录展示 -->
  <div class="friend" v-if="isLogin">
    <div class="friend-container">
      <!-- 主体内容 -->
      <div class="container-content">
        <friend-content />
      </div>
      <!-- 侧边栏 -->
      <div class="container-side">
        <side />
      </div>
    </div>
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
import FriendContent from './content/Content.vue';
import Side from './side/Side.vue';

export default defineComponent({
  name: 'firend',
  components: {
    FriendContent,
    Side
  },
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
