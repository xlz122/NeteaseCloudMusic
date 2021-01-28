<template>
  <div class="list-title">
    <h3 class="title-text">评论</h3>
    <span class="title-text-num">共{{ commentList?.length }}条评论</span>
  </div>
  <div class="detail-comment" v-if="commentList?.length > 0">
    <div class="comment-content">
      <img
        class="user-avatar"
        :src="playDetailData?.playlist?.creator?.avatarUrl"
      />
      <textarea class="comment-textarea" placeholder="评论"></textarea>
    </div>
    <div class="operate">
      <div class="operate-icon">
        <i class="icon expression"></i>
        <i class="icon att"></i>
      </div>
      <div class="operate-publish">
        <span class="text">140</span>
        <button class="publish">评论</button>
      </div>
    </div>
    <h3 class="comment-list-title">最新评论({{ commentList?.length }})</h3>
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
          <template v-if="item?.beReplied.length > 0">
            <div
              class="comment-content-detail"
              v-for="(i, ind) in item?.beReplied"
              :key="ind"
            >
              <span class="name">
                {{ i?.user?.nickname }}
              </span>
              <span class="text">: {{ i?.content }}</span>
            </div>
          </template>
          <div class="item-operate">
            <span class="time">{{ formatDate(item?.time) }}</span>
            <div class="reply-operate">
              <span class="delete">删除</span>
              <span class="delete-line">|</span>
              <i class="give"></i>
              <span class="line">|</span>
              <span class="reply">回复</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { commentPlayList } from '@api/my-music';
import { formatDate } from '@utils/utils';
import { ResponseType } from '@/types/types';

export default defineComponent({
  props: ({
    playDetailData: {
      type: Object,
      default: {}
    }
  } as unknown) as undefined,
  setup(props: { playDetailData: ResponseType }) {
    // 获取评论列表
    const commentList = ref<unknown>([]);
    function getCommentPlayList() {
      commentPlayList({
        id: props.playDetailData.playlist.id
      }).then((res: ResponseType) => {
        console.log(res);
        if (res.code === 200) {
          commentList.value = res.comments;
        }
      });
    }
    onMounted(() => {
      getCommentPlayList();
    });
    return {
      formatDate,
      commentList
    };
  }
});
</script>

<style lang="less" scoped>
@import './comment.less';
</style>
