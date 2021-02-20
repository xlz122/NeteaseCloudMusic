<template>
  <div class="sub-play-list">
    <div class="title">
      <span class="text">我的歌手({{ subPlayListCount }})</span>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in subPlayListList"
        :key="index"
        @click="subPlayListClick"
      >
        <div class="cover">
          <img class="img" :src="`${item?.picUrl}?param=80y80`" alt="" />
        </div>
        <div class="info">
          <h4 class="info-title">{{ item?.name }}</h4>
          <p class="desc">{{ item?.albumSize }}专辑</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { subPlayList } from '@api/my-music';
import { ResponseType } from '@/types/types';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    // 我的视频数量
    const subPlayListCount = ref<number>(0);
    // 获取我的视频列表
    const subPlayListList = ref<unknown[]>([]);
    function getMyMvSbulist(): void {
      subPlayList().then((res: ResponseType) => {
        if (res.code == 200) {
          console.log(res);
          subPlayListCount.value = res.count || 0;
          subPlayListList.value = res.data;
        }
      });
    }
    getMyMvSbulist();

    // 列表点击
    function subPlayListClick(): void {
      console.log('点击');
    }
    return {
      timeStampToDuration,
      subPlayListCount,
      subPlayListList,
      subPlayListClick
    };
  }
});
</script>

<style lang="less" scopde>
@import './sub-play-list.less';
</style>
