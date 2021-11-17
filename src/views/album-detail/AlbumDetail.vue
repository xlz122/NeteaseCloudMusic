<template>
  <div class="album-detail">
    <div class="album-detail-container">
      <div class="album-content">
        <AlbumInfo
          class="user-info"
          :userInfo="albumData.userInfo"
          :songs="albumData.songs"
          @commentClick="commentClick"
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
          :noData="albumData.noData"
          :songs="albumData.songs"
        />
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
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { albumDetail } from '@api/album-detail';
import { commentAlbum } from '@api/comment';
import { ResponseType, CommentParams } from '@/types/types';
import { handleCommentData } from '@components/comment/handleCommentData';
import AlbumInfo from './album-info/AlbumInfo.vue';
import AlbumSong from './album-song/AlbumSong.vue';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './album-detail-side/AlbumDetailSide.vue';
import Page from '@components/page/Page.vue';

type AlbumData = {
  loading: boolean;
  noData: boolean;
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
    const $route = useRoute();
    const $store = useStore();

    // 专辑id
    const albumId = computed(() => $store.getters.albumId);

    const albumData = reactive<AlbumData>({
      loading: false,
      noData: false,
      userInfo: {},
      songs: []
    });

    watch(
      () => $route.params,
      curVal => {
        if (curVal.albumId) {
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

    // 获取歌单详情
    function getAlbumDetail(): void {
      albumData.loading = true;
      albumData.noData = false;
      albumData.songs = [];

      albumDetail({
        id: albumId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            albumData.userInfo = res.album;
            albumData.songs = res.songs;
            if (res.songs.length === 0) {
              albumData.noData = true;
            }
            // 存储歌手id
            $store.commit('setSingerId', res.album.artist.id);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
          albumData.loading = false;
        })
        .catch(() => ({}));
    }
    getAlbumDetail();

    // 评论
    function commentClick(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      // 标题高度
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

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      albumId,
      albumData,
      commentClick,
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
