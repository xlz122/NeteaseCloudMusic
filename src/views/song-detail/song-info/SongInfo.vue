<template>
  <div class="song-user-info-container">
    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { simiPlaylist, simiSong } from '@api/song-detail';
import { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    return {};
  }
});
</script>

<style lang="less" scoped>
@import './song-info.less';
</style>
