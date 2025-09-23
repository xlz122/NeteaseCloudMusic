<template>
  <div class="singer-introduce">
    <h2 class="desc-title">
      <i class="desc-line"></i>
      <span>{{ singerDetail.artist?.name }}简介</span>
    </h2>
    <p class="desc-content">{{ singerDesc.briefDesc }}</p>
    <ul class="introduce-list">
      <li class="item" v-for="(item, index) in singerDesc.introduction" :key="index">
        <h2 class="title">{{ item.ti }}</h2>
        <div class="content">
          <pre class="text">{{ item.txt }}</pre>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { artistDesc } from '@/api/singer-detail';
import type { ResponseType } from '@/types';

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
    default: () => ({})
  }
});

const route = useRoute();

// 获取歌手 - 简介
const singerDesc = ref<SingerDesc>({
  briefDesc: '',
  introduction: []
});

function getArtistDetail(): void {
  artistDesc({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singerDesc.value.briefDesc = res.briefDesc ?? '';
      singerDesc.value.introduction = res.introduction ?? [];
    })
    .catch(() => ({}));
}
getArtistDetail();
</script>

<style lang="less" scoped>
@import url('./singer-introduce.less');
</style>
