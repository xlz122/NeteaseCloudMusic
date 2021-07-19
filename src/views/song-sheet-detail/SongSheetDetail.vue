<template>
  <div class="song-sheet-detail">
    <div class="song-sheet-detail-container">
      <div class="song-sheet-content">
        <UserInfo class="user-info" />
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num">
            {{ songListDetailData?.playlist?.trackCount }}首歌
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
              v-if="songListDetailData?.playlist?.tracks.length > 0"
            >
              播放:
              <span class="eye-catching">{{
                songListDetailData?.playlist?.playCount
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
          class="comment"
          v-if="songListDetailData?.playlist?.tracks.length > 0"
        >
          <comment :songListDetailData="songListDetailData" />
        </div>
      </div>
      <div class="song-sheet-side">
        <SongSheetSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { playlistDetail } from '@api/song-sheet-detail';
import { ResponseType } from '@/types/types';
import UserInfo from '@components/song-sheet/user-info/UserInfo.vue';
import MusicTable from '@components/song-sheet/music-table/MusicTable.vue';
import Comment from '@views/my-music/play-list-detail/Comment.vue';
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
    const songListDetailData = computed(
      () => $store.getters['music/songListDetailData']
    );

    // 获取歌单详情
    function getSongDetail(): void {
      // 清空歌单详情数据
      $store.commit('music/setSongListDetailData', {});
      playlistDetail({
        id: songSheetId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            $store.commit('music/setSongListDetailData', res);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    return {
      songListDetailData,
      songSheetId
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-detail.less';
</style>
