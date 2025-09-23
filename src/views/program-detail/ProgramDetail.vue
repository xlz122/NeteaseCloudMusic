<template>
  <div class="program-detail">
    <div class="detail-container">
      <div class="program-content">
        <ProgramInfo
          :detail="programDetail"
          :commentTotal="commentParams.total"
          @jumpToComment="jumpToComment"
        />
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
      <div class="program-side">
        <ProgramSide :rid="programDetail.radio?.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { formatComment } from '@/components/comment/formatComment';
import { djProgramDetail } from '@/api/program-detail';
import { djprogramComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import ProgramInfo from './program-info/ProgramInfo.vue';
import ProgramSide from './program-side/ProgramSide.vue';

type ProgramDetail = {
  radio?: {
    id?: number;
  };
};

const route = useRoute();
const store = useStore();

// 获取电台节目详情
const programDetail = ref<ProgramDetail>({});

function getProgramDetail(): void {
  djProgramDetail({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      programDetail.value = res.program ?? {};
    })
    .catch(() => ({}));
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 4,
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

  djprogramComment({ ...params })
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

watch(
  () => route.query.id,
  () => {
    commentParams.id = Number(route.query.id);
    commentParams.offset = 1;
    getProgramDetail();
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
@import url('./program-detail.less');
</style>
