<template>
  <div class="song-sheet-detail">
    <div class="detail-container">
      <div class="detail-content">
        <UserInfo class="user-info" @jumpToComment="jumpToComment" />
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num">
            {{ songSheetDetail?.playlist?.trackCount }}首歌
          </span>
          <div class="title-right">
            <div
              class="out"
              v-if="songSheetDetail?.playlist?.tracks.length > 0"
            >
              <i class="icon"></i>
              <a
                class="link"
                :href="`https://music.163.com/#/outchain/0/${songSheetId}`"
              >
                生成外链播放器
              </a>
            </div>
            <div class="title-play-num">
              播放:
              <span
                class="eye-catching"
                v-if="songSheetDetail?.playlist?.tracks.length > 0"
              >
                {{ songSheetDetail?.playlist?.playCount }}
              </span>
              <span class="eye-catching" v-else>0</span>
              次
            </div>
          </div>
        </div>
        <MusicTable class="music-table" />
        <div class="playlist-see-more">
          <div class="text">查看更多内容，请下载客户端</div>
          <router-link class="link" to="/download">立即下载</router-link>
        </div>
        <div class="comment-component">
          <Comment
            :commentParams="commentParams"
            @refreshComment="refreshComment"
          />
        </div>
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @pageChange="pageChange"
        />
      </div>
      <div class="detail-side">
        <SongSheetSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { playlistDetail } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import UserInfo from '@/components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@/components/song-sheet/music-table/MusicTable.vue';
import Comment from '@/components/comment/Comment.vue';
import SongSheetSide from './song-sheet-side/SongSheetSide.vue';
import Page from '@/components/page/Page.vue';

const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);
const songSheetDetail = computed(() => $store.getters.songSheetDetail);

// 获取歌单详情
function getSongDetail(): void {
  $store.commit('setSongSheetDetail', {});

  playlistDetail({ id: songSheetId.value })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        $store.commit('setSongSheetDetail', res);
      }
    })
    .catch(() => ({}));
}

// 跳转至评论
function jumpToComment(): void {
  const commentDom = document.querySelector(
    '.comment-component'
  ) as HTMLDivElement;

  window.scrollTo(0, Number(commentDom.offsetTop) + 20);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: songSheetId.value,
  offset: 1,
  limit: 20,
  total: 0,
  hotList: [],
  list: []
});

function getCommentList(): void {
  const params = {
    id: songSheetId.value,
    offset: (commentParams.offset - 1) * commentParams.limit,
    limit: commentParams.limit
  };

  playlistComment({ ...params })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        const result = handleCommentData(res);
        // 精彩评论
        commentParams.hotList = result.hotList;
        // 最新评论
        commentParams.list = result.list;
        commentParams.total = res.total;
      }
    })
    .catch(() => ({}));
}

// 刷新评论
function refreshComment(): void {
  getCommentList();
}

// 分页
function pageChange(current: number): void {
  commentParams.offset = current;
  jumpToComment();
  getCommentList();
}

watch(
  () => songSheetId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getSongDetail();
    getCommentList();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  $store.commit('setMenuIndex', 0);
  $store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./song-sheet-detail.less');
</style>
