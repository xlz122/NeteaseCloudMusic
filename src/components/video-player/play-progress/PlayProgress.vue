<template>
  <HorizontalProgress
    class="horizontal-progress"
    :range="'.video-player .horizontal-progress'"
    :current="progress * 100 + '%'"
    @progressChange="progressChange"
  />
</template>

<script lang="ts" setup>
import HorizontalProgress from '@/components/progress/Progress.vue';

defineProps({
  progress: {
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
