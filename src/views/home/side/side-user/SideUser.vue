<template>
  <!-- 登录展示 -->
  <div class="side-user" v-if="isLogin">
    <div class="side-user-container">
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
          <button v-if="!isSignIn" class="btnwarp" @click="signIn">
            <i class="btnwarp-icon">签到</i>
          </button>
          <button v-else class="btnwarp disable-btnwarp">
            <i class="btnwarp-icon">已签到</i>
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
  <div class="side-user" v-else>
    <div class="side-user-login">
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
import { formatDateTime } from '@utils/utils';

export default defineComponent({
  setup() {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);

    // 重置签到
    function resetSignIn(): boolean | undefined {
      // 获取本地签到日期
      const signInTimestamp = localStorage.getItem('signInTimestamp') || 0;
      if (Number(signInTimestamp) === 0) {
        return false;
      }
      const signInDay = formatDateTime(
        Number(signInTimestamp) / 1000,
        'yyyyMMdd'
      );
      // 获取今天日期
      const today = formatDateTime(new Date().getTime() / 1000, 'yyyyMMdd');
      // 今天大于签到日期
      if (Number(today) > Number(signInDay)) {
        $store.commit('setSignIn', false);
      }
    }
    resetSignIn();

    // 是否已签到
    const isSignIn = computed<boolean>(() => $store.getters.userInfo.pcSign);

    // 签到
    function signIn(): void {
      // 存储签到时间戳，用于重置签到
      localStorage.setItem(
        'signInTimestamp',
        JSON.stringify(new Date().getTime())
      );
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
@import './side-user.less';
</style>
