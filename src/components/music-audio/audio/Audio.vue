<template>
  <!-- audio 标签上使用scr，可以播放，控制台报错 -->
  <!-- source 调用load()播放 -->
  <!-- controls="controls" 是否显示原生控件 -->
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

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { getPlayMusicUrl } from '@/api/my-music';
import type { ResponseType } from '@/types/types';
import type { PlayMusicItem } from '@/store/music/state';
import { playNextMusic } from '@/components/music-audio/play-action/play-action';

const $store = useStore();
const playMusicId = computed<number>(() => $store.getters['music/playMusicId']);
const playMusicList = computed(() => $store.getters['music/playMusicList']);
const musicVolume = computed<number>(() => $store.getters['music/musicVolume']);
// 播放状态
const musicPlayStatus = computed(() => $store.getters['music/musicPlayStatus']);
// 播放进度
const musicPlayProgress = computed(
  () => $store.getters['music/musicPlayProgress']
);

// 播放器实例
const musicAudio = ref<HTMLVideoElement | null>(null);

watch(
  () => musicPlayStatus.value.look,
  () => {
    // 播放 & 不是刷新播放
    if (musicPlayStatus.value.look && !musicPlayStatus.value.refresh) {
      startPlayMusic();
    }

    // 暂停
    if (!musicPlayStatus.value.look) {
      stopPlayMusic();
    }
  }
);

watch(
  () => musicPlayStatus.value.refresh,
  () => {
    // 刷新
    if (musicPlayStatus.value.refresh) {
      $store.commit('music/setMusicPlayStatus', {
        refresh: false
      });

      getAudioPlaySrc();
    }
  }
);

// 监听手动更新进度
watch(
  () => musicPlayProgress.value.timeChange,
  curVal => {
    if (curVal) {
      if (isNaN(musicPlayProgress.value.currentTime)) {
        return;
      }

      // 设置播放器进度
      const audio = musicAudio.value as HTMLVideoElement;
      audio.currentTime = musicPlayProgress.value.currentTime;

      // 重置手动更新
      $store.commit('music/setMusicPlayProgress', {
        timeChange: false
      });
    }
  }
);

// 获取播放地址
const audioSrc = ref<string>('');

function getAudioPlaySrc(): boolean | undefined {
  if (!playMusicId.value) {
    return;
  }

  getPlayMusicUrl({ id: playMusicId.value })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (!res?.data[0]?.url) {
          audioSrc.value = '';

          handleMusicUrlError();
          return;
        }

        // 重置播放进度
        $store.commit('music/setMusicPlayProgress', {
          progress: 0,
          currentTime: 0,
          duration: 0
        });

        audioSrc.value = res.data[0]?.url;

        if (musicPlayStatus.value.look) {
          startPlayMusic();
        }
      }
    })
    .catch(() => ({}));
}
getAudioPlaySrc();

// 获取播放链接失败
const cacheId = ref<number[]>([]);
const errorTimer = ref<NodeJS.Timeout | null>(null);

function handleMusicUrlError(): boolean | undefined {
  // 播放停止/只有一首歌
  if (!musicPlayStatus.value.look || playMusicList.value.length <= 1) {
    setMessage({ type: 'error', title: '音乐播放链接获取失败' });
    return;
  }

  // 缓存当前播放
  if (!cacheId.value.includes(playMusicId.value)) {
    cacheId.value.push(playMusicId.value);
  }

  // 删除不在播放列表的缓存id
  cacheId.value.forEach((item: number, index: number) => {
    const exist = playMusicList.value.find((p: PlayMusicItem) => p.id === item);

    if (!exist) {
      cacheId.value.splice(index, 1);
    }
  });

  // 最大缓存2首, 停止下一首播放
  if (cacheId.value.length > 2) {
    setMessage({ type: 'error', title: '播放失败' });

    $store.commit('music/setMusicPlayStatus', {
      look: false,
      loading: false,
      refresh: false
    });

    if (errorTimer.value) {
      clearTimeout(errorTimer.value);
    }
    cacheId.value = [];

    return;
  }

  setMessage({ type: 'error', title: '播放失败,3秒后自动播放下一首' });

  errorTimer.value && clearTimeout(errorTimer.value);

  errorTimer.value = setTimeout(() => {
    // 播放链接有效
    if (audioSrc.value) {
      return;
    }

    playNextMusic();
  }, 3000);
}

const playTimer = ref<NodeJS.Timeout | null>(null);

// 播放音乐
function startPlayMusic(): void {
  $store.commit('music/setMusicPlayStatus', {
    loading: false
  });

  (musicAudio.value as HTMLVideoElement).load();
}

// 停止播放
function stopPlayMusic(): void {
  if (playTimer.value) {
    clearInterval(playTimer.value);
  }

  (musicAudio.value as HTMLVideoElement).pause();
}

// 开始播放
function musicPlaying(): boolean | undefined {
  if (playTimer.value) {
    clearInterval(playTimer.value);
  }

  if (!musicPlayStatus.value.look) {
    playTimer.value && clearInterval(playTimer.value);
    return;
  }

  if (musicPlayProgress.value.progress >= 100) {
    playTimer.value && clearInterval(playTimer.value);
  }

  const audio = musicAudio.value as HTMLVideoElement;

  // 继续播放
  if (musicPlayProgress.value.currentTime > 0) {
    audio.currentTime = musicPlayProgress.value.currentTime;
  }

  playTimer.value = setInterval(() => {
    const progress = audio.currentTime / audio.duration;
    $store.commit('music/setMusicPlayProgress', {
      progress: progress * 100,
      currentTime: audio.currentTime || 0,
      duration: audio.duration || 0
    });
  }, 500);
}

// 音乐加载缓存进度
function musicUpdateTime(): void {
  const audio = musicAudio.value as HTMLVideoElement;

  let cache = 0;
  if (audio?.buffered && audio?.buffered?.length > 0) {
    cache += audio.buffered.end(0);
  }
  $store.commit('music/setMusicPlayProgress', {
    cacheProgress: (cache / audio?.duration) * 100 || 0
  });
}

// 播放完成
const musicModeType = computed(() => $store.getters['music/musicModeType']);
function musicPlayEnded(): boolean | undefined {
  // 单曲循环
  // 播放列表没有音乐，或只有一首音乐
  if (musicModeType.value === 0 || playMusicList.value.length <= 1) {
    // 重置播放进度
    $store.commit('music/setMusicPlayProgress', {
      progress: 0,
      currentTime: 0,
      duration: 0
    });

    $store.commit('music/setMusicPlayStatus', {
      look: false,
      loading: true
    });

    setTimeout(() => {
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: false
      });
    }, 100);
    return;
  }

  playNextMusic();
}

onMounted(() => {
  $store.commit('music/setMusicPlayStatus', {
    look: false,
    loading: false,
    refresh: false
  });
});
</script>

<style lang="less" scoped>
@import url('./audio.less');
</style>
