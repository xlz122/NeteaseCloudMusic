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
  <div class="side-content">
    <!-- 明星用户 -->
    <h4 class="side-title">
      <span>明星用户</span>
      <router-link class="link" to="">换一批</router-link>
    </h4>
    <ul class="star-list">
      <li class="item" v-for="(item, index) in starList" :key="index">
        <div class="item-img">
          <img class="img" :src="item.src" alt="" />
        </div>
        <div class="info">
          <h4 class="info-title" :title="item.name">{{ item.name }}</h4>
          <p class="info-desc" :title="item.desc">{{ item.desc }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
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

    // 明星列表
    const starList = ref<unknown>([
      {
        src:
          'http://p1.music.126.net/RQT6l2Vd9mQ9bSA_9MdWBw==/109951163720144425.jpg?param=45y45',
        name: '品冠victor',
        desc: '台湾流行歌手品冠'
      }
    ]);
    return {
      userInfo,
      isSignIn,
      signIn,
      openLogin,
      starList
    };
  }
});
</script>

<style lang="less" scoped>
@import './side.less';
</style>
