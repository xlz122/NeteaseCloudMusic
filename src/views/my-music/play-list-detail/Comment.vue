<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentTotal }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img
        class="user-avatar"
        :src="playDetailData?.playlist?.creator?.avatarUrl"
      />
      <textarea
        class="comment-textarea"
        v-model="commentText"
        placeholder="评论"
      ></textarea>
    </div>
    <div class="operate">
      <div class="operate-icon">
        <i class="icon expression"></i>
        <i class="icon att"></i>
      </div>
      <div class="operate-publish">
        <span class="text" :class="{ 'words-beyond': commentTextLength < 0 }">
          {{ commentTextLength }}
        </span>
        <button class="publish" @click="commentSubmit">评论</button>
      </div>
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
              <span class="reply" @click="replyComment(item.commentId, index)">
                回复
              </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply" v-if="item?.replyShow || false">
            <div class="comment-content">
              <textarea
                class="comment-textarea"
                v-model="replyText"
                :placeholder="`回复${item?.user?.nickname}`"
              ></textarea>
            </div>
            <div class="operate">
              <div class="operate-icon">
                <i class="icon expression"></i>
                <i class="icon att"></i>
              </div>
              <div class="operate-publish">
                <span
                  class="text"
                  :class="{ 'words-beyond': replyTextLength < 0 }"
                >
                  {{ replyTextLength }}
                </span>
                <button class="publish" @click="replySubmit">评论</button>
              </div>
            </div>
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
              <span class="reply" @click="replyComment(item.commentId, index)">
                回复
              </span>
            </div>
          </div>
          <!-- 回复他人 -->
          <div class="comment-content-reply" v-if="item?.replyShow || false">
            <div class="comment-content">
              <textarea
                class="comment-textarea"
                v-model="replyText"
                :placeholder="`回复${item?.user?.nickname}`"
              ></textarea>
            </div>
            <div class="operate">
              <div class="operate-icon">
                <i class="icon expression"></i>
                <i class="icon att"></i>
              </div>
              <div class="operate-publish">
                <span
                  class="text"
                  :class="{ 'words-beyond': replyTextLength < 0 }"
                >
                  {{ replyTextLength }}
                </span>
                <button class="publish" @click="replySubmit">评论</button>
              </div>
            </div>
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
import { defineComponent, ref, watch, onMounted } from 'vue';
import MyDialog from '@/components/MyDialog.vue';
import {
  commentPlayList,
  addSongSheetComment,
  deleteSongSheetComment,
  songSheetLike,
  replySongSheetComment
} from '@api/my-music';
import { formatDate } from '@utils/utils';
import { ResponseType, LoopType } from '@/types/types';

export default defineComponent({
  components: {
    MyDialog
  },
  props: ({
    playDetailData: {
      type: Object,
      default: {}
    }
  } as unknown) as undefined,
  setup(props: { playDetailData: ResponseType }) {
    // 播放列表更新，重新请求评论数据
    watch(
      () => props.playDetailData,
      () => {
        getCommentPlayList();
      }
    );

    // 评论内容
    const commentText = ref<string>('');

    // 监听最大可以输入数量
    const commentTextLength = ref<number>(140);
    watch(
      () => commentText.value,
      (curVal: string) => {
        commentTextLength.value = 140 - curVal.length;
      }
    );

    // 评论提交
    function commentSubmit(): boolean | undefined {
      if (commentTextLength.value === 0) {
        alert('输入点内容再提交吧');
        return false;
      }
      if (commentTextLength.value < 0) {
        alert('输入不能超过140个字符');
        return false;
      }
      addSongSheetComment({
        id: props?.playDetailData?.playlist?.id,
        content: commentText.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          commentText.value = '';
          getCommentPlayList();
        }
      });
    }

    // 获取评论列表
    const hotCommentsList = ref<LoopType>([]);
    const commentList = ref<LoopType>([]);
    const commentTotal = ref<number>(0);
    function getCommentPlayList(): void {
      commentPlayList({
        id: props?.playDetailData?.playlist?.id
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 精彩评论
          res.hotComments.forEach((item: LoopType) => {
            item.replyShow = false;
          });
          hotCommentsList.value = res.hotComments;
          // 最新评论
          res.comments.forEach((item: LoopType) => {
            item.replyShow = false;
          });
          commentList.value = res.comments;
          // 最新评论 - 总数
          commentTotal.value = res.total;
        }
      });
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
        id: props?.playDetailData?.playlist?.id,
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
        id: props?.playDetailData?.playlist?.id,
        cid: commentId,
        t: type
      });
    }

    // 回复
    // 回复内容
    const replyText = ref<string>('');

    // 监听最大可以输入数量
    const replyTextLength = ref<number>(140);
    watch(
      () => replyText.value,
      (curVal: string) => {
        replyTextLength.value = 140 - curVal.length;
      }
    );

    // 显示回复框
    const replyCommentId = ref<number>(0);
    function replyComment(commentId: number, index: number): void {
      commentList.value.forEach((item: LoopType) => {
        item.replyShow = false;
      });
      commentList.value[index].replyShow = true;
      replyCommentId.value = commentId;
    }

    // 回复提交
    function replySubmit(): void {
      replySongSheetComment({
        id: props?.playDetailData?.playlist?.id,
        content: replyText.value,
        commentId: replyCommentId.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          replyText.value = '';
          getCommentPlayList();
        }
      });
    }
    return {
      formatDate,
      commentText,
      commentTextLength,
      commentSubmit,
      hotCommentsList,
      commentList,
      commentTotal,
      deleteCommentList,
      deleteCommentDialog,
      deleteCommentConfirm,
      deleteCommentCancel,
      songSheetLikeList,
      replyText,
      replyTextLength,
      replyComment,
      replySubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment.less';
</style>
