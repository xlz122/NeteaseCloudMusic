<template>
  <div class="video-player" :class="{ 'video-player-fullscreen': fullscreen }">
    <!-- 播放器 -->
    <Video :videoStatus="videoStatus" @videoEnded="videoEnded" />
    <div class="play" @click="togglePlayStatus">
      <i class="icon pause-icon" v-if="videoStatus === 'pause'"></i>
      <i class="icon replay-icon" v-if="videoStatus === 'ended'">
        <span class="text">重播</span>
      </i>
    </div>
    <!-- 大屏显示，标题、操作 -->
    <div class="full-operate">
      <h2 class="title">
        {{ videoDetailData.title }} - by
        {{ videoDetailData?.creator?.nickname }}
      </h2>
      <ul class="list">
        <li class="item" @click="likeClick">
          <i class="icon like"></i>
        </li>
        <li class="item" @click="collectionClick">
          <i class="icon collection"></i>
        </li>
        <li class="item" @click="shareClick">
          <i class="icon share"></i>
        </li>
      </ul>
    </div>
    <!-- 操作部分 -->
    <div class="wrap">
      <i
        class="icon play-btn"
        v-if="videoStatus === 'play'"
        @click="togglePlayStatus"
      ></i>
      <i class="icon pause-btn" v-else @click="togglePlayStatus"></i>
      <span class="time">
        {{ timeStampToDuration(videoPlayProgress.currentTime || 0) || '00:00' }}
      </span>
      <div class="progress"></div>
      <span class="time">
        {{ timeStampToDuration(videoPlayProgress.duration || 0) || '00:00' }}
      </span>
      <div class="other">
        <i class="volume-btn"></i>
        <p class="mode">高清</p>
        <!-- 放大/缩小 -->
        <i class="full" v-if="!fullscreen" @click="lanchFullscreen"></i>
        <i class="narrow" v-else @click="exitFullscreen"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted
} from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils';
// 播放器
import Video from './video/Video.vue';

export default defineComponent({
  components: {
    Video
  },
  props: {
    videoDetailData: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const $store = useStore();

    // 播放进度数据
    const videoPlayProgress = computed(
      () => $store.getters['videoPlayProgress']
    );
    // 播放状态
    const musicPlayStatus = computed(
      () => $store.getters['music/musicPlayStatus']
    );

    const videoStatus = ref<string>('pause');

    // 播放视频暂停音乐,播放音乐暂停视频
    watch(
      () => videoStatus.value,
      () => {
        if (videoStatus.value === 'play') {
          $store.commit('music/setMusicPlayStatus', {
            look: false,
            loading: false,
            refresh: false
          });
        }
      }
    );
    watch(
      () => musicPlayStatus.value,
      () => {
        if (musicPlayStatus.value.look) {
          videoStatus.value = 'pause';
        }
      }
    );

    // 切换播放/暂停状态
    function togglePlayStatus(): void {
      videoStatus.value = videoStatus.value === 'play' ? 'pause' : 'play';
    }

    // 播放完成
    function videoEnded(): void {
      videoStatus.value = 'ended';
    }

    // 重播
    function videoReplay(): void {
      videoStatus.value = 'replay';
    }

    // 全屏切换
    const fullscreen = ref<boolean>(false);

    // 进入全屏
    function lanchFullscreen() {
      fullscreen.value = true;

      const element = document.documentElement;
      element.requestFullscreen && element.requestFullscreen();
    }

    // 退出全屏
    function exitFullscreen() {
      fullscreen.value = false;

      document.exitFullscreen && document.exitFullscreen();
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

    // 喜欢
    function likeClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 收藏
    function collectionClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    onUnmounted(() => {
      window.removeEventListener('keydown', () => ({}));
      window.removeEventListener('fullscreenchange', () => ({}));
    });

    return {
      timeStampToDuration,
      videoPlayProgress,
      videoStatus,
      togglePlayStatus,
      videoEnded,
      videoReplay,
      fullscreen,
      lanchFullscreen,
      exitFullscreen,
      likeClick,
      collectionClick,
      shareClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './video-player.less';
</style>
