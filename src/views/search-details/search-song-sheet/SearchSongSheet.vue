<template>
  <div class="loading" v-if="songSheetData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-song-sheet" v-if="!songSheetData?.loading">
    <li
      class="item"
      v-for="(item, index) in songSheetData?.list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div
        class="td play-icon"
        :class="{ 'active-play': item.id === playSongId }"
        title="播放"
        @click="songSheetToPlaylistPlay(item?.id)"
      ></div>
      <div class="td td1">
        <img
          class="cover-img"
          :src="item?.coverImgUrl"
          :title="item?.name"
          alt=""
          @click="jumpSongSheetDetail(item?.id)"
        />
      </div>
      <div class="td td2">
        <span
          class="text"
          :title="item?.name"
          @click="jumpSongSheetDetail(item?.id)"
        >
          <span
            v-html="handleMatchString(item?.name || '', searchDetailText)"
          ></span>
        </span>
      </div>
      <div class="td td3-sheet">
        <div class="operate-btn">
          <i
            class="icon add"
            title="添加到播放列表"
            @click="songSheetToPlaylist(item?.id)"
          ></i>
          <i
            class="icon collect"
            :class="`${item?.subscribed ? 'collectd' : ''}`"
            :title="`${item?.subscribed ? '已收藏' : '收藏'}`"
            @click="handleCollection(item?.id, item?.subscribed)"
          ></i>
          <i class="icon share" title="分享" @click="shareClick"></i>
        </div>
      </div>
      <div class="td4-sheet">101首</div>
      <div class="td5-sheet">
        <div class="name">
          <span class="by">by</span>
          <span
            class="text"
            :title="item?.creator?.nickname"
            @click="jumpUserProfile(item?.userId)"
          >
            {{ item?.creator?.nickname }}
          </span>
        </div>
      </div>
      <div class="td6-sheet">收藏: {{ item?.bookCount }}</div>
      <div class="td6-sheet">
        收听: {{ bigNumberTransform(item?.playCount) }}
      </div>
    </li>
  </ul>
  <Page
    v-if="songSheetData.total > songSheetData.limit"
    :page="songSheetData.offset"
    :pageSize="songSheetData.limit"
    :total="songSheetData.total"
    @pageChange="pageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongToPlaylist from '@/hooks/useSongToPlaylist';
import { bigNumberTransform, handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import { playlistTrack, playlistSubscribe } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/hooks/songFormat';
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

const props = defineProps({
  searchDetailText: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['searchCountChange']);

const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);
const playSongId = computed<number>(() => $store.getters['music/playSongId']);
const searchText = computed<string>(() =>
  $store.getters.searchText.replace(/"/g, '')
);

const { searchDetailText } = toRefs(props);

// 获取歌单列表
const songSheetData = reactive<SongSheetData>({
  loading: true,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

watch(
  () => searchDetailText.value,
  () => {
    getSearchSongSheet();
  }
);

function getSearchSongSheet(): void {
  searchKeywords({
    type: 1000,
    keywords: searchDetailText.value || searchText.value,
    offset: (songSheetData.offset - 1) * songSheetData.limit,
    limit: isLogin.value ? songSheetData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        const total = isLogin.value
          ? res?.result?.playlistCount
          : res?.result?.playlists.length;

        songSheetData.total = total;
        songSheetData.list = res?.result?.playlists;

        emits('searchCountChange', total || 0);
      }

      songSheetData.loading = false;
    })
    .catch(() => ({}));
}
getSearchSongSheet();

// 歌单添加到播放列表并播放
function songSheetToPlaylistPlay(id: number): void {
  playlistTrack({ id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        res.songs = res?.songs?.slice(0, 20) || [];

        // 过滤无版权
        const songList: SongType[] = res?.songs.filter(
          (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
        );

        usePlaySong(songList[0]);
        useSongToPlaylist(songList, { clear: true });
      }
    })
    .catch(() => ({}));
}

// 歌单添加到播放列表
function songSheetToPlaylist(id: number): void {
  playlistTrack({ id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        res.songs = res?.songs?.slice(0, 20) || [];

        // 过滤无版权
        const songList: SongType[] = res?.songs.filter(
          (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
        );

        useSongToPlaylist(songList, { clear: true });
      }
    })
    .catch(() => ({}));
}

// 收藏歌单
function handleCollection(
  id: number,
  subscribed: boolean
): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  if (subscribed) {
    return;
  }

  playlistSubscribe({ id: id, t: 1 })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        setMessage({ type: 'info', title: '收藏成功' });

        songSheetData.list.forEach((item: unknown) => {
          if (id === (item as { id: number }).id) {
            (item as { subscribed: boolean }).subscribed = true;
          }
        });
        return;
      }

      setMessage({ type: 'error', title: '收藏失败' });
    })
    .catch(() => ({}));
}

// 分享
function shareClick(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 分页
function pageChange(current: number): void {
  songSheetData.offset = current;
  getSearchSongSheet();
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-song-sheet.less');
</style>
