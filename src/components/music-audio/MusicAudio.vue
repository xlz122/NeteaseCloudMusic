<template>
  <!-- 遇到的坑： -->
  <!-- 直接 audio 标签上添加scr，可以播放，但是控制会报错，使用source解决 -->
  <!-- 改变source src地址，调用play()，音频无法播放，需要调用load()重新加载，然后调用play()播放 -->
  <!-- controls="controls" 是否显示原生播放控件 -->
  <audio
    class="music-audio"
    ref="musicAudio"
    :muted="audioData.muted"
    :autoplay="audioData.autoplay"
    :loop="audioData.loop"
    @play="musicPlaying"
    @timeupdate="musicUpdateTime"
    @ended="musicPlayEnded"
  >
    <source :src="audioData.src" />
  </audio>
  <div class="music-audio-container">
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
          <button
            class="btn prev-btn"
            title="上一首(ctrl+←)"
            @click="prevPlayMusic"
          ></button>
          <button
            class="btn look-btn"
            :class="{ 'look-play-btn': playMusicStatus.look }"
            title="播放/暂停(p)"
            @click="lookPlayMusic"
          ></button>
          <button
            class="btn down-btn"
            title="下一首(ctrl+→)"
            @click="nextPlayMusic"
          ></button>
        </div>
        <div class="music-img">
          <img
            class="img"
            v-if="playMusic?.al?.picUrl"
            :src="playMusic?.al?.picUrl"
          />
          <span class="default-img"></span>
        </div>
        <div class="play">
          <div class="play-info">
            <span class="music-name">
              <span class="name">{{ playMusic?.name }}</span>
              <span class="icon-mv" v-if="playMusic?.mv > 0"></span>
            </span>
            <span class="singer-name">
              <span
                class="text"
                v-for="(item, index) in playMusic?.ar"
                :key="index"
              >
                {{ item.name }}
                <span class="line" v-if="index !== playMusic.ar.length - 1">
                  /
                </span>
              </span>
            </span>
            <span class="link" v-if="playMusic.name"></span>
          </div>
          <div class="play-progress">
            <!-- <div class="progress">
              <div class="current-progress">
                <i class="icon"></i>
                <i class="icon-loading" v-if="playMusicStatus.loading"></i>
              </div>
              <div class="total-progress"></div>
            </div>
            <div class="time">
              <span class="duration">00:00</span>
              <span class="total-duration"> / 03:00</span>
            </div> -->
            <play-progress-bar
              :loading="playMusicStatus.loading"
              :progressData="progressData"
              :stopProgress="stopProgress"
              @handleProgressChange="handleProgressChange"
            />
          </div>
        </div>
        <div class="oper">
          <button class="btn collection-btn" title="收藏"></button>
          <button class="btn share-btn" title="分享"></button>
        </div>
        <div class="other">
          <button class="btn volume-btn" title="音量"></button>
          <!-- 音量控制 -->
          <volume-progress-bar v-if="false" />
          <button class="btn mode-btn" title="模式"></button>
          <button
            class="btn list-btn"
            title="列表"
            @click="setPlayListShow"
          ></button>
          <span class="list-text">{{ playMusicList?.length }}</span>
        </div>
      </div>
    </div>
    <play-list
      class="play-list"
      :playListShow="playListShow"
      :playMusicList="playMusicList"
      :playMusicId="playMusicId"
      :playMusic="playMusic"
      @playlistItem="playlistItem"
      @closePlayList="closePlayList"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  reactive,
  onUnmounted
} from 'vue';
import { useStore } from 'vuex';
import PlayList from './PlayList.vue';
import PlayProgressBar from './PlayProgressBar.vue';
import VolumeProgressBar from './VolumeProgressBar.vue';
import { getPlayMusicUrl } from '@api/my-music';
import { ResponseType, LoopType } from '@/types/types';

interface AudioData {
  src: string;
  muted: boolean;
  autoplay: boolean;
  loop: boolean;
}

interface ProgressData {
  progress: number;
  currentTime: number;
  duration: number;
  cacheProgress: number;
}

