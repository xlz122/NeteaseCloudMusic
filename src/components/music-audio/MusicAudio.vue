<template>
  <AudioView />
  <div class="music-audio-container">
    <div
      class="music-audio-playbar"
      :class="[
        { 'audio-playbar-enter': audioEnter },
        { 'audio-playbar-leave': !audioEnter },
        { 'audio-playbar-lock': musicAudioLock }
      ]"
      @mouseenter="musicAudioEnter"
      @mouseleave="musicAudioLeave"
    >
      <div class="updn">
        <div class="updn-left">
          <i
            class="updn-icon"
            :class="[
              { 'icon-updn-left': !musicAudioLock },
              { 'icon-updn-left-lock': musicAudioLock }
            ]"
            @click="audioLock"
          ></i>
        </div>
        <div class="updn-right"></div>
      </div>
      <div class="playbar-bg"></div>
      <div class="hand" title="展开播放条" @mouseenter="musicAudioEnter"></div>
      <div class="wrap">
        <PlayAction />
        <div class="music-img">
          <img
            class="img"
            v-if="playMusicItem?.picUrl"
            :src="playMusicItem?.picUrl"
            @click="jumpSongDetail(playMusicItem?.id)"
          />
          <span class="default-img"></span>
        </div>
        <div class="play">
          <div class="play-info">
            <span class="music-name">
              <span
                class="name"
                :title="playMusicItem?.name"
                @click="jumpSongDetail(playMusicItem?.id)"
              >
                {{ playMusicItem?.name }}
              </span>
              <i
                class="icon-mv"
                v-if="playMusicItem?.mv > 0"
                @click="jumpVideoDetail(playMusicItem?.mv)"
              ></i>
            </span>
            <span class="singer-name">
              <span
                class="text"
                v-for="(item, index) in playMusicItem?.singerList"
                :key="index"
                :title="item?.name"
                @click="jumpSingerDetail(item.id)"
              >
                <span class="name">{{ item?.name }}</span>
                <span
                  class="line"
                  v-if="index !== playMusicItem.singerList.length - 1"
                >
                  /
                </span>
              </span>
            </span>
            <span
              class="link"
              v-if="playMusicItem?.name"
              @click="jumpSongPosition"
            ></span>
          </div>
          <div class="play-progress">
            <PlayProgress />
            <div class="time">
              <span class="duration">
                {{
                  timeStampToDuration(musicPlayProgress.currentTime || 0) ||
                  '00:00'
                }}
              </span>
              <span class="total-duration">
                /
                {{
                  timeStampToDuration(musicPlayProgress.duration || 0) ||
                  '00:00'
                }}
              </span>
            </div>
          </div>
        </div>
        <OtherTool />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { timeStampToDuration } from '@/utils/utils';
import type { PlayMusicItem } from '@/store/music/state';
import AudioView from './audio/Audio.vue';
import PlayAction from './play-action/PlayAction.vue';
import PlayProgress from './play-progress/PlayProgress.vue';
import OtherTool from './other-tool/OtherTool.vue';

const $router = useRouter();
const $store = useStore();

// 当前播放音乐
const playMusicItem = computed<PlayMusicItem>(
  () => $store.getters['music/playMusicItem']
);
// 播放进度数据
const musicPlayProgress = computed(
  () => $store.getters['music/musicPlayProgress']
);
// 播放器锁定
const musicAudioLock = computed<boolean>(
  () => $store.getters['music/musicAudioLock']
);

function audioLock(): void {
  if (musicAudioLock.value) {
    $store.commit('music/setMsicAudioLock', false);
  } else {
    $store.commit('music/setMsicAudioLock', true);
  }
}

const audioEnter = ref<boolean>(false);

// 播放器鼠标移入事件
function musicAudioEnter(): boolean | undefined {
  if (musicAudioLock.value) {
    return;
  }

  audioEnter.value = true;
}

// 播放器鼠标移出事件
function musicAudioLeave(): boolean | undefined {
  if (musicAudioLock.value) {
    return;
  }

  audioEnter.value = false;
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转视频详情
function jumpVideoDetail(id: number): void {
  $router.push({ path: '/mv-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: string | number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转歌曲位置
function jumpSongPosition(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}
</script>

<style lang="less" scoped>
@import url('./music-audio.less');
</style>
