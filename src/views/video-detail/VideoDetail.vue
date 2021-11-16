<template>
  <div class="video-detail">
    <div class="video-detail-container">
      <div class="video-detail-content">
        <div class="title">
          <h2 class="text" :title="videoDetailData.title">
            {{ videoDetailData.title }}
          </h2>
          <div class="desc">
            <span class="by">by</span>
            <span
              class="name"
              @click="jumpUserProfile(videoDetailData?.creator.userId)"
            >
              {{ videoDetailData?.creator?.nickname }}
            </span>
          </div>
        </div>
        <!-- 播放器 -->
        <div class="video-container">
          <VideoPlayer :videoDetailData="videoDetailData" />
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div class="other like" @click="likeClick">
            <template v-if="videoDetailData?.praisedCount > 0">
              <i class="like-icon"></i>
              <span class="icon"> ({{ videoDetailData?.praisedCount }}) </span>
            </template>
            <template v-else>
              <i class="like-icon"></i>
              <span class="icon">喜欢</span>
            </template>
          </div>
          <div class="other collection" @click="collectionClick">
            <template v-if="videoDetailData?.subscribeCount > 0">
              <span class="icon">
                ({{ videoDetailData?.subscribeCount }})
              </span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="shareClick">
            <template v-if="videoDetailData?.shareCount > 0">
              <span class="icon">({{ videoDetailData?.shareCount }})</span>
            </template>
            <template v-else>
              <span class="icon">分享</span>
            </template>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment-component">
          <Comment
            :commentParams="commentParams"
            @commentRefresh="commentRefresh"
          />
        </div>
        <!-- 参数从0开始，分页需从1开始 -->
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @changPage="changPage"
        />
      </div>
      <div class="video-detail-side">
        <VideoDetailSide :videoDetailData="videoDetailData" />
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
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { videoDetail } from '@api/video-detail';
import { commentVideo } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import VideoPlayer from '@components/video-player/VideoPlayer.vue';
import { handleCommentData } from '@components/comment/handleCommentData';
import Comment from '@components/comment/Comment.vue';
import VideoDetailSide from './video-detail-side/VideoDetailSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  name: 'VideoDetail',
  components: {
    VideoPlayer,
    Comment,
    VideoDetailSide,
    Page
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    // 视频id
    const videoId = computed<number>(() => $store.getters.videoId);

    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          nextTick(() => {
            getVideoDetail();
            getCommentData();
          });
          return false;
        }
        if (videoId.value) {
          getVideoDetail();
        }
      },
      {
        immediate: true
      }
    );

    const videoDetailData = ref<unknown>({});
    // 获取视频详情
    function getVideoDetail(): void {
      videoDetail({
        id: videoId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            videoDetailData.value = res.data;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 喜欢
    function likeClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 收藏
    function collectionClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 5,
      id: videoId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: videoId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentVideo({ ...params })
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
    getCommentData();

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      videoId,
      videoDetailData,
      jumpUserProfile,
      likeClick,
      collectionClick,
      shareClick,
      commentParams,
      commentRefresh,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './video-detail.less';
</style>
