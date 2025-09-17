<template>
  <div class="home-toplist">
    <div class="home-toplist-container">
      <div class="home-toplist-menu">
        <ToplistMenu
          :character="toplist.character"
          :media="toplist.media"
          @menuChange="menuChange"
        />
      </div>
      <div class="home-toplist-content">
        <ToplistContent
          :songSheetDetail="songSheetDetail"
          :commentParams="commentParams"
          @refreshComment="refreshComment"
          @handlePageChange="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatComment } from '@/components/comment/formatComment';
import { playlistDetail } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import { topList } from '@/api/home-toplist';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import ToplistMenu from './toplist-menu/ToplistMenu.vue';
import ToplistContent from './toplist-content/ToplistContent.vue';

type TopList = {
  character: SongSheetItem[];
  media: SongSheetItem[];
};

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  updateFrequency: string;
};

const route = useRoute();
const router = useRouter();

// 获取特色榜、媒体榜
const toplist = reactive<TopList>({
  character: [],
  media: []
});

function getTopList(): Promise<null> {
  return new Promise((resolve) => {
    topList()
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        toplist.character = res.list?.slice?.(0, 4) ?? [];
        toplist.media = res.list?.slice?.(4) ?? [];
        resolve(null);
      })
      .catch(() => ({}));
  });
}

// 菜单选择
function menuChange(id: number): void {
  router.push({ path: '/home-toplist', query: { id } });
}

// 获取歌单详情
const songSheetDetail = ref({});

function getSongSheetDetail(): void {
  playlistDetail({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songSheetDetail.value = res ?? {};
    })
    .catch(() => ({}));
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: undefined,
  offset: 1,
  limit: 20,
  hotList: [],
  list: [],
  total: 0
});

function getCommentList(): void {
  const params = {
    id: commentParams.id,
    offset: (commentParams.offset - 1) * commentParams.limit,
    limit: commentParams.limit
  };

  playlistComment({ ...params })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      const comment = formatComment(res);
      commentParams.hotList = comment.hotList;
      commentParams.list = comment.list;
      commentParams.total = comment.total;
    })
    .catch(() => ({}));
}

function refreshComment(): void {
  getCommentList();
}

function handlePageChange(current: number): void {
  commentParams.offset = current;
  getCommentList();
}

watch(
  () => route.query.id,
  async () => {
    await getTopList();

    if (!route.query.id) {
      router.replace({
        path: '/home-toplist',
        query: { id: toplist.character[0].id }
      });
      return;
    }

    commentParams.id = Number(route.query.id);
    commentParams.offset = 1;
    getSongSheetDetail();
    getCommentList();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="less">
@import url('./home-toplist.less');
</style>
