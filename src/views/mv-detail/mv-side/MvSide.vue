<template>
  <div class="side-container">
    <h3 class="title">MV简介</h3>
    <div class="video-desc">
      <p class="publish-time">发布时间：{{ detail.publishTime }}</p>
      <p class="play-time">播放次数：{{ formatLargeNumber(detail.playCount) }}次</p>
      <div class="content">
        <pre class="text">{{ detail.desc }}</pre>
      </div>
    </div>
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
    <h4 class="supplement-title">
      <span class="text">用户wiki</span>
    </h4>
    <a class="supplement" href="#" target="_blank">补充或修改艺人资料></a>
    <a
      class="supplement"
      href="https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/recommend"
      target="_blank"
      >用户wiki任务中心></a
    >
  </div>
</template>

<script lang="ts" setup>
import { formatLargeNumber } from '@/utils/utils';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

defineProps({
  detail: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style lang="less" scoped>
@import url('./mv-side.less');
</style>
