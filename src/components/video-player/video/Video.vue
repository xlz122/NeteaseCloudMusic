<template>
  <!--
    controls="controls" 是否显示原生播放控件
    @play="" 播放视频
    @pause="" 暂停视频
    @timeupdate="" 视频播放的时间
  -->
  <video
    class="video"
    ref="videoRef"
    :src="videoPlayUrl"
    :volume="videoVolume"
    @play="videoPlay"
    @pause="videoPause"
    @timeupdate="updateTime"
    @ended="videoEnded"
  ></video>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  videoStatus: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['videoEnded']);

const $store = useStore();
const videoVolume = computed(() => $store.getters['video/videoVolume']);
// 视频/mv播放url
const videoPlayUrl = computed(() => $store.getters['video/videoPlayUrl']);

// 播放器实例
const videoRef = ref<HTMLVideoElement | null>(null);

watch(
  () => props.videoStatus,
  () => {
    if (!videoRef.value) {
      return;
    }

    // 播放
    if (props.videoStatus === 'play') {
      videoRef.value.play();
    }
    // 暂停
    if (props.videoStatus === 'pause') {
      videoRef.value.pause();
    }
    // 重播
    if (props.videoStatus === 'replay') {
      videoRef.value.load();
      videoRef.value.play();
    }
  }
);

// 开始播放
function videoPlay(): void {
  console.log('开始播放');
}

// 播放暂停
function videoPause(): void {
  console.log('播放暂停');
}

// 播放进度数据
const videoPlayProgress = computed(
  () => $store.getters['video/videoPlayProgress']
);

// 监听手动更新时间
watch(
  () => videoPlayProgress.value.timeChange,
  (curVal: boolean) => {
    if (curVal) {
      // 设置播放时间
      const videoMp3 = videoRef.value as HTMLVideoElement;

      // 当前时间是NaN,不进行更新
      if (isNaN(videoPlayProgress.value.currentTime)) {
        return;
      }

      videoMp3.currentTime = videoPlayProgress.value.currentTime;
      // 重置手动更新
      $store.commit('video/setVideoPlayProgress', {
        timeChange: false
      });
    }
  },
  {
    deep: true
  }
);

// 播放进度
function updateTime(e: Event): void {
  const target = e.target as { currentTime?: number; duration?: number };

  if (!target.currentTime || !target.duration) {
    return;
  }

  const progress = target.currentTime / target.duration;
  $store.commit('video/setVideoPlayProgress', {
    progress: progress * 100,
    currentTime: target.currentTime || 0,
    duration: target.duration || 0
  });
}

// 播放完成
function videoEnded(): void {
  emits('videoEnded');
}
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>
