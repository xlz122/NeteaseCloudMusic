<template>
  <div class="loading" v-if="anchorData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <h2 class="search-anchor-title" v-if="!anchorData?.loading">声音主播</h2>
  <ul class="search-anchor-list" v-if="!anchorData?.loading">
    <li
      class="search-anchor-item"
      v-for="(item, index) in anchorData?.list"
      :key="index"
    >
      <div class="item-cover" @click="jumpDjradioDetail(item.id)">
        <img
          class="item-cover-img"
          :src="`${item?.picUrl}?param=150y150`"
          alt=""
        />
      </div>
      <p class="desc" @click="jumpDjradioDetail(item.id)">
        <span
          v-html="
            handleMatchString(item?.name || '', String($route.query.keyword))
          "
        ></span>
      </p>
      <p class="name" @click="jumpUserProfile(item?.dj?.userId)">
        <span class="by">by</span>
        <span class="text">
          <span
            v-html="
              handleMatchString(
                item?.dj?.nickname || '',
                String($route.query.keyword)
              )
            "
          ></span>
        </span>
        <i class="icon-sex male" v-if="item?.dj?.gender === 1"></i>
        <i class="icon-sex female" v-if="item?.dj?.gender === 2"></i>
      </p>
    </li>
  </ul>
  <Page
    v-if="anchorData.total > anchorData.limit"
    :page="anchorData.offset"
    :pageSize="anchorData.limit"
    :total="anchorData.total"
    @pageChange="pageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types/types';
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

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

// 获取声音主播列表
const anchorData = reactive<AnchorData>({
  loading: true,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

watch(
  () => $route.query.keyword,
  () => {
    getSearchAnchor();
  },
  {
    immediate: true
  }
);

function getSearchAnchor(): void {
  searchKeywords({
    keywords: String($route.query.keyword),
    type: Number($route.query.type),
    offset: (anchorData.offset - 1) * anchorData.limit,
    limit: isLogin.value ? anchorData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        const total = isLogin.value
          ? res?.result?.djRadiosCount
          : res?.result?.djRadios.length;

        anchorData.total = total || 0;
        anchorData.list = res?.result?.djRadios || [];

        emits('searchCountChange', total || 0);
      }

      anchorData.loading = false;
    })
    .catch(() => ({}));
}

// 分页
function pageChange(current: number): void {
  anchorData.offset = current;
  getSearchAnchor();
}

// 跳转电台详情
function jumpDjradioDetail(id: number): void {
  $router.push({ path: '/djradio-detail', query: { id } });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-anchor.less');
</style>
