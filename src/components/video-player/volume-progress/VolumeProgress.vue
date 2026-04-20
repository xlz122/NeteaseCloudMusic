<template>
  <VerticalProgress
    class="vertical-progress"
    :current="progress * 100 + '%'"
    :range="'.video-player .vertical-progress'"
    @progressChange="progressChange"
  />
</template>

<script setup lang="ts">
import VerticalProgress from '@/components/vertical-progress/VerticalProgress.vue';

defineProps({
  progress: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(['progressChange']);

function progressChange(value: number): void {
  emits('progressChange', value);
}
</script>

<style scoped lang="scss">
@use './volume-progress.scss';
</style>