// 未完成功能：拖动比缓冲更快，需置为加载
export default defineComponent({
  components: {
    PlayList,
    PlayProgressBar,
    VolumeProgressBar
  },
  setup() {
    const $store = useStore();

    // 播放列表数据
    const playMusicList = computed(() => $store.getters.playMusicList);

    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters.playMusicId);

    // 当前播放数据
    const playMusic = ref<unknown>({});

    // 监听播放列表变化
    watch(
      () => playMusicList.value,
      () => {
        playMusicSrc(playMusicId.value);
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
    const playMusicStatus = reactive({
      look: false,
      loading: false
    });

    // 播放进度数据
    const progressData = reactive<ProgressData>({
      progress: 0, // 播放进度
      currentTime: 0, // 当前播放时间
      duration: 0, // 总时长
      cacheProgress: 0 // 缓存进度
    });

    // 播放进度更新
    const stopProgress = ref<boolean>(false);

    // 获取播放地址
    function playMusicSrc(id: number): boolean | undefined {
      playMusicStatus.look = true;
      playMusicStatus.loading = true;
      if (playMusicList.value.length === 0) {
        return false;
      }
      getPlayMusicUrl({
        id
      }).then((res: ResponseType) => {
        // 清空所有播放进度
        stopProgress.value = false;
        progressData.progress = 0;
        progressData.currentTime = 0;
        progressData.duration = 0;
        progressData.cacheProgress = 0;
        // 播放地址
        audioData.src = res.data[0].url;
        startPlayMusic();
        // 当前播放音乐数据
        const musicData: unknown = playMusicList.value.find(
          (item: LoopType) => item.id === playMusicId.value
        );
        playMusic.value = musicData;
        // 当前播放音乐id
        $store.commit('setPlayMusicId', id);
      });
    }

    // 上一首
    function prevPlayMusic(): boolean | undefined {
      if (playMusicList.value.length === 0) {
        return false;
      }
      // 获取当前id索引
      const index: number = playMusicList.value.findIndex(
        (item: LoopType) => item.id === playMusicId.value
      );
      let id = null;
      // 当前播放在列表存在，并且不是第一项
      if (index !== -1 && index > 0) {
        id = playMusicList.value[index - 1].id;
        playMusicSrc(playMusicList.value[index - 1].id);
      }
      // 列表回到最后一项项
      if (index !== -1 && index === 0) {
        id = playMusicList.value[playMusicList.value.length - 1].id;
        playMusicSrc(playMusicList.value[playMusicList.value.length - 1].id);
      }
      // 当前播放音乐id
      $store.commit('setPlayMusicId', id);
    }

    // 下一首
    function nextPlayMusic(): boolean | undefined {
      if (playMusicList.value.length === 0) {
        return false;
      }
      // 获取当前id索引
      const index: number = playMusicList.value.findIndex(
        (item: LoopType) => item.id === playMusicId.value
      );
      let id = null;
      // 当前播放在列表存在，并且不是最后一项
      if (index !== -1 && index < playMusicList.value.length - 1) {
        id = playMusicList.value[index + 1].id;
        playMusicSrc(playMusicList.value[index + 1].id);
      }
      // 列表回到第一项
      if (index !== -1 && index === playMusicList.value.length - 1) {
        id = playMusicList.value[0].id
        playMusicSrc(playMusicList.value[0].id);
      }
      // 当前播放音乐id
      $store.commit('setPlayMusicId', id);
    }

    // 播放/暂停切换
    function lookPlayMusic(): void {
      playMusicStatus.look = !playMusicStatus.look;
      if (playMusicStatus.look) {
        playMusicStatus.loading = true;
        startPlayMusic();
      } else {
        stopPlayMusic();
      }
    }

    // 开始播放
    function startPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).load();
      // 设置进度时间
      if (progressData.currentTime !== 0) {
        const musicMp3 = musicAudio.value as HTMLVideoElement;
        musicMp3.currentTime = progressData.currentTime;
      }
      (musicAudio.value as HTMLVideoElement).play();
    }

    // 停止播放
    function stopPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).pause();
    }

    // 音频开始播放
    function musicPlaying(): void {
      // 关闭加载loading
      playMusicStatus.loading = false;
      // 计算播放进度
      const musicMp3 = musicAudio.value as HTMLVideoElement;
      const timer = setInterval(() => {
        const progress = musicMp3.currentTime / musicMp3.duration;
        // 存储当前进度，当前播放时间，总进度
        progressData.progress = progress * 100;
        progressData.currentTime = musicMp3.currentTime || 0;
        progressData.duration = musicMp3.duration || 0;
        if (progressData.progress >= 100) {
          clearInterval(timer);
        }
      }, 1000);
    }

    function handleProgressChange(value: number): void {
      // 停止进度
      stopProgress.value = true;
      // 设置进度时间
      const musicMp3 = musicAudio.value as HTMLVideoElement;
      const progress = musicMp3.duration * value;
      musicMp3.currentTime = progress;
      progressData.currentTime = progress;
      // 开启进度
      stopProgress.value = false;
      // 开始播放
      playMusicStatus.look = true;
      (musicAudio.value as HTMLVideoElement).play();
    }

    // 音乐加载缓存进度
    function musicUpdateTime(): void {
      const musicMp3 = musicAudio.value as HTMLVideoElement;
      // 获取.buffered.end(0)前，先判断一下.buffered.length是不是大于0
      let cache = 0;
      if(musicMp3.buffered.length !== 0){
        cache += musicMp3.buffered.end(0);
      }
      progressData.cacheProgress = cache / musicMp3.duration * 100;
    }

    // 播放完成
    function musicPlayEnded(): void {
      nextPlayMusic();
    }

    // 显示播放列表
    const playListShow = ref<boolean>(false);
    function setPlayListShow(): void {
      playListShow.value = !playListShow.value;
    }

    // 列表项播放
    function playlistItem(id: number): void {
      // 当前播放音乐id
      $store.commit('setPlayMusicId', id);
      playMusicSrc(id);
    }

    // 关闭播放列表
    function closePlayList(): void {
      playListShow.value = false;
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
      playMusicList,
      playMusicId,
      playMusic,
      musicAudio,
      audioData,
      playMusicStatus,
      prevPlayMusic,
      nextPlayMusic,
      lookPlayMusic,
      progressData,
      stopProgress,
      handleProgressChange,
      musicUpdateTime,
      musicPlayEnded,
      musicPlaying,
      setPlayListShow,
      playListShow,
      playlistItem,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './music-audio.less';
</style>
