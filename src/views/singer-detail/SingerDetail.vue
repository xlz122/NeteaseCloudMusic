<template>
  <div class="singer-detail">
    <div class="singer-detail-container">
      <div class="singer-content"></div>
      <div class="singer-side">
        <SingerDetailSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { artistDetail } from '@api/singer-detail';
import { ResponseType } from '@/types/types';
import SingerDetailSide from './singer-detail-side/SingerDetailSide.vue';

export default defineComponent({
  components: {
    SingerDetailSide
  },
  setup() {
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);
    const singerDetail = ref<unknown[]>([]);

    // 获取歌手详情
    function getArtistDetail(): void {
      artistDetail({ id: singerId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerDetail.value = res.data;
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

    return {};
  }
});
</script>

<style lang="less" scoped>
@import './singer-detail.less';
</style>
