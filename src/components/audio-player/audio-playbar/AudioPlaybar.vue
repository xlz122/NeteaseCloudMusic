<template>
  <AudioView
    ref="audioRef"
    :src="playUrl"
    :volume="volume"
    @timeupdate="audioTimeUpdate"
    @ended="audioPlayEnded"
  />
  <div class="audio-playbar">
    <div class="play-action">
      <i class="icon icon-prev" title="上一首(ctrl+←)" @click="playPrevSong(modeType)"></i>
      <i
        class="icon icon-pause"
        :class="{ 'icon-play': playStatus.look }"
        title="播放/暂停(p)"
        @click="togglePlayStatus"
      ></i>
      <i class="icon icon-next" title="下一首(ctrl+→)" @click="playNextSong(modeType)"></i>
    </div>
    <div class="song">
      <div class="song-avatar">
        <img
          class="avatar"
          v-if="playSongItem.picUrl"
          :src="playSongItem.picUrl"
          @click="jumpSongDetail(playSongItem.id)"
        />
        <i v-else class="default-avatar"></i>
      </div>
      <div class="song-info">
        <span class="song-name" :title="playSongItem.name" @click="jumpSongDetail(playSongItem.id)">
          {{ playSongItem.name }}
        </span>
        <i class="icon-mv" v-if="playSongItem.mv > 0" @click="jumpMvDetail(playSongItem.mv)"></i>
        <ul class="singer-list">
          <li
            class="item"
            v-for="(item, index) in playSongItem.artists"
            :key="index"
            :title="item.name"
            @click="jumpSingerDetail(item.id)"
          >
            <span class="name">{{ item.name }}</span>
            <span v-if="index !== playSongItem.artists?.length - 1">/</span>
          </li>
        </ul>
        <span class="link" v-if="playSongItem.name" @click="jumpSongPosition"></span>
      </div>
    </div>
    <div class="audio-progress">
      <PlayProgress
        :loading="playStatus.loading"
        :progress="playProgress.progress"
        :cacheProgress="playProgress.cacheProgress"
        @progressChange="audioProgressChange"
      />
      <div class="time">
        <span class="duration">
          {{ timeStampToDuration(playProgress.currentTime) }}
        </span>
        <span class="total-duration">
          /
          {{ timeStampToDuration(playProgress.duration) }}
        </span>
      </div>
    </div>
    <div class="other">
      <i class="icon icon-collection" title="收藏" @click="handleCollection"></i>
      <i class="icon icon-share" title="分享" @click="handleShare"></i>
      <i
        class="icon icon-volume"
        :class="{ 'icon-mute': Number(volume) === 0 }"
        title="音量"
        @click="volumeStatusToggle"
      ></i>
      <div class="volue-progress" v-if="volumVisible">
        <VolumeProgress :progress="volume" @progressChange="volumeProgressChange" />
      </div>
      <!-- 模式切换 -->
      <i
        class="icon"
        title="模式"
        :class="[
          { 'mode-single': modeType === 0 },
          { 'mode-loop': modeType === 1 },
          { 'mode-random': modeType === 2 }
        ]"
        @click="modeTypeChange"
      ></i>
      <div class="mode-tip" v-if="modeTip.visible">
        <template v-if="modeType === 0">单曲循环</template>
        <template v-if="modeType === 1">循环</template>
        <template v-if="modeType === 2">随机</template>
      </div>
      <!-- 播放列表 -->
      <i class="icon icon-list" title="列表" @click="playlistStatusToggle"></i>
      <span class="song-total">{{ songPlaylist.length }}</span>
    </div>
    <PlayList class="play-list" :visible="playlistVisible" @close="closePlaylist" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, provide, toRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { timeStampToDuration } from '@/utils/utils';
import { playPrevSong, playNextSong } from './methods/methods';
import { getSongPlayUrl } from '@/api/my-music';
import type { ResponseType } from '@/types';
import AudioView from '../audio/Audio.vue';
import PlayProgress from '../play-progress/PlayProgress.vue';
import VolumeProgress from '../volume-progress/VolumeProgress.vue';
import PlayList from '../play-list/PlayList.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const playSongItem = computed(() => store.getters['music/playSongItem']);
const songPlaylist = computed(() => store.getters['music/songPlaylist']);

