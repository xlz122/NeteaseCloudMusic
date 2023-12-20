<template>
  <div class="search-details">
    <div class="search-details-container">
      <SearchHeader @searchEnter="searchEnter" />
      <div class="search-desc">
        搜索“{{ searchDetailText }}”，找到
        <span class="search-desc-num">{{ searchCount || 0 }}</span>
        {{ displayTitle }}
      </div>
      <SearchTabs @tabChange="tabChange" />
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

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
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

const $store = useStore();
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

const title = ref('单曲');
function tabChange(item: string): void {
  title.value = item;

  searchCount.value = '';
}

const displayTitle = ref('');
watch(
  () => title.value,
  () => {
    if (title.value === '单曲') {
      displayTitle.value = `首${title.value}`;
      return;
    }
    if (title.value === '专辑') {
      displayTitle.value = `张${title.value}`;
      return;
    }
    if (title.value === '声音主播') {
      displayTitle.value = '个节目';
      return;
    }

    displayTitle.value = `个${title.value}`;
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped>
@import url('./search-details.less');
</style>
