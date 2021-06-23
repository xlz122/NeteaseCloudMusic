<template>
  <div class="header">
    <!-- 头部导航及其他 -->
    <div class="h-top">
      <div class="h-warp">
        <div class="logo"></div>
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
          <div class="search">
            <span class="icon"></span>
            <input
              class="search-input"
              type="text"
              :placeholder="searchPlaceholder"
              @focus="seachFocus"
              @blur="seachBlur"
            />
          </div>
          <div class="create">
            <router-link class="link" to="/creator-center" target="_blank">
              创作中心
            </router-link>
          </div>
          <div class="login" v-if="isLogin">
            <img class="user-img" :src="userInfo?.profile?.avatarUrl" />
            <user class="user-list" />
          </div>
          <div v-else class="login" @click="openLogin">
            登录
          </div>
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
              { 'active-item': index === subNavActive },
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
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import User from '@views/user/User.vue';
import { LoopType } from '@/types/types';

interface NavList {
  title: string;
  link?: string;
  href?: string;
}

export default defineComponent({
  components: {
    User
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

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

    // 导航当前选中项
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

    // 监听导航变化
    watch(
      () => $route.path,
      (path: string) => {
        const index = navList.value.findIndex(
          (item: LoopType) => item.link === path
        );
        if (index !== -1) {
          $store.commit('setHeaderActiveIndex', index);
        }
      },
      {
        immediate: true
      }
    );

    // 子导航数据
    const subNavList = ref<NavList[]>([
      {
        title: '推荐',
        link: '/'
      },
      {
        title: '排行',
        link: ''
      },
      {
        title: '歌单',
        link: ''
      },
      {
        title: '主播电台',
        link: ''
      },
      {
        title: '歌手',
        link: ''
      },
      {
        title: '新碟上架',
        link: '/home-newDisc'
      }
    ]);

    // 子导航当前选中项
    const subNavActive = ref<number>(0);
    // 导航更改
    function subNavChange(item: NavList, index: number): boolean | undefined {
      if (!item.link) {
        $store.commit('setMessage', {
          type: 'error',
          title: '该功能暂未开发'
        });
        return false;
      }
      subNavActive.value = index;
    }

    const searchPlaceholder = ref<string>('音乐/视频/电台/用户');

    // 搜索框获取焦点
    function seachFocus(): void {
      searchPlaceholder.value = '';
    }

    // 搜索框失去焦点
    function seachBlur(): void {
      searchPlaceholder.value = '音乐/视频/电台/用户';
    }

    // 登录弹框显隐
    const dialogvisible = ref<boolean>(false);

    // 打开登录对话框
    function openLogin(): void {
      $store.commit('setLoginDialog', true);
    }
    return {
      isLogin,
      userInfo,
      navList,
      heaerActiveIndex,
      navChange,
      subNavList,
      subNavActive,
      subNavChange,
      searchPlaceholder,
      seachFocus,
      seachBlur,
      dialogvisible,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './header.less';
</style>
