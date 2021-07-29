<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <UserInfo class="user-info" @commentClick="commentClick" />
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
              <span class="eye-catching">{{
                songSheetDetail?.playlist?.playCount
              }}</span>
              次
            </div>
          </div>
        </div>
        <MusicTable class="music-table" />
        <div class="playlist-see-more">
          <div class="text">查看更多内容，请下载客户端</div>
          <router-link class="link" to="/download">立即下载</router-link>
        </div>
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
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { playlistDetail } from '@api/song-sheet-detail';
import { ResponseType } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@components/comment/Comment.vue';
import SongSheetSide from './song-sheet-side/SongSheetSide.vue';

export default defineComponent({
  components: {
    UserInfo,
    MusicTable,
    Comment,
    SongSheetSide
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const songSheetId = ref<number>(-1);
    // 监听路由传参，获取歌单详情
    watch(
      () => $route.params,
      curVal => {
        if (curVal.id) {
          songSheetId.value = Number(curVal.id);
          getSongDetail();
        }
      },
      {
        immediate: true
      }
    );

    // 歌单详情数据
    const songSheetDetail = computed(
      () => $store.getters['music/songSheetDetail']
    );

    // 获取歌单详情
    function getSongDetail(): void {
      // 清空歌单详情数据
      $store.commit('music/setSongSheetDetail', {});
      playlistDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            $store.commit('music/setSongSheetDetail', res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

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
      songSheetId,
      commentClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-detail.less';
</style>