// 获取音乐播放地址
const playUrl = ref('');

function getAudioPlayUrl(): void | Promise<void> {
  if (!playSongItem.value.id) {
    return;
  }

  return new Promise((resolve) => {
    getSongPlayUrl({ id: playSongItem.value.id })
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        playUrl.value = res.data?.[0]?.url ?? '';
        resolve();
      })
      .catch(() => ({}));
  });
}
getAudioPlayUrl();

const audioRef = ref();
const modeType = ref(0);

// 播放状态
const playStatus = ref({
  loading: false,
  look: false
});

function togglePlayStatus(): void {
  playStatus.value.loading = true;
  playStatus.value.look = !playStatus.value.look;

  if (audioRef.value && playStatus.value.look) {
    audioRef.value.ref.play();
  }
  if (audioRef.value && !playStatus.value.look) {
    audioRef.value.ref.pause();
  }

  playStatus.value.loading = false;
}

// 播放进度
const playProgress = ref({
  currentTime: 0,
  duration: 0,
  progress: 0,
  cacheProgress: 0,
  manualUpdate: false
});
// 进度数据传递给歌词组件
provide('playProgress', toRef(playProgress, 'value'));

function audioTimeUpdate(currentTime: number, duration: number, cache: number) {
  if (playProgress.value.manualUpdate) {
    return;
  }

  playProgress.value = {
    ...playProgress.value,
    currentTime: currentTime,
    duration: duration,
    progress: currentTime / duration,
    cacheProgress: cache / duration
  };
}

function audioProgressChange(value: number): void {
  playProgress.value.manualUpdate = true;

  playProgress.value = {
    ...playProgress.value,
    currentTime: playProgress.value.duration * value,
    progress: value
  };

  // 更新播放器时间
  audioRef.value.ref.currentTime = playProgress.value.duration * value;

  playProgress.value.manualUpdate = false;
}

// 播放结束
function audioPlayEnded(): void {
  if (modeType.value === 0) {
    audioRef.value.ref.play();
    return;
  }

  playNextSong(modeType.value);
}

// 播放歌曲更新
const playSongRefresh = computed(() => store.getters['music/playSongRefresh']);

watch(
  () => playSongItem.value,
  async () => {
    if (!playSongItem.value) {
      return;
    }

    playStatus.value.loading = true;
    playProgress.value.progress = 0;
    playProgress.value.cacheProgress = 0;
    playProgress.value.manualUpdate = true;

    audioRef.value.ref.pause();

    await getAudioPlayUrl();

    if (playStatus.value.look || playSongRefresh.value) {
      playStatus.value.look = true;
      store.commit('music/setPlaySongRefresh', false);

      audioRef.value.ref.play();
    }

    playStatus.value.loading = false;
    playProgress.value.manualUpdate = false;
  }
);

// 音量
const volumVisible = ref(false);

function volumeStatusToggle(): void {
  volumVisible.value = !volumVisible.value;
}

const volume = ref(1);

function volumeProgressChange(value: number): void {
  volume.value = value;
}

// 播放模式
const modeTip = reactive<{ visible: boolean; timer: number | null }>({
  visible: false,
  timer: null
});

function modeTypeChange(): void {
  modeTip.visible = true;

  modeTip.timer && clearTimeout(modeTip.timer);
  modeTip.timer = setTimeout(() => {
    modeTip.visible = false;
  }, 3000);

  if (modeType.value === 2) {
    modeType.value = 0;
    return;
  }

  modeType.value++;
}

// 播放列表
const playlistVisible = ref(false);

watch(
  () => route.path,
  () => {
    playlistVisible.value = false;
  }
);

function playlistStatusToggle(): void {
  playlistVisible.value = !playlistVisible.value;
}

function closePlaylist(): void {
  playlistVisible.value = false;
}

function handleCollection(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  store.commit('setSongCollect', {
    visible: true,
    songIds: playSongItem.value.id
  });
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpSongDetail(id: number): void {
  router.push({ path: '/song-detail', query: { id } });
}

function jumpMvDetail(id: number): void {
  router.push({ path: '/mv-detail', query: { type: 0, id } });
}

function jumpSingerDetail(id: string | number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

// 跳转歌曲位置
function jumpSongPosition(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}
</script>

<style lang="less" scoped>
@import url('./audio-playbar.less');
</style>
