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
          :updateFrequency="updateFrequency"
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
import { ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
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
const $store = useStore();
const songSheetId = computed<number>(() => $store.getters.songSheetId);

// 监听路由传参, 获取歌单详情
const updateFrequency = ref<string>('');

watch(
  () => $route,
  curVal => {
    if (curVal.path !== '/home-toplist') {
      return;
    }

    if (curVal.params?.id) {
      (async () => {
        const list = await getTopList();
        const ItemId = list.findIndex(item => item.id === songSheetId.value);
        list.forEach(item => {
          if (ItemId !== -1) {
            if (item.id === songSheetId.value) {
              updateFrequency.value = item.updateFrequency;
            }
          } else {
            $store.commit('setSongSheetId', list[0].id);
            updateFrequency.value = list[0].updateFrequency;
          }
        });
        getSongSheetDetail();
        getCommentList();
      })();
    } else {
      (async () => {
        const list = await getTopList();
        $store.commit('setSongSheetId', list[0].id);
        updateFrequency.value = list[0].updateFrequency;
        getSongSheetDetail();
        getCommentList();
      })();
    }
  },
  {
    immediate: true
  }
);

// 获取特色榜、媒体榜
const toplist = reactive<TopList>({
  character: [],
  media: []
});

function getTopList(): Promise<SongSheetItem[]> {
  return new Promise(resolve => {
    topList()
      .then((res: ResponseType) => {
        if (res?.code === 200) {
          toplist.character = res?.list?.slice(0, 4) || [];
          toplist.media = res?.list?.slice(4) || [];
          resolve(res.list);
        } else {
          setMessage({ type: 'error', title: res?.msg });
        }
      })
      .catch(() => ({}));
  });
}

// 菜单选择
function menuChange(id: number, frequency: string): void {
  $store.commit('setSongSheetId', id);
  updateFrequency.value = frequency;
  getSongSheetDetail();
  getCommentList();
}

// 获取歌单详情
const songSheetDetail = ref({});

function getSongSheetDetail(): void {
  playlistDetail({ id: songSheetId.value })
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

watch(
  () => songSheetId.value,
  () => {
    commentParams.id = songSheetId.value;
  }
);

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
  getCommentList();
}
</script>

<style lang="less">
@import url('./home-toplist.less');
</style>
