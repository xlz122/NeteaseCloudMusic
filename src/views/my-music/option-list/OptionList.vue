<template>
  <!-- 我的视频 -->
  <h2
    class="music-my-mv"
    :class="{ 'music-my-mv-active': musicDetailOptions.myMv }"
    @click="myMvClick"
  >
    我的视频({{ optionsCount.myMvCount }})
  </h2>
  <!-- 创建的歌单 -->
  <toggle-list
    :title="'创建的歌单'"
    :listCount="optionsCount.createdPlayCount"
    :listData="songList.createSongList"
    addBtnShow
    @listClick="createListClick"
  />
  <!-- 收藏的歌单 -->
  <toggle-list
    v-if="optionsCount.collectionPlayCount > 0"
    :title="'收藏的歌单'"
    :listCount="optionsCount.collectionPlayCount"
    :listData="songList.collectionSongList"
    @listClick="collectionListClick"
  />
</template>

<script lang="ts">
/* eslint-disable */
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import ToggleList from './ToggleList.vue';
import { userSubcount, userPlayList, playListDetail } from '@api/my-music';
import { OptionsCount, SongList, ResponseType, LoopType } from '@/types/types';

export default defineComponent({
  components: {
    ToggleList
  },
  setup() {
    const $store = useStore();
    
    // 详情页面显示
    const musicDetailOptions = computed(() => $store.getters['music/musicDetailOptions']);

    // 侧边歌单列表选中项id
    const activeSongListId = computed(() => $store.getters['music/activeSongListId']);

    const optionsCount = reactive<OptionsCount>({
      myMvCount: 0, // 我的视频数量
      createdPlayCount: 0, // 创建歌单数量
      collectionPlayCount: 0 // 创建歌单数量
    });

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): void {
      userSubcount().then((res: ResponseType) => {
        optionsCount.myMvCount = res.mvCount || 0;
        optionsCount.createdPlayCount = res.createdPlaylistCount || 0;
        optionsCount.collectionPlayCount = res.subPlaylistCount || 0;
      });
    }
    getUserSubcount();

    // 获取歌单列表
    const songList = reactive<SongList>({
      createSongList: [], // 创建的歌单
      collectionSongList: [] // 收藏的歌单
    });
    function getUserPlayList(): void {
      // 账户数据
      const accountInfo = computed(() => $store.getters.accountInfo);
      userPlayList({
        uid: accountInfo.value.id
      }).then((res: ResponseType) => {
        if (res.code == 200) {
          // 列表数据
          res.playlist.forEach((item: LoopType) => {
            // 喜欢的音乐处理
            if (item.name.includes('喜欢的音乐')) {
              item.name = '我喜欢的音乐';
              item.cannotEdit = true;
              item.cannotDelete = true;
            }
            // 收藏列表判断
            if (!item.subscribed) {
              songList.createSongList.push(item);
            } else {
              item.cannotEdit = true;
              songList.collectionSongList.push(item);
            }
          });

          // 初始化获取详情，列表id获取对应详情，不存在获取我喜欢的音乐详情
          const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
          for (const value in musicDetail) {
            musicDetail[value] = false;
          }
          musicDetail.playListDetail = true;
          $store.commit('music/setMusicDetailOptions', musicDetail);

          if (activeSongListId.value >= 0) {
            getSongListDetail(activeSongListId.value);
          } else {
            getSongListDetail(res.playlist[0].id);
          }
        }
      });
    }
    getUserPlayList();

    // 我的视频点击
    function myMvClick(): void {
      const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.myMv = true;
      $store.commit('music/setMusicDetailOptions', musicDetail);

      // 取消其他项选中
      $store.commit('music/setActiveSongListId', -1);
    }

    // 创建歌单项点击
    function createListClick(id: number): void {
      const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.playListDetail = true;
      $store.commit('music/setMusicDetailOptions', musicDetail);
      
      // 获取歌单详情
      if (id !== activeSongListId.value) {
        getSongListDetail(id);
      }

      // 存储选中id
      $store.commit('music/setActiveSongListId', id);
    }

    // 收藏歌单项点击
    function collectionListClick(id: number): boolean | undefined {
      // 收藏的歌单被全部删除
      if (id === 0) {
        // 选中我喜欢的音乐
        const createSongList = JSON.parse(JSON.stringify(songList.createSongList));
        createListClick(createSongList[0].id);
        // 隐藏收藏的歌单
        optionsCount.collectionPlayCount = 0;
        return false;
      }
      const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.playListDetail = true;
      $store.commit('music/setMusicDetailOptions', musicDetail);
      
      // 获取歌单详情
      if (id !== activeSongListId.value) {
        getSongListDetail(id);
      }

      // 存储选中id
      $store.commit('music/setActiveSongListId', id);
    }

    // 获取歌单详情
    function getSongListDetail(id: number): void {
      playListDetail({ id }).then((res: ResponseType) => {
        if (res.code === 200) {
          // 单独处理我喜欢的音乐
          if (res?.playlist?.name.includes('喜欢的音乐')) {
            res.playlist.name = '我喜欢的音乐';
          }

          $store.commit('music/setSongListDetailData', res);
        }
      });
    }
    return {
      musicDetailOptions,
      optionsCount,
      songList,
      myMvClick,
      createListClick,
      collectionListClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
