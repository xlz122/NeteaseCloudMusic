<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <UserInfo class="user-info" @commentClick="commentClick" />
        <!-- 评论 -->
        <div
          class="comment-component"
          v-if="songSheetDetail?.playlist?.tracks.length > 0"
        >
          <comment :songSheetDetail="songSheetDetail" />
        </div>
      </div>
      <div class="song-sheet-side">
        <SongSheetSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { songDetail } from '@api/song-detail';
import { ResponseType } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './song-detail-side/SonDetailSide.vue';

export default defineComponent({
  components: {
    UserInfo,
    Comment,
    SongSheetSide
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const songId = computed(() => $store.getters.songId);
    // 监听路由传参，获取歌曲详情
    watch(
      () => $route.params,
      curVal => {
        if (curVal.songId) {
          $store.commit('setSongId', Number(curVal.songId));
          getSongDetail();
        }
      },
      {
        immediate: true
      }
    );

    // 获取歌曲详情
    function getSongDetail(): void {
      songDetail({
        ids: songId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            console.log(res);
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

    // 歌单详情数据
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );

    // 评论
    function commentClick(): void {
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      // 标题高度
      window.scrollTo(0, Number(commentDom.offsetTop) + 20);
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      songSheetDetail,
      songId,
      commentClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-detail.less';
</style>
