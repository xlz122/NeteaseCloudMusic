<template>
  <div class="search-header">
    <!-- 搜索框 -->
    <div class="serch-header-input">
      <input
        class="search-input"
        type="text"
        autocomplete="off"
        v-model="searchValue"
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
          搜“{{ searchValue }}”相关用户 >
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
                {{ item?.name?.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchValue.length) }}-{{
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
                {{ item?.name?.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchValue.length) }}-{{
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
                {{ item?.name?.slice(0, searchValue.length) }}
              </span>
              <span>
                {{ item?.name?.slice(searchValue.length) }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchPropose } from '@/api/search';
import type { ResponseType } from '@/types/types';

type SearchPropos = {
  songs?: {
    id?: number;
    name?: string;
    artists: {
      name: string;
    }[];
  }[];
  artists?: {
    id?: number;
    name?: string;
  }[];
  albums?: {
    id?: number;
    name?: string;
    artist?: {
      name?: string;
    };
  }[];
  playlists?: {
    id?: number;
    name?: string;
  }[];
};

const emits = defineEmits(['searchEnter']);

const $router = useRouter();
const $store = useStore();
// 搜索详情关键字
const searchDetailText = computed(() =>
  $store.getters.searchDetailText.replace(/"/g, '')
);

const searchValue = ref<string>(searchDetailText.value);
const searchProposShow = ref<boolean>(false);
const oldSearchValue = ref<string>('');

// 搜索框获取焦点
function searchFocus(): void {
  if (searchValue.value) {
    searchProposShow.value = true;
    getSearchPropos();
  }
}

// 搜索框失去焦点
function searchBlur(): void {
  // 延迟关闭, 用于响应点击事件
  setTimeout(() => {
    searchProposShow.value = false;
  }, 150);
}

// 搜索框内容改变
watch(
  () => searchValue.value,
  (curVal: string, oldVal: string) => {
    if (curVal) {
      getSearchPropos();
    } else {
      searchProposShow.value = false;
    }

    // 存储旧搜索内容
    if (oldVal) {
      oldSearchValue.value = oldVal;
    }
  }
);

// 搜索框回车
function searchEnter(): boolean | undefined {
  searchProposShow.value = false;
  if (!searchValue.value) {
    return;
  }

  // 搜索内容变化
  if (searchValue.value !== oldSearchValue.value) {
    emits('searchEnter', searchValue.value);
  }
}

// 获取搜索框建议
const searchPropos = ref<SearchPropos>({});

function getSearchPropos(): void {
  searchPropose({ keywords: searchValue.value })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        searchPropos.value = res.result;
      }
    })
    .catch(() => ({}));
}

// 跳转搜索用户
function jumpSearchUser(): void {
  // 存储关键字
  $store.commit('setSearchText', searchValue.value);
  $store.commit('setMenuIndex', -1);
  $store.commit('setSearchIndex', 7);

  $router.push({
    name: 'search-details',
    query: { searchText: searchValue.value }
  });
}

// 跳转歌曲详情
function jumpSongDetail(id: number | undefined): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number | undefined): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number | undefined): void {
  $router.push({ path: '/album-detail', query: { id } });
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number | undefined): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-header.less');
</style>
