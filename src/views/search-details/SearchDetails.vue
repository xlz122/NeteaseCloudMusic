<template>
  <div class="search-details">
    <div class="search-details-container">
      <SearchHeader @searchEnter="searchEnter" />
      <div class="search-desc">
        搜索“{{ searchTitleText }}”，找到
        <span class="search-desc-num">{{ songData.count }}</span>
        首单曲
      </div>
      <SearchTabs @changeTab="changeTab" />
      <template v-if="tabIndex === 0">
        <SearchSong
          :page="pageParams.page"
          :pageSize="pageParams.pageSize"
          :total="songData.count"
          :list="songData.list"
          @changPage="changPage"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import SearchHeader from './search-header/SearchHeader.vue';
import SearchTabs from './search-tabs/SearchTabs.vue';
import SearchSong from './search-song/SearchSong.vue';
import { ResponseType } from '@/types/types';

type SongData = {
  count: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    SearchHeader,
    SearchTabs,
    SearchSong
  },
  setup() {
    const $store = useStore();

    const searchText = computed(() => $store.getters.searchText);
    // 标题
    const searchTitleText = ref<string>('');

    // 分页参数
    const pageParams = reactive({
      page: 1,
      pageSize: 30
    });

    // 导航搜索回车
    watch(
      () => searchText.value,
      () => {
        searchTitleText.value = searchText.value;
        getSearchSong();
      },
      {
        immediate: true
      }
    );

    // 详情搜索回车
    function searchEnter(searchValue: string): void {
      searchTitleText.value = searchValue;
      getSearchSong();
    }

    // tab切换
    const tabIndex = ref<number>(0);
    function changeTab(index: number): void {
      tabIndex.value = index;
    }

    // 获取单曲列表
    const songData = reactive<SongData>({
      count: 0,
      list: []
    });
    function getSearchSong(): void {
      searchKeywords({
        keywords: searchTitleText.value,
        offset: pageParams.page - 1,
        limit: pageParams.pageSize,
        type: 1
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songData.count = res?.result?.songCount;
            songData.list = res?.result?.songs;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 监听总数，重置分页
    watch(
      () => songData.count,
      () => {
        pageParams.page = 1;
      }
    );

    // 分页
    function changPage(current: number): void {
      pageParams.page = current;
      getSearchSong();
    }

    return {
      searchTitleText,
      searchEnter,
      changeTab,
      tabIndex,
      songData,
      pageParams,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-details.less';
</style>
