<template>
  <div class="search-detail">
    <div class="detail-container">
      <SearchHeader />
      <div class="title">
        搜索“{{ route.query?.keyword }}”，找到
        <span class="count">{{ searchCount ?? 0 }}</span>
        <template v-if="Number(route.query.type) === 1">首单曲</template>
        <template v-if="Number(route.query.type) === 100">个歌手</template>
        <template v-if="Number(route.query.type) === 10">张专辑</template>
        <template v-if="Number(route.query.type) === 1014">个视频</template>
        <template v-if="Number(route.query.type) === 1006">个歌词</template>
        <template v-if="Number(route.query.type) === 1000">个歌单</template>
        <template v-if="Number(route.query.type) === 1009">节目</template>
        <template v-if="Number(route.query.type) === 1002">个用户</template>
      </div>
      <SearchTabs />
      <template v-if="Number(route.query.type) === 1">
        <SearchSong @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 100">
        <SearchSinger @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 10">
        <SearchAlbum @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 1014">
        <SearchMv @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 1000">
        <SearchSongSheet @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 1009">
        <SearchAnchor @searchCountChange="searchCountChange" />
      </template>
      <template v-if="Number(route.query.type) === 1002">
        <SearchUser @searchCountChange="searchCountChange" />
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
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import SearchHeader from './search-header/SearchHeader.vue';
import SearchTabs from './search-tabs/SearchTabs.vue';
import SearchSong from './search-song/SearchSong.vue';
import SearchSinger from './search-singer/SearchSinger.vue';
import SearchAlbum from './search-album/SearchAlbum.vue';
import SearchMv from './search-mv/SearchMv.vue';
import SearchSongSheet from './search-song-sheet/SearchSongSheet.vue';
import SearchAnchor from './search-anchor/SearchAnchor.vue';
import SearchUser from './search-user/SearchUser.vue';

const route = useRoute();

const searchCount = ref<string | number>('');
function searchCountChange(count: number): void {
  searchCount.value = count;
}
</script>

<style lang="less" scoped>
@import url('./search-details.less');
</style>
