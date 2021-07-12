<template>
  <div class="my-mv">
    <div class="title">
      <span class="text">我的视频({{ myMvCount }})</span>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in myMvList"
        :key="index"
        @click="myMvplay"
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
        <div class="item-title">{{ item?.title }}</div>
        <div class="item-name">
          <span class="text">by</span>
          <span class="name">{{ item?.creator[0]?.userName }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { myMvSbulist } from '@api/my-music';
import { ResponseType } from '@/types/types';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 我的视频数量
    const myMvCount = ref<number>(0);
    // 获取我的视频列表
    const myMvList = ref<unknown[]>([]);
    function getMyMvSbulist(): void {
      myMvSbulist().then((res: ResponseType) => {
        if (res.code === 200) {
          myMvCount.value = res.count || 0;
          myMvList.value = res.data;
        }
      });
    }
    getMyMvSbulist();

    // 播放
    function myMvplay(): void {
      $store.commit('setMessage', {
        type: 'info',
        title: '点击mv播放'
      });
    }
    return {
      timeStampToDuration,
      myMvCount,
      myMvList,
      myMvplay
    };
  }
});
</script>

<style lang="less" scopde>
@import './my-mv.less';
</style>
