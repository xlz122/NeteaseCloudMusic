<template>
  <div class="play-list" v-if="visible">
    <div class="play-list-title">
      <h4 class="title">播放列表({{ songPlaylist.length }})</h4>
      <div class="collect-all" @click="collectAll">
        <i class="icon"></i>
        <span>收藏全部</span>
      </div>
      <span class="line"></span>
      <div class="clear-all" @click="emptyPlaylist">
        <i class="icon"></i>
        <span>清除</span>
      </div>
      <div class="song-title">{{ playSongItem.name ?? '' }}</div>
      <i class="icon-close" @click="close"></i>
    </div>
    <div class="play-list-content">
      <img
        class="play-list-content-bg"
        v-if="playSongItem.picUrl"
        :src="playSongItem.picUrl"
        alt=""
      />
      <div class="left-content">
        <ul class="p-list" v-if="songPlaylist.length > 0">
          <li
            class="item"
            v-for="(item, index) in songPlaylist"
            :key="index"
            :class="{ 'p-active-item': item.id === playSongId }"
            @click="playSingleSong(item)"
          >
            <i class="play-icon"></i>
            <span class="text song-title" :title="item.name">
              {{ item.name }}
            </span>
            <div class="operate-btn">
              <i class="icon collect" title="收藏" @click.stop="handleCollection(item.id)"></i>
              <i class="icon share" title="分享" @click.stop="handleShare"></i>
              <i class="icon download" title="下载" @click.stop="handleDownload"></i>
              <i class="icon delete" title="删除" @click="deleteSingleSong(item, $event)"></i>
            </div>
            <span class="text name" @click.stop>
              <span v-for="(i, ind) in item.artists" :key="ind" @click="jumpSingerDetail(i.id)">
                <span class="name-text" :title="i.name">{{ i.name }}</span>
                <span v-if="ind !== item.artists?.length - 1"> / </span>
              </span>
            </span>
            <span class="text time">
              {{ timeStampToDuration(item.duration / 1000) }}
            </span>
            <i class="share" @click.stop="jumpSongPosition"></i>
          </li>
        </ul>
        <div class="no-data" v-else>
          <div class="title">
            <i class="icon"></i>
            <span class="text">你还没有添加任何歌曲</span>
          </div>
          <p class="desc">
            <span>去首页</span>
            <router-link class="link" to="/">发现音乐</router-link>
            <span>，或在</span>
            <router-link class="link" to="/my-music">我的音乐</router-link>
            <span>收听自己收藏得歌单</span>
          </p>
        </div>
      </div>
      <i class="line" v-if="songPlaylist.length === 0"></i>
      <div class="right-content">
        <lyric />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongDelPlaylist from '@/hooks/useSongDelPlaylist';
import { timeStampToDuration } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';
import Lyric from './lyric/Lyric.vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['close']);

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongId = computed(() => store.getters['music/playSongId']);
const playSongItem = computed(() => store.getters['music/playSongItem']);
const songPlaylist = computed(() => store.getters['music/songPlaylist']);

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      playSongPosition();
    }
  }
);

// 播放歌曲定位
function playSongPosition(): void {
  const isExist = songPlaylist.value.find?.((item: SongType) => item.id === playSongId.value);
  if (!isExist) {
    return;
  }

  nextTick(() => {
    const listDom: HTMLElement = document.querySelector('.p-list')!;
    const activeItem: HTMLElement = document.querySelector('.p-active-item')!;

    listDom?.scrollTo(0, activeItem.offsetTop - activeItem.clientHeight * 4);
  });
}

// 收藏全部
function collectAll(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  const ids = songPlaylist.value.map?.((item: SongType) => item.id).join?.(',');

  store.commit('setSongCollect', { visible: true, songIds: ids });
}

// 清除列表
function emptyPlaylist(): void {
  store.commit('music/emptySongPlaylist');
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

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  usePlaySong(item);
}

// 删除单个歌曲
function deleteSingleSong(item: SongType, event: MouseEvent): void {
  event.stopPropagation();

  useSongDelPlaylist(item);
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
  close();
}

// 跳转歌曲位置
function jumpSongPosition(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function close(): void {
  emits('close');
}
</script>

<style lang="less" scoped>
@import url('./play-list.less');
</style>
