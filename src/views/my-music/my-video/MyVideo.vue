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
        @click="MyVideoplay(item.vid)"
      >
        <div class="cover">
          <img class="img" :src="item?.coverUrl" alt="" />
          <div class="play-volume">
            <span class="icon-mv"></span>
            <span class="text">{{ item?.playTime }}</span>
          </div>
          <div class="duration">
            {{ timeStampToDuration(item?.durationms / 1000) }}
          </div>
        </div>
        <div class="item-title">{{ item?.title }}</div>
        <div class="item-name">
          <span class="text">by</span>
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
      MyVideoSbulist().then((res: ResponseType) => {
        if (res.code === 200) {
          MyVideoCount.value = res.count || 0;
          MyVideoList.value = res.data;
        }
      });
    }
    getMyVideoSbulist();

    // 播放
    function MyVideoplay(id: string): void {
      $router.push({ name: 'video-detail', params: { id } });
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
      MyVideoplay,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scopde>
@import './my-video.less';
</style>
