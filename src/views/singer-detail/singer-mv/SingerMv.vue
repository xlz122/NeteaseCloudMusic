<template>
  <div class="singer-mv">
    <div class="singer-mv-container">
      <ul class="new-disc-list">
        <li class="new-disc-item" v-for="(item, index) in singerMv.mvs" :key="index">
          <div class="item-cover" @click="jumpMvDetail(item.id)">
            <img class="item-cover-img" :src="`${item.imgurl}?param=137y103`" alt="" />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play"></i>
          </div>
          <p class="desc" @click="jumpMvDetail(item.id)">{{ item.name }}</p>
        </li>
      </ul>
      <Page
        v-if="params.total > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="params.total"
        @onChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { artistMv } from '@/api/singer-detail';
import type { ResponseType } from '@/types';
import Page from '@/components/page/Page.vue';

type SingerMv = {
  mvs: {
    id: number;
    name: string;
    imgurl: string;
  }[];
};

const props = defineProps({
  singerDetail: {
    type: Object,
    default: () => ({})
  }
});

const route = useRoute();
const router = useRouter();

// 获取歌手 - MV
const params = reactive({
  offset: 1,
  limit: 12,
  total: 0
});
const singerMv = ref<SingerMv>({
  mvs: []
});

watch(
  () => props.singerDetail,
  () => {
    params.total = props.singerDetail.artist?.mvSize;
  },
  { immediate: true }
);

function getArtistMv(): void {
  artistMv({
    id: Number(route.query.id),
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singerMv.value.mvs = res.mvs ?? [];
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getArtistMv();
  },
  { immediate: true }
);

function handlePageChange(current: number): void {
  params.offset = current;
  getArtistMv();
}

function jumpMvDetail(id: number): void {
  router.push({ path: '/mv-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./singer-mv.less');
</style>
