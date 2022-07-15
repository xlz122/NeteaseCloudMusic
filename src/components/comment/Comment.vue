<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentParams?.total }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img
        class="user-avatar"
        :src="userInfo?.profile?.avatarUrl || defaultAvatarImg"
        alt=""
      />
      <comment-replay
        class="comment-content-replay"
        :isClearText="isClearText"
        :rows="3"
        @submit="submit"
      />
    </div>
    <!-- 精彩评论(页数1展示) -->
    <template
      v-if="commentParams?.offset <= 1 && commentParams?.hotList?.length > 0"
    >
      <h3 class="comment-list-title">精彩评论</h3>
      <CommentList
        :type="0"
        :list="commentParams.hotList"
        @handleDeleteComment="handleDeleteComment"
        @handleLikeComment="handleLikeComment"
        @setComments="setComments"
        @replySubmit="replySubmit"
      />
    </template>
    <!-- 最新评论 -->
    <template v-if="commentParams?.list?.length > 0">
      <h3 class="comment-list-title" v-if="commentParams?.offset <= 1">
        最新评论({{ commentParams?.total }})
      </h3>
      <CommentList
        :type="1"
        :list="commentParams.list"
        @handleDeleteComment="handleDeleteComment"
        @handleLikeComment="handleLikeComment"
        @setComments="setComments"
        @replySubmit="replySubmit"
      />
    </template>
    <my-dialog
      class="delete-comment-dialog"
      :visible="deleteCommentDialog"
      :confirmtext="'确定'"
      :canceltext="'取消'"
      showConfirmButton
      showCancelButton
      @confirm="deleteCommentConfirm"
      @cancel="deleteCommentCancel"
    >
      <p class="content">确定删除评论？</p>
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick, toRefs } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import {
  addComment,
  deleteComment,
  commentLike,
  replyComment
} from '@api/comment';
import type { ResponseType } from '@/types/types';
import CommentReplay from '@/components/comment/comment-replay/CommentReplay.vue';
import CommentList from '@/components/comment/comment-list/CommentList.vue';
import MyDialog from '@/components/MyDialog.vue';
import defaultAvatarImg from '@assets/image/user/default_avatar.jpg';

export type CommentParams = {
  type: number;
  id: number;
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

export default defineComponent({
  name: 'CommentView',
  components: {
    CommentReplay,
    CommentList,
    MyDialog
  },
  props: {
    commentParams: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['commentRefresh'],
  setup(props, { emit }) {
    const { commentParams } = toRefs(props);

    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);

    // 是否清除回复内容
    const isClearText = ref<boolean>(false);

    // 顶部评论提交
    function submit(replayText: string): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }

      if (replayText.length === 0) {
        setMessage({
          type: 'error',
          title: '输入点内容再提交吧'
        });
        return false;
      }
      if (replayText.length > 140) {
        setMessage({
          type: 'error',
          title: '输入不能超过140个字符'
        });
        return false;
      }

      addComment({
        type: commentParams.value?.type,
        id: commentParams.value?.id,
        content: replayText
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            setMessage({ type: 'info', title: '评论成功' });
            // 清空回复内容
            isClearText.value = true;
            // 延迟重置
            nextTick(() => {
              isClearText.value = false;
            });
            emit('commentRefresh');
          } else {
            setMessage({ type: 'error', title: '评论失败' });
          }
        })
        .catch(() => ({}));
    }

    // 删除评论
    const deleteCommentDialog = ref<boolean>(false);
    const deleteCommentId = ref<number>(0);
    function handleDeleteComment(commentId: number): void {
      deleteCommentDialog.value = true;
      deleteCommentId.value = commentId;
    }

    // 删除评论 - 确定
    function deleteCommentConfirm() {
      deleteComment({
        type: commentParams.value?.type,
        id: props?.commentParams?.id,
        commentId: deleteCommentId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            deleteCommentDialog.value = false;
            emit('commentRefresh');
          } else {
            deleteCommentDialog.value = false;
            setMessage({ type: 'error', title: '删除失败' });
          }
        })
        .catch(() => ({}));
    }

    // 删除评论 - 取消
    function deleteCommentCancel() {
      deleteCommentDialog.value = false;
    }

    // 点赞(0精彩评论，1最新评论)
    function handleLikeComment(
      t: number,
      commentId: number,
      type: number
    ): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      // 页面静态修改
      let likeIndex = 0;
      if (t === 0) {
        likeIndex = commentParams.value.hotList.findIndex(
          (item: { commentId: number }) => item.commentId === commentId
        );
        if (type === 0) {
          commentParams.value.hotList[likeIndex].liked = false;
          commentParams.value.hotList[likeIndex].likedCount--;
        } else {
          commentParams.value.hotList[likeIndex].liked = true;
          commentParams.value.hotList[likeIndex].likedCount++;
        }
      }
      if (t === 1) {
        likeIndex = commentParams.value.list.findIndex(
          (item: { commentId: number }) => item.commentId === commentId
        );
        if (type === 0) {
          commentParams.value.list[likeIndex].liked = false;
          commentParams.value.list[likeIndex].likedCount--;
        } else {
          commentParams.value.list[likeIndex].liked = true;
          commentParams.value.list[likeIndex].likedCount++;
        }
      }

      // 接口修改
      commentLike({
        type: commentParams.value?.type,
        id: props?.commentParams?.id,
        cid: commentId,
        t: type
      });
    }

    // 打开当前评论回复框
    function setComments(type: number, index: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      commentParams.value.hotList.forEach((item: { replyShow: boolean }) => {
        item.replyShow = false;
      });
      commentParams.value.list.forEach((item: { replyShow: boolean }) => {
        item.replyShow = false;
      });

      if (type === 0) {
        commentParams.value.hotList[index].replyShow = true;
      }
      if (type === 1) {
        commentParams.value.list[index].replyShow = true;
      }
    }

    // 回复提交（精彩评论、最新回复）
    function replySubmit(
      replayText: string,
      commentId: number
    ): boolean | undefined {
      if (replayText.length === 0) {
        setMessage({
          type: 'error',
          title: '输入点内容再提交吧'
        });
        return false;
      }
      if (replayText.length > 140) {
        setMessage({
          type: 'error',
          title: '输入不能超过140个字符'
        });
        return false;
      }

      replyComment({
        type: commentParams.value?.type,
        id: props?.commentParams?.id,
        content: replayText,
        commentId
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            setMessage({ type: 'info', title: '评论成功' });
            emit('commentRefresh');
          } else {
            setMessage({ type: 'error', title: '评论失败' });
          }
        })
        .catch(() => ({}));
    }

    return {
      defaultAvatarImg,
      userInfo,
      isClearText,
      submit,
      handleDeleteComment,
      deleteCommentDialog,
      deleteCommentConfirm,
      deleteCommentCancel,
      handleLikeComment,
      setComments,
      replySubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./comment.less');
</style>
