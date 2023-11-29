<template>
  <div class="singer-introduce">
    <h2 class="desc-title">
      <i class="desc-line"></i>
      <span>{{ singerDetail?.artist?.name }}简介</span>
    </h2>
    <p class="desc-content">{{ singerDesc?.briefDesc }}</p>
    <ul class="introduce-list">
      <li
        class="item"
        v-for="(item, index) in singerDesc?.introduction"
        :key="index"
      >
        <h2 class="title">{{ item?.ti }}</h2>
        <div class="content">
          <pre class="text">{{ item?.txt }}</pre>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { artistDesc } from '@/api/singer-detail';
import type { ResponseType } from '@/types/types';

type SingerDesc = {
  briefDesc: string;
  introduction: {
    ti?: string;
    txt?: string;
  }[];
};

defineProps({
  singerDetail: {
    type: Object,
    default: () => {}
  }
});

const $store = useStore();
const singerId = computed<number>(() => $store.getters.singerId);

// 获取歌手 - 简介
const singerDesc = ref<SingerDesc>({
  briefDesc: '',
  introduction: []
});

function getArtistDetail(): void {
  artistDesc({ id: singerId.value })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        singerDesc.value.briefDesc = res?.briefDesc || '';
        singerDesc.value.introduction = res?.introduction || [];
      }
    })
    .catch(() => ({}));
}
getArtistDetail();
</script>

<style lang="less" scoped>
@import url('./singer-introduce.less');
</style>
