<template>
  <ul class="user-base">
    <li class="item" @click="undeveloped">
      <i class="icon homepage"></i>
      <span class="text">我的主页</span>
    </li>
    <li class="item" @click="undeveloped">
      <i class="icon message"></i>
      <span class="text">我的消息</span>
    </li>
    <li class="item" @click="undeveloped">
      <i class="icon grade"></i>
      <span class="text">我的等级</span>
    </li>
    <li class="item" @click="undeveloped">
      <i class="icon member"></i>
      <span class="text">VIP会员</span>
    </li>
    <li class="item" @click="undeveloped">
      <i class="icon setting"></i>
      <span class="text">个人设置</span>
    </li>
    <li class="item" @click="undeveloped">
      <i class="icon real-name"></i>
      <span class="text">实名认证</span>
    </li>
    <li class="item" @click="signOut">
      <i class="icon logout"></i>
      <span class="text">退出</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const $store = useStore();

    function undeveloped(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 退出登录
    function signOut(): void {
      $store.dispatch('setLogout');
    }
    return {
      undeveloped,
      signOut
    };
  }
});
</script>

<style lang="less" scoped>
@import './user.less';
</style>
