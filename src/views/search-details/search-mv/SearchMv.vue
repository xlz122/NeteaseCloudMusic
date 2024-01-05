<template>
  <div class="loading" v-if="mvData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-mv-list" v-if="!mvData?.loading">
    <li
      class="search-mv-item"
      v-for="(item, index) in mvData?.list"
      :key="index"
      :class="{ 'first-item': index % 5 }"
    >
      <div class="cover" @click="jumpVideoDetail(item?.vid, item?.type)">
        <img class="img" :src="item?.coverUrl" alt="" />
        <div class="play-volume">
          <span class="icon-mv"></span>
          <span class="text">{{ bigNumberTransform(item?.playTime) }}</span>
        </div>
        <div class="duration">
          {{ timeStampToDuration(item?.durationms / 1000) }}
        </div>
      </div>
      <div class="item-title">
        <i class="icon" v-if="item?.type && item?.type === 0"></i>
        <span
          :title="item?.title"
          @click="jumpVideoDetail(item?.vid, item?.type)"
        >
          <span
            v-html="
              handleMatchString(item?.title || '', String($route.query.keyword))
            "
          ></span>
        </span>
      </div>
      <div class="item-name">
        <span class="text" v-if="item?.type !== 0">by</span>
        <span
          class="name"
          :title="item?.creator[0]?.userName"
          @click="jumpSingerDetail(item?.creator[0]?.userId)"
        >
          {{ item?.creator[0]?.userName }}
        </span>
      </div>
    </li>
  </ul>
  <Page
    v-if="mvData.total > mvData.limit"
    :page="mvData.offset"
    :pageSize="mvData.limit"
    :total="mvData.total"
    @pageChange="pageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  bigNumberTransform,
  timeStampToDuration,
  handleMatchString
} from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types/types';
import Page from '@/components/page/Page.vue';

type MvData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    vid: number;
    title: string;
    type: number;
    coverUrl: string;
    playTime: number;
    durationms: number;
    creator: {
      userId: number;
      userName: string;
    }[];
  }[];
};

const emits = defineEmits(['searchCountChange']);

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

// 获取视频列表
const mvData = reactive<MvData>({
  loading: true,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

watch(
  () => $route.query.keyword,
  () => {
    getSearchMv();
  },
  {
    immediate: true
  }
);

function getSearchMv(): void {
  searchKeywords({
    keywords: String($route.query.keyword),
    type: Number($route.query.type),
    offset: (mvData.offset - 1) * mvData.limit,
    limit: isLogin.value ? mvData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        const total = isLogin.value
          ? res?.result?.videoCount
          : res?.result?.videos.length;

        mvData.total = total;
        mvData.list = res?.result?.videos;

        emits('searchCountChange', total || 0);
      }

      mvData.loading = false;
    })
    .catch(() => ({}));
}

// 分页
function pageChange(current: number): void {
  mvData.offset = current;
  getSearchMv();
}

// 跳转视频详情
function jumpVideoDetail(id: number, type: number): void {
  // 0: mv, 1: 视频
  if (type === 0) {
    $router.push({ path: '/mv-detail', query: { id } });
  }

  if (type === 1) {
    $router.push({ path: '/video-detail', query: { id } });
  }
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-mv.less');
</style>
