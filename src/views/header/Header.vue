<template>
  <div class="header">
    <!-- 头部导航及其他 -->
    <div class="h-top">
      <div class="h-warp">
        <div class="logo" @click="logoJump"></div>
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in navList"
            :key="index"
            :class="[
              { 'active-item': index === heaerActiveIndex },
              { 'last-item': index === navList.length - 1 }
            ]"
            @click="navChange(index)"
          >
            <router-link class="link" v-if="item.link" :to="item?.link">
              {{ item?.title }}
            </router-link>
            <a class="link" target="_blank" v-else :href="item?.href">
              {{ item?.title }}
            </a>
            <i class="hot" v-if="index === navList.length - 1"></i>
          </li>
        </ul>
        <div class="other">
          <!-- 搜索 -->
          <Search />
          <div class="create">
            <router-link class="link" to="/creator-center" target="_blank">
              创作中心
            </router-link>
          </div>
          <div class="login" v-if="isLogin">
            <img class="user-img" :src="userInfo?.profile?.avatarUrl" />
            <user class="user-list" />
          </div>
          <div v-else class="login" @click="openLogin">登录</div>
        </div>
      </div>
    </div>
    <!-- 头部子导航 -->
    <div class="h-bottom">
      <div class="h-warp subnav" v-if="heaerActiveIndex === 0">
        <ul class="nav">
          <li
            class="item"
            v-for="(item, index) in subNavList"
            :key="index"
            :class="[
              { 'active-item': index === subActiveIndex },
              { 'song-sheet': index === 2 }
            ]"
            @click="subNavChange(item, index)"
          >
            <router-link class="link" :to="item?.link">
              {{ item?.title }}
            </router-link>
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
import { LoopType } from '@/types/types';

type NavList = {
  title: string;
  link?: string;
  href?: string;
};

export default defineComponent({
  components: {
    User,
    Search
  },
  setup() {
    const $route = useRoute();
    const $router = useRouter();
    const $store = useStore();

    // logo点击跳转
    function logoJump(): void {
      if ($route.path !== '/') {
        $router.push({ name: 'home' });
      }
    }

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    const navList = ref<NavList[]>([
      {
        title: '发现音乐',
        link: '/'
      },
      {
        title: '我的音乐',
        link: '/my-music'
      },
      {
        title: '朋友',
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

    // 头部导航当前选中项
    const heaerActiveIndex = computed<number>(
      () => $store.getters.heaerActiveIndex
    );

    // 导航更改
    function navChange(item: NavList, index: number): boolean | undefined {
      // 外部链接不更改导航
      if (!item.link) {
        return false;
      }
      $store.commit('setHeaderActiveIndex', index);
    }

    // 子导航数据
    const subNavList = ref<NavList[]>([
      {
        title: '推荐',
        link: '/'
      },
      {
        title: '排行',
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

    // 二级导航当前选中项
    const subActiveIndex = computed<number>(
      () => $store.getters.subActiveIndex
    );

    // 导航更改
    function subNavChange(item: NavList, index: number): boolean | undefined {
      if (!item.link) {
        $store.commit('setMessage', {
          type: 'error',
          title: '该功能暂未开发'
        });
        return false;
      }
      $store.commit('setSubActiveIndex', index);
    }

    // 监听导航变化
    watch(
      () => $route.path,
      (path: string) => {
        // 一级导航
        const index = navList.value.findIndex(
          (item: LoopType) => item.link === path
        );
        if (index !== -1) {
          $store.commit('setHeaderActiveIndex', index);
        }
        // 二级导航
        const subIndex = subNavList.value.findIndex(
          (item: LoopType) => item.link === path
        );
        if (subIndex !== -1) {
          subNavChange(subNavList.value[subIndex], subIndex);
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
      navList,
      heaerActiveIndex,
      navChange,
      subNavList,
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
