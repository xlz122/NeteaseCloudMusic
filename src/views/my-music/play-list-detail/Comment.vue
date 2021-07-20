<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentTotal }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img
        class="user-avatar"
        :src="songSheetDetail?.playlist?.creator?.avatarUrl"
      />
      <comment-replay
        class="comment-content-replay"
        :clearText="commentClearText"
        :rows="3"
        @submit="commentSubmit"
      />
    </div>
    <!-- 精彩评论 -->
    <h3 class="comment-list-title" v-if="hotCommentsList?.length > 0">
      精彩评论
    </h3>
    <ul class="comment-list" v-if="hotCommentsList?.length > 0">
      <li class="item" v-for="(item, index) in hotCommentsList" :key="index">
        <img class="user-avatar" :src="item?.user?.avatarUrl" />
        <div class="item-right">
          <div class="detail-text">
            <span class="name">
              {{ item?.user?.nickname }}
            </span>
            <span class="text">: {{ item?.content }}</span>
          </div>
          <!-- 他人回复部分 -->
          <template v-if="item?.beReplied.length > 0">
            <div
              class="comment-content-detail"
              v-for="(i, ind) in item?.beReplied"
              :key="ind"
            >
              <template v-if="i.status === 0">
                <span class="name">
                  {{ i?.user?.nickname }}
                </span>
                <span class="text">: {{ i?.content }}</span>
              </template>
              <template v-if="i.status === -5">
                <span class="text delete-text">该评论已删除</span>
              </template>
            </div>
          </template>
          <div class="item-operate">
            <span class="time">{{ formatDate(item?.time) }}</span>
            <div class="reply-operate">
              <span class="delete" @click="deleteCommentList(item.commentId)">
                删除
              </span>
              <span class="delete-line">|</span>
              <!-- 点赞 -->
              <i
                class="like liked"
                v-if="item.liked"
                @click="songSheetLikeList(item.commentId, 0)"
              ></i>
              <i
                class="like no-like"
                v-else
                @click="songSheetLikeList(item.commentId, 1)"
              ></i>
              <span class="like-num" v-if="item.likedCount > 0">
                ({{ item.likedCount }})
              </span>
              <span class="line">|</span>
              <span class="reply" @click="setHotComments(index)"> 回复 </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply-others" v-if="item?.replyShow">
            <comment-replay
              class="comment-content-replay"
              :rows="1"
              :width="567"
              :nickname="item?.user?.nickname"
              @submit="replySubmit($event, item.commentId)"
            />
          </div>
        </div>
      </li>
    </ul>
    <!-- 最新评论 -->
    <h3 class="comment-list-title" v-if="commentList?.length > 0">
      最新评论({{ commentTotal }})
    </h3>
    <ul class="comment-list" v-if="commentList?.length > 0">
      <li class="item" v-for="(item, index) in commentList" :key="index">
        <img class="user-avatar" :src="item?.user?.avatarUrl" />
        <div class="item-right">
          <div class="detail-text">
            <span class="name">
              {{ item?.user?.nickname }}
            </span>
            <span class="colon">:</span>
            <div class="text" v-html="item.content"></div>
          </div>
          <!-- 他人回复部分 -->
          <template v-if="item?.beReplied.length > 0">
            <div
              class="comment-content-detail"
              v-for="(i, ind) in item?.beReplied"
              :key="ind"
            >
              <template v-if="i.status === 0">
                <span class="name">
                  {{ i?.user?.nickname }}
                </span>
                <span class="colon">:</span>
                <span class="text" v-html="item?.beReplied[0]?.content"></span>
              </template>
              <template v-if="i.status === -5">
                <span class="text delete-text">该评论已删除</span>
              </template>
            </div>
          </template>
          <div class="item-operate">
            <span class="time">{{ formatDate(item?.time) }}</span>
            <div class="reply-operate">
              <!-- 只能删除自己的评论 -->
              <span
                v-if="item?.user?.userId === userInfo?.profile?.userId"
                class="delete"
                @click="deleteCommentList(item.commentId)"
              >
                删除
              </span>
              <span
                v-if="item?.user?.userId === userInfo?.profile?.userId"
                class="delete-line"
              >
                |
              </span>
              <!-- 点赞 -->
              <i
                class="like liked"
                v-if="item.liked"
                @click="songSheetLikeList(item.commentId, 0)"
              ></i>
              <i
                class="like no-like"
                v-else
                @click="songSheetLikeList(item.commentId, 1)"
              ></i>
              <span class="like-num" v-if="item.likedCount > 0">
                ({{ item.likedCount }})
              </span>
              <span class="line">|</span>
              <span class="reply" @click="setNewestComment(index)"> 回复 </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply-others" v-if="item?.replyShow">
            <comment-replay
              class="comment-content-replay"
              :rows="1"
              :width="567"
              :nickname="item?.user?.nickname"
              @submit="replySubmit($event, item.commentId)"
            />
          </div>
        </div>
      </li>
    </ul>
    <!-- 删除歌曲弹框 -->
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
import { defineComponent, ref, watch, computed, nextTick } from 'vue';
import { useStore } from 'vuex';
import MyDialog from '@/components/MyDialog.vue';
import CommentReplay from '@/components/comment-replay/CommentReplay.vue';
import {
  commentPlayList,
  addSongSheetComment,
  deleteSongSheetComment,
  songSheetLike,
  replySongSheetComment
} from '@api/my-music';
import { ResponseType, LoopType } from '@/types/types';
import { formatDate } from '@utils/utils';
import { formatMixedText } from '@utils/formatMixedText';

