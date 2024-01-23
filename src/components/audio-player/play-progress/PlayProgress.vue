<template>
  <HorizontalProgress
    class="horizontal-progress"
    :range="'.audio-player .horizontal-progress'"
    :loading="loading"
    :current="progress * 100 + '%'"
    :cache="cacheProgress * 100 + '%'"
    @progressChange="progressChange"
  />
</template>

<script lang="ts" setup>
import HorizontalProgress from '@/components/progress/Progress.vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  cacheProgress: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(['progressChange']);

function progressChange(value: number): void {
  emits('progressChange', value);
}
</script>

<style lang="less" scoped>
@import url('./play-progress.less');
</style>
