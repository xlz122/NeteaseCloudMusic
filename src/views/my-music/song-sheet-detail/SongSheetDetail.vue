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
      <span class="title-track"> {{ songSheetDetail.playlist?.trackCount }}首歌 </span>
      <div class="title-play-num" v-if="songSheetDetail.playlist?.tracks?.length">
        <span>播放:</span>
        <span class="eye-catching">
          {{ songSheetDetail.playlist?.playCount }}
        </span>
        <span>次</span>
      </div>
    </div>
    <MusicTable
      class="music-table"
      :loading="loading"
      :songSheetDetail="songSheetDetail"
      @handleSongDelete="handleSongDelete"
    />
    <div class="comment-component">
      <Comment :params="commentParams" @onRefresh="refreshComment" />
      <Page
        v-if="commentParams.total > commentParams.limit"
        :page="commentParams.offset"
        :pageSize="commentParams.limit"
        :total="commentParams.total"
        @onChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { formatComment } from '@/components/comment/formatComment';
import { playListDetail } from '@/api/my-music';
import { playlistSubscribe } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types';
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

const store = useStore();
const songSheetId = computed(() => store.getters.songSheetId);

// 获取歌单详情
const loading = ref(false);
const songSheetDetail = reactive<SongSheetDetail>({
  playlist: {},
  privileges: []
});

function getSongSheetDetail(): void {
  loading.value = true;

  playListDetail({ id: songSheetId.value })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (res.playlist?.name?.includes?.('喜欢的音乐')) {
        res.playlist.name = '我喜欢的音乐';
      }

      songSheetDetail.playlist = res.playlist ?? {};
      songSheetDetail.privileges = res.privileges ?? [];
      loading.value = false;
    })
    .catch(() => ({}));
}

function handleCollection(): void {
  if (songSheetDetail.playlist?.subscribed) {
    return;
  }

  // 1: 收藏 2: 取消收藏
  playlistSubscribe({ id: songSheetId.value, t: 1 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: '收藏失败' });
        return;
      }

      songSheetDetail.playlist.subscribed = true;
      setMessage({ type: 'info', title: '收藏成功' });
    })
    .catch(() => ({}));
}

function jumpToComment(): void {
  const commentDom = document.querySelector('.comment-component') as HTMLDivElement;
  const myMusic = document.querySelector('.my-music') as HTMLDivElement;
  myMusic.scrollTo?.(0, Number(commentDom.offsetTop) - 50);
}

// 删除歌曲
function handleSongDelete(id: number): void {
  const index = songSheetDetail.playlist?.tracks?.findIndex?.((item) => item.id === id);
  if (index === -1) {
    return;
  }

  songSheetDetail.playlist?.tracks?.splice?.(index!, 1);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: undefined,
  offset: 1,
  limit: 20,
  hotList: [],
  list: [],
  total: 0
});

function getCommentList(): void {
  const params = {
    id: commentParams.id,
    offset: (commentParams.offset - 1) * commentParams.limit,
    limit: commentParams.limit
  };

  playlistComment({ ...params })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      const comment = formatComment(res);
      commentParams.hotList = comment.hotList;
      commentParams.list = comment.list;
      commentParams.total = comment.total;
    })
    .catch(() => ({}));
}

function refreshComment(): void {
  getCommentList();
}

function handlePageChange(current: number): void {
  commentParams.offset = current;
  getCommentList();
  jumpToComment();
}

watch(
  () => songSheetId.value,
  () => {
    if (!songSheetId.value) {
      return;
    }

    commentParams.id = songSheetId.value;
    commentParams.offset = 1;
    getSongSheetDetail();
    getCommentList();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import url('./song-sheet-detail.less');
</style>
