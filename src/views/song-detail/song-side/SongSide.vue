<template>
  <div class="side-container">
    <template v-if="songSheet.length > 0">
      <h3 class="title">包含这首歌的歌单</h3>
      <ul class="song-sheet-list">
        <li class="item" v-for="(item, index) in songSheet" :key="index">
          <div class="item-cover" :title="item.name" @click="jumpSongSheetDetail(item.id)">
            <img class="cover-img" :src="`${item.coverImgUrl}?param=50y50`" alt="" />
            <i class="high-quality" v-if="item.highQuality"></i>
          </div>
          <div class="item-info">
            <p class="info-title" :title="item.name" @click="jumpSongSheetDetail(item.id)">
              {{ item.name }}
            </p>
            <div class="info-desc">
              <span class="by">by</span>
              <span
                class="text"
                :title="item.creator?.nickname"
                @click="jumpUserProfile(item.creator?.userId)"
              >
                {{ item.creator?.nickname }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-if="similarSong.length > 0">
      <h3 class="title">相似歌曲</h3>
      <ul class="simi-song-list">
        <li class="item" v-for="(item, index) in similarSong" :key="index">
          <div class="item-info">
            <p class="info-title" :title="item.name" @click="jumpSongDetail(item.id)">
              <span class="text">{{ item.name }}</span>
            </p>
            <div
              class="info-desc"
              :title="item.artists[0]?.name"
              @click="jumpSingerDetail(item.artists[0]?.id)"
            >
              <span class="text">{{ item.artists?.[0]?.name }}</span>
            </div>
          </div>
          <div class="item-operate">
            <i class="icon-operate play" @click="playSingleSong(item)"></i>
            <i class="icon-operate add" @click="singleSongToPlaylist(item)"></i>
          </div>
        </li>
      </ul>
    </template>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
    <a class="supplement" href="#" target="_blank">补充或修改艺人资料></a>
    <a
      class="supplement"
      href="https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/recommend"
      target="_blank"
    >
      用户wiki任务中心>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { simiPlaylist, simiSong } from '@/api/song-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  creator: {
    userId: number;
    nickname: string;
  };
  highQuality: boolean;
};

type SimiSongItem = {
  id: number;
  artists: {
    id: number;
  }[];
  privilege: {
    cp: number;
  };
} & SongType;

const route = useRoute();
const router = useRouter();

// 获取歌曲 - 歌单
const songSheet = ref<SongSheetItem[]>([]);

function getSimiPlaylist(): void {
  simiPlaylist({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songSheet.value = res.playlists ?? [];
    })
    .catch(() => ({}));
}

// 获取歌曲 - 相似歌曲
const similarSong = ref<SimiSongItem[]>([]);

function getSimiSong(): void {
  simiSong({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      similarSong.value = res.songs ?? [];
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getSimiPlaylist();
    getSimiSong();
  },
  { immediate: true }
);

// 播放单个歌曲
function playSingleSong(item: SimiSongItem): void {
  // 无版权
  if (item.privilege?.cp === 0) {
    return;
  }

  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(item: SimiSongItem): void {
  // 无版权
  if (item.privilege?.cp === 0) {
    return;
  }

  useSongAddPlaylist(item);
}

function jumpSongSheetDetail(id: number): void {
  router.push({ path: '/song-sheet-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-side.less');
</style>
