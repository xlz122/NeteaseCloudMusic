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
          @pageChange="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { handleCommentData } from '@/components/comment/handleCommentData';
import { playlistDetail } from '@/api/song-sheet-detail';
import { playlistComment } from '@/api/comment';
import { topList } from '@/api/home-toplist';
import type { ResponseType } from '@/types/types';
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

const $route = useRoute();
const $router = useRouter();

// 获取特色榜、媒体榜
const toplist = reactive<TopList>({
  character: [],
  media: []
});

function getTopList(): Promise<null> {
  return new Promise(resolve => {
    topList()
      .then((res: ResponseType) => {
        if (res?.code === 200) {
          toplist.character = res?.list?.slice(0, 4) || [];
          toplist.media = res?.list?.slice(4) || [];
          resolve(null);
        }
      })
      .catch(() => ({}));
  });
}

// 菜单选择
function menuChange(id: number): void {
  $router.push({ path: '/home-toplist', query: { id } });
}

// 获取歌单详情
const songSheetDetail = ref({});

function getSongSheetDetail(): void {
  playlistDetail({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        songSheetDetail.value = res || {};
      }
    })
    .catch(() => ({}));
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 2,
  id: 0,
  offset: 1,
  limit: 20,
  total: 0,
  hotList: [],
  list: []
});

function getCommentList(): void {
  const params = {
    id: Number($route.query.id),
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
  getCommentList();
}

watch(
  () => $route,
  async () => {
    if ($route.path !== '/home-toplist') {
      return;
    }

    await getTopList();

    if (!$route.query.id) {
      $router.push({
        path: '/home-toplist',
        query: { id: toplist.character[0].id }
      });
      return;
    }

    getSongSheetDetail();
    getCommentList();
  },
  {
    immediate: true,
    deep: true
  }
);
</script>

<style lang="less">
@import url('./home-toplist.less');
</style>
