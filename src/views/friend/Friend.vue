<template>
  <div class="friend" v-if="isLogin">
    <div class="friend-container">
      <div class="container-content">
        <FriendContent />
      </div>
      <div class="container-side">
        <Side />
      </div>
    </div>
  </div>
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
  name: 'FriendView',
  components: {
    FriendContent,
    Side
  },
  setup() {
    const $store = useStore();

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
