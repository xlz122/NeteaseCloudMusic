<template>
  <div class="video-detail-side">
    <h3 class="title">视频简介</h3>
    <div class="video-desc">
      <p class="publish-time">
        发布时间：{{ formatDateTime(detail?.publishTime / 1000) }}
      </p>
      <p class="play-time">播放次数：{{ detail?.playTime }}次</p>
      <p class="text">{{ detail?.description }}</p>
    </div>
    <h3 class="title">相关推荐</h3>
    <ul class="like-list">
      <li class="item" v-for="(item, index) in videoList" :key="index">
        <div
          class="cover"
          :title="item?.title"
          @click="jumpVideoDetail(item?.vid)"
        >
          <img class="cover-img" :src="item?.coverUrl" alt="" />
          <div class="play-volume">
            <span class="icon-mv"></span>
            <span class="text">{{ bigNumberTransform(item?.playTime) }}</span>
          </div>
        </div>
        <div class="desc">
          <p
            class="desc-title hide"
            :title="item?.title"
            @click="jumpVideoDetail(item?.vid)"
          >
            {{ item?.title }}
          </p>
          <p class="desc-time hide">
            {{ timeStampToDuration(item?.durationms / 1000) }}
          </p>
          <div class="desc-name">
            <span class="text">by</span>
            <span
              class="name hide"
              @click="jumpUserProfile(item?.creator[0]?.userId)"
            >
              {{ item?.creator[0]?.userName }}
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

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  formatDateTime,
  bigNumberTransform,
  timeStampToDuration
} from '@utils/utils';
import { relatedVideo } from '@api/video-detail';
import type { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  name: 'VideoDetailSide',
  components: {
    SideDownload
  },
  props: {
    detail: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const video = computed(() => $store.getters['video/video']);

    const videoList = ref<unknown[]>([]);

    // 获取相关推荐视频
    function getRelatedVideo(): void {
      relatedVideo({ id: video.value.id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            videoList.value = res?.data;
          }
        })
        .catch(() => ({}));
    }
    getRelatedVideo();

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number): void {
      $router.push({ name: 'video-detail', params: { id } });
      $store.commit('video/setVideo', { id, url: '' });

      getRelatedVideo();
    }

    return {
      formatDateTime,
      bigNumberTransform,
      timeStampToDuration,
      videoList,
      jumpUserProfile,
      jumpVideoDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './video-detail-side.less';
</style>
