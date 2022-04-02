<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <div class="song-user-info">
          <SongInfo
            :songDetailData="songDetailData"
            :lyric="lyric"
            :commentTotal="commentParams.total"
            @jumpToComments="jumpToComments"
          />
        </div>
        <!-- 操作项 -->
        <!--
          歌曲被翻译有transUser,没有lyricUser
          歌曲没被翻译有lyricUser,没有transUser
        -->
        <div class="song-user-operate">
          <div class="operate-top">
            <a
              v-if="lyric?.lyricUser?.nickname"
              class="text lyric"
              :href="`https://music.163.com/#/wiki/song?songId=${songId}&type=3`"
              target="_blank"
            >
              翻译歌词
            </a>
            <a
              class="text"
              :href="`https://music.163.com/#/lyric/report?id=${songId}`"
              target="_blank"
            >
              报错
            </a>
          </div>
          <div class="operate-bottom">
            <template v-if="lyric?.lyricUser?.nickname">
              <span class="text">贡献歌词:</span>
              <span
                class="name"
                @click="jumpUserProfile(lyric?.lyricUser?.userid)"
              >
                {{ lyric?.lyricUser?.nickname }}
              </span>
              <span class="text temporary">暂时没有翻译，</span>
              <span class="text translate" @click="lyricTranslate">
                求翻译
              </span>
            </template>
            <template v-else>
              <span class="text" v-if="lyric?.transUser?.nickname">
                贡献歌词:
              </span>
              <span
                class="name"
                @click="jumpUserProfile(lyric?.transUser?.userid)"
              >
                {{ lyric?.transUser?.nickname }}
              </span>
            </template>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment-component">
          <Comment
            :commentParams="commentParams"
            @commentRefresh="commentRefresh"
          />
        </div>
        <!-- 参数从0开始，分页需从1开始 -->
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @changPage="changPage"
        />
      </div>
      <div class="song-sheet-side">
        <SongDateilSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { songDetail } from '@api/song-detail';
import { getLyric } from '@api/my-music';
import { commentMusic } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import Comment from '@components/comment/Comment.vue';
import SongInfo from './song-info/SongInfo.vue';
import SongDateilSide from './song-detail-side/SongDetailSide.vue';
import Page from '@components/page/Page.vue';

type Lyric = {
  lyricUser: unknown;
  transUser: unknown;
  list: List[];
};

type List = {
  lyric: string;
  time: number;
};

export default defineComponent({
  components: {
    SongInfo,
    Comment,
    SongDateilSide,
    Page
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    // 歌曲id
    const songId = computed<number>(() => $store.getters.songId);

    // 监听路由传参，获取歌曲详情
    watch(
      () => $route.params,
      curVal => {
        if (curVal.songId) {
          nextTick(() => {
            getSongDetail();
            getCommentData();
            getLyricData();
          });
        }
      },
      {
        immediate: true
      }
    );

    const songDetailData = ref({});
    // 获取歌曲详情
    function getSongDetail(): void {
      songDetail({
        ids: songId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songDetailData.value = res;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSongDetail();

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 求翻译
    function lyricTranslate(): boolean | undefined {
      // 未登录打开登录对话框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能未开发'
      });
    }

    // 歌词数据
    const lyric = reactive<Lyric>({
      lyricUser: {},
      transUser: {},
      list: []
    });

    // 获取歌词
    function getLyricData() {
      getLyric({
        id: songId.value
      })
        .then((res: ResponseType) => {
          // 歌词作者
          lyric.lyricUser = res?.lyricUser;
          lyric.transUser = res?.transUser;
          handlerLyric(res.lrc.lyric);
        })
        .catch(() => ({}));
    }
    getLyricData();

    // 处理歌词数据
    function handlerLyric(lyricStr: string): void {
      // 清空歌词
      lyric.list = [];

      const regNewLine = /\n/;
      // 每行歌词的数组
      const lineArr = lyricStr.split(regNewLine);
      const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      lineArr.forEach((item: string) => {
        if (item === '') return;
        const obj = {
          lyric: '',
          time: -1
        };
        const time = item.match(regTime);
        if (item.includes('[')) {
          obj.lyric =
            item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
          obj.time = time
            ? formatLyricTime(time[0].slice(1, time[0].length - 1))
            : 0;
        } else {
          obj.lyric = item;
        }
        lyric.list.push(obj);
      });
    }

    // 格式化歌词的时间 转换成 sss:ms
    function formatLyricTime(time: any): number {
      const regMin = /.*:/;
      const regSec = /:.*\./;
      const regMs = /\./;

      const min = parseInt(time.match(regMin)[0].slice(0, 2));
      let sec = parseInt(time.match(regSec)[0].slice(1, 3));
      const ms = time.slice(
        time.match(regMs).index + 1,
        time.match(regMs).index + 3
      );
      if (min !== 0) {
        sec += min * 60;
      }
      return Number(sec + '.' + ms);
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 0,
      id: songId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: songId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentMusic({ ...params })
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

    // 刷新评论
    function commentRefresh(): void {
      getCommentData();
    }

    // 分页
    function changPage(current: number): void {
      commentParams.offset = current;
      getCommentData();
    }

    // 跳转至评论
    function jumpToComments(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;

      const appwrap = document.querySelector('.app-wrap') as HTMLElement;
      appwrap.scrollTo(0, Number(commentDom.offsetTop) + 20);
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      songId,
      songDetailData,
      jumpUserProfile,
      lyric,
      lyricTranslate,
      commentParams,
      commentRefresh,
      changPage,
      jumpToComments
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-detail.less';
</style>
