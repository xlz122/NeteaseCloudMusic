<template>
  <!-- 横向进度条组件测试用例 -->
  <div class="progress-test">
    <Xprogress
      class="progress"
      :range="'.progress-test'"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Xprogress from './Progress.vue';

export default defineComponent({
  name: 'ProgressTestView',
  components: {
    Xprogress
  },
  setup() {
    function progressChange(progress: number): void {
      console.log(progress);
    }

    return {
      progressChange
    };
  }
});
</script>

<style lang="less" scoped>
.progress-test {
  width: 493px;
  height: 100px;
  margin: 200px auto 0;
}

::v-deep(.progress) {
  height: 9px;
  background: url('~@/assets/image/music-audio/progress.png') no-repeat;
  background-position: right 0;

  .current-progress {
    background: url('~@/assets/image/music-audio/progress.png');
    background-position: left -66px;

    .icon-round {
      right: -11px;
      width: 22px;
      height: 22px;
      background: url('~@/assets/image/music-audio/play-btn-hover.png');
      background-position: 0 -288px;
    }

    .icon-loading {
      right: -6px;
      width: 12px;
      height: 12px;
      background: url('~@/assets/image/music-audio/loading.gif');
    }
  }

  .cache-progress {
    background: url('~@/assets/image/music-audio/progress.png');
    background-position: right -30px;
  }
}
</style>
