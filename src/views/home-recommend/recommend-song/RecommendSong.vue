<template>
  <div class="music-table-container">
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      <span>加载中...</span>
    </div>
    <table class="play-list-table" v-if="list.length > 0">
      <thead>
        <tr>
          <th class="th first-th">
            <i class="icon"></i>
          </th>
          <th class="th two-th">
            <i class="icon"></i>
          </th>
          <th class="th three-th">
            <i class="icon"></i>
          </th>
          <th class="th four-th">
            <i class="icon"></i>
          </th>
          <th class="th five-th">
            <i class="icon"></i>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr v-for="(item, index) in list" :key="index" :class="[{ 'even-item': (index + 1) % 2 }]">
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
                <span class="title" :title="item.name">
                  {{ item.name }}
                </span>
                <span class="no-click" v-if="item.alia?.[0]"> - {{ item.alia[0] }} </span>
              </span>
              <i class="icon-play" v-if="item.mv && item.mv > 0"></i>
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
          <td class="tbody-td singer">
            <div class="hd">
              <div class="text" v-for="(i, ind) in item.ar" :key="ind">
                <span class="name" :title="i.name" @click="jumpSingerDetail(i.id)">
                  {{ i.name }}
                </span>
                <span class="line" v-if="ind !== item.ar?.length - 1">/</span>
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
    <div class="no-data" v-if="!loading && list.length === 0">
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
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { timeStampToDuration } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';

type ItemType = {
  alia: string[];
  al: {
    id: number;
    name: string;
  };
  ar: {
    id: number;
  }[];
  dt: number;
} & SongType;

const props = defineProps({
  list: {
    type: Array as () => ItemType[],
    default: () => []
  }
});

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongId = computed(() => store.getters['music/playSongId']);

const loading = ref(true);
watch(
  () => props.list,
  () => {
    loading.value = false;
  }
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

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./recommend-song.less');
</style>
