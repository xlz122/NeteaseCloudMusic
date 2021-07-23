<template>
  <div class="singer-detail">
    <div class="singer-detail-container">
      <div class="singer-content"></div>
      <div class="singer-side"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useRoute } from 'vue-router';
// import { useStore } from 'vuex';
// import { playlistDetail } from '@api/song-sheet-detail';
// import { ResponseType } from '@/types/types';

export default defineComponent({
  components: {},
  setup() {
    // const $route = useRoute();
    // const $store = useStore();
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './singer-detail.less';
</style>
