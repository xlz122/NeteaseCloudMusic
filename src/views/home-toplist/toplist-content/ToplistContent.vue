<template>
  <div class="toplist-content">
    <ToplistInfo :songSheetDetail="songSheetDetail" />
    <div class="table-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
      <div class="title-right">
        <div
          class="title-play-num"
          v-if="songSheetDetail?.playlist?.tracks.length > 0"
        >
          播放:
          <span class="eye-catching">
            {{ songSheetDetail?.playlist?.playCount }}
          </span>
          次
        </div>
      </div>
    </div>
    <ToplistSong class="music-table" :songSheetDetail="songSheetDetail" />
    <div class="comment-component">
      <Comment
        :commentParams="commentParams"
        @refreshComment="refreshComment"
      />
    </div>
    <Page
      v-if="commentParams.total > commentParams.limit"
      :page="commentParams.offset"
      :pageSize="commentParams.limit"
      :total="commentParams.total"
      @pageChange="pageChange"
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
    default: () => {}
  },
  commentParams: {
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(['pageChange', 'refreshComment']);

// 刷新评论
function refreshComment(): void {
  emits('refreshComment');
}

// 分页
function pageChange(current: number): void {
  emits('pageChange', current);
}
</script>

<style lang="less">
@import url('./toplist-content.less');
</style>
