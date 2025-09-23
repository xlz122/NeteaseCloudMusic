<template>
  <div class="user-info-container">
    <template v-if="songDetailData.songs?.length">
      <div class="cover-warp">
        <div class="cover">
          <img
            class="cover-img"
            :src="`${songDetailData.songs?.[0]?.al?.picUrl}?param=130y130`"
            alt=""
          />
          <span class="cover-img-bg"></span>
        </div>
        <div class="out">
          <i class="icon"></i>
          <a class="link" :href="`https://music.163.com/#/outchain/2/${route.query.id}`">
            生成外链播放器
          </a>
        </div>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">{{ songDetailData.songs?.[0]?.name }}</h2>
        </div>
        <div class="info">
          <span>歌手：</span>
          <template v-for="(item, index) in songDetailData.songs?.[0]?.ar" :key="index">
            <span class="text" :title="item.name" @click="jumpSingerDetail(item.id)">
              {{ item.name }}
            </span>
            <span class="line" v-if="index !== songDetailData.songs?.[0]?.ar?.length - 1">/</span>
          </template>
        </div>
        <div class="info">
          <span>所属专辑：</span>
          <span class="text" @click="jumpAlbumDetail(songDetailData.songs[0]?.al?.id)">
            {{ songDetailData.songs?.[0]?.al?.name }}
          </span>
        </div>
        <div class="operate-btn">
          <template v-if="songDetailData.privileges?.[0]?.cp !== 0">
            <div class="play" @click="playSingleSong">
              <span class="icon-play" title="播放">播放</span>
            </div>
            <div class="play-add" title="添加到播放列表" @click="singleSongToPlaylist"></div>
          </template>
          <template v-else>
            <div class="no-copyright" title="由于版权保护，您所在的地区暂时无法使用。">
              <span class="icon-play">
                <span class="text">播放</span>
              </span>
            </div>
          </template>
          <div class="other collection" @click="handleCollection(songDetailData.songs[0]?.id)">
            <span class="icon">收藏</span>
          </div>
          <div class="other share" @click="handleShare">
            <span class="icon">分享</span>
          </div>
          <div class="other download" @click="handleDownload">
            <span class="icon">下载</span>
          </div>
          <div class="other comment" @click="jumpToComment">
            <template v-if="commentTotal > 0">
              <span class="icon"> ({{ commentTotal }}) </span>
            </template>
            <template v-else>
              <span class="icon">评论</span>
            </template>
          </div>
        </div>
        <ul
          class="lyric-list"
          :class="[{ 'lyric-list-auto': lyric.list?.length < 13 || toggleShow }]"
        >
          <li class="lyric-list-item" v-for="(item, index) in lyric.list" :key="index">
            {{ item.lyric }}
          </li>
        </ul>
        <div class="toggle-btn" v-if="lyric.list?.length > 13">
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';

const props = defineProps({
  songDetailData: {
    type: Object,
    default: () => ({})
  },
  lyric: {
    type: Object,
    default: () => ({})
  },
  commentTotal: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(['jumpToComment']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 播放单个歌曲
function playSingleSong(): void {
  if (!props.songDetailData?.songs?.length) {
    return;
  }

  usePlaySong(props.songDetailData?.songs?.[0]);
  useSongAddPlaylist(props.songDetailData?.songs?.[0]);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(): void {
  if (!props.songDetailData?.songs?.length) {
    return;
  }

  useSongAddPlaylist(props.songDetailData?.songs?.[0]);
}

function handleCollection(id: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  if (props.songDetailData?.privileges?.[0]?.cp === 0) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  store.commit('setSongCollect', { visible: true, songIds: id });
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  if (props.songDetailData?.privileges?.[0]?.cp === 0) {
    store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
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

// 歌词展开/收缩
const toggleShow = ref(false);

function toggle(): void {
  toggleShow.value = !toggleShow.value;
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-info.less');
</style>
