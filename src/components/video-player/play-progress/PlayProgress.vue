<template>
  <div>
    <XProgress
      class="progress"
      :range="'.progress'"
      :current="progress.current"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import XProgress from '@components/progress/Progress.vue';

export default defineComponent({
  components: {
    XProgress
  },
  setup() {
    const $store = useStore();

    // 播放进度数据
    const videoPlayProgress = computed(
      () => $store.getters['video/videoPlayProgress']
    );

    const progress = reactive({
      current: ''
    });

    // 更新进度数据
    watch(
      () => videoPlayProgress.value,
      curVal => {
        progress.current = curVal.progress + '%';
      }
    );

    // 视频进度更改
    function progressChange(value: number): void {
      const currentTime = videoPlayProgress.value.duration * value;
      $store.commit('video/setVideoPlayProgress', {
        progress: value * 100,
        currentTime,
        timeChange: true
      });
    }

    return {
      videoPlayProgress,
      progress,
      progressChange
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./play-progress.less');
</style>
