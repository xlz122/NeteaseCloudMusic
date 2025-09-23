<template>
  <div class="toplist-content">
    <ToplistInfo :songSheetDetail="songSheetDetail" />
    <div class="table-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num"> {{ songSheetDetail.playlist?.trackCount }}首歌 </span>
      <div class="title-right">
        <div class="title-play-num" v-if="songSheetDetail.playlist?.tracks?.length > 0">
          <span>播放:</span>
          <span class="eye-catching">
            {{ songSheetDetail.playlist?.playCount }}
          </span>
          <span>次</span>
        </div>
      </div>
    </div>
    <ToplistSong class="music-table" :songSheetDetail="songSheetDetail" />
    <div class="comment-component">
      <Comment :params="commentParams" @onRefresh="refreshComment" />
    </div>
    <Page
      v-if="commentParams.total > commentParams.limit"
      :page="commentParams.offset"
      :pageSize="commentParams.limit"
      :total="commentParams.total"
      @onChange="handlePageChange"
    />
  </div>
</template>

<script lang="ts" setup>
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import ToplistInfo from './toplist-info/ToplistInfo.vue';
import ToplistSong from './toplist-song/ToplistSong.vue';

defineProps({
  songSheetDetail: {
    type: Object,
    default: () => ({})
  },
  commentParams: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['handlePageChange', 'refreshComment']);

function refreshComment(): void {
  emits('refreshComment');
}

function handlePageChange(current: number): void {
  emits('handlePageChange', current);
}
</script>

<style lang="less">
@import url('./toplist-content.less');
</style>