export default defineComponent({
  components: {
    MyDialog,
    CommentReplay
  },
  props: {
    songSheetDetail: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: { songSheetDetail: ResponseType }) {
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 播放列表更新，重新请求评论数据
    watch(
      () => props.songSheetDetail,
      () => {
        getCommentPlayList();
      },
      {
        immediate: true
      }
    );

    // 获取评论列表
    const hotCommentsList = ref<LoopType>([]);
    const commentList = ref<LoopType>([]);
    const commentTotal = ref<number>(0);
    function getCommentPlayList(): void {
      commentPlayList({
        id: props?.songSheetDetail?.playlist?.id
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 精彩评论
          res.hotComments.forEach((item: LoopType) => {
            item.replyShow = false;
            item.content = formatMixedText(item.content);
            // 他人回复也进行转换
            if (item.beReplied[0]) {
              item.beReplied[0].content = formatMixedText(
                item?.beReplied[0]?.content
              );
            }
          });
          hotCommentsList.value = res.hotComments;
          // 最新评论
          res.comments.forEach((item: LoopType) => {
            item.replyShow = false;
            item.content = formatMixedText(item.content);
            // 他人回复也进行转换
            if (item.beReplied[0]) {
              item.beReplied[0].content = formatMixedText(
                item?.beReplied[0]?.content
              );
            }
          });
          commentList.value = res.comments;
          // 最新评论 - 总数
          commentTotal.value = res.total;
        }
      });
    }

    // 是否清除回复内容
    const commentClearText = ref<boolean>(false);

    // 顶部评论提交
    function commentSubmit(replayText: string): boolean | undefined {
      if (replayText.length === 0) {
        $store.commit('setMessage', {
          type: 'error',
          title: '输入点内容再提交吧'
        });
        return false;
      }
      if (replayText.length > 140) {
        $store.commit('setMessage', {
          type: 'error',
          title: '输入不能超过140个字符'
        });
        return false;
      }
      addSongSheetComment({
        id: props?.songSheetDetail?.playlist?.id,
        content: replayText
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 评论成功提醒
          $store.commit('setMessage', { type: 'info', title: '评论成功' });
          // 清空回复内容
          commentClearText.value = true;
          getCommentPlayList();
          // 延迟重置
          nextTick(() => {
            commentClearText.value = false;
          });
        } else {
          // 评论失败提醒
          $store.commit('setMessage', { type: 'error', title: '评论失败' });
        }
      });
    }

    // 精彩评论
    function setHotComments(index: number): void {
      // 关闭最新评论
      commentList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      hotCommentsList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      hotCommentsList.value[index].replyShow = true;
    }

    // 最新评论
    function setNewestComment(index: number): void {
      // 关闭精彩评论
      hotCommentsList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      commentList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      commentList.value[index].replyShow = true;
    }

    // 删除评论
    const deleteCommentDialog = ref<boolean>(false);
    const deleteCommentId = ref<number>(0);
    function deleteCommentList(commentId: number): void {
      deleteCommentDialog.value = true;
      deleteCommentId.value = commentId;
    }

    // 删除评论 - 确定
    function deleteCommentConfirm() {
      deleteSongSheetComment({
        id: props?.songSheetDetail?.playlist?.id,
        commentId: deleteCommentId.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          deleteCommentDialog.value = false;
          getCommentPlayList();
        }
      });
    }

    // 删除评论 - 确定
    function deleteCommentCancel() {
      deleteCommentDialog.value = false;
    }

    // 点赞
    function songSheetLikeList(commentId: number, type: number): void {
      // 页面静态修改
      const likeIndex = commentList.value.findIndex(
        (item: LoopType) => item.commentId === commentId
      );
      if (type === 0) {
        commentList.value[likeIndex].liked = false;
        commentList.value[likeIndex].likedCount--;
      } else {
        commentList.value[likeIndex].liked = true;
        commentList.value[likeIndex].likedCount++;
      }
      // 接口修改
      songSheetLike({
        id: props?.songSheetDetail?.playlist?.id,
        cid: commentId,
        t: type
      });
    }

    // 回复提交（精彩评论、最新回复）
    function replySubmit(
      replayText: string,
      commentId: number
    ): boolean | undefined {
      if (replayText.length === 0) {
        $store.commit('setMessage', {
          type: 'error',
          title: '输入点内容再提交吧'
        });
        return false;
      }
      if (replayText.length > 140) {
        $store.commit('setMessage', {
          type: 'error',
          title: '输入不能超过140个字符'
        });
        return false;
      }
      replySongSheetComment({
        id: props?.songSheetDetail?.playlist?.id,
        content: replayText,
        commentId
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 评论成功提醒
          $store.commit('setMessage', { type: 'info', title: '评论成功' });
          getCommentPlayList();
        } else {
          // 评论失败提醒
          $store.commit('setMessage', { type: 'error', title: '评论失败' });
        }
      });
    }
    return {
      userInfo,
      formatDate,
      commentClearText,
      commentSubmit,
      hotCommentsList,
      setHotComments,
      setNewestComment,
      commentList,
      commentTotal,
      deleteCommentList,
      deleteCommentDialog,
      deleteCommentConfirm,
      deleteCommentCancel,
      songSheetLikeList,
      replySubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment.less';
</style>
