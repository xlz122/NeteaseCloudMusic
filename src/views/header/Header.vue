<template>
  <div class="header">
    <div class="h-top">
      <div class="h-warp">
        <div class="logo" @click="logoJump"></div>
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in NavItem"
            :key="index"
            :class="[
              { 'active-item': index === heaerActiveIndex },
              { 'last-item': index === NavItem.length - 1 }
            ]"
            @click="navChange(index)"
          >
            <router-link class="link" v-if="item?.link" :to="item?.link">
              {{ item?.title }}
            </router-link>
            <a class="link" target="_blank" v-else :href="item?.href">
              {{ item?.title }}
            </a>
            <i class="hot" v-if="index === NavItem.length - 1"></i>
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
            <img class="user-img" :src="userInfo?.profile?.avatarUrl" />
            <User class="user-list" />
          </div>
          <div v-else class="login" @click="openLogin">登录</div>
        </div>
      </div>
    </div>
    <div class="h-bottom">
      <div class="h-warp subnav" v-if="heaerActiveIndex === 0">
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in subNavItem"
            :key="index"
            :class="[
              { 'active-item': index === subActiveIndex },
              { 'song-sheet': index === 2 }
            ]"
            @click="subNavChange(item, index)"
          >
            <span class="link">
              {{ item?.title }}
            </span>
            <i class="white-icon" v-if="index === 2"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Search from '@views/header/search/Search.vue';
import User from '@views/user/User.vue';

type NavItem = {
  title: string;
  link?: string;
  href?: string;
};

export default defineComponent({
  name: 'HeaderView',
  components: {
    Search,
    User
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);

    function logoJump(): void {
      if ($route.path !== '/') {
        $router.push({ name: 'home' });
      }
    }

    const NavItem = ref<NavItem[]>([
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

    const heaerActiveIndex = computed<number>(
      () => $store.getters.heaerActiveIndex
    );

    // 一级导航更改
    function navChange(item: NavItem, index: number): boolean | undefined {
      if (!item.link) {
        return false;
      }

      $store.commit('setHeaderActiveIndex', index);
    }

    const subNavItem = ref<NavItem[]>([
      {
        title: '推荐',
        link: '/'
      },
      {
        title: '排行榜',
        link: '/home-toplist'
      },
      {
        title: '歌单',
        link: '/home-song-sheet'
      },
      {
        title: '主播电台',
        link: '/home-djprogram'
      },
      {
        title: '歌手',
        link: '/home-singer'
      },
      {
        title: '新碟上架',
        link: '/home-new-disc'
      }
    ]);

    const subActiveIndex = computed<number>(
      () => $store.getters.subActiveIndex
    );

    // 二级导航更改
    function subNavChange(item: NavItem, index: number): boolean | undefined {
      if (!item.link) {
        $store.commit('setMessage', {
          type: 'error',
          title: '该功能暂未开发'
        });
        return false;
      }

      $router.push({ path: item.link });
      $store.commit('setSubActiveIndex', index);
    }

    // 监听导航变化
    watch(
      () => $route.path,
      (path: string) => {
        // 一级导航
        const index = NavItem.value.findIndex(
          (item: NavItem) => item.link === path
        );
        if (index !== -1) {
          $store.commit('setHeaderActiveIndex', index);
        }

        // 二级导航
        const subIndex = subNavItem.value.findIndex(
          (item: NavItem) => item.link === path
        );
        if (subIndex !== -1) {
          $store.commit('setSubActiveIndex', subIndex);
        }
      },
      {
        immediate: true
      }
    );

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }

    return {
      logoJump,
      isLogin,
      userInfo,
      NavItem,
      heaerActiveIndex,
      navChange,
      subNavItem,
      subActiveIndex,
      subNavChange,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './header.less';
</style>
