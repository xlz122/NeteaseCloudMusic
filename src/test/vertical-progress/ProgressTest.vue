<template>
  <!-- 竖向进度条组件测试用例 -->
  <div class="progress-test">
    <VerticalProgress
      class="progress"
      :range="'.progress-test'"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts" setup>
import VerticalProgress from '@/components/vertical-progress/VerticalProgress.vue';

function progressChange(progress: number): void {
  console.log(progress);
}
</script>

<style lang="less" scoped>
.progress-test {
  position: relative;
  width: 32px;
  height: 113px;
  margin: 150px auto 0;
  background: url('http://192.168.10.135:8018/img/playbar.8f67c7ff.png');
  background-position: 0 -503px;
}

::v-deep(.progress) {
  position: absolute;
  top: 16px;
  left: 14px;
  width: 4px;
  height: 86px;
  background: transparent;

  .current-progress {
    background-color: #b2072a;

    .icon-round {
      bottom: -10px;
      width: 18px;
      height: 20px;
      background: url('@/assets/image/video/video-play-btn.png') no-repeat;
      background-position: center;
    }

    .icon-round:hover {
      background: url('@/assets/image/video/video-play-btn-hover.png');
      background-position: center;
    }
  }
}
</style>
