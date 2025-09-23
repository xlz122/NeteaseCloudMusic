<template>
  <div class="recommend-side-container">
    <div class="recommend-top">
      <div class="top-title">
        <i class="icon"></i>
        <span class="text">个性化推荐如何工作</span>
      </div>
      <p class="top-desc">它聪明、熟悉每个用户的喜好，从海量音乐中挑选出你可能喜欢的音乐。</p>
      <p class="top-desc">它通过你每一次操作来记录你的口味</p>
      <ul class="top-list">
        <li class="item">
          <i class="icon play"></i>
          <span class="text">你播放了</span>
          <span class="num">{{ userInfo.listenSongs }}</span>
          <span class="text">首音乐</span>
        </li>
        <li class="item">
          <i class="icon like"></i>
          <span class="text">你喜欢了</span>
          <span class="num">140</span>
          <span class="text">首音乐</span>
        </li>
        <li class="item">
          <i class="icon collection"></i>
          <span class="text">你收藏了</span>
          <span class="num">2</span>
          <span class="text">位歌手</span>
        </li>
      </ul>
      <p class="top-desc">你提供给云音乐的信息越多，它就越了解你的音乐喜好。</p>
    </div>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

const store = useStore();
const userInfo = computed(() => store.getters.userInfo);
</script>

<style lang="less" scoped>
@import url('./recommend-side.less');
</style>
