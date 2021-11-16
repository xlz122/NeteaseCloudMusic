<template>
  <!-- 直接 audio 标签上添加scr，可以播放，但是控制会报错，使用source解决 -->
  <!-- 改变source src地址，调用play()，音频无法播放，需要调用load()重新加载，然后调用play()播放 -->
  <!-- controls="controls" 是否显示原生播放控件 -->
  <audio
    class="music-audio"
    ref="musicAudio"
    :autoplay="true"
    :loop="false"
    :volume="musicVolume"
    @play="musicPlaying"
    @timeupdate="musicUpdateTime"
    @ended="musicPlayEnded"
  >
    <source :src="audioSrc" />
  </audio>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { getMusicUrl, getNextMusicId } from './methods';

export default defineComponent({
  name: 'AudioView',
  setup() {
    const $store = useStore();

    // 播放列表
    const playMusicList = computed(() => $store.getters['music/playMusicList']);

    // 当前播放音乐id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 音量
    const musicVolume = computed(() => $store.getters['music/musicVolume']);

    // 播放地址
    const audioSrc = ref<string>('');

    // 初始获取播放地址
    function initAudioSrc(): void {
      if (playMusicId.value > 0) {
        getMusicUrl(playMusicId.value).then((res: string) => {
          audioSrc.value = res;
        });
      }
    }
    initAudioSrc();

    // 播放状态
    const musicPlayStatus = computed(
      () => $store.getters['music/musicPlayStatus']
    );

    // 监听是否播放
    watch(
      () => musicPlayStatus.value.look,
      () => {
        setAudioStatus();
      }
    );

    // 监听播放刷新
    watch(
      () => musicPlayStatus.value.refresh,
      (curVal: boolean) => {
        if (curVal) {
          getMusicUrl(playMusicId.value).then((res: string) => {
            audioSrc.value = res;
            // 重置播放进度
            $store.commit('music/setMusicPlayProgress', {
              progress: 0,
              currentTime: 0,
              duration: 0
            });
            // 重置刷新
            $store.commit('music/setMusicPlayStatus', {
              refresh: false
            });
            setAudioStatus();
          });
        }
      }
    );

    // 播放/暂停
    function setAudioStatus(): boolean | undefined {
      // 刷新播放
      if (musicPlayStatus.value.look && musicPlayStatus.value.refresh) {
        startPlayMusic();
        return false;
      }
      // 不刷新播放
      if (musicPlayStatus.value.look && audioSrc.value) {
        startPlayMusic();
      }
      // 暂停
      if (!musicPlayStatus.value.look) {
        stopPlayMusic();
        $store.commit('music/setMusicPlayStatus', {
          look: false
        });
      }
    }

    // 播放器实例
    const musicAudio = ref<HTMLVideoElement>();

    const playTimer = ref<number | null>(null);

    // 播放音乐
    function startPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).load();
    }

    // 停止播放
    function stopPlayMusic(): void {
      (musicAudio.value as HTMLVideoElement).pause();
      // 清除已存在定时器
      if (playTimer.value) {
        clearInterval(playTimer.value as number);
      }
    }

    // 播放进度数据
    const musicPlayProgress = computed(
      () => $store.getters['music/musicPlayProgress']
    );

    // 监听手动更新时间
    watch(
      () => musicPlayProgress.value.timeChange,
      (curVal: boolean) => {
        if (curVal) {
          // 设置播放时间
          const musicMp3 = musicAudio.value as HTMLVideoElement;
          // 当前时间是NaN,不进行更新
          if (isNaN(musicPlayProgress.value.currentTime)) {
            return false;
          }
          musicMp3.currentTime = musicPlayProgress.value.currentTime;
          // 重置手动更新
          $store.commit('music/setMusicPlayProgress', {
            timeChange: false
          });
        }
      },
      {
        deep: true
      }
    );

    // 播放触发
    function musicPlaying(): void {
      // 关闭加载loading
      $store.commit('music/setMusicPlayStatus', {
        loading: false
      });
      // 计算播放进度
      const musicMp3 = musicAudio.value as HTMLVideoElement;
      // 清除已存在定时器
      if (playTimer.value) {
        clearInterval(playTimer.value as number);
      }
      // 继续播放
      if (musicPlayProgress.value.currentTime > 0) {
        musicMp3.currentTime = musicPlayProgress.value.currentTime;
      }
      playTimer.value = setInterval(() => {
        const progress = musicMp3.currentTime / musicMp3.duration;
        $store.commit('music/setMusicPlayProgress', {
          progress: progress * 100,
          currentTime: musicMp3.currentTime || 0,
          duration: musicMp3.duration || 0
        });
        if (musicPlayProgress.value.progress >= 100) {
          clearInterval(playTimer.value as number);
        }
      }, 500);
    }

    // 音乐加载缓存进度
    function musicUpdateTime(): void {
      const musicMp3 = musicAudio.value as HTMLVideoElement;
      // 获取.buffered.end(0)前，先判断一下.buffered.length是不是大于0
      let cache = 0;
      if (musicMp3.buffered.length !== 0) {
        cache += musicMp3.buffered.end(0);
      }
      $store.commit('music/setMusicPlayProgress', {
        cacheProgress: (cache / musicMp3.duration) * 100
      });
    }

    // 播放完成
    const musicModeType = computed(() => $store.getters['music/musicModeType']);
    function musicPlayEnded(): boolean | undefined {
      // 播放列表没有音乐，或只有一首音乐，直接循环
      if (playMusicList.value.length <= 1) {
        $store.commit('music/setMusicPlayProgress', {
          progress: 0,
          currentTime: 0,
          duration: 0
        });
        startPlayMusic();
        return false;
      }
      // 单曲循环
      if (musicModeType.value === 0) {
        // 重置播放进度
        $store.commit('music/setMusicPlayProgress', {
          progress: 0,
          currentTime: 0,
          duration: 0
        });
        startPlayMusic();
      }
      // 循环
      if (musicModeType.value === 1) {
        getNextMusicId().then(() => {
          // 开始播放
          $store.commit('music/setMusicPlayStatus', {
            look: true,
            loading: true,
            refresh: true
          });
        });
      }
      // 随机播放
      if (musicModeType.value === 2) {
        const musicItem = Math.floor(
          Math.random() * playMusicList.value.length
        );
        // 当前播放音乐id
        $store.commit(
          'music/setPlayMusicId',
          playMusicList.value[musicItem].id
        );
        // 当前播放音乐数据
        $store.commit('music/setPlayMusicItem', playMusicList.value[musicItem]);
        // 开始播放
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          loading: true,
          refresh: true
        });
      }
    }
    return {
      musicAudio,
      musicVolume,
      audioSrc,
      musicPlaying,
      musicUpdateTime,
      musicPlayEnded
    };
  }
});
</script>

<style lang="less" scoped>
.music-audio {
  position: fixed;
  left: 0;
  bottom: -300px;
}
</style>
