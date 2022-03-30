<template>
  <!-- loading -->
  <div class="loading" v-if="singerData.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <div class="search-singer" v-if="!singerData.loading">
    <ul class="search-singer-list">
      <li
        class="search-singer-item"
        v-for="(item, index) in singerData.list"
        :key="index"
        :class="{ 'first-item': index % 6 }"
      >
        <div class="item-cover" @click="jumpSingerDetail(item?.id)">
          <img
            class="item-cover-img"
            :src="`${item.picUrl}?param=130y130`"
            alt=""
          />
        </div>
        <div class="item-info">
          <span class="item-info-text" @click="jumpSingerDetail(item?.id)">
            {{ item.name }}
          </span>
          <span class="item-info-icon" v-if="item.accountId"></span>
        </div>
      </li>
    </ul>
    <Page
      v-if="singerData.total"
      :page="singerData.offset"
      :pageSize="singerData.limit"
      :total="singerData.total"
      @changPage="changPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type SingerData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    searchDetailText: {
      type: String,
      default: ''
    }
  },
  emits: ['searchCountChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    const userInfo = computed(() => $store.getters.userInfo);
    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const singerData = reactive<SingerData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    // 详情搜索回车
    watch(
      () => searchDetailText.value,
      () => {
        getSearchSinger();
      }
    );

    // 获取歌手列表
    function getSearchSinger(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (singerData.offset - 1) * singerData.limit,
        limit: singerData.limit,
        type: 100
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            singerData.total = res?.result?.artistCount;
            singerData.list = res?.result?.artists;
            emit('searchCountChange', res?.result?.artistCount);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
          singerData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSinger();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 分页
    function changPage(current: number): void {
      singerData.offset = current;
      getSearchSinger();
    }

    return {
      timeStampToDuration,
      userInfo,
      singerData,
      jumpSingerDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-singer.less';
</style>
