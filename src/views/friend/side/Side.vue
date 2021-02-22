<template>
  <div class="user-profile">
    <div class="user-profile-container">
      <div class="user-info">
        <div class="user-avatar">
          <img class="user-avatar-img" :src="userInfo?.profile?.avatarUrl" />
        </div>
        <div class="info">
          <h4 class="name">
            <span class="text">{{ userInfo?.profile?.nickname }}</span>
          </h4>
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

    // 用户信息
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
      userInfo,
      isSignIn,
      signIn,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
