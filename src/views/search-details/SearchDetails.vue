<template>
  <div class="search-details">
    <div class="search-details-container">
      <SearchHeader @searchEnter="searchEnter" />
      <div class="search-desc">
        搜索“{{ searchDetailText }}”，找到
        <span class="search-desc-num">{{ searchCount || 0 }}</span>
        {{ handleTitle }}
      </div>
      <SearchTabs @changeTab="changeTab" />
      <!-- 单曲 -->
      <template v-if="searchIndex === 0">
        <SearchSong
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 歌手 -->
      <template v-if="searchIndex === 1">
        <SearchSinger
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 歌手 -->
      <template v-if="searchIndex === 2">
        <SearchAlbum
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import SearchHeader from './search-header/SearchHeader.vue';
import SearchTabs from './search-tabs/SearchTabs.vue';
import SearchSong from './search-song/SearchSong.vue';
import SearchSinger from './search-singer/SearchSinger.vue';
import SearchAlbum from './search-album/SearchAlbum.vue';

export default defineComponent({
  components: {
    SearchHeader,
    SearchTabs,
    SearchSong,
    SearchSinger,
    SearchAlbum
  },
  setup() {
    const $store = useStore();

    // tab选中
    const searchIndex = computed(() => $store.getters.searchIndex);
    // 搜索详情关键字
    const searchDetailText = computed(() =>
      $store.getters.searchDetailText.replace(/"/g, '')
    );

    // 详情搜索回车
    function searchEnter(searchValue: string): void {
      $store.commit('setSearchDetailText', searchValue);
    }

    // 搜索结果数量
    const searchCount = ref<number>(0);

    function searchCountChange(count: number): void {
      searchCount.value = count;
    }

    // tab切换
    const tabTitle = ref<string>('单曲');
    function changeTab(item: string): void {
      tabTitle.value = item;
      // tab切换，重置搜索结果数量
      searchCount.value = 0;
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

    //  离开页面，重置tab
    onUnmounted(() => {
      $store.commit('setSearchIndex', 0);
    });

    return {
      searchIndex,
      searchDetailText,
      searchEnter,
      changeTab,
      searchCount,
      searchCountChange,
      handleTitle
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-details.less';
</style>
