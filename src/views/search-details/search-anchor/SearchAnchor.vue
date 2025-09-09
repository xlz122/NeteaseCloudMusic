<template>
  <div class="loading" v-if="anchorData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <h2 class="search-anchor-title" v-if="!anchorData.loading">声音主播</h2>
  <ul class="search-anchor-list" v-if="!anchorData.loading">
    <li class="search-anchor-item" v-for="(item, index) in anchorData.list" :key="index">
      <div class="item-cover" @click="jumpDjradioDetail(item.id)">
        <img class="item-cover-img" :src="`${item.picUrl}?param=150y150`" alt="" />
      </div>
      <p class="desc" @click="jumpDjradioDetail(item.id)">
        <span v-html="handleMatchString(item.name, String(route.query.keyword))"></span>
      </p>
      <p class="name" @click="jumpUserProfile(item.dj?.userId)">
        <span class="by">by</span>
        <span class="text">
          <span v-html="handleMatchString(item.dj?.nickname, String(route.query.keyword))"></span>
        </span>
        <i class="icon-sex male" v-if="item.dj?.gender === 1"></i>
        <i class="icon-sex female" v-if="item.dj?.gender === 2"></i>
      </p>
    </li>
  </ul>
  <Page
    v-if="anchorData.total > anchorData.limit"
    :page="anchorData.offset"
    :pageSize="anchorData.limit"
    :total="anchorData.total"
    @onChange="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types';
import Page from '@/components/page/Page.vue';

type AnchorData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    id: number;
    name: string;
    picUrl: string;
    dj: {
      userId: number;
      nickname: string;
      gender: number;
    };
  }[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取声音主播列表
const anchorData = reactive<AnchorData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchAnchor(): void {
  anchorData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (anchorData.offset - 1) * anchorData.limit,
    limit: isLogin.value ? anchorData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        anchorData.total = res.result?.djRadios?.length ?? 0;
      }
      if (isLogin.value) {
        anchorData.total = res.result?.djRadiosCount ?? 0;
      }
      anchorData.list = res.result?.djRadios ?? [];
      anchorData.loading = false;

      emits('searchCountChange', anchorData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    anchorData.offset = 1;
    getSearchAnchor();
  },
  { immediate: true }
);

function handlePageChange(current: number): void {
  anchorData.offset = current;
  getSearchAnchor();
}

function jumpDjradioDetail(id: number): void {
  router.push({ path: '/djradio-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-anchor.less');
</style>
