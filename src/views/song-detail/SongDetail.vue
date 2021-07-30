<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <!-- 评论 -->
        <div class="comment-component">
          <comment :commentParams="commentParams" />
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
      <div class="song-sheet-side">
        <SongSheetSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { songDetail } from '@api/song-detail';
import { commentMusic } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './song-detail-side/SonDetailSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    Comment,
    SongSheetSide,
    Page
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const songId = computed(() => $store.getters.songId);
    // 监听路由传参，获取歌曲详情
    watch(
      () => $route.params,
      curVal => {
        if (curVal.songId) {
          nextTick(() => {
            $store.commit('setSongId', Number(curVal.songId));
            getSongDetail();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    // 获取歌曲详情
    function getSongDetail(): void {
      songDetail({
        ids: songId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            console.log(res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSongDetail();

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      id: songId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: songId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = commentParams.offset;
      }
      commentMusic({ ...params })
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
      commentParams,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-detail.less';
</style>
