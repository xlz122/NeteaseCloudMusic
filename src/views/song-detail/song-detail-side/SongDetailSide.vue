<template>
  <div class="detail-side-container">
    <template v-if="songSheetList?.length > 0">
      <h3 class="title">包含这首歌的歌单</h3>
      <ul class="song-sheet-list">
        <li class="item" v-for="(item, index) in songSheetList" :key="index">
          <div
            class="item-cover"
            :title="item?.name"
            @click="jumpSongSheetDetail(item?.id)"
          >
            <img
              class="cover-img"
              :src="`${item?.coverImgUrl}?param=50y50`"
              alt=""
            />
          </div>
          <div class="item-info">
            <p
              class="info-title"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
            >
              {{ item?.name }}
            </p>
            <div class="info-desc">
              <span class="by">by</span>
              <span
                class="text"
                :title="item?.creator?.nickname"
                @click="jumpUserProfile(item?.creator?.userId)"
              >
                {{ item?.creator?.nickname }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-if="simiSongList?.length > 0">
      <h3 class="title">相似歌曲</h3>
      <ul class="simi-song-list">
        <li class="item" v-for="(item, index) in simiSongList" :key="index">
          <div class="item-info">
            <p
              class="info-title"
              :title="item?.name"
              @click="jumpSongDetail(item?.id)"
            >
              <span class="text">{{ item?.name }}</span>
            </p>
            <div
              class="info-desc"
              :title="item?.artists[0]?.name"
              @click="jumpSingerDetail(item?.artists[0]?.id)"
            >
              <span class="text">{{ item?.artists[0]?.name }}</span>
            </div>
          </div>
          <div class="item-operate">
            <i class="icon-operate play" @click="playSingleMusic(item)"></i>
            <i
              class="icon-operate add"
              @click="singleMusicToPlayList(item)"
            ></i>
          </div>
        </li>
      </ul>
    </template>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
    <a class="supplement" href="#" target="_blank">补充或修改艺人资料></a>
    <a
      class="supplement"
      href="https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/recommend"
      target="_blank"
    >
      用户wiki任务中心>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { simiPlaylist, simiSong } from '@api/song-detail';
import type { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  setup() {
    const $store = useStore();

    const songId = computed<number>(() => $store.getters.songId);

    const songSheetList = ref<unknown[]>([]);
    // 获取歌曲的歌单
    function getSimiPlaylist(): void {
      simiPlaylist({ id: songId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            songSheetList.value = res?.playlists;
          }
        })
        .catch(() => ({}));
    }
    getSimiPlaylist();

    const simiSongList = ref<unknown[]>([]);
    // 获取歌曲的相似歌曲
    function getSimiSong(): void {
      simiSong({ id: songId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            simiSongList.value = res?.songs;
          }
        })
        .catch(() => ({}));
    }
    getSimiSong();

    // 播放单个歌曲
    function playSingleMusic(
      item: Record<string, { cp: number }>
    ): boolean | undefined {
      // 无版权过滤
      if (item?.privilege?.cp === 0) {
        return false;
      }

      usePlaySingleMusic(item);
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(
      item: Record<string, { cp: number }>
    ): boolean | undefined {
      // 无版权过滤
      if (item?.privilege?.cp === 0) {
        return false;
      }

      useMusicToPlayList({ music: item });
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      getSimiPlaylist();
      getSimiSong();

      $store.commit('jumpSongDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    return {
      songSheetList,
      simiSongList,
      playSingleMusic,
      singleMusicToPlayList,
      jumpSongSheetDetail,
      jumpUserProfile,
      jumpSongDetail,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./song-detail-side.less');
</style>
