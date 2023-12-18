<template>
  <div class="album-detail">
    <div class="album-detail-container">
      <div class="album-content">
        <AlbumInfo
          class="user-info"
          :userInfo="album.userInfo"
          :songs="album.songs"
          @jumpToComment="jumpToComment"
        />
        <div class="list-title">
          <h3 class="title-text">包含歌曲列表</h3>
          <span class="title-text-num">{{ album?.songs?.length }}首歌</span>
          <div class="title-right">
            <div class="out">
              <i class="icon"></i>
              <a
                class="link"
                :href="`https://music.163.com/#/outchain/1/${$route.query.id}`"
              >
                生成外链播放器
              </a>
            </div>
          </div>
        </div>
        <AlbumSong
          class="music-table"
          :loading="album.loading"
          :songs="album.songs"
        />
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
      <div class="album-side">
        <AlbumDetailSide :singerId="album.userInfo?.artist?.id" />
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
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import { handleCommentData } from '@/components/comment/handleCommentData';
import AlbumInfo from './album-info/AlbumInfo.vue';
import AlbumSong from './album-song/AlbumSong.vue';
import Comment from '@/components/comment/Comment.vue';
import AlbumDetailSide from './album-detail-side/AlbumDetailSide.vue';
import Page from '@/components/page/Page.vue';

type Album = {
  loading: boolean;
  userInfo: Record<string, any>;
  songs: [];
};

const $route = useRoute();
const $store = useStore();

// 获取专辑详情
const album = reactive<Album>({
  loading: true,
  userInfo: {},
  songs: []
});

function getAlbumDetail(): void {
  album.loading = true;
  album.songs = [];

  albumDetail({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        album.userInfo = res?.album || {};
        album.songs = res?.songs || [];
      }

      album.loading = false;
    })
    .catch(() => ({}));
}

// 跳转至评论
function jumpToComment(): void {
  const commentDom = document.querySelector(
    '.comment-component'
  ) as HTMLElement;

  window.scrollTo(0, Number(commentDom.offsetTop) + 20);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 3,
  id: 0,
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

  albumComment({ ...params })
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

    getAlbumDetail();
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
@import url('./album-detail.less');
</style>
