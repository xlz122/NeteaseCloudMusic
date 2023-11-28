<template>
  <div class="song-sheet-detail">
    <UserInfo class="user-info" @jumpToComment="jumpToComment" />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-track">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
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
    <MusicTable class="music-table" />
    <div class="comment-component">
      <Comment
        :commentParams="commentParams"
        @refreshComment="refreshComment"
      />
      <Page
        v-if="commentParams.total > commentParams.limit"
        :page="commentParams.offset"
        :pageSize="commentParams.limit"
        :total="commentParams.total"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { playListDetail } from '@/api/my-music';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import UserInfo from '@/components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@/components/song-sheet/music-table/MusicTable.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';

const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);
const songSheetDetail = computed(() => $store.getters.songSheetDetail);

// 获取歌单详情
function getSongSheetDetail(): void {
  playListDetail({ id: songSheetId.value })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        if (res?.playlist?.name.includes('喜欢的音乐')) {
          res.playlist.name = '我喜欢的音乐';
        }

        $store.commit('setSongSheetDetail', res);
      }
    })
    .catch(() => ({}));
}

// 跳转至评论
function jumpToComment(): void {
  const commentDom = document.querySelector(
    '.comment-component'
  ) as HTMLDivElement;
  const myMusic = document.querySelector('.my-music') as HTMLDivElement;
  myMusic?.scrollTo(0, Number(commentDom.offsetTop) - 50);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: songSheetId.value,
  offset: 1,
  limit: 20,
  total: 0,
  hotList: [],
  list: []
});

function getCommentList(): void {
  const params = {
    id: songSheetId.value,
    offset: (commentParams.offset - 1) * commentParams.limit,
    limit: commentParams.limit
  };

  playlistComment({ ...params })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        const result = handleCommentData(res);
        // 精彩评论
        commentParams.hotList = result.hotList;
        // 最新评论
        commentParams.list = result.list;
        commentParams.total = res.total;
      }
    })
    .catch(() => ({}));
}

// 刷新评论
function refreshComment(): void {
  getCommentList();
}

// 分页
function pageChange(current: number): void {
  commentParams.offset = current;
  jumpToComment();
  getCommentList();
}

watch(
  () => songSheetId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getSongSheetDetail();
    getCommentList();
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped>
@import url('./song-sheet-detail.less');
</style>
