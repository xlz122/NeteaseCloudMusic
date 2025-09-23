<template>
  <ul class="comment-list">
    <li class="item" v-for="(item, index) in list" :key="index">
      <img
        class="user-avatar"
        :src="item.user?.avatarUrl"
        @click="jumpUserProfile(item.user?.userId)"
        alt=""
      />
      <div class="item-right">
        <div class="detail-text">
          <span class="name" @click="jumpUserProfile(item.user?.userId)">
            {{ item.user?.nickname }}
          </span>
          <template v-if="item.user?.avatarDetail">
            <img class="icon-identity" :src="item.user?.avatarDetail?.identityIconUrl" alt="" />
          </template>
          <template v-if="item.user?.vipRights?.redplus?.iconUrl">
            <img class="icon-svip" :src="item.user?.vipRights?.redplus?.iconUrl" alt="" />
          </template>
          <template v-else>
            <img class="icon-vip" :src="item.user?.vipRights?.associator?.iconUrl" alt="" />
          </template>
          <span class="symbol">:</span>
          <span v-html="item.content"></span>
        </div>
        <!-- 他人回复部分 -->
        <template v-if="item.beReplied?.length > 0">
          <div class="comment-content-detail" v-for="(i, ind) in item.beReplied" :key="ind">
            <template v-if="i.status === 0">
              <span class="name" @click="jumpUserProfile(i.user?.userId)">
                {{ i.user?.nickname }}
              </span>
              <span class="symbol">:</span>
              <span v-html="i.content"></span>
            </template>
            <template v-if="i.status === -5 || i.status === -10">
              <span class="text delete-text">该评论已删除</span>
            </template>
          </div>
        </template>
        <div class="item-operate">
          <span class="time">{{ formatDate(item.time) }}</span>
          <div class="reply-operate">
            <!-- 登录用户才有删除 -->
            <template v-if="userInfo.profile?.userId === item.user?.userId">
              <span class="delete" @click="handleDeleteComment(item.commentId)"> 删除 </span>
              <span class="delete-line">|</span>
            </template>
            <i
              class="like liked"
              v-if="item.liked"
              @click="handleLikeComment(type, item.commentId, 0)"
            ></i>
            <i class="like no-like" v-else @click="handleLikeComment(type, item.commentId, 1)"></i>
            <span class="like-num" v-if="item.likedCount > 0"> ({{ item.likedCount }}) </span>
            <span class="line">|</span>
            <span class="reply" @click="setComments(Number(index))"> 回复 </span>
          </div>
        </div>
        <!-- 回复他人 -->
        <div class="comment-content-reply-others" v-if="item.replyShow">
          <comment-replay
            class="comment-content-replay"
            :rows="1"
            :nickname="item.user?.nickname"
            @submit="replySubmit($event, item.commentId)"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/utils';
import CommentReplay from '@/components/comment/comment-replay/CommentReplay.vue';

const props = defineProps({
  // 0: 精彩评论 1: 最新评论
  type: {
    type: Number,
    default: 0
  },
  list: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits([
  'handleDeleteComment',
  'handleLikeComment',
  'setComments',
  'replySubmit'
]);

const router = useRouter();
const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

// 删除
function handleDeleteComment(commentId: number): void {
  emits('handleDeleteComment', commentId);
}

// 点赞
function handleLikeComment(t: number, commentId: number, type: number): void {
  emits('handleLikeComment', t, commentId, type);
}

// 打开当前评论回复
function setComments(index: number): void {
  emits('setComments', props.type, index);
}

// 回复提交
function replySubmit(replayText: string, commentId: number): void {
  emits('replySubmit', replayText, commentId);
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./comment-list.less');
</style>
