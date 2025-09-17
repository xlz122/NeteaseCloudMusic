<template>
  <div class="header">
    <div class="h-menu">
      <div class="h-menu-warp">
        <i class="logo" @click="handleLogoJump"></i>
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in menu"
            :key="index"
            :class="{ 'active-item': index === menuIndex }"
            @click="handleMenuChange(item)"
          >
            <a class="link" v-if="item.link?.includes('https')" :href="item.link" target="_blank">
              {{ item.title }}
            </a>
            <router-link class="link" v-else :to="item.link">
              {{ item.title }}
            </router-link>
          </li>
        </ul>
        <div class="other">
          <Search />
          <div class="creator-center">
            <router-link class="link" to="/creator-center" target="_blank">
              创作者中心
            </router-link>
          </div>
          <p class="login-text" v-if="!isLogin" @click="handleLogin">登录</p>
          <div class="user-avatar" v-else>
            <img class="avatar" :src="userInfo.profile?.avatarUrl" alt="头像" />
            <div class="msg-count" v-if="msgCount !== 0">{{ msgCount }}</div>
            <User class="user-list" :msgCode="msgCount" />
          </div>
        </div>
      </div>
    </div>
    <SubMenu />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { messageEv } from '@/api/user';
import type { ResponseType } from '@/types';
import User from '@/views/user/User.vue';
import Search from './search/Search.vue';
import SubMenu from './sub-menu/SubMenu.vue';

type MenuItem = {
  title: string;
  link: string;
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);
const menuIndex = computed(() => store.getters.menuIndex);

function handleLogoJump(): void {
  if (route.path === '/') {
    return;
  }

  router.push({ path: '/' });
}

const menu = ref<MenuItem[]>([
  {
    title: '发现音乐',
    link: '/'
  },
  {
    title: '我的音乐',
    link: '/my-music'
  },
  {
    title: '关注',
    link: '/friend'
  },
  {
    title: '商城',
    link: 'https://music.163.com/store/product'
  },
  {
    title: '音乐人',
    link: 'https://music.163.com/st/musician'
  },
  {
    title: '云推歌',
    link: 'https://music.163.com/st/ad-song'
  },
  {
    title: '下载客户端',
    link: '/download'
  }
]);

function handleMenuChange(item: MenuItem): void {
  if (item.link?.includes('https')) {
    return;
  }

  const index = menu.value.findIndex?.((v) => v.link === item.link);
  store.commit('setMenuIndex', index);
}

function handleLogin(): void {
  store.commit('setLoginDialog', true);
}

// 消息
const msgCount = ref(0);

function getMessageMv(): void {
  messageEv({ limit: 1, offset: 100 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      msgCount.value = res.newMsgCount ?? 0;
    })
    .catch(() => ({}));
}

watch(
  () => isLogin.value,
  () => {
    if (!isLogin.value) {
      return;
    }

    getMessageMv();
  },
  { immediate: true }
);

watch(
  () => route.path,
  (path) => {
    const index = menu.value.findIndex?.((item) => item.link === path);
    if (index === -1) {
      return;
    }

    store.commit('setMenuIndex', index);
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import url('./header.less');
</style>
