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
    :src="videoSrc"
    @play="videoPlay"
    @pause="videoPause"
    @timeupdate="updateTime"
    @ended="videoEnded"
  ></video>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'VideoView',
  props: {
    videoStatus: {
      type: String,
      default: ''
    }
  },
  emits: ['videoEnded'],
  setup(props, { emit }) {
    const $store = useStore();

    // 视频/mv
    const video = computed(() => $store.getters['video/video']);

    watch(
      () => video.value.url,
      () => {
        if (video.value.url) {
          initVideoSrc();
        }
      }
    );

    // 播放地址
    const videoSrc = ref<string>('');

    // 初始获取播放地址
    function initVideoSrc(): void {
      videoSrc.value = video.value.url;
    }
    initVideoSrc();

    // 播放器实例
    const videoRef = ref<HTMLVideoElement>();

    watch(
      () => props.videoStatus,
      () => {
        // 播放
        if (props.videoStatus === 'play') {
          (videoRef.value as HTMLVideoElement).play();
        }
        // 暂停
        if (props.videoStatus === 'pause') {
          (videoRef.value as HTMLVideoElement).pause();
        }
        // 重播
        if (props.videoStatus === 'replay') {
          (videoRef.value as HTMLVideoElement).load();
          (videoRef.value as HTMLVideoElement).play();
        }
      }
    );

    // 开始播放
    // function videoPlay(): void {}

    // 播放暂停
    // function videoPause(): void {}

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
            return false;
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
    function updateTime(e: any): void {
      const progress = e.target.currentTime / e.target.duration;
      $store.commit('video/setVideoPlayProgress', {
        progress: progress * 100,
        currentTime: e.target.currentTime || 0,
        duration: e.target.duration || 0
      });
    }

    // 播放完成
    function videoEnded(): void {
      emit('videoEnded');
    }

    return {
      videoSrc,
      videoRef,
      // videoPlay,
      // videoPause,
      updateTime,
      videoEnded
    };
  }
});
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
}
</style>
