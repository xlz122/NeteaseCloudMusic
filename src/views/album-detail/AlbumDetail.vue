<template>
  <div class="album-detail">
    <div class="album-detail-container">
      <div class="album-content">
        <AlbumInfo
          class="user-info"
          :userInfo="albumData.userInfo"
          :songs="albumData.songs"
          @jumpToComments="jumpToComments"
        />
        <div class="list-title">
          <h3 class="title-text">包含歌曲列表</h3>
          <span class="title-text-num">
            {{ albumData?.songs?.length }}首歌
          </span>
          <div class="title-right">
            <div class="out">
              <i class="icon"></i>
              <a
                class="link"
                :href="`https://music.163.com/#/outchain/1/${albumId}`"
              >
                生成外链播放器
              </a>
            </div>
          </div>
        </div>
        <AlbumSong
          class="music-table"
          :loading="albumData.loading"
          :songs="albumData.songs"
        />
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
      <div class="album-side">
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
  nextTick,
  onMounted
} from 'vue';
import { useStore } from 'vuex';
import { albumDetail } from '@api/album-detail';
import { commentAlbum } from '@api/comment';
import type { ResponseType } from '@/types/types';
import type { CommentParams } from '@components/comment/Comment.vue';
import { handleCommentData } from '@components/comment/handleCommentData';
import AlbumInfo from './album-info/AlbumInfo.vue';
import AlbumSong from './album-song/AlbumSong.vue';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './album-detail-side/AlbumDetailSide.vue';
import Page from '@components/page/Page.vue';

type AlbumData = {
  loading: boolean;
  userInfo: unknown;
  songs: unknown[];
};

export default defineComponent({
  components: {
    AlbumInfo,
    AlbumSong,
    Comment,
    SongSheetSide,
    Page
  },
  setup() {
    const $store = useStore();

    const albumId = computed<number>(() => $store.getters.albumId);

    const albumData = reactive<AlbumData>({
      loading: true,
      userInfo: {},
      songs: []
    });

    watch(
      () => albumId.value,
      curVal => {
        if (curVal) {
          nextTick(() => {
            getAlbumDetail();
            getCommentData();
          });
        }
      },
      {
        immediate: true
      }
    );

    // 获取专辑详情
    function getAlbumDetail(): void {
      albumData.loading = true;
      albumData.songs = [];

      albumDetail({
        id: albumId.value
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            albumData.userInfo = res?.album;
            albumData.songs = res?.songs;

            // 存储歌手id
            $store.commit('setSingerId', res?.album?.artist?.id);
          }
          albumData.loading = false;
        })
        .catch(() => ({}));
    }

    // 跳转至评论
    function jumpToComments(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;

      window.scrollTo(0, Number(commentDom.offsetTop) + 20);
    }

    // 获取评论数据
    const commentParams = reactive<CommentParams>({
      type: 3,
      id: albumId.value,
      offset: 1,
      limit: 20,
      total: 0,
      hotList: [],
      list: []
    });
    function getCommentData(): void {
      const params = {
        id: albumId.value,
        limit: commentParams.limit
      };
      // 精彩评论不加offset
      if (commentParams.offset > 1) {
        params['offset'] = (commentParams.offset - 1) * commentParams.limit;
      }
      commentAlbum({ ...params })
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
      $store.commit('setMenuIndex', 0);
      $store.commit('setSubMenuIndex', -1);
    });

    return {
      albumId,
      albumData,
      jumpToComments,
      commentParams,
      commentRefresh,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './album-detail.less';
</style>
