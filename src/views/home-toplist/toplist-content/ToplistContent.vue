<template>
  <div class="toplist-content">
    <ToplistInfo
      :updateFrequency="updateFrequency"
      :songSheetDetail="songSheetDetail"
    />
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
        @commentRefresh="commentRefresh"
      />
    </div>
    <Page
      v-if="commentParams.total > commentParams.limit"
      :page="commentParams.offset"
      :pageSize="commentParams.limit"
      :total="commentParams.total"
      @changPage="changPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ToplistInfo from './toplist-info/ToplistInfo.vue';
import ToplistSong from './toplist-song/ToplistSong.vue';
import Comment from '@components/comment/Comment.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    ToplistInfo,
    ToplistSong,
    Comment,
    Page
  },
  props: {
    updateFrequency: {
      type: String,
      default: ''
    },
    songSheetDetail: {
      type: Object,
      default: () => ({})
    },
    commentParams: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['changPage', 'commentRefresh'],
  setup(props, { emit }) {
    // 刷新评论
    function commentRefresh(): void {
      emit('commentRefresh');
    }

    // 分页
    function changPage(current: number): void {
      emit('changPage', current);
    }

    return {
      commentRefresh,
      changPage
    };
  }
});
</script>

<style lang="less">
@import url('./toplist-content.less');
</style>
