<template>
  <div class="program-user-info-container">
    <div class="cover-warp">
      <div class="cover">
        <img class="cover-img" :src="`${detail.coverUrl}?param=130y130`" alt="" />
        <span class="cover-img-bg"></span>
      </div>
    </div>
    <div class="info-right">
      <div class="title">
        <i class="icon-title"></i>
        <h2 class="title-text">
          {{ detail.name }}
        </h2>
      </div>
      <div class="rdiname">
        <i class="icon"></i>
        <span class="text" :title="detail.radio?.name" @click="jumpDjradioDetail(detail.radio?.id)">
          {{ detail.radio?.name }}
        </span>
        <div class="subscribe">
          <i class="subscribe-icon">订阅({{ detail.radio?.subCount }})</i>
        </div>
      </div>
    </div>
    <div class="info-bottom">
      <div class="operate-btn">
        <div class="play">
          <span class="icon-play" @click="djprogramToPlaylistPlay(detail.mainSong)"> 播放 </span>
        </div>
        <div class="other like" @click="handleLike">
          <template v-if="detail.likedCount > 0">
            <i class="like-icon"></i>
            <span class="icon"> ({{ detail.likedCount }}) </span>
          </template>
          <template v-else>
            <i class="like-icon"></i>
            <span class="icon">喜欢</span>
          </template>
        </div>
        <div class="other comment" @click="jumpToComment">
          <template v-if="commentTotal > 0">
            <span class="icon"> ({{ commentTotal }}) </span>
          </template>
          <template v-else>
            <span class="icon">评论</span>
          </template>
        </div>
        <div class="other share" @click="handleShare">
          <template v-if="detail.shareCount > 0">
            <span class="icon"> ({{ detail.shareCount }}) </span>
          </template>
          <template v-else>
            <span class="icon">分享</span>
          </template>
        </div>
        <div class="other download" @click="handleDownload">
          <span class="icon">下载</span>
        </div>
      </div>
      <div class="out">
        <i class="icon"></i>
        <a class="link" :href="`https://music.163.com/#/outchain/3/${route.query.id}`">
          生成外链播放器
        </a>
      </div>
    </div>
    <div class="sub">
      <span class="cat">
        {{ detail.categoryName }}
      </span>
      <strong class="sub-title">
        <span class="title-text" :title="detail.radio?.name">
          {{ detail.radio?.name }}
        </span>
        第{{ detail.serialNum }}期
      </strong>
      <span class="sub-time">
        {{ formatTimestamp(detail.createTime, 'YYYY-MM-DD') }}
        创建
      </span>
      <div class="title-play-num">
        <span>播放:</span>
        <span class="eye-catching">
          {{ detail.listenerCount }}
        </span>
        <span>次</span>
      </div>
    </div>
    <div class="simple-description">介绍：{{ detail.description }}</div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatTimestamp } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';

defineProps({
  detail: {
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

// 电台节目添加到播放列表并播放
function djprogramToPlaylistPlay(item: SongType): void {
  usePlaySong(item);
  useSongAddPlaylist(item);
}

function handleLike(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpToComment(): void {
  emits('jumpToComment');
}

function handleShare(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleDownload(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpDjradioDetail(id: number): void {
  router.push({ path: '/djradio-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./program-info.less');
</style>
