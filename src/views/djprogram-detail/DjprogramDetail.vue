<template>
  <div class="djprogram-detail">
    <div class="djprogram-detail-container">
      <div class="djprogram-content">
        <DjprogramInfo
          :djProgramDetailData="djProgramDetailData"
          :commentTotal="commentParams.total"
          @commentClick="commentClick"
        />
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
      <div class="djprogram-side">
        <DjprogramSide />
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
  onMounted,
  nextTick
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { djProgramDetail } from '@api/djprogram-detail';
import { commentDjprogram } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import Comment from '@components/comment/Comment.vue';
import DjprogramInfo from './djprogram-info/DjprogramInfo.vue';
import DjprogramSide from './djprogram-side/DjprogramSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    DjprogramInfo,
    Comment,
    DjprogramSide,
    Page
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    // 电台节目id
    const djprogramId = computed(() => $store.getters.djprogramId);
    // 监听路由传参，获取歌曲详情
    watch(
      () => $route.params,
      curVal => {
        if (curVal.djprogramId) {
          nextTick(() => {
            $store.commit('setDjprogramId', Number(curVal.djprogramId));
            getDjProgramDetail();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    const djProgramDetailData = ref({});
    // 获取电台节目详情
    function getDjProgramDetail(): void {
      djProgramDetail({
        id: djprogramId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            djProgramDetailData.value = res.program;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getDjProgramDetail();

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 4,
      id: djprogramId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: djprogramId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentDjprogram({ ...params })
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

    // 评论
    function commentClick(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      // 标题高度
      window.scrollTo(0, Number(commentDom.offsetTop) + 20);
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      djprogramId,
      djProgramDetailData,
      commentParams,
      commentRefresh,
      changPage,
      commentClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './djprogram-detail.less';
</style>
