<template>
  <div class="album-info-container">
    <div class="cover-warp">
      <img class="cover-img" :src="`${userInfo.picUrl}?param=177y177`" alt="" />
      <i class="cover-bg"></i>
    </div>
    <div class="info-right">
      <div class="title">
        <i class="icon-title"></i>
        <h2 class="title-text">
          {{ userInfo.name }}
        </h2>
      </div>
      <div class="info">
        <span>歌手：</span>
        <template v-for="(item, index) in userInfo.artists" :key="index">
          <span class="name" :title="item.name" @click="jumpSingerDetail(item.id)">
            {{ item.name }}
          </span>
          <span class="line" v-if="index !== userInfo.artists?.length - 1"> / </span>
        </template>
      </div>
      <div class="info">
        <span>发行时间：</span>
        <span class="text">
          {{ formatTimestamp(userInfo.publishTime, 'YYYY-MM-DD') }}
        </span>
      </div>
      <div class="info" v-if="userInfo.company">
        <span>发行公司：</span>
        <span class="text">
          {{ userInfo.company }}
        </span>
      </div>
      <div class="operate-btn">
        <div class="play" @click="playAllSong">
          <span class="icon-play" title="播放">播放</span>
        </div>
        <div class="play-add" title="添加到播放列表" @click="allSongToPlaylist"></div>
        <div class="other collection" @click="handleCollectAll">
          <template v-if="userInfo.info?.likedCount > 0">
            <span class="icon"> ({{ userInfo.info?.likedCount }}) </span>
          </template>
          <template v-else>
            <span class="icon">收藏</span>
          </template>
        </div>
        <div class="other share" @click="handleShare">
          <template v-if="userInfo.info?.shareCount > 0">
            <span class="icon">({{ userInfo.info?.shareCount }})</span>
          </template>
          <template v-else>
            <span class="icon">分享</span>
          </template>
        </div>
        <div class="other download" @click="handleDownload">
          <span class="icon">下载</span>
        </div>
        <div class="other comment" @click="jumpToComment">
          <template v-if="userInfo.info?.commentCount > 0">
            <span class="icon">({{ userInfo.info?.commentCount }})</span>
          </template>
          <template v-else>
            <span class="icon">评论</span>
          </template>
        </div>
      </div>
    </div>
    <div class="album-desc" v-if="userInfo.description">
      <h3 class="album-desc-title">专辑介绍：</h3>
      <div class="album-desc-text" v-if="userInfo.description?.length < 170">
        <pre class="text">{{ userInfo.description }}</pre>
      </div>
      <div class="album-desc-text" v-else :class="{ 'text-hide': !toggleShow }">
        <pre class="text">{{ userInfo.description }}</pre>
      </div>
    </div>
    <div class="toggle-btn" v-if="userInfo.description?.length > 170">
      <span v-if="!toggleShow" @click="toggle">
        <span class="text">展开</span>
        <i class="icon"></i>
      </span>
      <span v-else @click="toggle">
        <span class="text">收起</span>
        <i class="icon hide"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatTimestamp } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  },
  songs: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['jumpToComment']);

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 展开/收缩简介
const toggleShow = ref(false);

function toggle(): void {
  toggleShow.value = !toggleShow.value;
}

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (props.songs.length === 0) {
    return;
  }

  // 全部无版权
  const allNoCopyright = props.songs?.some?.(
    (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
  );
  if (!allNoCopyright) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  // 过滤无版权
  const songList: SongType[] = props.songs.filter?.(
    (item: Record<string, { cp: number }>) => item.privilege?.cp !== 0
  );

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): void {
  if (props.songs.length === 0) {
    return;
  }

  // 全部无版权
  const allNoCopyright = props.songs?.some?.(
    (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
  );
  if (!allNoCopyright) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  // 过滤无版权
  const songList: SongType[] = props.songs.filter?.(
    (item: Record<string, { cp: number }>) => item.privilege?.cp !== 0
  );

  useSongAddPlaylist(songList);
}

// 收藏全部
function handleCollectAll(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 全部无版权
  const allNoCopyright = props.songs?.some?.(
    (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
  );
  if (!allNoCopyright) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  // 过滤无版权
  const songs = props.songs.filter?.(
    (item: Record<string, { cp: number }>) => item.privilege.cp !== 0
  );
  const ids = songs.map?.((item: { id: number }) => item.id).join?.(',');

  store.commit('setSongCollect', { visible: true, songIds: ids });
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

function jumpToComment(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  emits('jumpToComment');
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./album-info.less');
</style>
