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
        <SearchSong :list="songData.list" />
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

    const searchKeywordText = computed(() => $store.getters.searchKeywordText);
    // 标题
    const searchTitleText = ref<string>('');

    // 导航搜索回车
    watch(
      () => searchKeywordText.value,
      () => {
        searchTitleText.value = searchKeywordText.value;
        getSearchSong(searchKeywordText.value);
      },
      {
        immediate: true
      }
    );

    // 详情搜索回车
    function searchEnter(searchValue: string): void {
      searchTitleText.value = searchValue;
      getSearchSong(searchValue);
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
    function getSearchSong(searchValue: string): void {
      searchKeywords({
        keywords: searchValue,
        limit: 30,
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
        .catch(err => {
          console.log(err);
        });
    }

    return {
      searchTitleText,
      searchEnter,
      changeTab,
      tabIndex,
      songData
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-details.less';
</style>
