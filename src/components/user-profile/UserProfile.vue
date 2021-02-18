<template>
  <!-- 登录展示 -->
  <div class="user-profile" v-if="isLogin">
    <div class="user-profile-container">
      <div class="user-info">
        <div class="user-avatar">
          <img class="user-avatar-img" :src="userInfo?.profile?.avatarUrl" />
        </div>
        <div class="info">
          <h4 class="name">
            <span class="text">{{ userInfo?.profile?.nickname }}</span>
            <i class="icon-info"></i>
          </h4>
          <p class="lv">
            <i class="lv-icon-left">{{ userInfo?.level }}</i>
            <i class="lv-icon-right"></i>
          </p>
          <button
            class="btnwarp"
            :class="{ 'disable-btnwarp': isSignIn }"
            @click="signIn"
          >
            <i class="btnwarp-icon">签到</i>
          </button>
        </div>
      </div>
      <ul class="list">
        <li class="item first-item">
          <strong class="num">{{ userInfo?.profile?.eventCount }}</strong>
          <span class="text">动态</span>
        </li>
        <li class="item">
          <strong class="num">{{ userInfo?.profile?.follows }}</strong>
          <span class="text">关注</span>
        </li>
        <li class="item last-item">
          <strong class="num">{{ userInfo?.profile?.followeds }}</strong>
          <span class="text">粉丝</span>
        </li>
      </ul>
    </div>
  </div>
  <!-- 未登录展示 -->
  <div class="user-profile" v-else>
    <div class="user-profile-login">
      <p class="login-title">
        登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机
      </p>
      <button class="login-btn" @click="openLogin">用户登录</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { dailySignin } from '@api/home';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 是否已签到
    const isSignIn = computed(() => $store.getters.userInfo.pcSign);

    // 签到
    function signIn(): boolean | undefined {
      // 防止重复签到
      if (isSignIn.value) {
        return false;
      }
      dailySignin().then((res: ResponseType) => {
        if (res.code === 200) {
          $store.commit('setSignIn', true);
        }
      });
    }

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      userInfo,
      isSignIn,
      signIn,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-profile.less';
</style>
