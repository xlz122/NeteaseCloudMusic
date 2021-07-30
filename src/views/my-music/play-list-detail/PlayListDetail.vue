<template>
  <div class="play-list-main">
    <!-- 个人信息部分 -->
    <UserInfo class="user-info" @commentClick="commentClick" />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="songSheetDetail?.playlist?.tracks.length > 0"
      >
        播放:
        <span class="eye-catching">{{
          songSheetDetail?.playlist?.playCount
        }}</span>
        次
      </div>
    </div>
    <!-- 音乐列表 -->
    <MusicTable class="music-table" />
    <!-- 评论 -->
    <div class="comment-component">
      <comment :commentParams="commentParams" />
      <!-- 参数从0开始，分页需从1开始 -->
      <Page
        v-if="commentParams.total > commentParams.limit"
        :page="commentParams.offset"
        :pageSize="commentParams.limit"
        :total="commentParams.total"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { commentPlayList } from '@api/my-music';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@components/comment/Comment.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    UserInfo,
    MusicTable,
    Comment,
    Page
  },
  setup() {
    const $store = useStore();

    // 歌单详情
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );

    // 歌单id
    const songSheetId = computed(() => $store.getters['music/songSheetId']);

    // 监听路由传参，获取歌曲评论
    watch(
      () => songSheetId.value,
      curVal => {
        if (curVal) {
          getCommentData();
        }
      }
    );

    // 评论
    function commentClick(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      const myMusicDom = document.querySelector('.my-music') as HTMLElement;
      // 标题高度
      myMusicDom.scrollTo(0, Number(commentDom.offsetTop) - 36);
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      id: songSheetId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: songSheetId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = commentParams.offset;
      }
      commentPlayList({ ...params })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            const result = handleCommentData(res);
            // 精彩评论
            commentParams.hotList = result.hotList;
            // 最新评论
            commentParams.list = result.list;
            // 最新评论 - 总数
            commentParams.total = res.total;
          }
        })
        .catch(() => ({}));
    }
    getCommentData();

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    return {
      songSheetDetail,
      commentClick,
      commentParams,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
