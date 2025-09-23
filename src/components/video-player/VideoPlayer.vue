<template>
  <div class="video-player" :class="{ 'video-fullscreen': fullscreen }">
    <VideoView
      ref="videoRef"
      :src="playUrl"
      :volume="volume"
      @timeupdate="videoTimeUpdate"
      @ended="videoPlayEnded"
    />
    <div class="play" @click="togglePlayStatus">
      <i class="icon icon-pause" v-if="playStatus === 'pause'"></i>
      <i class="icon icon-replay" v-if="playStatus === 'ended'">
        <span class="text">重播</span>
      </i>
    </div>
    <!-- 大屏显示 -->
    <div class="full-operate">
      <h2 class="title">
        {{ detail.title }} - by
        {{ detail.creator?.nickname }}
      </h2>
      <ul class="list">
        <li class="item" @click="handleLike">
          <i class="icon like"></i>
        </li>
        <li class="item" @click="handleCollection(subed)">
          <i class="icon collection" :class="{ collectioned: subed }"></i>
        </li>
        <li class="item" @click="handleShare">
          <i class="icon share"></i>
        </li>
      </ul>
    </div>
    <div class="wrap">
      <i class="icon icon-play" v-if="playStatus === 'play'" @click="togglePlayStatus"></i>
      <i class="icon icon-pause" v-else @click="togglePlayStatus"></i>
      <span class="time">
        {{ timeStampToDuration(playProgress.currentTime) }}
      </span>
      <div class="video-progress">
        <PlayProgress :progress="playProgress.progress" @progressChange="videoProgressChange" />
      </div>
      <span class="time">
        {{ timeStampToDuration(playProgress.duration) }}
      </span>
      <div class="other">
        <i
          class="icon-volume"
          :class="{ 'icon-mute': Number(volume) === 0 }"
          @click="volumeStatusToggle"
        ></i>
        <div class="volume-progress" v-if="volumVisible">
          <i class="volume-progress-bar-arrow"></i>
          <VolumeProgress :progress="volume" @progressChange="volumeProgressChange" />
        </div>
        <p class="mode">高清</p>
        <i class="full" v-if="!fullscreen" @click="lanchFullscreen"></i>
        <i class="narrow" v-else @click="exitFullscreen"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { timeStampToDuration } from '@/utils/utils';
import { setMessage } from '@/hooks/useMessage';
import { mvUrl } from '@/api/mv-detail';
import { videoUrl } from '@/api/video-detail';
import type { ResponseType } from '@/types';
import VideoView from './video/Video.vue';
import PlayProgress from './play-progress/PlayProgress.vue';
import VolumeProgress from './volume-progress/VolumeProgress.vue';

defineProps({
  detail: {
    type: Object,
    default: () => ({})
  },
  subed: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['handleCollection']);

const route = useRoute();

// 获取MV/视频播放地址
const playUrl = ref('');

watch(
  () => route.query.type,
  () => {
    if (Number(route.query.type) === 0) {
      getMvPlayUrl();
    }
    if (Number(route.query.type) === 1) {
      getVideoPlayUrl();
    }
  },
  { immediate: true }
);

function getMvPlayUrl(): void {
  mvUrl({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      playUrl.value = res.data?.url ?? '';
    })
    .catch(() => ({}));
}

function getVideoPlayUrl(): void {
  videoUrl({ id: String(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      playUrl.value = res.urls?.[0]?.url ?? '';
    })
    .catch(() => ({}));
}

const videoRef = ref();

// 播放状态
const playStatus = ref('pause');

function togglePlayStatus(): void {
  playStatus.value = playStatus.value === 'play' ? 'pause' : 'play';

  if (!videoRef.value) {
    return;
  }

  if (playStatus.value === 'play') {
    videoRef.value.ref.play();
  }
  if (playStatus.value === 'pause') {
    videoRef.value.ref.pause();
  }
  if (playStatus.value === 'replay') {
    videoRef.value.ref.load();
    videoRef.value.ref.play();
  }
}

// 播放进度
const playProgress = ref({
  currentTime: 0,
  duration: 0,
  progress: 0,
  manualUpdate: false
});

function videoTimeUpdate(currentTime: number, duration: number): void {
  if (playProgress.value.manualUpdate) {
    return;
  }

  playProgress.value = {
    ...playProgress.value,
    currentTime: currentTime,
    duration: duration,
    progress: currentTime / duration
  };
}

function videoProgressChange(value: number): void {
  playProgress.value.manualUpdate = true;

  playProgress.value = {
    ...playProgress.value,
    currentTime: playProgress.value.duration * value,
    progress: value
  };

  // 更新播放器时间
  videoRef.value.ref.currentTime = playProgress.value.duration * value;

  playProgress.value.manualUpdate = false;
}

// 播放结束
function videoPlayEnded(): void {
  playStatus.value = 'ended';
}

// 音量
const volumVisible = ref(false);

function volumeStatusToggle(): void {
  volumVisible.value = !volumVisible.value;
}

const volume = ref(1);

function volumeProgressChange(value: number): void {
  volume.value = value;
}

// 全屏切换
const fullscreen = ref(false);

// 进入全屏
function lanchFullscreen(): void {
  fullscreen.value = true;

  const element = document.documentElement;
  element.requestFullscreen?.();
}

// 退出全屏
function exitFullscreen(): void {
  fullscreen.value = false;

  document.exitFullscreen?.();
}

function handleLike(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleCollection(followed: boolean): void {
  emits('handleCollection', followed);
}

function handleShare(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

onMounted(() => {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    const key = e.key;
    if (key === 'F11') {
      // 阻止默认的键盘事件
      e.preventDefault();
    }
  });

  window.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      // 进入大屏
    } else {
      // 退出大屏
      fullscreen.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', () => ({}));
  window.removeEventListener('fullscreenchange', () => ({}));
});
</script>

<style lang="less" scoped>
@import url('./video-player.less');
</style>
