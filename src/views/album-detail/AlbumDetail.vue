<template>
  <div class="album-detail">
    <div class="detail-container">
      <div class="album-content">
        <AlbumInfo
          class="user-info"
          :userInfo="album.userInfo"
          :songs="album.songs"
          @jumpToComment="jumpToComment"
        />
        <div class="list-title">
          <h3 class="title-text">包含歌曲列表</h3>
          <span class="title-text-num">{{ album.songs?.length }}首歌</span>
          <div class="title-right">
            <div class="out">
              <i class="icon"></i>
              <a class="link" :href="`https://music.163.com/#/outchain/1/${route.query.id}`">
                生成外链播放器
              </a>
            </div>
          </div>
        </div>
        <AlbumSong class="music-table" :loading="album.loading" :songs="album.songs" />
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
      <div class="album-side">
        <AlbumSide :singerId="album.userInfo?.artist?.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { albumDetail } from '@/api/album-detail';
import { albumComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import { formatComment } from '@/components/comment/formatComment';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import AlbumInfo from './album-info/AlbumInfo.vue';
import AlbumSong from './album-song/AlbumSong.vue';
import AlbumSide from './album-side/AlbumSide.vue';

type Album = {
  loading: boolean;
  userInfo: Record<string, any>;
  songs: [];
};

const route = useRoute();
const store = useStore();

// 获取专辑详情
const album = reactive<Album>({
  loading: false,
  userInfo: {},
  songs: []
});

function getAlbumDetail(): void {
  album.loading = true;

  albumDetail({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      album.userInfo = res.album ?? {};
      album.songs = res.songs ?? [];
      album.loading = false;
    })
    .catch(() => ({}));
}

function jumpToComment(): void {
  const element: HTMLElement = document.querySelector('.comment-component')!;
  window.scrollTo(0, element.offsetTop + 20);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 3,
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

  albumComment({ ...params })
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
    getAlbumDetail();
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
@import url('./album-detail.less');
</style>
