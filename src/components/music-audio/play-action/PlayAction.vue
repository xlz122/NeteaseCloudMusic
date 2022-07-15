<template>
  <div class="play-action">
    <button
      class="btn prev-btn"
      title="上一首(ctrl+←)"
      @click="playPrevMusic"
    ></button>
    <button
      class="btn look-btn"
      :class="{ 'look-play-btn': musicPlayStatus?.look }"
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

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { playPrevMusic, playNextMusic } from './play-action';

export default defineComponent({
  setup() {
    const $store = useStore();

    const musicPlayStatus = computed(
      () => $store.getters['music/musicPlayStatus']
    );

    function lookPlayMusic(): void {
      if (musicPlayStatus.value.look) {
        $store.commit('music/setMusicPlayStatus', {
          look: false,
          loading: false,
          refresh: false
        });
      } else {
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          loading: true,
          refresh: false
        });
      }
    }

    return {
      musicPlayStatus,
      playPrevMusic,
      playNextMusic,
      lookPlayMusic
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./play-action.less');
</style>
