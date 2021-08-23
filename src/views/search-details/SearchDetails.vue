<template>
  <div class="search-details">
    <div class="search-details-container">
      <SearchHeader @searchEnter="searchEnter" />
      <div class="search-desc">
        搜索“{{ searchTitleText }}”，找到
        <!-- songData.count -->
        <span class="search-desc-num">{{ 0 }}</span>
        {{ handleTitle }}
      </div>
      <SearchTabs @changeTab="changeTab" />
      <!-- 单曲 -->
      <template v-if="searchIndex === 0">
        <SearchSong />
      </template>
      <!-- 歌手 -->
      <template v-if="searchIndex === 1">
        <SearchSinger />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import SearchHeader from './search-header/SearchHeader.vue';
import SearchTabs from './search-tabs/SearchTabs.vue';
import SearchSong from './search-song/SearchSong.vue';
import SearchSinger from './search-singer/SearchSinger.vue';

export default defineComponent({
  components: {
    SearchHeader,
    SearchTabs,
    SearchSong,
    SearchSinger
  },
  setup() {
    const $store = useStore();

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );
    // tab选中
    const searchIndex = computed(() => $store.getters.searchIndex);
    // 标题
    const searchTitleText = ref<string>('');

    // 导航搜索回车
    watch(
      () => searchText.value,
      () => {
        searchTitleText.value = searchText.value;
      },
      {
        immediate: true
      }
    );

    // 详情搜索回车
    function searchEnter(searchValue: string): void {
      searchTitleText.value = searchValue;
    }

    // tab切换
    const tabTitle = ref<string>('单曲');
    function changeTab(item: string): void {
      tabTitle.value = item;
    }

    // 处理标题
    const handleTitle = ref<string>('');
    watch(
      () => tabTitle.value,
      () => {
        if (tabTitle.value === '单曲') {
          handleTitle.value = `首${tabTitle.value}`;
          return false;
        }
        if (tabTitle.value === '专辑') {
          handleTitle.value = `张${tabTitle.value}`;
          return false;
        }
        if (tabTitle.value === '声音主播') {
          handleTitle.value = '个节目';
          return false;
        }
        handleTitle.value = `个${tabTitle.value}`;
      },
      {
        immediate: true
      }
    );

    return {
      searchIndex,
      searchTitleText,
      searchEnter,
      changeTab,
      handleTitle
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-details.less';
</style>
