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
          <span class="title-text-num">
            {{ songSheetDetail?.playlist?.trackCount }}首歌
          </span>
          <div class="title-right">
            <div
              class="out"
              v-if="
                songSheetDetail?.playlist?.tracks &&
                songSheetDetail?.playlist?.tracks.length > 0
              "
            >
              <i class="icon"></i>
              <a
                class="link"
                :href="`https://music.163.com/#/outchain/0/${$route.query.id}`"
              >
                生成外链播放器
              </a>
            </div>
            <div class="title-play-num">
              播放:
              <span
                class="eye-catching"
                v-if="
                  songSheetDetail?.playlist?.tracks &&
                  songSheetDetail?.playlist?.tracks.length > 0
                "
              >
                {{ songSheetDetail?.playlist?.playCount }}
              </span>
              <span class="eye-catching" v-else>0</span>
              次
            </div>
          </div>
        </div>
        <MusicTable
          class="music-table"
          :loading="loading"
          :songSheetDetail="songSheetDetail"
        />
        <div class="playlist-see-more">
          <div class="text">查看更多内容，请下载客户端</div>
          <router-link class="link" to="/download">立即下载</router-link>
        </div>
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
      <div class="detail-side">
        <SongSheetSide :subscribers="songSheetDetail.playlist.subscribers" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { playlistDetail, playlistSubscribe } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
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

const $route = useRoute();
const $store = useStore();

// 获取歌单详情
const songSheetDetail = reactive<SongSheetDetail>({
  playlist: {},
  privileges: []
});
const loading = ref(false);

function getSongSheetDetail(): void {
  loading.value = true;

  playlistDetail({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
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
    id: Number($route.query.id),
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

  window.scrollTo(0, Number(commentDom.offsetTop) + 20);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: Number($route.query.id),
  offset: 1,
  limit: 20,
  total: 0,
  hotList: [],
  list: []
});

function getCommentList(): void {
  const params = {
    id: Number($route.query.id),
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
  () => $route.query.id,
  curVal => {
    if (!curVal) {
      return;
    }

    commentParams.offset = 1;

    getSongSheetDetail();
    getCommentList();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  $store.commit('setMenuIndex', 0);
  $store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./song-sheet-detail.less');
</style>
