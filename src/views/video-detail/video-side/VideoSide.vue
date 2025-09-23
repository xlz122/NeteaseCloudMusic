<template>
  <div class="side-container">
    <h3 class="title">视频简介</h3>
    <div class="video-desc">
      <p class="publish-time">发布时间：{{ formatTimestamp(detail.publishTime, 'YYYY-MM-DD') }}</p>
      <p class="play-time">播放次数：{{ detail.playTime }}次</p>
      <div class="content">
        <pre class="text">{{ detail.description }}</pre>
      </div>
    </div>
    <h3 class="title">相关推荐</h3>
    <ul class="like-list">
      <li class="item" v-for="(item, index) in videoList" :key="index">
        <div class="cover" :title="item.title" @click="jumpVideoDetail(item.vid)">
          <img class="cover-img" :src="item.coverUrl" alt="" />
          <div class="play-volume">
            <span class="icon-mv"></span>
            <span class="text">{{ formatLargeNumber(item.playTime) }}</span>
          </div>
        </div>
        <div class="desc">
          <p class="desc-title hide" :title="item.title" @click="jumpVideoDetail(item.vid)">
            {{ item.title }}
          </p>
          <p class="desc-time hide">
            {{ timeStampToDuration(item.durationms / 1000) }}
          </p>
          <div class="desc-name">
            <span class="text">by</span>
            <span class="name hide" @click="jumpUserProfile(item.creator[0]?.userId)">
              {{ item.creator?.[0]?.userName }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
    <h3 class="title">网易云音乐公众号</h3>
    <div class="side-code">
      <i class="code"></i>
      <p class="tip">
        关注我，我们才能
        <br />
        真正拥有彼此啊~
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatTimestamp, formatLargeNumber, timeStampToDuration } from '@/utils/utils';
import { relatedVideo } from '@/api/video-detail';
import type { ResponseType } from '@/types';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type VideoItem = {
  vid: number;
  title: string;
  coverUrl: string;
  playTime: number;
  durationms: number;
  creator: {
    userId: number;
    userName: string;
  }[];
};

defineProps({
  detail: {
    type: Object,
    default: () => ({})
  }
});

const route = useRoute();
const router = useRouter();

// 获取相关推荐视频
const videoList = ref<VideoItem[]>([]);

function getRelatedVideo(): void {
  relatedVideo({ id: String(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      videoList.value = res.data ?? [];
    })
    .catch(() => ({}));
}
getRelatedVideo();

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

function jumpVideoDetail(id: number): void {
  router.push({ path: '/video-detail', query: { type: 1, id } });
  getRelatedVideo();
}
</script>

<style lang="less" scoped>
@import url('./video-side.less');
</style>
