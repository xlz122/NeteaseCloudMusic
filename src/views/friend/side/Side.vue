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
  <div class="side-content">
    <h4 class="side-title">
      <span>感兴趣的人</span>
      <router-link class="link" to="">换一批</router-link>
    </h4>
  </div>
  <div class="side-footer">
    <p>添加微博好友，和他们分享音乐</p>
    <a
      class="footer-micro-blog"
      href="`https://api.weibo.com/oauth2/authorize?client_id=301575942&
      response_type=code&redirect_uri=http://music.163.com/back/weibo
      &forcelogin=true&csrf_token=643fa51471e99a9de1952ffd30c0b0e1
      &scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog
      &state=FQffzGAsJk###`"
      target="_blank"
    >
      <i class="micro-blog-icon">
        <i class="icon"></i>
        <span class="title">绑定新浪微博</span>
      </i>
    </a>
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
      },
      {
        src:
          'http://p1.music.126.net/fBd9G5UPnAkN5GJhD27f7w==/109951164233456965.jpg?param=45y45',
        name: '池约翰CJohnny',
        desc: 'MIC男团成员池约翰'
      },
      {
        src:
          'http://p1.music.126.net/HiaQmvjTbEXfo8bsiPv9rQ==/109951165312873539.jpg?param=45y45',
        name: '朱云',
        desc: '北京音乐台资深DJ'
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
