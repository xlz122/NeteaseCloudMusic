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
        <button class="login-btn" @click="handleLogin"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import FriendContent from './content/Content.vue';
import Side from './side/Side.vue';

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

function handleLogin(): void {
  store.commit('setLoginDialog', true);
}
</script>

<style lang="less" scoped>
@import url('./friend.less');
</style>
