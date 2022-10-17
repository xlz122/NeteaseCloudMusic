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
      <!-- 专辑 -->
      <template v-if="searchIndex === 2">
        <SearchAlbum
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 视频 -->
      <template v-if="searchIndex === 3">
        <SearchMv
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 歌单 -->
      <template v-if="searchIndex === 5">
        <SearchSongSheet
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 声音主播 -->
      <template v-if="searchIndex === 6">
        <SearchAnchor
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <!-- 用户 -->
      <template v-if="searchIndex === 7">
        <SearchUser
          :searchDetailText="searchDetailText"
          @searchCountChange="searchCountChange"
        />
      </template>
      <div class="no-data" v-if="searchCount === 0">
        <div class="title">
          <i class="icon"></i>
          <h3 class="text">很抱歉，未能找到相关搜索结果！</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import SearchHeader from './search-header/SearchHeader.vue';
import SearchTabs from './search-tabs/SearchTabs.vue';
import SearchSong from './search-song/SearchSong.vue';
import SearchSinger from './search-singer/SearchSinger.vue';
import SearchAlbum from './search-album/SearchAlbum.vue';
import SearchMv from './search-mv/SearchMv.vue';
import SearchSongSheet from './search-song-sheet/SearchSongSheet.vue';
import SearchAnchor from './search-anchor/SearchAnchor.vue';
import SearchUser from './search-user/SearchUser.vue';

export default defineComponent({
  components: {
    SearchHeader,
    SearchTabs,
    SearchSong,
    SearchSinger,
    SearchAlbum,
    SearchMv,
    SearchSongSheet,
    SearchAnchor,
    SearchUser
  },
  setup() {
    const $store = useStore();

    // tab选中
    const searchIndex = computed<number>(() => $store.getters.searchIndex);
    // 搜索详情关键字
    const searchDetailText = computed<string>(() =>
      $store.getters.searchDetailText.replace(/"/g, '')
    );

    function searchEnter(searchValue: string): void {
      $store.commit('setSearchDetailText', searchValue);
    }

    const searchCount = ref<number | string>('');
    function searchCountChange(count: number): void {
      searchCount.value = count;
    }

    const tabTitle = ref<string>('单曲');
    function changeTab(item: string): void {
      tabTitle.value = item;

      searchCount.value = '';
    }

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
@import url('./search-details.less');
</style>
