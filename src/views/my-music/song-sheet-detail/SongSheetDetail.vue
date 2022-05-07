<template>
  <div class="song-sheet-detail">
    <UserInfo class="user-info" @jumpToComments="jumpToComments" />
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-track">
        {{ songSheetDetail?.playlist?.trackCount }}首歌
      </span>
      <div
        class="title-play-num"
        v-if="songSheetDetail?.playlist?.tracks.length > 0"
      >
        播放:
        <span class="eye-catching">
          {{ songSheetDetail?.playlist?.playCount }}
        </span>
        次
      </div>
    </div>
    <MusicTable class="music-table" />
    <div class="comment-component">
      <Comment
        :commentParams="commentParams"
        @commentRefresh="commentRefresh"
      />
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
import { defineComponent, reactive, computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { playListDetail } from '@api/my-music';
import { commentPlayList } from '@api/comment';
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

    // 歌单id
    const songSheetId = computed<number>(() => $store.getters.songSheetId);
    // 歌单详情
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );

    watch(
      () => songSheetId.value,
      () => {
        nextTick(() => {
          getSongSheetDetail();
          getCommentData();
        });
      }
    );

    // 获取歌单详情
    function getSongSheetDetail(): void {
      playListDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            if (res?.playlist?.name.includes('喜欢的音乐')) {
              res.playlist.name = '我喜欢的音乐';
            }
            $store.commit('music/setSongSheetDetail', res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转至评论
    function jumpToComments(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      const myMusicDom = document.querySelector('.my-music') as HTMLElement;
      myMusicDom?.scrollTo(0, Number(commentDom.offsetTop) - 40);
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 2,
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
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
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

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    return {
      songSheetDetail,
      jumpToComments,
      commentParams,
      commentRefresh,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-detail.less';
</style>
