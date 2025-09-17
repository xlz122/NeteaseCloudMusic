<template>
  <div class="side-user" v-if="isLogin">
    <div class="user-content">
      <div class="user-info">
        <div class="user-avatar" @click="jumpUserProfile">
          <img class="user-avatar-img" :src="userInfo.profile?.avatarUrl" />
        </div>
        <div class="info">
          <h4 class="name">
            <span class="text" @click="jumpUserProfile">
              {{ userInfo.profile?.nickname }}
            </span>
            <template v-if="vipInfo.redVipLevelIcon">
              <img class="vip-level" :src="vipInfo.redVipLevelIcon" alt="" />
            </template>
          </h4>
          <p class="lv" @click="jumpLevel">
            <i class="lv-icon-left">{{ userInfo.level }}</i>
            <i class="lv-icon-right"></i>
          </p>
          <button v-if="!userInfo.pcSign" class="btnwarp" @click="signIn">
            <i class="btnwarp-icon">签到</i>
          </button>
          <button v-else class="btnwarp disable-btnwarp">
            <i class="btnwarp-icon">已签到</i>
          </button>
        </div>
      </div>
      <ul class="list">
        <li class="item first-item">
          <strong class="num">{{ userInfo.profile?.eventCount }}</strong>
          <span class="text">动态</span>
        </li>
        <li class="item">
          <strong class="num">{{ userInfo.profile?.follows }}</strong>
          <span class="text">关注</span>
        </li>
        <li class="item last-item">
          <strong class="num">{{ userInfo.profile?.followeds }}</strong>
          <span class="text">粉丝</span>
        </li>
      </ul>
    </div>
  </div>
  <div class="side-user" v-else>
    <div class="user-login">
      <p class="login-title">登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
      <button class="login-btn" @click="handleLogin">用户登录</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { formatTimestamp } from '@/utils/utils';
import { userVipInfo } from '@/api/user';
import { dailySignin } from '@/api/home';
import type { ResponseType } from '@/types';

type VipInfo = {
  redVipLevelIcon?: string;
};

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);

// 获取用户vip信息
const vipInfo = ref<VipInfo>({});

function getVipInfo(): void {
  userVipInfo()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      vipInfo.value = res.data ?? {};
    })
    .catch(() => ({}));
}

watch(
  () => isLogin.value,
  () => {
    if (!isLogin.value) {
      return;
    }

    getVipInfo();
  },
  { immediate: true }
);

// 签到状态
function handleSignInStatus(): void {
  const signInTimestamp = localStorage.getItem('signInTimestamp');
  const signInDay = formatTimestamp(Number(signInTimestamp), 'YYYYMMDD');
  const today = formatTimestamp(new Date().getTime(), 'YYYYMMDD');

  if (!signInTimestamp || Number(today) === Number(signInDay)) {
    return;
  }

  store.commit('setSignIn', false);
}
handleSignInStatus();

// 签到
function signIn(): void {
  localStorage.setItem('signInTimestamp', JSON.stringify(new Date().getTime()));

  dailySignin()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      store.commit('setSignIn', true);
    })
    .catch(() => ({}));
}

function handleLogin(): void {
  store.commit('setLoginDialog', true);
}

function jumpUserProfile(): void {
  router.push({
    path: '/user-profile',
    query: { id: userInfo.value.profile?.userId }
  });
}

function jumpLevel(): void {
  router.push({ path: '/level' });
}
</script>

<style lang="less" scoped>
@import url('./side-user.less');
</style>
