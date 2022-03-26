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
          <div
            class="other collection"
            :class="{ 'collection-sub': videoSubed }"
            @click="collectionClick(videoSubed)"
          >
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
import { MyVideoSbulist } from '@api/my-music';
import { videoDetail } from '@api/video-detail';
import { commentVideo } from '@api/comment';
import { videoUrl, videoSub } from '@api/video-detail';
import { ResponseType, CommentParams, LoopType } from '@/types/types';
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

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    const video = computed(() => $store.getters.video);

    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          nextTick(() => {
            getVideoDetail();
            getVideoSrc();
            getCommentData();
          });
          return false;
        }
        if (video.value.id) {
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
        id: video.value.id
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

    // 获取播放地址
    function getVideoSrc(): void {
      videoUrl({ id: video.value.id }).then((res: ResponseType) => {
        $store.commit('setVideo', { ...video.value, url: res.urls[0].url });
      });
    }
    getVideoSrc();

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

    // 是否收藏
    const videoSubed = ref<boolean>(false);

    // 获取视频列表
    function getVideoSbulist(): void {
      MyVideoSbulist().then((res: ResponseType) => {
        if (res.code === 200) {
          res.data.forEach((item: LoopType) => {
            if (item.vid === video.value.id) {
              videoSubed.value = true;
            }
          });
        }
      });
    }
    getVideoSbulist();

    // 收藏
    function collectionClick(followed: boolean): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      // 1:收藏 2:取消收藏
      const t = followed ? 2 : 1;

      videoSub({ id: video.value.id, t })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            if (t === 1) {
              $store.commit('setMessage', {
                type: 'info',
                title: '收藏成功'
              });

              videoSubed.value = true;
            }
            if (t === 2) {
              $store.commit('setMessage', {
                type: 'info',
                title: '取消收藏成功'
              });

              videoSubed.value = false;
            }
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
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
      video,
      videoDetailData,
      jumpUserProfile,
      likeClick,
      videoSubed,
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
