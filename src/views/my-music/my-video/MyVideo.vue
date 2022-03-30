<template>
  <div class="my-video">
    <div class="title">
      <span class="text">我的视频({{ MyVideoCount }})</span>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in MyVideoList"
        :key="index"
        @click="jumpVideoDetail(item.type, item.vid)"
      >
        <div class="cover">
          <img class="img" :src="item?.coverUrl" alt="" />
          <div class="play-volume">
            <span class="icon-play"></span>
            <span class="text">{{ item?.playTime }}</span>
          </div>
          <div class="duration">
            {{ timeStampToDuration(item?.durationms / 1000) }}
          </div>
        </div>
        <div class="item-title" :title="item?.title">
          <i class="icon-mv" v-if="item?.type === 0"></i>
          {{ item?.title }}
        </div>
        <div class="item-name">
          <span class="text" v-if="item?.type === 1">by</span>
          <span class="name" @click="jumpUserProfile(item?.creator[0]?.userId)">
            {{ item?.creator[0]?.userName }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { MyVideoSbulist } from '@api/my-music';
import { ResponseType } from '@/types/types';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 我的视频数量
    const MyVideoCount = ref<number>(0);
    // 获取我的视频列表
    const MyVideoList = ref<unknown[]>([]);
    function getMyVideoSbulist(): void {
      MyVideoSbulist()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            MyVideoCount.value = res.count || 0;
            MyVideoList.value = res.data;
          }
        })
        .catch(() => ({}));
    }
    getMyVideoSbulist();

    // 播放
    function jumpVideoDetail(type: number, id: number): void {
      // type 0为mv, 1为视频
      if (type === 0) {
        $router.push({ name: 'mv-detail', params: { id } });
      }
      if (type === 1) {
        $router.push({ name: 'video-detail', params: { id } });
      }
      $store.commit('setVideo', { id, url: '' });
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      timeStampToDuration,
      MyVideoCount,
      MyVideoList,
      jumpVideoDetail,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scopde>
@import './my-video.less';
</style>
