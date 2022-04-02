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
            <template v-if="i?.status === -5 || i?.status === -10">
              <span class="text delete-text">该评论已删除</span>
            </template>
          </div>
        </template>
        <div class="item-operate">
          <span class="time">{{ formatDate(item?.time) }}</span>
          <div class="reply-operate">
            <!-- 登录用户才有删除 -->
            <template v-if="userInfo?.profile.userId === item?.user?.userId">
              <span
                class="delete"
                @click="handleDeleteComment(item?.commentId)"
              >
                删除
              </span>
              <span class="delete-line">|</span>
            </template>
            <!-- 点赞 -->
            <i
              class="like liked"
              v-if="item?.liked"
              @click="handleLikeComment(type, item?.commentId, 0)"
            ></i>
            <i
              class="like no-like"
              v-else
              @click="handleLikeComment(type, item?.commentId, 1)"
            ></i>
            <span class="like-num" v-if="item?.likedCount > 0">
              ({{ item?.likedCount }})
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
            @submit="replySubmit($event, item?.commentId)"
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
    'handleDeleteComment',
    'handleLikeComment',
    'setComments',
    'replySubmit'
  ],
  setup(props, { emit }) {
    const $store = useStore();

    const userInfo = computed(() => $store.getters.userInfo);

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 删除评论
    function handleDeleteComment(commentId: number): void {
      emit('handleDeleteComment', commentId);
    }

    // 点赞
    function handleLikeComment(
      t: number,
      commentId: number,
      type: number
    ): void {
      emit('handleLikeComment', t, commentId, type);
    }

    // 打开当前评论回复框
    function setComments(index: number): void {
      emit('setComments', props.type, index);
    }

    // 回复提交
    function replySubmit(replayText: string, commentId: number): void {
      emit('replySubmit', replayText, commentId);
    }

    return {
      formatDate,
      userInfo,
      jumpUserProfile,
      handleDeleteComment,
      handleLikeComment,
      setComments,
      replySubmit
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment-list.less';
</style>
