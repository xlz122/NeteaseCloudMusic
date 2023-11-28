<template>
  <div class="volume-progress">
    <i class="volume-progress-bar-arrow"></i>
    <VerticalProgress
      class="progress"
      :current="progress.current"
      :range="'.volume-progress'"
      @progressChange="progressChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import VerticalProgress from '@/components/vertical-progress/VerticalProgress.vue';

const $store = useStore();
const videoVolume = computed<number>(() => $store.getters['video/videoVolume']);

// 更新进度数据
const progress = reactive({
  current: ''
});

watch(
  () => videoVolume.value,
  curVal => {
    progress.current = curVal * 100 + '%';
  },
  {
    immediate: true
  }
);

// 音量更改
function progressChange(value: number): void {
  $store.commit('video/setVideoVolume', value);
}
</script>

<style lang="less" scoped>
@import url('./volume-progress.less');
</style>
