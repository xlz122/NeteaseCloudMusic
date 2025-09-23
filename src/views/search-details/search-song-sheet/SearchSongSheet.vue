<template>
  <div class="loading" v-if="songSheetData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <ul class="search-song-sheet" v-if="!songSheetData.loading">
    <li
      class="item"
      v-for="(item, index) in songSheetData.list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div
        class="td play-icon"
        :class="{ 'active-play': item.id === playSongId }"
        title="播放"
        @click="songSheetToPlaylistPlay(item.id)"
      ></div>
      <div class="td td1">
        <img
          class="cover-img"
          :src="item.coverImgUrl"
          :title="item.name"
          @click="jumpSongSheetDetail(item.id)"
          alt=""
        />
      </div>
      <div class="td td2">
        <span class="text" :title="item.name" @click="jumpSongSheetDetail(item.id)">
          <span v-html="handleMatchString(item.name, String(route.query.keyword))"></span>
        </span>
      </div>
      <div class="td td3-sheet">
        <div class="operate-btn">
          <i class="icon add" title="添加到播放列表" @click="songSheetToPlaylist(item.id)"></i>
          <i
            class="icon collect"
            :class="`${item.subscribed ? 'collectd' : ''}`"
            :title="`${item.subscribed ? '已收藏' : '收藏'}`"
            @click="handleCollection(item.id, item.subscribed)"
          ></i>
          <i class="icon share" title="分享" @click="shareClick"></i>
        </div>
      </div>
      <div class="td4-sheet">101首</div>
      <div class="td5-sheet">
        <div class="name">
          <span class="by">by</span>
          <span class="text" :title="item.creator?.nickname" @click="jumpUserProfile(item.userId)">
            {{ item.creator?.nickname }}
          </span>
        </div>
      </div>
      <div class="td6-sheet">收藏: {{ item.bookCount }}</div>
      <div class="td6-sheet">收听: {{ formatLargeNumber(item.playCount) }}</div>
    </li>
  </ul>
  <Page
    v-if="songSheetData.total > songSheetData.limit"
    :page="songSheetData.offset"
    :pageSize="songSheetData.limit"
    :total="songSheetData.total"
    @onChange="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatLargeNumber, handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import { playlistTrack, playlistSubscribe } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';

type SongSheetData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    id: number;
    userId: number;
    name: string;
    coverImgUrl: string;
    subscribed: boolean;
    bookCount: number;
    playCount: number;
    creator: {
      nickname: string;
    };
  }[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongId = computed(() => store.getters['music/playSongId']);

// 获取歌单列表
const songSheetData = reactive<SongSheetData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchSongSheet(): void {
  songSheetData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (songSheetData.offset - 1) * songSheetData.limit,
    limit: isLogin.value ? songSheetData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        songSheetData.total = res.result?.playlists?.length ?? 0;
      }
      if (isLogin.value) {
        songSheetData.total = res.result?.playlistCount ?? 0;
      }
      songSheetData.list = res.result?.playlists ?? [];
      songSheetData.loading = false;

      emits('searchCountChange', songSheetData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    songSheetData.offset = 1;
    getSearchSongSheet();
  },
  { immediate: true }
);

// 歌单添加到播放列表并播放
function songSheetToPlaylistPlay(id: number): void {
  playlistTrack({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.songs?.length === 0) {
        return;
      }

      // 过滤无版权
      res.songs = res.songs?.slice?.(0, 20) ?? [];
      const songList: SongType[] = res.songs?.filter?.(
        (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
      );

      usePlaySong(songList[0]);
      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

// 歌单添加到播放列表
function songSheetToPlaylist(id: number): void {
  playlistTrack({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.songs?.length === 0) {
        return;
      }

      // 过滤无版权
      res.songs = res.songs?.slice?.(0, 20) ?? [];
      const songList: SongType[] = res.songs?.filter?.(
        (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
      );

      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

function handleCollection(id: number, subscribed: boolean): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }
  if (subscribed) {
    return;
  }

  playlistSubscribe({ id, t: 1 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: '收藏失败' });
        return;
      }

      songSheetData.list.forEach?.((item) => {
        if (id !== item.id) {
          return;
        }

        item.subscribed = true;
      });
      setMessage({ type: 'info', title: '收藏成功' });
    })
    .catch(() => ({}));
}

function shareClick(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handlePageChange(current: number): void {
  songSheetData.offset = current;
  getSearchSongSheet();
}

function jumpSongSheetDetail(id: number): void {
  router.push({ path: '/song-sheet-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-song-sheet.less');
</style>
