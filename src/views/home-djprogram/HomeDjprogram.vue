<template>
  <div class="home-djprogram">
    <div class="home-djprogram-container">
      <div class="category-box">
        <ul class="category-list"></ul>
        <span class="btn prev-btn"></span>
        <span class="btn next-btn"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useStore } from 'vuex';
// import { topPlaylist } from '@api/home-song-sheet';
// import { ResponseType, LoopType } from '@/types/types';

export default defineComponent({
  setup() {
    // const $route = useRoute();

    return {};
  }
});
</script>

<style lang="less" scoped>
@import './home-djprogram.less';
</style>
