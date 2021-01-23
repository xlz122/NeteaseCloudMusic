<template>
  <!-- 遇到的坑： -->
  <!-- 直接 audio 标签上添加scr，可以播放，但是控制会报错，使用source解决 -->
  <!-- 改变source src地址，调用play()，音频无法播放，需要调用load()重新加载，然后调用play()播放 -->
  <audio
    class="music-audio"
    ref="musicAudio"
    :muted="audioData.muted"
    :autoplay="audioData.autoplay"
    :loop="audioData.loop"
    @play="musicPlaying"
    controls="controls"
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
            <div class="progress">
              <div class="current-progress">
                <i class="icon"></i>
                <i class="icon-loading" v-if="playMusicStatus.loading"></i>
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
import { getPlayMusicUrl } from '@api/my-music';
import { ResponseType, LoopType } from '@/types/types';

interface AudioData {
  src: string;
  muted: boolean;
  autoplay: boolean;
  loop: boolean;
}

export default defineComponent({
  components: {
    PlayList
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
        playMusicStatus.loading = false;
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
      const index: number = playMusicList.value.findIndex(
        (item: LoopType) => item.id === playMusicId.value
      );
      // 当前播放在列表存在，并且不是第一项
      if (index !== -1 && index > 0) {
        playMusicSrc(playMusicList.value[index - 1].id);
      }
      // 列表回到最后一项项
      if (index !== -1 && index === 0) {
        playMusicSrc(playMusicList.value[playMusicList.value.length - 1].id);
      }
    }

    // 下一首
    function nextPlayMusic(): boolean | undefined {
      if (playMusicList.value.length === 0) {
        return false;
      }
      const index: number = playMusicList.value.findIndex(
        (item: LoopType) => item.id === playMusicId.value
      );
      // 当前播放在列表存在，并且不是最后一项
      if (index !== -1 && index < playMusicList.value.length - 1) {
        playMusicSrc(playMusicList.value[index + 1].id);
      }
      // 列表回到第一项
      if (index !== -1 && index === playMusicList.value.length - 1) {
        playMusicSrc(playMusicList.value[0].id);
      }
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
      (musicAudio.value as HTMLVideoElement).play();
    }

    // 停止播放
    function stopPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).pause();
    }

    // 音频开始播放
    function musicPlaying(res: Record<string, any>) {
      console.log('播放开始' + res);
    }

    // 显示播放列表
    const playListShow = ref<boolean>(false);
    function setPlayListShow(): void {
      playListShow.value = !playListShow.value;
    }

    // 列表项播放
    function playlistItem(id: number): void {
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
