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
                v-if="index !== mvDetailData?.artists.length - 1"
                >/</span
              >
            </template>
          </div>
        </div>
        <div class="video-container">
          <VideoPlayer
            :detail="mvDetailData"
            :subed="mvsubed"
            @handleCollection="handleCollection"
          />
        </div>
        <div class="operate-btn">
          <div class="other like" @click="handleLike">
            <template v-if="mvDetailData?.praisedCount > 0">
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
            :class="{ 'collection-sub': mvsubed }"
            @click="handleCollection(mvsubed)"
          >
            <template v-if="mvDetailData?.subCount > 0">
              <span class="icon">({{ mvDetailData?.subCount }})</span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="handleShare">
            <template v-if="mvDetailData?.shareCount > 0">
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
            @commentRefresh="commentRefresh"
          />
        </div>
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @changPage="changPage"
        />
      </div>
      <div class="detail-side">
        <MvDetailSide :detail="mvDetailData" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted
} from 'vue';
import { useStore } from 'vuex';
import { handleCommentData } from '@components/comment/handleCommentData';
import { mvDetail } from '@api/mv-detail';
import { mvUrl, mvSub } from '@api/mv-detail';
import { commentMv } from '@api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@components/comment/Comment.vue';
import type { Video } from '@store/video/state';
import VideoPlayer from '@components/video-player/VideoPlayer.vue';
import Comment from '@components/comment/Comment.vue';
import MvDetailSide from './mv-detail-side/MvDetailSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  name: 'VideoDetail',
  components: {
    VideoPlayer,
    Comment,
    MvDetailSide,
    Page
  },
  setup() {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const video = computed<Video>(() => $store.getters['video/video']);

    watch(
      () => video.value.id,
      curVal => {
        if (curVal) {
          nextTick(() => {
            getMvDetail();
            getVideoSrc();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    const mvDetailData = ref<unknown>({});
    // 是否收藏
    const mvsubed = ref<boolean>(false);
    // 获取mv详情
    function getMvDetail(): void {
      mvDetail({
        mvid: video.value.id
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            mvDetailData.value = res?.data;
            mvsubed.value = res?.subed;
          }
        })
        .catch(() => ({}));
    }

    // 获取播放地址
    function getVideoSrc(): void {
      mvUrl({ id: video.value.id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            $store.commit('video/setVideo', {
              ...video.value,
              url: res?.data?.url
            });
          }
        })
        .catch(() => ({}));
    }

    // 喜欢
    function handleLike(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 收藏
    function handleCollection(followed: boolean): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      // 1:收藏 2:取消收藏
      const t = followed ? 2 : 1;

      mvSub({ mvid: video.value.id, t })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (t === 1) {
              $store.commit('setMessage', {
                type: 'info',
                title: '收藏成功'
              });

              mvsubed.value = true;
            }
            if (t === 2) {
              $store.commit('setMessage', {
                type: 'info',
                title: '取消收藏成功'
              });

              mvsubed.value = false;
            }
          }
        })
        .catch(() => ({}));
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 1,
      id: video.value.id,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: video.value.id,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentMv({ ...params })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            const result = handleCommentData(res);
            // 精彩评论
            commentParams.hotList = result.hotList;
            // 最新评论
            commentParams.list = result.list;
            // 最新评论 - 总数
            commentParams.total = res.total;
          }
        })
        .catch(() => ({}));
    }

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    onMounted(() => {
      $store.commit('setMenuIndex', 0);
      $store.commit('setSubMenuIndex', -1);
    });

    return {
      mvDetailData,
      mvsubed,
      handleLike,
      handleCollection,
      handleShare,
      commentParams,
      commentRefresh,
      changPage,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './mv-detail.less';
</style>
