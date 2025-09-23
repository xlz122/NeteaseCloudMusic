<template>
  <div class="video-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="title">
          <h2 class="title-text" :title="videoDetailData.title">
            {{ videoDetailData.title }}
          </h2>
          <div class="title-info">
            <span class="by">by</span>
            <span
              class="name"
              :title="videoDetailData.creator?.nickname"
              @click="jumpUserProfile(videoDetailData.creator?.userId)"
            >
              {{ videoDetailData.creator?.nickname }}
            </span>
          </div>
        </div>
        <div class="video-container">
          <VideoPlayer
            :detail="videoDetailData"
            :subed="videoSubed"
            @handleCollection="handleCollection"
          />
        </div>
        <div class="operate-btn">
          <div class="other like" @click="handleLike">
            <template v-if="videoDetailData.praisedCount">
              <i class="like-icon"></i>
              <span class="icon"> ({{ videoDetailData.praisedCount }}) </span>
            </template>
            <template v-else>
              <i class="like-icon"></i>
              <span class="icon">喜欢</span>
            </template>
          </div>
          <div
            class="other collection"
            :class="{ 'collection-sub': videoSubed }"
            @click="handleCollection(videoSubed)"
          >
            <template v-if="videoDetailData.subscribeCount">
              <span class="icon">({{ videoDetailData.subscribeCount }})</span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="handleShare">
            <template v-if="videoDetailData.shareCount">
              <span class="icon">({{ videoDetailData.shareCount }})</span>
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
        <VideoSide :detail="videoDetailData" />
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
import { videoDetail, videoSub } from '@/api/video-detail';
import { videoSbulist } from '@/api/my-music';
import { videoComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import VideoPlayer from '@/components/video-player/VideoPlayer.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import VideoSide from './video-side/VideoSide.vue';

type VideoDetailData = {
  title?: string;
  creator?: {
    userId?: number;
    nickname?: string;
  };
  praisedCount?: number;
  subscribeCount?: number;
  shareCount?: number;
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取详情
const videoDetailData = ref<VideoDetailData>({});

function getVideoDetail(): void {
  videoDetail({ id: String(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      videoDetailData.value = res.data ?? {};
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

// 判断视频是否被收藏
const videoSubed = ref(false);

function getVideoSbulist(): void {
  videoSbulist()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      res.data?.forEach?.((item: { vid: number }) => {
        if (item.vid !== Number(route.query.id)) {
          return;
        }

        videoSubed.value = true;
      });
    })
    .catch(() => ({}));
}

function handleCollection(followed: boolean): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  const t = followed ? 2 : 1;

  videoSub({ id: String(route.query.id), t })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: res?.message });
        return;
      }

      if (t === 1) {
        videoSubed.value = true;
        setMessage({ type: 'info', title: '收藏成功' });
      }
      if (t === 2) {
        videoSubed.value = false;
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
  type: 5,
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

  videoComment({ ...params })
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

function jumpUserProfile(id: number | undefined): void {
  router.push({ path: '/user-profile', query: { id } });
}

watch(
  () => route.query.id,
  () => {
    commentParams.id = String(route.query.id);
    commentParams.offset = 1;
    getVideoDetail();
    getVideoSbulist();
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
@import url('./video-detail.less');
</style>
