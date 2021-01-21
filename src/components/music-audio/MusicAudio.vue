<template>
  <audio
    ref="musicAudio"
    :muted="audioData.muted"
    :autoplay="audioData.autoplay"
    :loop="audioData.loop"
    @play="onPlay"
    controls="controls"
  >
    <source :src="audioData.src" />
  </audio>
  <div class="music-audio">
    <div class="music-audio-playbar">
      <!-- 锁定 -->
      <div class="updn">
        <div class="updn-left">
          <i class="icon-updn-left"></i>
        </div>
        <div class="updn-right"></div>
      </div>
      <!-- 背景 -->
      <div class="playbar-bg"></div>
      <!-- 内容 -->
      <div class="wrap">
        <div class="operate-btn">
          <button class="btn prev-btn" title="上一首(ctrl+←)"></button>
          <button
            class="btn look-btn"
            :class="{ 'look-play-btn': playMusicStatus }"
            title="播放/暂停(p)"
            @click="lookPlayMusic"
          ></button>
          <button class="btn down-btn" title="下一首(ctrl+→)"></button>
        </div>
        <div class="music-img">
          <img
            class="img"
            src="http://p3.music.126.net/mwCUI0iL3xEC2a4WVICHlA==/109951163115369030.jpg?param=34y34"
          />
          <span class="default-img"></span>
        </div>
        <div class="play">
          <div class="play-info">
            <span class="music-name"></span>
            <span class="singer-name"></span>
            <span class="link"></span>
          </div>
          <div class="play-progress">
            <div class="progress">
              <div class="current-progress">
                <i class="icon"></i>
              </div>
              <div class="total-progress"></div>
            </div>
            <div class="time">
              <span class="duration">00:00</span>
              <span class="total-duration"> / 03:00</span>
            </div>
          </div>
        </div>
        <div class="oper">
          <button class="btn collection-btn" title="收藏"></button>
          <button class="btn share-btn" title="分享"></button>
        </div>
        <div class="other">
          <button class="btn volume-btn" title="音量"></button>
          <button class="btn mode-btn" title="模式"></button>
          <button class="btn list-btn" title="列表"></button>
          <span class="list-text">12</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, reactive, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { getPlayMusicUrl } from '@api/my-music';

interface ResponseType {
  [key: string]: any;
}

interface AudioData {
  src: string;
  muted: boolean;
  autoplay: boolean;
  loop: boolean;
}

export default defineComponent({
  setup() {
    const $store = useStore();

    // 播放列表数据
    const playMusicList = computed(() => $store.getters.playMusicList);

    // 当前播放数据
    const playMusic = ref<unknown>({});

    // 监听播放
    watch(
      () => playMusicList.value,
      cur => {
        playMusic.value = cur[0];
        playMusicSrc(cur[0].id);
      },
      {
        deep: true
      }
    );

    // 播放器实例
    const musicAudio = ref<HTMLVideoElement>();
    // 播放地址
    const audioData = reactive<AudioData>({
      src: '', // 地址
      muted: true, // 静音
      autoplay: true, // 自动播放
      loop: true // 循环播放
    });
    // 播放/暂停切换状态
    const playMusicStatus = ref<boolean>(false);

    // 获取播放地址
    function playMusicSrc(id: number): boolean | undefined {
      if (playMusicList.value?.length === 0) {
        return false;
      }
      getPlayMusicUrl({
        id
      }).then((res: ResponseType) => {
        audioData.src = res.data[0].url;
        
        playMusicStatus.value = !playMusicStatus.value;
        startPlayMusic();
      });
    }

    // 播放/暂停切换
    function lookPlayMusic(): void {
      playMusicStatus.value = !playMusicStatus.value;
      if (playMusicStatus.value) {
        startPlayMusic();
      } else {
        stopPlayMusic();
      }
    }

    // 开始播放
    function startPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).play();
    }

    // 停止播放
    function stopPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).pause();
    }

    // 音频开始播放
    function onPlay(res: any) {
     console.log(res);
     setAudioMuted();
    }

    // 浏览器音频限制处理
    function setAudioMuted(): void {
      audioData.muted = false;
    }
    document.body.addEventListener('mousedown', setAudioMuted, false);

    onUnmounted(() => {
      document.body.removeEventListener('mousedown', setAudioMuted, false);
    });
    return {
      playMusic,
      musicAudio,
      audioData,
      playMusicStatus,
      lookPlayMusic,
      onPlay
    };
  }
});
</script>

<style lang="less" scoped>
@import './music-audio.less';
</style>
