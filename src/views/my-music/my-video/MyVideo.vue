<template>
  <div class="my-video">
    <div class="title">
      <span class="text">我的视频({{ count }})</span>
    </div>
    <ul class="list">
      <li class="item" v-for="(item, index) in videoList" :key="index">
        <div class="cover" @click="jumpVideoDetail(item.vid, item.type)">
          <img class="img" :src="item.coverUrl" alt="" />
          <div class="play-volume">
            <i class="icon-play"></i>
            <span class="text">{{ item.playTime }}</span>
          </div>
          <div class="duration">
            {{ timeStampToDuration(item.durationms / 1000) }}
          </div>
        </div>
        <div class="item-title" :title="item.title" @click="jumpVideoDetail(item.vid, item.type)">
          <i class="icon-mv" v-if="item.type === 0"></i>
          {{ item.title }}
        </div>
        <div class="item-name">
          <span class="text" v-if="item.type === 1">by</span>
          <span class="name" @click="jumpUserProfile(item.creator[0]?.userId, item.type)">
            {{ item.creator?.[0]?.userName }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { timeStampToDuration } from '@/utils/utils';
import { videoSbulist } from '@/api/my-music';
import type { ResponseType } from '@/types';

type VideoItem = {
  vid: number;
  title: string;
  type: number;
  coverUrl: string;
  playTime: number;
  durationms: number;
  creator: {
    userId: number;
    userName: string;
  }[];
};

defineProps({
  count: {
    type: Number,
    default: () => 0
  }
});
const emits = defineEmits(['handleOptions']);

const router = useRouter();

// 获取视频列表
const videoList = ref<VideoItem[]>([]);

function getVideoList(): void {
  videoSbulist()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      videoList.value = res.data ?? [];

      emits('handleOptions', {
        type: 'myVideo',
        data: { visible: true, count: res.count ?? 0 }
      });
    })
    .catch(() => ({}));
}
getVideoList();

function jumpVideoDetail(id: number, type: number): void {
  // 0: mv, 1: 视频
  if (type === 0) {
    router.push({ path: '/mv-detail', query: { type: 0, id } });
  }
  if (type === 1) {
    router.push({ path: '/video-detail', query: { type: 1, id } });
  }
}

function jumpUserProfile(id: number, type: number): void {
  // 0: mv, 1: 视频
  if (type === 0) {
    router.push({ path: '/singer-detail', query: { id } });
  }
  if (type === 1) {
    router.push({ path: '/user-profile', query: { id } });
  }
}
</script>

<style lang="less" scopde>
@import url('./my-video.less');
</style>
