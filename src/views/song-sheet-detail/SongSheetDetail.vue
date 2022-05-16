<template>
  <div class="song-sheet-detail">
    <div class="detail-container">
      <div class="detail-content">
        <UserInfo class="user-info" @jumpToComments="jumpToComments" />
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num">
            {{ songSheetDetail?.playlist?.trackCount }}首歌
          </span>
          <div class="title-right">
            <div class="out">
              <i class="icon"></i>
              <a
                class="link"
                :href="`https://music.163.com/#/outchain/0/${songSheetId}`"
              >
                生成外链播放器
              </a>
            </div>
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
        </div>
        <MusicTable class="music-table" />
        <div class="playlist-see-more">
          <div class="text">查看更多内容，请下载客户端</div>
          <router-link class="link" to="/download">立即下载</router-link>
        </div>
        <div class="comment-component">
          <Comment
            :commentParams="commentParams"
            @commentRefresh="commentRefresh"
          />
        </div>
        <Page
          v-if="commentParams.total > commentParams.limit"
          :page="commentParams.offset"
          :pageSize="commentParams.limit"
          :total="commentParams.total"
          @changPage="changPage"
        />
      </div>
      <div class="detail-side">
        <SongSheetSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue';
import { useStore } from 'vuex';
import { handleCommentData } from '@components/comment/handleCommentData';
import { playlistDetail } from '@api/song-sheet-detail';
import { commentPlayList } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './song-sheet-side/SongSheetSide.vue';
import Page from '@components/page/Page.vue';

export default defineComponent({
  components: {
    UserInfo,
    MusicTable,
    Comment,
    SongSheetSide,
    Page
  },
  setup() {
    const $store = useStore();

    const songSheetId = computed<number>(() => $store.getters.songSheetId);
    // 歌单详情数据
    const songSheetDetail = computed(() => $store.getters.songSheetDetail);

    watch(
      () => songSheetId.value,
      curVal => {
        if (curVal) {
          nextTick(() => {
            getSongDetail();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    // 获取歌单详情
    function getSongDetail(): void {
      $store.commit('setSongSheetDetail', {});

      playlistDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            $store.commit('setSongSheetDetail', res);
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

      const appwrap = document.querySelector('.app-wrap') as HTMLElement;
      appwrap.scrollTo(0, Number(commentDom.offsetTop) + 20);
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

    onMounted(() => {
      $store.commit('setHeaderActiveIndex', 0);
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      songSheetId,
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
