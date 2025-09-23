<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ params.total }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img class="user-avatar" :src="userInfo.profile?.avatarUrl ?? defaultAvatarImg" alt="" />
      <comment-replay
        class="comment-content-replay"
        :isClearText="isClearText"
        :rows="3"
        @submit="submit"
      />
    </div>
    <!-- 精彩评论(页数1展示) -->
    <template v-if="params.offset <= 1 && params.hotList?.length > 0">
      <h3 class="comment-title">精彩评论</h3>
      <CommentList
        :type="0"
        :list="params.hotList"
        @handleDeleteComment="handleDeleteComment"
        @handleLikeComment="handleLikeComment"
        @setComments="setComments"
        @replySubmit="replySubmit"
      />
    </template>
    <!-- 最新评论 -->
    <template v-if="params.list?.length > 0">
      <h3 class="comment-title" v-if="params.offset <= 1">最新评论({{ params.total }})</h3>
      <CommentList
        :type="1"
        :list="params.list"
        @handleDeleteComment="handleDeleteComment"
        @handleLikeComment="handleLikeComment"
        @setComments="setComments"
        @replySubmit="replySubmit"
      />
    </template>
    <Dialog
      class="comment-dialog"
      :visible="deleteCommentDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm="deleteCommentConfirm"
      @cancel="deleteCommentCancel"
    >
      <p class="content">确定删除评论？</p>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { addComment, deleteComment, commentLike, replyComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import CommentReplay from '@/components/comment/comment-replay/CommentReplay.vue';
import CommentList from '@/components/comment/comment-list/CommentList.vue';
import Dialog from '@/components/Dialog.vue';
import defaultAvatarImg from '@/assets/image/user/default_avatar.jpg';

export type CommentParams = {
  type: number;
  id: number | string | undefined;
  offset: number;
  limit: number;
  total: number;
  hotList: {
    replyShow: boolean;
    liked: boolean;
    likedCount: number;
  }[];
  list: {
    replyShow: boolean;
    liked: boolean;
    likedCount: number;
  }[];
};

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['onRefresh']);

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);

// 是否清除回复内容
const isClearText = ref(false);

// 顶部评论提交
function submit(replayText: string): void {
  if (!isLogin.value) {
    return;
  }
  if (replayText.length === 0) {
    setMessage({ type: 'error', title: '输入点内容再提交吧' });
    return;
  }
  if (replayText.length > 140) {
    setMessage({ type: 'error', title: '输入不能超过140个字符' });
    return;
  }

  addComment({
    type: props.params.type,
    id: props.params.id,
    content: replayText
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: '评论失败' });
        return;
      }

      // 清空回复内容
      isClearText.value = true;
      emits('onRefresh');
      setMessage({ type: 'info', title: '评论成功' });
      // 延迟重置
      nextTick(() => {
        isClearText.value = false;
      });
    })
    .catch(() => ({}));
}

// 删除评论
const deleteCommentDialog = ref(false);
const deleteCommentId = ref(0);

function handleDeleteComment(commentId: number): void {
  deleteCommentDialog.value = true;
  deleteCommentId.value = commentId;
}

// 删除评论 - 确定
function deleteCommentConfirm(): void {
  deleteComment({
    type: props.params.type,
    id: props.params.id,
    commentId: deleteCommentId.value
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        deleteCommentDialog.value = false;
        setMessage({ type: 'error', title: '删除失败' });
        return;
      }

      deleteCommentDialog.value = false;
      emits('onRefresh');
    })
    .catch(() => ({}));
}

// 删除评论 - 取消
function deleteCommentCancel(): void {
  deleteCommentDialog.value = false;
}

// 点赞(0精彩评论，1最新评论)
function handleLikeComment(t: number, commentId: number, type: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  // 页面静态修改
  let likeIndex = 0;
  if (t === 0) {
    likeIndex = props.params.hotList?.findIndex?.(
      (item: { commentId: number }) => item.commentId === commentId
    );
    if (type === 0) {
      props.params.hotList[likeIndex].liked = false;
      props.params.hotList[likeIndex].likedCount--;
    } else {
      props.params.hotList[likeIndex].liked = true;
      props.params.hotList[likeIndex].likedCount++;
    }
  }
  if (t === 1) {
    likeIndex = props.params.list?.findIndex?.(
      (item: { commentId: number }) => item.commentId === commentId
    );
    if (type === 0) {
      props.params.list[likeIndex].liked = false;
      props.params.list[likeIndex].likedCount--;
    } else {
      props.params.list[likeIndex].liked = true;
      props.params.list[likeIndex].likedCount++;
    }
  }

  // 接口修改
  commentLike({
    type: props.params.type,
    id: props.params.id,
    cid: commentId,
    t: type
  });
}

// 打开当前评论回复框
function setComments(type: number, index: number): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  props.params.hotList?.forEach?.((item: { replyShow: boolean }) => {
    item.replyShow = false;
  });
  props.params.list?.forEach?.((item: { replyShow: boolean }) => {
    item.replyShow = false;
  });

  if (type === 0) {
    props.params.hotList[index].replyShow = true;
  }
  if (type === 1) {
    props.params.list[index].replyShow = true;
  }
}

// 回复提交（精彩评论、最新回复）
function replySubmit(replayText: string, commentId: number): void {
  if (replayText.length === 0) {
    setMessage({ type: 'error', title: '输入点内容再提交吧' });
    return;
  }
  if (replayText.length > 140) {
    setMessage({ type: 'error', title: '输入不能超过140个字符' });
    return;
  }

  replyComment({
    type: props.params.type,
    id: props.params.id,
    content: replayText,
    commentId
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        setMessage({ type: 'error', title: '评论失败' });
        return;
      }

      emits('onRefresh');
      setMessage({ type: 'info', title: '评论成功' });
    })
    .catch(() => ({}));
}
</script>

<style lang="less" scoped>
@import url('./comment.less');
</style>
