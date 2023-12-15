<template>
  <div class="program-detail">
    <div class="program-detail-container">
      <div class="program-content">
        <ProgramInfo
          :detail="programDetail"
          :commentTotal="commentParams.total"
          @jumpToComment="jumpToComment"
        />
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
      <div class="program-side">
        <ProgramSide :rid="programDetail?.radio?.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { djProgramDetail } from '@/api/program-detail';
import { djprogramComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import Comment from '@/components/comment/Comment.vue';
import ProgramInfo from './program-info/ProgramInfo.vue';
import ProgramSide from './program-side/ProgramSide.vue';
import Page from '@/components/page/Page.vue';

type ProgramDetail = {
  radio?: {
    id?: number;
  };
};

const $route = useRoute();
const $store = useStore();

// 获取电台节目详情
const programDetail = ref<ProgramDetail>({});

function getProgramDetail(): void {
  djProgramDetail({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        programDetail.value = res?.program || {};
      }
    })
    .catch(() => ({}));
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 4,
  id: 0,
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

  djprogramComment({ ...params })
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

watch(
  () => $route.query.id,
  curVal => {
    if (!curVal) {
      return;
    }

    getProgramDetail();
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
@import url('./program-detail.less');
</style>
