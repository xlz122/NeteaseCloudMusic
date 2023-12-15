<template>
  <div class="loading" v-if="singerData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <div class="search-singer" v-if="!singerData?.loading">
    <ul class="search-singer-list">
      <li
        class="search-singer-item"
        v-for="(item, index) in singerData?.list"
        :key="index"
        :class="{ 'first-item': index % 6 }"
      >
        <div
          class="item-cover"
          :title="item?.name"
          @click="jumpSingerDetail(item?.id)"
        >
          <img
            class="item-cover-img"
            :src="`${item?.picUrl}?param=130y130`"
            alt=""
          />
        </div>
        <div class="item-info">
          <span
            class="item-info-text"
            :title="item?.name"
            @click="jumpSingerDetail(item?.id)"
          >
            <span
              v-html="handleMatchString(item?.name || '', searchDetailText)"
            ></span>
          </span>
          <span
            class="item-info-icon"
            v-if="item?.accountId"
            @click="jumpUserProfile(item?.accountId)"
          ></span>
        </div>
      </li>
    </ul>
    <Page
      v-if="singerData.total > singerData.limit"
      :page="singerData.offset"
      :pageSize="singerData.limit"
      :total="singerData.total"
      @pageChange="pageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types/types';
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

const props = defineProps({
  searchDetailText: {
    type: String,
    default: ''
  }
});
const emits = defineEmits(['searchCountChange']);

const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);
const searchText = computed<string>(() =>
  $store.getters.searchText.replace(/"/g, '')
);

const { searchDetailText } = toRefs(props);

// 获取歌手列表
const singerData = reactive<SingerData>({
  loading: true,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

watch(
  () => searchDetailText.value,
  () => {
    getSearchSinger();
  }
);

function getSearchSinger(): void {
  searchKeywords({
    type: 100,
    keywords: searchDetailText.value || searchText.value,
    offset: (singerData.offset - 1) * singerData.limit,
    limit: isLogin.value ? singerData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        const total = isLogin.value
          ? res?.result?.artistCount
          : res?.result?.artists.length;

        singerData.total = total || 0;
        singerData.list = res?.result?.artists || [];

        emits('searchCountChange', total || 0);
      }

      singerData.loading = false;
    })
    .catch(() => ({}));
}
getSearchSinger();

// 分页
function pageChange(current: number): void {
  singerData.offset = current;
  getSearchSinger();
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-singer.less');
</style>
