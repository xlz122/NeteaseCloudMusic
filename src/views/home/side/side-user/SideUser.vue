<template>
  <div class="side-user" v-if="isLogin">
    <div class="side-user-container">
      <div class="user-info">
        <div
          class="user-avatar"
          @click="jumpUserProfile(userInfo?.profile?.userId)"
        >
          <img class="user-avatar-img" :src="userInfo?.profile?.avatarUrl" />
        </div>
        <div class="info">
          <h4 class="name">
            <span
              class="text"
              @click="jumpUserProfile(userInfo?.profile?.userId)"
            >
              {{ userInfo?.profile?.nickname }}
            </span>
            <template v-if="vipInfo?.redVipLevelIcon">
              <img class="vip-level" :src="vipInfo?.redVipLevelIcon" alt="" />
            </template>
          </h4>
          <p class="lv" @click="jumpLevel">
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
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { formatDateTime } from '@utils/utils';
import { dailySignin } from '@api/home';
import { userVipInfo } from '@api/user';
import type { ResponseType } from '@/types/types';

type VipInfo = {
  redVipLevelIcon?: string;
};

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);

    watch(
      () => isLogin.value,
      () => {
        if (isLogin.value) {
          getVipInfo();
        }
      },
      {
        immediate: true
      }
    );

    const vipInfo = ref<VipInfo>({});

    // 获取登录用户vip信息
    function getVipInfo() {
      userVipInfo()
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            vipInfo.value = res?.data;
          }
        })
        .catch(() => ({}));
    }

    // 重置签到
    function resetSignIn(): boolean | undefined {
      const signInTimestamp = localStorage.getItem('signInTimestamp') || 0;
      if (Number(signInTimestamp) === 0) {
        return false;
      }

      const signInDay = formatDateTime(
        Number(signInTimestamp) / 1000,
        'yyyyMMdd'
      );
      const today = formatDateTime(new Date().getTime() / 1000, 'yyyyMMdd');

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
      dailySignin()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            $store.commit('setSignIn', true);
          }
        })
        .catch(() => ({}));
    }

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 跳转等级
    function jumpLevel(): void {
      $router.push({ path: '/level' });
    }

    return {
      isLogin,
      userInfo,
      vipInfo,
      isSignIn,
      signIn,
      openLogin,
      jumpUserProfile,
      jumpLevel
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./side-user.less');
</style>
