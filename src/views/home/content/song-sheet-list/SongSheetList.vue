<template>
  <div class="song-sheet-list">
    <dl class="group" v-for="(item, index) in songSheet" :key="index">
      <dt class="top">
        <img class="cover" :src="item.coverImgUrl" @click="songSheetMore(item.id)" alt="" />
        <div class="content">
          <h3 class="title" :title="item.name" @click="songSheetMore(item.id)">
            {{ item.name }}
          </h3>
          <div class="btns">
            <i class="btn-play" title="播放" @click="playAllSong(index)"></i>
            <template v-if="!item.subscribed">
              <i class="btn-collection" title="收藏" @click="handleCollectAll(item.id)"></i>
            </template>
            <template v-if="item.subscribed">
              <i class="btn-collection subscribe" title="已收藏"></i>
            </template>
          </div>
        </div>
      </dt>
      <dd>
        <ul class="list">
          <li class="item" v-for="(i, ind) in item.tracks?.slice?.(0, 10)" :key="ind">
            <span class="num" :class="{ 'top-three': ind < 3 }">
              {{ ind + 1 }}
            </span>
            <p class="text" :title="i.name" @click="jumpSongDetail(i.id)">
              {{ i.name }}
            </p>
            <div class="operate">
              <i class="operate-play" title="播放" @click="playSingleSong(i)"></i>
              <i class="operate-add" title="添加到播放列表" @click="singleSongToPlaylist(i)"></i>
              <i class="operate-collection" title="收藏" @click="handleCollection(i.id)"></i>
            </div>
          </li>
        </ul>
        <p class="more" @click="songSheetMore(item.id)">查看全部></p>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { topList } from '@/api/home-toplist';
import { playlistDetail } from '@/api/song-sheet-detail';
import { playlistSubscribe } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  subscribed: boolean;
  tracks: {
    id: number;
    name: string;
    noCopyrightRcmd: unknown;
  }[];
};

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取歌单榜单
const songSheet = ref<SongSheetItem[]>([]);

async function getTopList(): Promise<void> {
  const res: ResponseType = await topList();
  if (res?.code !== 200) {
    return;
  }

  res.list?.slice?.(0, 3)?.forEach?.((item: { id: number }) => {
    getSongSheetDetail(item.id);
  });
}
getTopList();

function getSongSheetDetail(id: number): void {
  playlistDetail({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songSheet.value.push(res.playlist ?? {});
    })
    .catch(() => ({}));
}

// 播放全部 - 默认播放列表第一项
function playAllSong(index: number): void {
  if (songSheet.value[index]?.tracks?.length === 0) {
    return;
  }

  // 过滤无版权
  const tracks = songSheet.value[index]?.tracks ?? [];
  const songList = tracks.filter?.((item) => !item.noCopyrightRcmd);

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

function handleCollectAll(id: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  playlistSubscribe({ id, t: 1 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: '收藏失败' });
        return;
      }

      songSheet.value.forEach?.((item) => {
        if (item.id !== id) {
          return;
        }

        item.subscribed = true;
      });
      setMessage({ type: 'info', title: '收藏成功' });
    })
    .catch(() => ({}));
}

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(item: SongType): void {
  useSongAddPlaylist(item);
}

function handleCollection(id: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  store.commit('setSongCollect', { visible: true, songIds: id });
}

function songSheetMore(id: number): void {
  router.push({ path: '/home-toplist', query: { id } });
}

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-sheet-list.less');
</style>
