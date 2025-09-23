<template>
  <div class="mv-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="title">
          <h2 class="title-text" :title="mvDetailData.name">
            <i class="icon-mv"></i>
            {{ mvDetailData.name }}
          </h2>
          <div class="title-info">
            <span class="by">by</span>
            <template v-for="(item, index) in mvDetailData.artists" :key="index">
              <span class="text" :title="item.name" @click="jumpSingerDetail(item.id)">
                {{ item.name }}
              </span>
              <span class="line" v-if="index !== mvDetailData.artists?.length - 1">/</span>
            </template>
          </div>
        </div>
        <div class="video-container">
          <VideoPlayer
            :detail="mvDetailData"
            :subed="mvSubed"
            @handleCollection="handleCollection"
          />
        </div>
        <div class="operate-btn">
          <div class="other like" @click="handleLike">
            <template v-if="mvDetailData.praisedCount && mvDetailData.praisedCount > 0">
              <i class="like-icon"></i>
              <span class="icon"> ({{ mvDetailData.praisedCount }}) </span>
            </template>
            <template v-else>
              <i class="like-icon"></i>
              <span class="icon">喜欢</span>
            </template>
          </div>
          <div
            class="other collection"
            :class="{ 'collection-sub': mvSubed }"
            @click="handleCollection(mvSubed)"
          >
            <template v-if="mvDetailData.subCount && mvDetailData.subCount > 0">
              <span class="icon">({{ mvDetailData.subCount }})</span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="handleShare">
            <template v-if="mvDetailData.shareCount && mvDetailData.shareCount > 0">
              <span class="icon">({{ mvDetailData.shareCount }})</span>
            </template>
            <template v-else>
              <span class="icon">分享</span>
            </template>
          </div>
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
        <MvSide :detail="mvDetailData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { formatComment } from '@/components/comment/formatComment';
import { mvDetail } from '@/api/mv-detail';
import { mvSub } from '@/api/mv-detail';
import { mvComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import VideoPlayer from '@/components/video-player/VideoPlayer.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import MvSide from './mv-side/MvSide.vue';

type MvDetailData = {
  name?: string;
  artists: {
    id: number;
    name: string;
  }[];
  praisedCount?: number;
  subCount?: number;
  shareCount?: number;
  subed?: boolean;
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取详情
const mvSubed = ref(false);
const mvDetailData = ref<MvDetailData>({
  artists: []
});

function getMvDetail(): void {
  mvDetail({ mvid: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      mvSubed.value = res.subed ?? false;
      mvDetailData.value = res.data ?? {};
    })
    .catch(() => ({}));
}

function handleLike(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleCollection(followed: boolean): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  const t = followed ? 2 : 1;

  mvSub({ mvid: Number(route.query.id), t })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (t === 1) {
        mvSubed.value = true;
        setMessage({ type: 'info', title: '收藏成功' });
      }
      if (t === 2) {
        mvSubed.value = false;
        setMessage({ type: 'info', title: '取消收藏成功' });
      }
    })
    .catch(() => ({}));
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 1,
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

  mvComment({ ...params })
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

function jumpToComment(): void {
  const element: HTMLElement = document.querySelector('.comment-component')!;
  window.scrollTo(0, element.offsetTop + 20);
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}

watch(
  () => route.query.id,
  () => {
    commentParams.id = Number(route.query.id);
    commentParams.offset = 1;
    getMvDetail();
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
@import url('./mv-detail.less');
</style>
