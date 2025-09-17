<template>
  <div class="singer-song">
    <div class="operate-btn">
      <div
        class="play"
        :class="{ 'disable-play': singerSong.hotSongs?.length === 0 }"
        title="播放"
        @click="playAllSong"
      >
        <span class="icon-play">播放</span>
      </div>
      <div
        class="play-add"
        :class="{ 'disable-add': singerSong.hotSongs?.length === 0 }"
        title="添加到播放列表"
        @click="allSongToPlaylist"
      ></div>
      <div class="other collection" @click="handleCollectAll">
        <span class="icon"> 收藏热门{{ singerSong.hotSongs?.length }} </span>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      <span>加载中...</span>
    </div>
    <table class="play-list-table" v-if="singerSong.hotSongs?.length > 0">
      <thead>
        <tr>
          <th class="th first-th"></th>
          <th class="th two-th"></th>
          <th class="th three-th"></th>
          <th class="th four-th"></th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in singerSong.hotSongs"
          :key="index"
          :class="[{ 'even-item': (index + 1) % 2 }, { 'no-copyright': isCopyright(item.id) }]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playSongId }"
                @click="playSingleSong(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item.id)">
                <span class="name" :title="item.name">
                  {{ item.name }}
                </span>
                <span class="no-click" v-if="item.alia?.[0]"> - {{ item.alia[0] }} </span>
              </span>
              <i class="icon-mv" v-if="item.mv > 0" @click="jumpMvDetail(item.id, item.mv)"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item.dt / 1000) }}
              </span>
              <div class="operate-btn">
                <i class="icon add" title="添加到播放列表" @click="singleSongToPlaylist(item)"></i>
                <i class="icon collect" title="收藏" @click="handleCollection(item.id)"></i>
                <i class="icon share" title="分享" @click="handleShare"></i>
                <i class="icon download" title="下载" @click="handleDownload"></i>
              </div>
            </div>
          </td>
          <td class="tbody-td" @click="jumpAlbumDetail(item.al?.id)">
            <div class="hd">
              <span class="text" :title="item.al?.name">
                {{ item.al?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-data" v-if="!loading && singerSong.hotSongs?.length === 0">
      <div class="title">
        <i class="icon"></i>
        <h3 class="text">暂无音乐！</h3>
      </div>
      <p class="desc">
        <span class="text">点击</span>
        <span class="icon"></span>
        <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
        <span class="text go">马上去</span>
        <router-link class="link" to="/">发现音乐</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { timeStampToDuration } from '@/utils/utils';
import { artistSong } from '@/api/singer-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type SingerSong = {
  hotSongs: {
    id: number;
    name: string;
    al: {
      id: number;
      name: string;
      picUrl: string;
    };
    alia: string[];
    mv: number;
    dt: number;
    privilege: {
      cp: number;
    };
  }[];
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongId = computed(() => store.getters['music/playSongId']);

// 获取歌手 - 歌曲
const loading = ref(false);
const singerSong = ref<SingerSong>({
  hotSongs: []
});

function getArtistSong(): void {
  loading.value = true;

  artistSong({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singerSong.value.hotSongs = res.hotSongs ?? [];
      loading.value = false;
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getArtistSong();
  },
  { immediate: true }
);

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (singerSong.value?.hotSongs?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = singerSong.value.hotSongs?.filter?.((item) => !isCopyright(item.id));

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): void {
  if (singerSong.value?.hotSongs?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = singerSong.value.hotSongs?.filter?.((item) => !isCopyright(item.id));

  useSongAddPlaylist(songList);
}

// 收藏全部
function handleCollectAll(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 过滤无版权
  const songs = singerSong.value.hotSongs?.filter?.((item) => item.privilege.cp !== 0);
  const ids = songs.map?.((item) => item.id).join?.(',');

  store.commit('setSongCollect', { visible: true, songIds: ids });
}

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
  const songItem = singerSong.value.hotSongs?.find?.((item) => item.id === id);
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

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}

function jumpMvDetail(songId: number, id: number): void {
  if (isCopyright(songId)) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  router.push({ path: '/mv-detail', query: { type: 0, id } });
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./singer-song.less');
</style>
