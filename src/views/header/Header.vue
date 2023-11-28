<template>
  <div class="header">
    <div class="h-top-bg"></div>
    <div class="h-top">
      <div class="h-warp">
        <div class="logo" @click="logoJump"></div>
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in menu"
            :key="index"
            :class="[
              { 'active-item': index === menuIndex },
              { 'last-item': index === menu.length - 1 }
            ]"
            @click="menuChange(item, index)"
          >
            <router-link class="link" v-if="item?.link" :to="item?.link">
              {{ item?.title }}
            </router-link>
            <a class="link" target="_blank" v-else :href="item?.href">
              {{ item?.title }}
            </a>
            <i class="hot" v-if="index === menu.length - 1"></i>
          </li>
        </ul>
        <div class="other">
          <Search />
          <div class="create">
            <router-link class="link" to="/creator-center" target="_blank">
              创作者中心
            </router-link>
          </div>
          <div class="login" v-if="isLogin">
            <div class="user-avatar">
              <img
                class="user-img"
                :src="userInfo?.profile?.avatarUrl"
                alt="头像"
              />
              <div class="msg-tag" v-if="msgCode > 0">{{ msgCode }}</div>
            </div>
            <User class="user-list" :msgCode="msgCode" />
          </div>
          <div v-else class="login" @click="openLogin">登录</div>
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
import SubMenu from '@/views/header/sub-menu/SubMenu.vue';
import Search from '@/views/header/search/Search.vue';
import User from '@/views/user/User.vue';
import type { ResponseType } from '@/types/types';

type MenuItem = {
  title: string;
  link?: string;
  href?: string;
};

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);
const userInfo = computed(() => $store.getters.userInfo);
const menuIndex = computed<number>(() => $store.getters.menuIndex);

function logoJump(): void {
  if ($route.path !== '/') {
    $router.push({ name: 'home' });
  }
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
    href: 'https://music.163.com/store/product'
  },
  {
    title: '音乐人',
    href: 'https://music.163.com/st/musician'
  },
  {
    title: '下载客户端',
    link: '/download'
  }
]);

function menuChange(item: MenuItem, index: number): boolean | undefined {
  if (!item.link) {
    return;
  }

  $store.commit('setMenuIndex', index);
}

// 消息提示
const msgCode = ref<number>(0);

function loadMessage(): void {
  messageEv({ limit: 1, offset: 100 })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        msgCode.value = res?.newMsgCount || 0;
      }
    })
    .catch(() => ({}));
}

// 登录
function openLogin(): void {
  $store.commit('setLoginDialog', true);
}

watch(
  () => isLogin.value,
  () => {
    if (!isLogin.value) {
      return;
    }

    loadMessage();
  },
  {
    deep: true
  }
);

watch(
  () => $route.path,
  path => {
    const index = menu.value.findIndex(item => item.link === path);

    if (index !== -1) {
      $store.commit('setMenuIndex', index);
    }
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped>
@import url('./header.less');
</style>
