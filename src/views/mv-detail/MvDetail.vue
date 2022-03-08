<template>
  <div class="mv-detail">
    <div class="mv-detail-container">
      <div class="mv-detail-content">
        <div class="title">
          <i class="icon"></i>
          <h2 class="text" :title="mvDetailData.name">
            {{ mvDetailData.name }}
          </h2>
          <div class="desc">
            <span class="by">by</span>
            <template
              v-for="(item, index) in mvDetailData?.artists"
              :key="index"
            >
              <span class="text" @click="jumpSingerDetail(item.id)">
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
        <!-- 播放器 -->
        <div class="video-container">
          <VideoPlayer :videoDetailData="mvDetailData" />
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div class="other like" @click="likeClick">
            <template v-if="mvDetailData?.praisedCount > 0">
              <i class="like-icon"></i>
              <span class="icon"> ({{ mvDetailData?.praisedCount }}) </span>
            </template>
            <template v-else>
              <i class="like-icon"></i>
              <span class="icon">喜欢</span>
            </template>
          </div>
          <div class="other collection" @click="collectionClick">
            <template v-if="mvDetailData?.subscribeCount > 0">
              <span class="icon">({{ mvDetailData?.subscribeCount }})</span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div class="other share" @click="shareClick">
            <template v-if="mvDetailData?.shareCount > 0">
              <span class="icon">({{ mvDetailData?.shareCount }})</span>
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
      <div class="mv-detail-side">
        <VideoDetailSide :mvDetailData="mvDetailData" />
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
import { mvDetail } from '@api/mv-detail';
import { mvUrl } from '@api/mv-detail';
import { commentMv } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import VideoPlayer from '@components/video-player/VideoPlayer.vue';
import { handleCommentData } from '@components/comment/handleCommentData';
import Comment from '@components/comment/Comment.vue';
import VideoDetailSide from './mv-detail-side/MvDetailSide.vue';
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

    const video = computed(() => $store.getters.video);

    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          nextTick(() => {
            getMvDetail();
            getVideoSrc();
            getCommentData();
          });
          return false;
        }
        if (video.value.id) {
          getMvDetail();
        }
      },
      {
        immediate: true
      }
    );

    const mvDetailData = ref<unknown>({});
    // 获取mv详情
    function getMvDetail(): void {
      mvDetail({
        mvid: video.value.id
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            mvDetailData.value = res.data;
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
      mvUrl({ id: video.value.id }).then((res: ResponseType) => {
        $store.commit('setVideo', { ...video.value, url: res.data.url });
      });
    }
    getVideoSrc();

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
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
      mvDetailData,
      jumpSingerDetail,
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
@import './mv-detail.less';
</style>
