<template>
  <video
    class="video"
    ref="videoRef"
    :src="videoPlayUrl"
    :volume="videoVolume"
    @play="videoPlaying"
    @pause="videoPause"
    @timeupdate="videoTimeUpdate"
    @ended="videoPlayEnded"
  ></video>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineExpose } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { mvUrl } from '@/api/mv-detail';
import { videoUrl } from '@/api/video-detail';
import type { ResponseType } from '@/types/index';

const props = defineProps({
  videoStatus: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['videoPlaying', 'videoPause', 'videoPlayEnded']);

const $route = useRoute();
const $store = useStore();
const videoVolume = computed(() => $store.getters['video/videoVolume']);

// 播放器实例
const videoRef = ref<HTMLVideoElement | null>(null);

defineExpose({
  videoRef
});

// 获取MV/视频播放地址
const videoPlayUrl = ref('');

watch(
  () => $route.query.type,
  curVal => {
    if (!curVal) {
      return;
    }

    if (Number(curVal) === 0) {
      getMvPlayUrl();
    }
    if (Number(curVal) === 1) {
      getVideoPlayUrl();
    }
  },
  {
    immediate: true
  }
);

function getMvPlayUrl(): void {
  mvUrl({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        videoPlayUrl.value = res?.data?.url || '';
      }
    })
    .catch(() => ({}));
}

function getVideoPlayUrl(): void {
  videoUrl({ id: String($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        videoPlayUrl.value = res?.urls[0]?.url || '';
      }
    })
    .catch(() => ({}));
}

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
function videoPlaying(): void {
  emits('videoPlaying');
}

// 播放暂停
function videoPause(): void {
  emits('videoPause');
}

// 播放进度
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
function videoTimeUpdate(e: Event): void {
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
function videoPlayEnded(): void {
  emits('videoPlayEnded');
}
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>
