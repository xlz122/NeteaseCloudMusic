<template>
  <div class="program-detail">
    <div class="program-detail-container">
      <div class="program-content">
        <ProgramInfo
          :detail="detail"
          :commentTotal="commentParams.total"
          @jumpToComments="jumpToComments"
        />
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
      <div class="program-side">
        <ProgramSide :rid="detail?.radio?.id" />
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
import { useStore } from 'vuex';
import { handleCommentData } from '@components/comment/handleCommentData';
import { programDetail } from '@api/program-detail';
import { commentDjprogram } from '@api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@components/comment/Comment.vue';
import Comment from '@components/comment/Comment.vue';
import ProgramInfo from './program-info/ProgramInfo.vue';
import ProgramSide from './program-side/ProgramSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    ProgramInfo,
    Comment,
    ProgramSide,
    Page
  },
  setup() {
    const $store = useStore();

    // 电台节目id
    const programId = computed<number>(() => $store.getters.programId);

    watch(
      () => programId.value,
      curVal => {
        if (curVal) {
          nextTick(() => {
            getProgramDetail();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    const detail = ref({});
    // 获取电台节目详情
    function getProgramDetail(): void {
      programDetail({
        id: programId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            detail.value = res.program;
          }
        })
        .catch(() => ({}));
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 4,
      id: programId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: programId.value,
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

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      jumpToComments();
      getCommentData();
    }

    // 跳转至评论
    function jumpToComments(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;

      window.scrollTo(0, Number(commentDom.offsetTop) + 20);
    }

    onMounted(() => {
      $store.commit('setMenuIndex', 0);
      $store.commit('setSubMenuIndex', -1);
    });

    return {
      programId,
      detail,
      commentParams,
      commentRefresh,
      changPage,
      jumpToComments
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./program-detail.less');
</style>
