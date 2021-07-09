<template>
  <div class="home-song-sheet">
    <div class="home-song-sheet-container">
      <div class="title">
        <span class="text">全部</span>
      </div>
      <!-- 参数从0开始，分页需从1开始 -->
      <!-- <Page
        v-if="pageTotal > newDiscFormData.limit"
        :page="newDiscFormData.offset"
        :pageSize="newDiscFormData.limit"
        :total="pageTotal"
        @changPage="changPage"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { hotNewDisc, nweDiscAlbum, NweDiscAlbum } from '@api/home-new-disc';
import { ResponseType } from '@/types/types';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    Page
  },
  setup() {
    return {};
  }
});
</script>

<style lang="less" scoped>
@import './home-song-sheet.less';
</style>
