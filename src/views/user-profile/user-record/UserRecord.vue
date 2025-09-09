<template>
  <div class="user-record-container">
    <div class="title">
      <span class="title-text">听歌排行</span>
      <h4 class="title-desc">累积听歌{{ listenSongs }}首</h4>
      <i class="title-desc-icon"></i>
      <div class="title-operate">
        <span class="song-week" :class="{ 'song-active': type === 1 }" @click="typeChange(1)">
          最近一周
        </span>
        <i class="song-icon"></i>
        <span class="song-all" :class="{ 'song-active': type === 0 }" @click="typeChange(0)">
          所有时间
        </span>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      <span>加载中...</span>
    </div>
    <ul class="list" v-if="!loading">
      <li class="item" v-for="(item, index) in recordList.slice?.(0, 10)" :key="index">
        <div class="hd">
          <span class="text">{{ index + 1 }}.</span>
          <i
            class="icon-play"
            :class="{ 'active-play': item.song?.id === playSongId }"
            @click="playSingleSong(item.song)"
          ></i>
        </div>
        <div class="song">
          <div class="song-text" :title="item.song?.name" @click="jumpSongDetail(item.song?.id)">
            <b class="text">
              {{ item.song?.name }}
              <span class="desc">
                <em class="em">-</em>
                <span class="desc-text" @click.stop="jumpSingerDetail(item.song?.ar[0]?.id)">
                  {{ item.song?.ar?.[0]?.name }}
                </span>
              </span>
            </b>
          </div>
          <div class="operate-btn">
            <i class="icon add" title="添加到播放列表" @click="singleSongToPlaylist(item.song)"></i>
            <i class="icon collect" title="收藏" @click="handleCollection(item.song?.id)"></i>
            <i class="icon share" title="分享" @click="handleShare"></i>
            <i class="icon download" title="下载" @click="handleDownload"></i>
          </div>
        </div>
        <div class="tops">
          <span class="bg" :style="{ width: `${item.score}%` }"></span>
          <span class="times" v-if="item.playCount > 0"> {{ item.playCount }}次 </span>
        </div>
      </li>
    </ul>
    <div class="more" v-if="recordList.length > 10">查看更多></div>
    <div class="no-data" v-if="!loading && recordList.length === 0">
      <div class="no-data-title">
        <i class="icon"></i>
        <h3 class="text">暂无听歌记录</h3>
      </div>
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
import { userRecord } from '@/api/user';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type RecordItem = {
  score: string;
  playCount: number;
  song: {
    id: number;
    name: string;
    ar: {
      id: number;
      name: string;
    }[];
  };
};

defineProps({
  listenSongs: {
    type: Number,
    default: 0
  }
});

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongId = computed(() => store.getters['music/playSongId']);

// 最近一周/所有时间
const type = ref(0);

function typeChange(t: number): void {
  type.value = t;
}

// 获取用户播放记录
const loading = ref(false);
const recordList = ref<RecordItem[]>([]);

function getUserRecord(): void {
  loading.value = true;

  userRecord({ uid: Number(route.query.id), type: type.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (type.value === 0) {
        recordList.value = res.allData ?? [];
      }
      if (type.value === 1) {
        recordList.value = res.weekData ?? [];
      }
      loading.value = false;
    })
    .catch(() => ({}));
}

watch(
  () => type.value,
  () => {
    getUserRecord();
  },
  { immediate: true }
);

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

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./user-record.less');
</style>
