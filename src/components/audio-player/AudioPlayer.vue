<template>
  <div class="audio-player">
    <div
      class="player-container"
      :class="[
        { 'mouse-enter': mouseStutas === 'enter' },
        { 'mouse-leave': mouseStutas === 'leave' },
        { 'player-lock': audioPlayerLock }
      ]"
      @mouseenter="audioMouseEnter"
      @mouseleave="audioMouseLeave"
    >
      <div class="updn" @click="toggleAudioLock">
        <i
          class="icon"
          :class="[
            { 'icon-unlock': !audioPlayerLock },
            { 'icon-lock': audioPlayerLock }
          ]"
        ></i>
      </div>
      <div class="bg"></div>
      <div class="hand" title="展开播放条" @mouseenter="audioMouseEnter"></div>
      <AudioPlaybar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import AudioPlaybar from './audio-playbar/AudioPlaybar.vue';

const $store = useStore();

// 播放器锁定
const audioPlayerLock = computed<boolean>(
  () => $store.getters['music/audioPlayerLock']
);

function toggleAudioLock(): void {
  $store.commit('music/setAudioPlayerLock', !audioPlayerLock.value);
}

// 播放器鼠标移入/离开
const mouseStutas = ref('leave');

function audioMouseEnter(): boolean | undefined {
  if (audioPlayerLock.value) {
    return;
  }

  mouseStutas.value = 'enter';
}

function audioMouseLeave(): boolean | undefined {
  if (audioPlayerLock.value) {
    return;
  }

  mouseStutas.value = 'leave';
}
</script>

<style lang="less" scoped>
@import url('./audio-player.less');
</style>
