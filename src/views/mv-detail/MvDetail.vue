<template>
  <div class="mv-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="title">
          <i class="title-icon"></i>
          <h2 class="title-text" :title="mvDetailData?.name">
            {{ mvDetailData?.name }}
          </h2>
          <div class="title-info">
            <span class="by">by</span>
            <template
              v-for="(item, index) in mvDetailData?.artists"
              :key="index"
            >
              <span
                class="text"
                :title="item?.name"
                @click="jumpSingerDetail(item?.id)"
              >
                {{ item.name }}
              </span>
              <span
                class="line"
                v-if="index !== mvDetailData?.artists?.length - 1"
                >/</span
              >
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
            <template
              v-if="
                mvDetailData?.praisedCount && mvDetailData?.praisedCount > 0
              "
            >
              <i class="like-icon"></i>
              <span class="icon"> ({{ mvDetailData?.praisedCount }}) </span>
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
            <template
              v-if="mvDetailData?.subCount && mvDetailData?.subCount > 0"
            >
              <span class="icon">({{ mvDetailData?.subCount }})</span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="handleShare">
            <template
              v-if="mvDetailData?.shareCount && mvDetailData?.shareCount > 0"
            >
              <span class="icon">({{ mvDetailData?.shareCount }})</span>
            </template>
            <template v-else>
              <span class="icon">分享</span>
            </template>
          </div>
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
        <MvDetailSide :detail="mvDetailData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { mvDetail } from '@/api/mv-detail';
import { mvUrl, mvSub } from '@/api/mv-detail';
import { mvComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import VideoPlayer from '@/components/video-player/VideoPlayer.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import MvDetailSide from './mv-detail-side/MvDetailSide.vue';

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

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

// 获取详情
const mvDetailData = ref<MvDetailData>({
  artists: []
});
const mvSubed = ref(false);

function getMvDetail(): void {
  mvDetail({ mvid: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        mvDetailData.value = res?.data || {};
        mvSubed.value = res?.subed || false;
      }
    })
    .catch(() => ({}));
}

// 获取播放地址
function getVideoPlaySrc(): void {
  mvUrl({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        $store.commit('video/setVideoPlayUrl', res?.data?.url || '');
      }
    })
    .catch(() => ({}));
}

// 喜欢
function handleLike(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 收藏
function handleCollection(followed: boolean | undefined): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  const t = followed ? 2 : 1;

  mvSub({ mvid: Number($route.query.id), t })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (t === 1) {
          mvSubed.value = true;

          setMessage({ type: 'info', title: '收藏成功' });
        }
        if (t === 2) {
          mvSubed.value = false;

          setMessage({ type: 'info', title: '取消收藏成功' });
        }
      }
    })
    .catch(() => ({}));
}

// 分享
function handleShare(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 1,
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

  mvComment({ ...params })
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

// 跳转至评论
function jumpToComment(): void {
  const commentDom = document.querySelector(
    '.comment-component'
  ) as HTMLDivElement;

  window.scrollTo(0, Number(commentDom.offsetTop) + 20);
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

watch(
  () => $route.query.id,
  curVal => {
    if (!curVal) {
      return;
    }

    getMvDetail();
    getVideoPlaySrc();
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
@import url('./mv-detail.less');
</style>
