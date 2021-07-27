<template>
  <div class="singer-song"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { artistSong } from '@api/singer-detail';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);

    // 获取歌手详情
    function getArtistDetail(): void {
      artistSong({ id: singerId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            console.log(res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistDetail();
  }
});
</script>

<style lang="less" scoped>
.singer-song {
  width: 100%;
}
</style>
