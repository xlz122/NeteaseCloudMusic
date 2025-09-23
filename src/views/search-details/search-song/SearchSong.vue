<template>
  <div class="loading" v-if="songData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <ul class="search-song" v-if="!songData.loading">
    <li
      class="item"
      v-for="(item, index) in songData.list"
      :key="index"
      :class="[{ 'even-item': index % 2 }, { 'no-copyright': isCopyright(item.id) }]"
    >
      <div
        class="td icon-play"
        :class="{ 'active-play': item.id === playSongId }"
        @click="playSingleSong(item)"
      ></div>
      <div class="td td1">
        <div class="text">
          <span class="name" :title="item.name" @click="jumpSongDetail(item.id)">
            <span v-html="handleMatchString(item.name, String(route.query.keyword))"></span>
          </span>
          <span class="desc" v-if="item.tns?.length"> - ({{ item.tns[0] }}) </span>
          <i class="icon-mv" v-if="item.mv > 0" @click="jumpMvDetail(item.id, item.mv)"></i>
        </div>
      </div>
      <div class="td td2">
        <div class="operate-btn">
          <i class="icon add" title="添加到播放列表" @click="singleSongToPlaylist(item)"></i>
          <i class="icon collect" title="收藏" @click="handleCollection(item.id)"></i>
          <i class="icon share" title="分享" @click="handleShare"></i>
          <i class="icon download" title="下载" @click="handleDownload"></i>
          <!-- 用户自己才有删除按钮 -->
          <i
            class="icon delete"
            v-if="item.ar?.[0]?.id === userInfo.profile?.userId"
            title="删除"
          ></i>
        </div>
      </div>
      <div class="td td3">
        <div class="text">
          <span class="name" @click="jumpSingerDetail(item.ar[0]?.id)">
            {{ item.ar?.[0]?.name }}
          </span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span class="name" :title="item.al?.name" @click="jumpAlbumDetail(item.al?.id)">
            {{ item.al?.name }}
          </span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item.dt / 1000) }}</div>
    </li>
  </ul>
  <Page
    v-if="songData.total > songData.limit"
    :page="songData.offset"
    :pageSize="songData.limit"
    :total="songData.total"
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
import { timeStampToDuration, handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';

type SongData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: Required<
    {
      tns: string[];
      al: {
        id: number;
        name: string;
      };
      privilege: {
        cp: number;
      };
    } & SongType
  >[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);
const playSongId = computed(() => store.getters['music/playSongId']);

// 获取单曲列表
const songData = reactive<SongData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchSong(): void {
  songData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (songData.offset - 1) * songData.limit,
    limit: isLogin.value ? songData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        songData.total = res.result?.songs?.length ?? 0;
      }
      if (isLogin.value) {
        songData.total = res.result?.songCount ?? 0;
      }
      songData.list = res.result?.songs ?? [];
      songData.loading = false;

      emits('searchCountChange', songData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    songData.offset = 1;
    getSearchSong();
  },
  { immediate: true }
);

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  if (isCopyright(item.id)) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(item: SongType): void {
  useSongAddPlaylist(item);
}

// 歌曲是否有版权
function isCopyright(id: number): boolean {
  const songItem = songData.list.find?.((item) => item.id === id);
  if (songItem?.privilege?.cp === 0) {
    return true;
  }

  return false;
}

function handleCollection(id: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  store.commit('setSongCollect', { visible: true, songIds: id });
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleDownload(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handlePageChange(current: number): void {
  songData.offset = current;
  getSearchSong();
}

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}

function jumpMvDetail(songId: number, id: number): void {
  // 无版权
  if (isCopyright(songId)) {
    return;
  }

  router.push({ path: '/mv-detail', query: { type: 0, id } });
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-song.less');
</style>
