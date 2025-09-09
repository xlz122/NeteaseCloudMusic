<template>
  <div class="song-sheet-detail">
    <div class="detail-container">
      <div class="detail-content">
        <div class="song-user-info">
          <SongInfo
            :songDetailData="songDetailData"
            :lyric="lyric"
            :commentTotal="commentParams.total"
            @jumpToComment="jumpToComment"
          />
        </div>
        <!--
          歌曲被翻译有transUser, 没有lyricUser
          歌曲没被翻译有lyricUser, 没有transUser
       -->
        <div class="song-user-operate">
          <div class="operate-top">
            <a
              v-if="lyric.lyricUser?.nickname"
              class="text lyric"
              :href="`https://music.163.com/#/wiki/song?songId=${route.query.id}&type=3`"
              target="_blank"
            >
              翻译歌词
            </a>
            <a
              class="text"
              :href="`https://music.163.com/#/lyric/report?id=${route.query.id}`"
              target="_blank"
            >
              报错
            </a>
          </div>
          <div class="operate-bottom">
            <template v-if="lyric.lyricUser?.nickname">
              <span class="text">贡献歌词:</span>
              <span class="name" @click="jumpUserProfile(lyric.lyricUser?.userid)">
                {{ lyric.lyricUser?.nickname }}
              </span>
              <span class="text temporary">暂时没有翻译，</span>
              <span class="text translate" @click="lyricTranslate"> 求翻译 </span>
            </template>
            <template v-else>
              <span class="text" v-if="lyric.transUser?.nickname"> 贡献歌词: </span>
              <span class="name" @click="jumpUserProfile(lyric.transUser?.userid)">
                {{ lyric.transUser?.nickname }}
              </span>
            </template>
          </div>
        </div>
        <div class="comment-component">
          <Comment :params="commentParams" @onRefresh="refreshComment" />
        </div>
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @onChange="handlePageChange"
        />
      </div>
      <div class="detail-side">
        <SongSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { formatComment } from '@/components/comment/formatComment';
import { songDetail } from '@/api/song-detail';
import { getLyric } from '@/api/my-music';
import { musicComment } from '@/api/comment';
import type { ResponseType } from '@/types';
import type { CommentParams } from '@/components/comment/Comment.vue';
import Comment from '@/components/comment/Comment.vue';
import Page from '@/components/page/Page.vue';
import SongInfo from './song-info/SongInfo.vue';
import SongSide from './song-side/SongSide.vue';

type Lyric = {
  lyricUser: {
    userid?: number;
    nickname?: string;
  };
  transUser: {
    userid?: number;
    nickname?: string;
  };
  list: {
    lyric: string;
    time: number;
  }[];
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取歌曲详情
const songDetailData = ref({});

function getSongDetail(): void {
  songDetail({ ids: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songDetailData.value = res ?? {};
    })
    .catch(() => ({}));
}

// 获取歌词
const lyric = reactive<Lyric>({
  lyricUser: {},
  transUser: {},
  list: []
});

function getLyricData(): void {
  getLyric({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      lyric.lyricUser = res.lyricUser;
      lyric.transUser = res.transUser;
      handlerLyric(res.lrc?.lyric);
    })
    .catch(() => ({}));
}

// 处理歌词数据
function handlerLyric(lyricStr: string): void {
  lyric.list = [];

  const regNewLine = /\n/;
  // 每行歌词的数组
  const lineArr = lyricStr.split(regNewLine);
  const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
  lineArr.forEach?.((item: string) => {
    if (item === '') return;
    const obj = {
      lyric: '',
      time: -1
    };
    const time = item.match(regTime);
    if (item.includes?.('[')) {
      obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
      obj.time = time ? formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0;
    } else {
      obj.lyric = item;
    }
    lyric.list.push(obj);
  });
}

// 格式化歌词的时间(转换成 s.ms)
function formatLyricTime(time: string): number {
  const regMin = /.*:/;
  const regSec = /:.*\./;
  const regMs = /\./;

  // 分
  let min = '';
  const rMin = time.match(regMin);
  if (rMin instanceof Array) {
    min = rMin[0].slice?.(0, 2);
  }
  // 秒
  let second = '';
  const rSec = time.match(regSec);
  if (rSec instanceof Array) {
    second = rSec[0].slice?.(1, 3);
  }
  // 毫秒
  let ms = '';
  const rMs = time.match(regMs);
  if (rMs?.index) {
    ms = time.slice?.(rMs.index + 1, rMs.index + 3);
  }
  // 分 + 秒
  if (min && parseInt(min) !== 0) {
    second = (parseInt(min) * 60 + parseInt(second)).toString();
  }

  return Number(second + '.' + ms);
}

// 获取评论
const commentParams = reactive<CommentParams>({
  type: 0,
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

  musicComment({ ...params })
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
  jumpToComment();
}

function jumpToComment(): void {
  const element: HTMLElement = document.querySelector('.comment-component')!;
  window.scrollTo(0, element.offsetTop + 20);
}

// 求翻译
function lyricTranslate(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpUserProfile(id: number | undefined): void {
  router.push({ path: '/user-profile', query: { id } });
}

watch(
  () => route.query.id,
  () => {
    commentParams.id = Number(route.query.id);
    commentParams.offset = 1;
    getSongDetail();
    getLyricData();
    getCommentList();
  },
  { immediate: true }
);

onMounted(() => {
  store.commit('setMenuIndex', 0);
  store.commit('setSubMenuIndex', -1);
});
</script>

<style lang="less" scoped>
@import url('./song-detail.less');
</style>
