<template>
  <div class="search-header">
    <!-- 搜索框 -->
    <div class="serch-header-input">
      <input
        class="search-input"
        type="text"
        autocomplete="off"
        v-model="searchKeyword"
        @focus="searchFocus"
        @blur="searchBlur"
        @keyup.enter="searchEnter"
      />
      <span class="search-icon" @click="searchEnter"></span>
    </div>
    <!-- 搜索建议 -->
    <template v-if="Object.keys(searchPropos).length">
      <ul class="search-list" v-show="searchProposShow">
        <li class="item-note" @click="jumpSearchUser">
          搜“{{ searchKeyword }}”相关用户 >
        </li>
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
              @click="jumpSongDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item?.name?.slice(0, searchKeyword.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchKeyword.length) }}-{{
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
              @click="jumpSingerDetail(item.id)"
            >
              <span class="f-cb-text">{{ item?.name }}</span>
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
              @click="jumpAlbumDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item?.name?.slice(0, searchKeyword.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchKeyword.length) }}-{{
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
              @click="jumpSongSheetDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item?.name?.slice(0, searchKeyword.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchKeyword.length) }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchPropose } from '@/api/search';
import type { ResponseType } from '@/types/index';

type SearchPropos = {
  songs?: {
    id: number;
    name: string;
    artists: {
      name: string;
    }[];
  }[];
  artists?: {
    id: number;
    name: string;
  }[];
  albums?: {
    id: number;
    name: string;
    artist: {
      name: string;
    };
  }[];
  playlists?: {
    id: number;
    name: string;
  }[];
};

const $route = useRoute();
const $router = useRouter();
const $store = useStore();

// 搜索关键词
const searchKeyword = ref(String($route.query.keyword) || '');
// 搜索建议
const searchPlaceholder = ref('音乐/视频/电台/用户');
const searchProposShow = ref(false);

watch(
  () => searchKeyword.value,
  curVal => {
    if (!curVal) {
      searchProposShow.value = false;
      return;
    }

    getSearchPropos();
  }
);

// 获取搜索框建议
const searchPropos = ref<SearchPropos>({});

function getSearchPropos(): void {
  searchProposShow.value = true;

  searchPropose({ keywords: searchKeyword.value })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        searchPropos.value = res.result || {};
      }
    })
    .catch(() => ({}));
}

// 搜索框获取焦点
function searchFocus(): void {
  searchPlaceholder.value = '';

  if (!searchKeyword.value) {
    return;
  }

  searchProposShow.value = true;
  getSearchPropos();
}

// 搜索框失去焦点
function searchBlur(): void {
  searchPlaceholder.value = '音乐/视频/电台/用户';

  // 延迟关闭, 用于响应点击事件
  setTimeout(() => {
    searchProposShow.value = false;
  }, 150);
}

// 搜索框回车
function searchEnter(): boolean | undefined {
  searchProposShow.value = false;
  if (!searchKeyword.value) {
    return;
  }
  if (searchKeyword.value === $route.query.keyword) {
    return;
  }

  $router.push({
    name: 'search-details',
    query: {
      keyword: searchKeyword.value,
      type: $route.query.type || 1
    }
  });

  $store.commit('setMenuIndex', -1);
}

// 跳转搜索用户
function jumpSearchUser(): void {
  $router.push({
    name: 'search-details',
    query: {
      keyword: searchKeyword.value,
      type: 1002
    }
  });

  $store.commit('setMenuIndex', -1);
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-header.less');
</style>
