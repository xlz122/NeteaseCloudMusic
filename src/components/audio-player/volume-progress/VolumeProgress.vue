<template>
  <VerticalProgress
    class="vertical-progress"
    :current="progress * 100 + '%'"
    :range="'.audio-player .vertical-progress'"
    @progressChange="progressChange"
  />
</template>

<script lang="ts" setup>
import VerticalProgress from '@/components/vertical-progress/VerticalProgress.vue';

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
@import url('./volume-progress.less');
</style>
