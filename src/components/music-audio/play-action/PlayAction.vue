<template>
  <div class="play-action">
    <button
      class="btn prev-btn"
      title="上一首(ctrl+←)"
      @click="playPrevMusic"
    ></button>
    <button
      class="btn look-btn"
      :class="{ 'look-play-btn': songPlayStatus?.look }"
      title="播放/暂停(p)"
      @click="lookPlayMusic"
    ></button>
    <button
      class="btn down-btn"
      title="下一首(ctrl+→)"
      @click="playNextMusic"
    ></button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { playPrevMusic, playNextMusic } from './play-action';

const $store = useStore();
// 播放状态
const songPlayStatus = computed(() => $store.getters['music/songPlayStatus']);

function lookPlayMusic(): void {
  if (songPlayStatus.value.look) {
    $store.commit('music/setSongPlayStatus', {
      look: false,
      loading: false,
      refresh: false
    });
    return;
  }

  $store.commit('music/setSongPlayStatus', {
    look: true,
    loading: true,
    refresh: false
  });
}
</script>

<style lang="less" scoped>
@import url('./play-action.less');
</style>
