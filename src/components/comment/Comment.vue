<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentParams.total }}条评论</span>
  </div>
  <div class="detail-comment">
    <div class="comment-content">
      <img class="user-avatar" :src="userInfo?.profile?.avatarUrl" />
      <comment-replay
        class="comment-content-replay"
        :clearText="commentClearText"
        :rows="3"
        @submit="commentSubmit"
      />
    </div>
    <!-- 精彩评论(页数1展示) -->
    <template
      v-if="commentParams.offset <= 1 && commentParams.hotList?.length > 0"
    >
      <h3 class="comment-list-title">精彩评论</h3>
      <ul class="comment-list">
        <li
          class="item"
          v-for="(item, index) in commentParams.hotList"
          :key="index"
        >
          <img
            class="user-avatar"
            :src="item?.user?.avatarUrl"
            @click="jumpUserProfile(item?.user?.userId)"
          />
          <div class="item-right">
            <div class="detail-text">
              <span class="text">
                <span class="name" @click="jumpUserProfile(item?.user?.userId)">
                  {{ item?.user?.nickname }}
                </span>
                : {{ item?.content }}
              </span>
            </div>
            <!-- 他人回复部分 -->
            <template v-if="item?.beReplied.length > 0">
              <div
                class="comment-content-detail"
                v-for="(i, ind) in item?.beReplied"
                :key="ind"
              >
                <template v-if="i.status === 0">
                  <span class="name" @click="jumpUserProfile(i?.user?.userId)">
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
    </template>
    <!-- 最新评论 -->
    <h3
      class="comment-list-title"
      v-if="commentParams.offset <= 1 && commentParams.list?.length > 0"
    >
      最新评论({{ commentParams.total }})
    </h3>
    <ul class="comment-list" v-if="commentParams.list?.length > 0">
      <li class="item" v-for="(item, index) in commentParams.list" :key="index">
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
/* eslint-disable */
import { defineComponent, ref, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  // commentPlayList,
  addSongSheetComment,
  deleteSongSheetComment,
  // songSheetLike,
  replySongSheetComment
} from '@api/my-music';
import { ResponseType } from '@/types/types';
import { formatDate } from '@utils/utils';
import CommentReplay from '@/components/comment/comment-replay/CommentReplay.vue';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  components: {
    CommentReplay,
    MyDialog
  },
  props: {
    commentParams: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const $router = useRouter();
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 跳转用户资料
    function jumpUserProfile(userId: number) {
      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);
      $router.push({ name: 'user-profile', params: { userId } });
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
        id: props?.commentParams?.id,
        content: replayText
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 评论成功提醒
          $store.commit('setMessage', { type: 'info', title: '评论成功' });
          // 清空回复内容
          commentClearText.value = true;
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
      // commentParams.list.forEach((item: LoopType) => {
      //   item.replyShow = false;
      // });
      // commentParams.hotList.forEach((item: LoopType) => {
      //   item.replyShow = false;
      // });
      // commentParams.hotList[index].replyShow = true;
    }

    // 最新评论
    function setNewestComment(index: number): void {
      // 关闭精彩评论
      // commentParams.hotList.forEach((item: LoopType) => {
      //   item.replyShow = false;
      // });
      // commentParams.list.forEach((item: LoopType) => {
      //   item.replyShow = false;
      // });
      // commentParams.list[index].replyShow = true;
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
        id: props?.commentParams?.id,
        commentId: deleteCommentId.value
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          deleteCommentDialog.value = false;
        } else {
          deleteCommentDialog.value = false;
          $store.commit('setMessage', {
            type: 'error',
            title: '删除失败'
          });
        }
      });
    }

    // 删除评论 - 取消
    function deleteCommentCancel() {
      deleteCommentDialog.value = false;
    }

    // 点赞
    function songSheetLikeList(commentId: number, type: number): void {
      // // 页面静态修改
      // const likeIndex = commentParams.list.findIndex(
      //   (item: LoopType) => item.commentId === commentId
      // );
      // if (type === 0) {
      //   commentParams.list[likeIndex].liked = false;
      //   commentParams.list[likeIndex].likedCount--;
      // } else {
      //   commentParams.list[likeIndex].liked = true;
      //   commentParams.list[likeIndex].likedCount++;
      // }
      // // 接口修改
      // songSheetLike({
      //   id: props?.songSheetDetail?.playlist?.id,
      //   cid: commentId,
      //   t: type
      // });
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
        id: props?.commentParams?.id,
        content: replayText,
        commentId
      }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 评论成功提醒
          $store.commit('setMessage', { type: 'info', title: '评论成功' });
        } else {
          // 评论失败提醒
          $store.commit('setMessage', { type: 'error', title: '评论失败' });
        }
      });
    }

    return {
      formatDate,
      jumpUserProfile,
      userInfo,
      commentClearText,
      commentSubmit,
      setHotComments,
      setNewestComment,
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
