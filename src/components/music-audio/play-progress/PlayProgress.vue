<template>
  <div>
    <HorizontalProgress
      class="progress"
      :range="'#musicAudio .play'"
      :loading="songPlayStatus.loading"
      :current="progress.current"
      :cache="progress.cache"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import HorizontalProgress from '@/components/progress/Progress.vue';

const $store = useStore();
// 播放状态
const songPlayStatus = computed(() => $store.getters['music/songPlayStatus']);
// 播放进度
const songPlayProgress = computed(
  () => $store.getters['music/songPlayProgress']
);

// 更新进度数据
const progress = reactive({
  current: '',
  cache: ''
});

watch(
  () => songPlayProgress.value,
  curVal => {
    progress.current = curVal.progress + '%';
    progress.cache = curVal.cacheProgress + '%';
  }
);

// 音乐进度更改
function progressChange(value: number): void {
  const currentTime = songPlayProgress.value.duration * value;

  $store.commit('music/setSongPlayProgress', {
    progress: value * 100,
    currentTime,
    timeChange: true
  });
}
</script>

<style lang="less" scoped>
@import url('./play-progress.less');
</style>
