<template>
  <div class="song-sheet-detail">
    <SongSheetInfo
      class="user-info"
      :songSheetDetail="songSheetDetail"
      @handleCollection="handleCollection"
      @jumpToComment="jumpToComment"
    />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-track">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="
          songSheetDetail?.playlist?.tracks &&
          songSheetDetail?.playlist?.tracks?.length > 0
        "
      >
        播放:
        <span class="eye-catching">
          {{ songSheetDetail?.playlist?.playCount }}
        </span>
        次
      </div>
    </div>
    <MusicTable
      class="music-table"
      :loading="loading"
      :songSheetDetail="songSheetDetail"
      @handleDeleteMusic="handleDeleteMusic"
    />
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
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { playListDetail } from '@/api/my-music';
import { playlistSubscribe } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import SongSheetInfo from '@/views/song-sheet-detail/song-sheet-info/SongSheetInfo.vue';
import MusicTable from '@/components/music-table/MusicTable.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';

type SongSheetDetail = {
  playlist: {
    playCount?: number;
    trackCount?: number;
    tracks?: {
      id: number;
    }[];
    subscribed?: boolean;
  };
  privileges: {
    id: number;
  }[];
};

const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);

// 获取歌单详情
const songSheetDetail = reactive<SongSheetDetail>({
  playlist: {},
  privileges: []
});
const loading = ref(false);

function getSongSheetDetail(): void {
  loading.value = true;

  playListDetail({ id: songSheetId.value })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        if (res?.playlist?.name.includes('喜欢的音乐')) {
          res.playlist.name = '我喜欢的音乐';
        }

        songSheetDetail.playlist = res?.playlist || {};
        songSheetDetail.privileges = res?.privileges || [];

        loading.value = false;
      }
    })
    .catch(() => ({}));
}

// 收藏
function handleCollection(): void {
  // 歌单是否已收藏
  if (songSheetDetail.playlist?.subscribed) {
    return;
  }

  // 1: 收藏 2: 取消收藏
  playlistSubscribe({
    id: songSheetId.value,
    t: 1
  })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        songSheetDetail.playlist.subscribed = true;

        setMessage({ type: 'info', title: '收藏成功' });
        return;
      }

      setMessage({ type: 'error', title: '收藏失败' });
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

// 删除歌曲
function handleDeleteMusic(id: number): void {
  const index = songSheetDetail.playlist?.tracks?.findIndex(
    item => item.id === id
  );

  if (!index || index === -1) {
    return;
  }

  songSheetDetail.playlist?.tracks?.splice(index, 1);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: 0,
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
