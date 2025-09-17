<template>
  <video
    class="video"
    ref="videoRef"
    :src="src"
    :volume="volume"
    @play="play"
    @timeupdate="timeupdate"
    @pause="pause"
    @ended="ended"
  ></video>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
  src: {
    type: String,
    default: ''
  },
  volume: {
    type: Number,
    default: 1
  }
});
const emits = defineEmits(['play', 'timeupdate', 'pause', 'ended']);

const videoRef = ref<HTMLVideoElement | null>(null);

defineExpose({
  ref: videoRef
});

// 开始播放
function play(): void {
  emits('play');
}

// 播放时间更新
function timeupdate(e: Event): void {
  const target = e.target as HTMLVideoElement;

  if (!target.currentTime || !target.duration) {
    return;
  }

  emits('timeupdate', target.currentTime, target.duration);
}

// 播放暂停
function pause(): void {
  emits('pause');
}

// 播放结束
function ended(): void {
  emits('ended');
}
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>
