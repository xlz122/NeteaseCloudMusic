<template>
  <div class="loading" v-if="singerData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <div class="search-singer" v-if="!singerData.loading">
    <ul class="search-singer-list">
      <li
        class="search-singer-item"
        v-for="(item, index) in singerData.list"
        :key="index"
        :class="{ 'first-item': index % 6 }"
      >
        <div class="item-cover" :title="item.name" @click="jumpSingerDetail(item.id)">
          <img class="item-cover-img" :src="`${item.picUrl}?param=130y130`" alt="" />
        </div>
        <div class="item-info">
          <span class="item-info-text" :title="item.name" @click="jumpSingerDetail(item.id)">
            <span v-html="handleMatchString(item.name, String(route.query.keyword))"></span>
          </span>
          <span
            class="item-info-icon"
            v-if="item.accountId"
            @click="jumpUserProfile(item.accountId)"
          ></span>
        </div>
      </li>
    </ul>
    <Page
      v-if="singerData.total > singerData.limit"
      :page="singerData.offset"
      :pageSize="singerData.limit"
      :total="singerData.total"
      @onChange="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types';
import Page from '@/components/page/Page.vue';

type SingerData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    id: number;
    name: string;
    picUrl: string;
    accountId: number;
  }[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取歌手列表
const singerData = reactive<SingerData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchSinger(): void {
  singerData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (singerData.offset - 1) * singerData.limit,
    limit: isLogin.value ? singerData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        singerData.total = res.result?.artists?.length ?? 0;
      }
      if (isLogin.value) {
        singerData.total = res.result?.artistCount ?? 0;
      }
      singerData.list = res.result?.artists ?? [];
      singerData.loading = false;

      emits('searchCountChange', singerData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    singerData.offset = 1;
    getSearchSinger();
  },
  { immediate: true }
);

function handlePageChange(current: number): void {
  singerData.offset = current;
  getSearchSinger();
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-singer.less');
</style>
