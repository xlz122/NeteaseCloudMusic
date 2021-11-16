<template>
  <ul class="comment-list">
    <li class="item" v-for="(item, index) in list" :key="index">
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
            <span>:</span>
            <span v-html="item?.content"></span>
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
              <span>:</span>
              <span v-html="i?.content"></span>
            </template>
            <template v-if="i.status === -5">
              <span class="text delete-text">该评论已删除</span>
            </template>
          </div>
        </template>
        <div class="item-operate">
          <span class="time">{{ formatDate(item?.time) }}</span>
          <div class="reply-operate">
            <template v-if="isDelete(item.user.userId)">
              <span class="delete" @click="deleteCommentList(item.commentId)">
                删除
              </span>
              <span class="delete-line">|</span>
            </template>
            <!-- 点赞 -->
            <i
              class="like liked"
              v-if="item.liked"
              @click="songSheetLikeList(type, item.commentId, 0)"
            ></i>
            <i
              class="like no-like"
              v-else
              @click="songSheetLikeList(type, item.commentId, 1)"
            ></i>
            <span class="like-num" v-if="item.likedCount > 0">
              ({{ item.likedCount }})
            </span>
            <span class="line">|</span>
            <span class="reply" @click="setComments(index)"> 回复 </span>
          </div>
        </div>
        <!-- 回复他人 -->
        <div class="comment-content-reply-others" v-if="item?.replyShow">
          <comment-replay
            class="comment-content-replay"
            :rows="1"
            :nickname="item?.user?.nickname"
            @submit="replySubmit($event, item.commentId)"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@utils/utils';
import CommentReplay from '@/components/comment/comment-replay/CommentReplay.vue';

export default defineComponent({
  components: {
    CommentReplay
  },
  props: {
    // 0: 精彩评论 1: 最新评论
    type: {
      type: Number,
      default: 0
    },
    list: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'deleteCommentList',
    'songSheetLikeList',
    'setComments',
    'replySubmit'
  ],
  setup(props, { emit }) {
    const $store = useStore();

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 是否显示删除按钮
    function isDelete(userId: number): boolean | undefined {
      if (!isLogin.value) {
        return false;
      }
      if (userInfo.value.profile.userId === userId) {
        return true;
      }
      return false;
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 删除评论
    function deleteCommentList(commentId: number): void {
      emit('deleteCommentList', commentId);
    }

    // 点赞
    function songSheetLikeList(
      t: number,
      commentId: number,
      type: number
    ): void {
      emit('songSheetLikeList', t, commentId, type);
    }

    // 打开当前评论回复框
    function setComments(index: number): void {
      emit('setComments', props.type, index);
    }

    // 回复提交（精彩评论、最新回复）
    function replySubmit(replayText: string, commentId: number): void {
      emit('replySubmit', replayText, commentId);
    }

    return {
      formatDate,
      isDelete,
      jumpUserProfile,
      deleteCommentList,
      songSheetLikeList,
      setComments,
      replySubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment-list.less';
</style>
