<template>
  <div class="singer-mv">
    <div class="singer-mv-container">
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in singerMv?.mvs"
          :key="index"
        >
          <div class="item-cover" @click="jumpMvDetail(item?.id)">
            <img
              class="item-cover-img"
              :src="`${item?.imgurl}?param=137y103`"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play"></i>
          </div>
          <p class="desc" @click="jumpMvDetail(item?.id)">{{ item?.name }}</p>
        </li>
      </ul>
      <Page
        v-if="params.total > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="params.total"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistMv } from '@/api/singer-detail';
import type { ResponseType } from '@/types/types';
import Page from '@/components/page/Page.vue';

type SingerMv = {
  mvs: {
    id?: number;
    name?: string;
    imgurl?: string;
  }[];
};

const props = defineProps({
  singerDetail: {
    type: Object,
    default: () => {}
  }
});

const $router = useRouter();
const $store = useStore();
const singerId = computed<number>(() => $store.getters.singerId);

watch(
  () => singerId.value,
  curVal => {
    if (curVal) {
      getArtistMv();
    }
  }
);

// 获取歌手 - MV
const params = reactive({
  offset: 1,
  limit: 12,
  total: props.singerDetail?.artist?.mvSize
});
const singerMv = ref<SingerMv>({
  mvs: []
});

// 获取歌手 - MV总数
watch(
  () => props.singerDetail,
  () => {
    params.total = props.singerDetail?.artist?.mvSize;
  }
);

function getArtistMv(): void {
  artistMv({
    id: singerId.value,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        singerMv.value.mvs = res?.mvs || [];
      }
    })
    .catch(() => ({}));
}
getArtistMv();

// 分页
function pageChange(current: number): void {
  params.offset = current;
  getArtistMv();
}

// 跳转Mv详情
function jumpMvDetail(id: number | undefined): void {
  $router.push({ name: 'mv-detail', params: { id } });
  $store.commit('video/setVideo', { id, url: '' });
}
</script>

<style lang="less" scoped>
@import url('./singer-mv.less');
</style>
