<template>
  <div class="home-recommend">
    <div class="home-recommend-container">
      <div class="recommend-content">
        <div class="header-info">
          <div class="item-top">
            <i class="img"></i>
            <span class="head">{{ getTodayDayOfWeek() }}</span>
            <span class="head-text">{{ dateText }}</span>
            <span class="mask"></span>
          </div>
        </div>
        <div class="operate-btn">
          <div
            class="play"
            :class="{ 'disable-play': recommend.length === 0 }"
            @click="playAllSong"
          >
            <span class="icon-play">播放全部</span>
          </div>
          <div
            class="play-add"
            :class="{ 'disable-add': recommend.length === 0 }"
            @click="allSongToPlaylist"
          ></div>
          <div class="other collection" @click="handleCollectAll">
            <span class="icon"> 收藏全部</span>
          </div>
        </div>
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num">{{ recommend.length }}首歌</span>
        </div>
        <RecommendSong class="music-table" :list="recommend" />
      </div>
      <div class="recommend-side">
        <RecommendSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { getTodayDayOfWeek, formatTimestamp } from '@/utils/utils';
import { recommendSongs } from '@/api/home-recommend';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import RecommendSong from './recommend-song/RecommendSong.vue';
import RecommendSide from './recommend-side/RecommendSide.vue';

type RecommendItem = {
  alia: string[];
  al: {
    id: number;
    name: string;
  };
  ar: {
    id: number;
  }[];
  dt: number;
  privilege: {
    cp: number;
  };
} & SongType;

const store = useStore();

// 获取当前日期
const dateText = ref('');
dateText.value = formatTimestamp(new Date().getTime(), 'DD').replace(/\b(0+)/gi, '');

// 获取每日推荐歌曲
const recommend = ref<RecommendItem[]>([]);

function getRecommendSong(): void {
  recommendSongs()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      recommend.value = res.data?.dailySongs ?? [];
    })
    .catch(() => ({}));
}
getRecommendSong();

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (recommend.value?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = recommend.value.filter?.((item) => item.privilege?.cp !== 0);

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): void {
  if (recommend.value?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = recommend.value.filter?.((item) => item.privilege?.cp !== 0);

  useSongAddPlaylist(songList);
}

// 收藏全部
function handleCollectAll(): void {
  // 过滤无版权
  const songs = recommend.value.filter?.((item) => item.privilege.cp !== 0);
  const ids = songs.map?.((item) => item.id).join?.(',');

  store.commit('setSongCollect', { visible: true, songIds: ids });
}

onMounted(() => {
  store.commit('setMenuIndex', 0);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./home-recommend.less');
</style>
