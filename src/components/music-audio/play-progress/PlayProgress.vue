<template>
  <div>
    <HorizontalProgress
      class="progress"
      :range="'#musicAudio .play'"
      :loading="musicPlayStatus.loading"
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
const musicPlayStatus = computed(() => $store.getters['music/musicPlayStatus']);
// 播放进度数据
const musicPlayProgress = computed(
  () => $store.getters['music/musicPlayProgress']
);

// 更新进度数据
const progress = reactive({
  current: '',
  cache: ''
});

watch(
  () => musicPlayProgress.value,
  curVal => {
    progress.current = curVal.progress + '%';
    progress.cache = curVal.cacheProgress + '%';
  }
);

// 音乐进度更改
function progressChange(value: number): void {
  const currentTime = musicPlayProgress.value.duration * value;

  $store.commit('music/setMusicPlayProgress', {
    progress: value * 100,
    currentTime,
    timeChange: true
  });
}
</script>

<style lang="less" scoped>
@import url('./play-progress.less');
</style>
