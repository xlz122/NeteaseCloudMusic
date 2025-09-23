<template>
  <div class="song-sheet-detail">
    <div class="detail-container">
      <div class="detail-content">
        <SongSheetInfo
          class="user-info"
          :songSheetDetail="songSheetDetail"
          @handleCollection="handleCollection"
          @jumpToComment="jumpToComment"
        />
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num"> {{ songSheetDetail.playlist?.trackCount }}首歌 </span>
          <div class="title-right">
            <div class="out" v-if="songSheetDetail.playlist?.tracks?.length">
              <i class="icon"></i>
              <a class="link" :href="`https://music.163.com/#/outchain/0/${route.query.id}`">
                生成外链播放器
              </a>
            </div>
            <div class="title-play-num">
              <span>播放:</span>
              <span class="eye-catching" v-if="songSheetDetail.playlist?.tracks?.length">
                {{ songSheetDetail.playlist?.playCount }}
              </span>
              <span class="eye-catching" v-else>0</span>
              <span>次</span>
            </div>
          </div>
        </div>
        <MusicTable class="music-table" :loading="loading" :songSheetDetail="songSheetDetail" />
        <div class="playlist-see-more">
          <div class="text">查看更多内容，请下载客户端</div>
          <router-link class="link" to="/download">立即下载</router-link>
        </div>
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
      <div class="detail-side">
        <SongSheetSide :subscribers="songSheetDetail.playlist?.subscribers" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { formatComment } from '@/components/comment/formatComment';
import { playlistDetail, playlistSubscribe } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import MusicTable from '@/components/music-table/MusicTable.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import SongSheetInfo from './song-sheet-info/SongSheetInfo.vue';
import SongSheetSide from './song-sheet-side/SongSheetSide.vue';

type SongSheetDetail = {
  playlist: {
    playCount?: number;
    trackCount?: number;
    tracks?: unknown[];
    subscribed?: boolean;
    subscribers?: {
      userId: number;
      nickname: string;
      avatarUrl: string;
    }[];
  };
  privileges: {
    id: number;
  }[];
};

const route = useRoute();
const store = useStore();

// 获取歌单详情
const loading = ref(false);
const songSheetDetail = reactive<SongSheetDetail>({
  playlist: {},
  privileges: []
});

function getSongSheetDetail(): void {
  loading.value = true;

  playlistDetail({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
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
  playlistSubscribe({ id: Number(route.query.id), t: 1 })
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
  const element: HTMLElement = document.querySelector('.comment-component')!;
  window.scrollTo(0, element.offsetTop + 20);
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
  () => route.query.id,
  () => {
    commentParams.id = Number(route.query.id);
    commentParams.offset = 1;
    getSongSheetDetail();
    getCommentList();
  },
  { immediate: true }
);

onMounted(() => {
  store.commit('setMenuIndex', 0);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./song-sheet-detail.less');
</style>
