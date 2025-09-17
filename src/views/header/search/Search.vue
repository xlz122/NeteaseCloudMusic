<template>
  <div class="search">
    <span class="search-icon"></span>
    <input
      class="search-input"
      type="text"
      v-model="searchKeyword"
      :placeholder="searchPlaceholder"
      @focus="searchFocus"
      @blur="searchBlur"
      @keyup.enter="searchEnter"
    />
    <!-- 搜索建议 -->
    <template v-if="Object.keys(searchPropos).length && searchProposShow">
      <ul class="search-list">
        <li class="item-note" @click="jumpSearchUser">搜“{{ searchKeyword }}”相关用户 ></li>
        <!-- 单曲 -->
        <li class="item" v-if="searchPropos.songs?.length">
          <div class="item-title">
            <i class="icon songs-icon"></i>
            <span class="text">单曲</span>
          </div>
          <ul class="f-cb">
            <li
              class="f-cb-li"
              v-for="(item, index) in searchPropos.songs"
              :key="index"
              @click="jumpSongDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item.name?.slice?.(0, searchKeyword.length) }}
              </span>
              <span>{{ item.name?.slice?.(searchKeyword.length) }}</span>
              <span>-</span>
              <span>{{ item.artists?.[0]?.name }}</span>
            </li>
          </ul>
        </li>
        <!-- 歌手 -->
        <li class="item" v-if="searchPropos.artists?.length">
          <div class="item-title">
            <i class="icon artists-icon"></i>
            <span class="text">歌手</span>
          </div>
          <ul class="f-cb f-cb-odd">
            <li
              class="f-cb-li"
              v-for="(item, index) in searchPropos.artists"
              :key="index"
              @click="jumpSingerDetail(item.id)"
            >
              <span class="f-cb-text">{{ item.name }}</span>
            </li>
          </ul>
        </li>
        <!-- 专辑 -->
        <li class="item" v-if="searchPropos.albums?.length">
          <div class="item-title">
            <i class="icon albums-icon"></i>
            <span class="text">专辑</span>
          </div>
          <ul class="f-cb">
            <li
              class="f-cb-li"
              v-for="(item, index) in searchPropos.albums"
              :key="index"
              @click="jumpAlbumDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item.name?.slice?.(0, searchKeyword.length) }}
              </span>
              <span>{{ item.name?.slice?.(searchKeyword.length) }}</span>
              <span>-</span>
              <span>{{ item.artist?.name }}</span>
            </li>
          </ul>
        </li>
        <!-- 歌单 -->
        <li class="item" v-if="searchPropos.playlists?.length">
          <div class="item-title">
            <i class="icon playlists-icon"></i>
            <span class="text">歌单</span>
          </div>
          <ul class="f-cb f-cb-odd">
            <li
              class="f-cb-li"
              v-for="(item, index) in searchPropos.playlists"
              :key="index"
              @click="jumpSongSheetDetail(item.id)"
            >
              <span class="f-cb-text">
                {{ item.name?.slice?.(0, searchKeyword.length) }}
              </span>
              <span>
                {{ item.name?.slice?.(searchKeyword.length) }}
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
import type { ResponseType } from '@/types';

type SearchPropos = {
  songs: {
    id: number;
    name: string;
    artists: {
      name: string;
    }[];
  }[];
  artists: {
    id: number;
    name: string;
  }[];
  albums: {
    id: number;
    name: string;
    artist: {
      name: string;
    };
  }[];
  playlists: {
    id: number;
    name: string;
  }[];
};

const route = useRoute();
const router = useRouter();
const store = useStore();

// 搜索关键词
const searchKeyword = ref('');
// 搜索建议
const searchProposShow = ref(false);
const searchPropos = ref<Partial<SearchPropos>>({});

function getSearchPropos(): void {
  searchProposShow.value = true;

  searchPropose({ keywords: searchKeyword.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      searchPropos.value = res.result ?? {};
    })
    .catch(() => ({}));
}

watch(
  () => searchKeyword.value,
  () => {
    if (!searchKeyword.value) {
      searchProposShow.value = false;
      return;
    }

    getSearchPropos();
  }
);

const searchPlaceholder = ref('音乐/视频/电台/用户');

function searchFocus(): void {
  searchPlaceholder.value = '';

  if (!searchKeyword.value) {
    return;
  }

  searchProposShow.value = true;
  getSearchPropos();
}

function searchBlur(): void {
  searchPlaceholder.value = '音乐/视频/电台/用户';

  // 延迟关闭, 响应点击事件
  setTimeout(() => {
    searchProposShow.value = false;
  }, 150);
}

function searchEnter(): void {
  searchProposShow.value = false;

  if (!searchKeyword.value || searchKeyword.value === route.query.keyword) {
    return;
  }

  router.push({
    name: 'search-details',
    query: { keyword: searchKeyword.value, type: route.query.type ?? 1 }
  });
  store.commit('setMenuIndex', -1);
}

function jumpSearchUser(): void {
  router.push({
    name: 'search-details',
    query: { keyword: searchKeyword.value, type: 1002 }
  });
  store.commit('setMenuIndex', -1);
}

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}

function jumpSongSheetDetail(id: number): void {
  router.push({ path: '/song-sheet-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search.less');
</style>
