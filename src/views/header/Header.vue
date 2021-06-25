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
          <div class="search">
            <span class="icon"></span>
            <input
              class="search-input"
              type="text"
              v-model="searchValue"
              :placeholder="searchPlaceholder"
              @focus="searchFocus"
              @blur="searchBlur"
              @keyup.enter="searchEnter"
            />
            <!-- 搜索建议 -->
            <template v-if="Object.keys(searchPropos).length">
              <ul class="search-list" v-show="searchProposShow">
                <li class="item-note">搜“{{ searchValue }}”相关用户 ></li>
                <!-- 单曲 -->
                <li class="item" v-if="searchPropos?.songs">
                  <div class="title">
                    <i class="title-icon songs-icon"></i>
                    <span class="title-text">单曲</span>
                  </div>
                  <ul class="f-cb">
                    <li
                      class="f-cb-i"
                      v-for="(item, index) in searchPropos.songs"
                      :key="index"
                      @click="songDetail(item)"
                    >
                      <span class="f-cb-text">
                        {{ item.name.slice(0, searchValue.length) }}
                      </span>
                      <span>
                        {{ item.name.slice(searchValue.length) }}-{{
                          item?.artists[0]?.name
                        }}
                      </span>
                    </li>
                  </ul>
                </li>
                <!-- 歌手 -->
                <li class="item" v-if="searchPropos?.artists">
                  <div class="title">
                    <i class="title-icon artists-icon"></i>
                    <span class="title-text">歌手</span>
                  </div>
                  <ul class="f-cb f-cb-odd">
                    <li
                      class="f-cb-i"
                      v-for="(item, index) in searchPropos.artists"
                      :key="index"
                    >
                      <span class="f-cb-text">{{ item.name }}</span>
                    </li>
                  </ul>
                </li>
                <!-- 专辑 -->
                <li class="item" v-if="searchPropos?.albums">
                  <div class="title">
                    <i class="title-icon albums-icon"></i>
                    <span class="title-text">专辑</span>
                  </div>
                  <ul class="f-cb">
                    <li
                      class="f-cb-i"
                      v-for="(item, index) in searchPropos.albums"
                      :key="index"
                    >
                      <span class="f-cb-text">
                        {{ item.name.slice(0, searchValue.length) }}
                      </span>
                      <span>
                        {{ item.name.slice(searchValue.length) }}-{{
                          item?.artist?.name
                        }}
                      </span>
                    </li>
                  </ul>
                </li>
                <!-- 歌单 -->
                <li class="item" v-if="searchPropos?.playlists">
                  <div class="title">
                    <i class="title-icon playlists-icon"></i>
                    <span class="title-text">歌单</span>
                  </div>
                  <ul class="f-cb f-cb-odd">
                    <li
                      class="f-cb-i"
                      v-for="(item, index) in searchPropos.playlists"
                      :key="index"
                    >
                      <span class="f-cb-text">
                        {{ item.name.slice(0, searchValue.length) }}
                      </span>
                      <span>
                        {{ item.name.slice(searchValue.length) }}
                      </span>
                    </li>
                  </ul>
                </li>
              </ul>
            </template>
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
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import User from '@views/user/User.vue';
import { LoopType, ResponseType } from '@/types/types';

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

    const searchPlaceholder = ref<string>('音乐/视频/电台/用户');
    // 搜索内容
    const searchValue = ref<string>('');
    // 搜索建议显隐
    const searchProposShow = ref<boolean>(false);
    // 搜索建议数据
    const searchPropos = ref<unknown>({});

    // 搜索框获取焦点
    function searchFocus(): void {
      searchPlaceholder.value = '';
      if (searchValue.value) {
        searchProposShow.value = true;
      }
    }

    // 搜索框失去焦点
    function searchBlur(): void {
      searchPlaceholder.value = '音乐/视频/电台/用户';
      // 延迟关闭，用于响应点击事件
      setTimeout(() => {
        searchProposShow.value = false;
      }, 150);
    }

    // 搜索框内容改变
    watch(
      () => searchValue.value,
      (curVal: string) => {
        if (curVal) {
          getSearchPropos();
        } else {
          searchProposShow.value = false;
        }
      }
    );

    // 搜索框监听回车键
    function searchEnter(): void {
      if (searchValue.value) {
        getSearchPropos();
      }
    }

    // 获取搜索框建议
    function getSearchPropos(): void {
      searchProposShow.value = true;
      searchKeywords({
        keywords: searchValue.value
      })
        .then((res: ResponseType) => {
          console.log(res);
          if (res.code === 200) {
            searchPropos.value = res.result;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    // 单曲详情
    function songDetail(item: unknown): void {
      console.log(item);
    }

    // 登录弹框显隐
    const dialogvisible = ref<boolean>(false);

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
      subNavActive,
      subNavChange,
      searchPlaceholder,
      searchProposShow,
      searchFocus,
      searchBlur,
      searchValue,
      searchPropos,
      searchEnter,
      songDetail,
      dialogvisible,
      openLogin
    };
  }
});
</script>

<style lang="less" scoped>
@import './header.less';
</style>
