<template>
  <!-- 我的歌手 -->
  <h2
    v-if="optionsCount.subPlayListCount > 0"
    class="music-my-singer"
    :class="{ 'music-my-singer-active': musicDetailOptions.subPlayList }"
    @click="subPlayListClick"
  >
    我的歌手({{ optionsCount?.subPlayListCount }})
  </h2>
  <!-- 我的视频 -->
  <h2
    class="music-my-mv"
    :class="{ 'music-my-mv-active': musicDetailOptions?.MyVideo }"
    @click="MyVideoClick"
  >
    我的视频({{ optionsCount?.MyVideoCount }})
  </h2>
  <!-- 创建的歌单 -->
  <toggle-list
    :title="'创建的歌单'"
    :listCount="optionsCount.createdPlayCount"
    :listData="songSheetList.createSongList"
    addBtnShow
    @listClick="createListClick"
  />
  <!-- 收藏的歌单 -->
  <toggle-list
    v-if="optionsCount.collectionPlayCount > 0"
    :title="'收藏的歌单'"
    :listCount="optionsCount.collectionPlayCount"
    :listData="songSheetList.collectionSongList"
    @listClick="handleCollection"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
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
    const musicDetailOptions = computed(
      () => $store.getters['music/musicDetailOptions']
    );

    // 侧边歌单列表选中项id
    const songSheetId = computed<number>(() => $store.getters.songSheetId);

    const optionsCount = reactive<OptionsCount>({
      subPlayListCount: 0, // 我的视频数量
      MyVideoCount: 0, // 我的视频数量
      createdPlayCount: 0, // 创建歌单数量
      collectionPlayCount: 0 // 创建歌单数量
    });

    // 获取歌单，收藏，mv, dj 数量
    function getUserSubcount(): void {
      userSubcount()
        .then((res: ResponseType) => {
          optionsCount.subPlayListCount = res.subPlaylistCount || 0;
          optionsCount.MyVideoCount = res.mvCount || 0;
          optionsCount.createdPlayCount = res.createdPlaylistCount || 0;
          optionsCount.collectionPlayCount = res.subPlaylistCount || 0;
        })
        .catch(() => ({}));
    }
    getUserSubcount();

    // 获取歌单列表
    const songSheetList = reactive<SongList>({
      createSongList: [], // 创建的歌单
      collectionSongList: [] // 收藏的歌单
    });
    function getUserPlayList(): void {
      const userInfo = computed(() => $store.getters.userInfo);
      userPlayList({
        uid: userInfo.value.profile.userId
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 处理列表数据
            res.playlist.forEach((item: LoopType) => {
              // 喜欢的音乐处理
              if (item.name.includes('喜欢的音乐')) {
                item.name = '我喜欢的音乐';
                item.cannotEdit = true;
                item.cannotDelete = true;
              }
              // 收藏列表判断
              if (!item.subscribed) {
                songSheetList.createSongList.push(item);
              } else {
                item.cannotEdit = true;
                songSheetList.collectionSongList.push(item);
              }
            });

            // 初始化获取详情，列表id获取对应详情，不存在获取我喜欢的音乐详情
            const musicDetail = JSON.parse(
              JSON.stringify(musicDetailOptions.value)
            );
            for (const value in musicDetail) {
              musicDetail[value] = false;
            }
            musicDetail.playListDetail = true;
            $store.commit('music/setMusicDetailOptions', musicDetail);

            // id存在，属于左侧列表，使用缓存id
            const playListId: number[] = [];
            res.playlist.forEach((item: LoopType) => {
              playListId.push(item.id);
            });

            if (
              songSheetId.value > 0 &&
              playListId.includes(songSheetId.value)
            ) {
              getSongListDetail(songSheetId.value);
              // 左侧选中
              $store.commit('setSongSheetId', songSheetId.value);
            } else {
              getSongListDetail(res.playlist[0].id);
              // 左侧选中
              $store.commit('setSongSheetId', res.playlist[0].id);
            }
          }
        })
        .catch(() => ({}));
    }
    getUserPlayList();

    // 我的歌手点击
    function subPlayListClick(): void {
      const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.subPlayList = true;
      $store.commit('music/setMusicDetailOptions', musicDetail);

      // 取消其他项选中
      $store.commit('setSongSheetId', -1);
    }

    // 我的视频点击
    function MyVideoClick(): void {
      const musicDetail = JSON.parse(JSON.stringify(musicDetailOptions.value));
      for (const value in musicDetail) {
        musicDetail[value] = false;
      }
      musicDetail.MyVideo = true;
      $store.commit('music/setMusicDetailOptions', musicDetail);

      // 取消其他项选中
      $store.commit('setSongSheetId', -1);
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
      if (id !== songSheetId.value) {
        getSongListDetail(id);
      }

      // 存储选中id
      $store.commit('setSongSheetId', id);
    }

    // 收藏歌单项点击
    function handleCollection(id: number): boolean | undefined {
      // 收藏的歌单被全部删除
      if (id === 0) {
        // 选中我喜欢的音乐
        const createSongList = JSON.parse(
          JSON.stringify(songSheetList.createSongList)
        );
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
      if (id !== songSheetId.value) {
        getSongListDetail(id);
      }

      // 存储选中id
      $store.commit('setSongSheetId', id);
    }

    // 获取歌单详情
    function getSongListDetail(id: number): void {
      $store.commit('music/setSongSheetDetail', {});

      playListDetail({ id })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            // 单独处理我喜欢的音乐
            if (res?.playlist?.name.includes('喜欢的音乐')) {
              res.playlist.name = '我喜欢的音乐';
            }
            $store.commit('music/setSongSheetDetail', res);
          }
        })
        .catch(() => ({}));
    }

    return {
      musicDetailOptions,
      optionsCount,
      songSheetList,
      subPlayListClick,
      MyVideoClick,
      createListClick,
      handleCollection
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
