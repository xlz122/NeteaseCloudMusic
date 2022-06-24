<template>
  <div class="loading" v-if="songSheetData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-song-sheet" v-if="!songSheetData?.loading">
    <li
      class="item"
      v-for="(item, index) in songSheetData?.list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div
        class="td play-icon"
        :class="{ 'active-play': item.id === playMusicId }"
        title="播放"
        @click="songSheetToPlayListPlay(item?.id)"
      ></div>
      <div class="td td1">
        <img
          class="cover-img"
          :src="item?.coverImgUrl"
          :title="item?.name"
          alt=""
          @click="jumpSongSheetDetail(item?.id)"
        />
      </div>
      <div class="td td2">
        <span
          class="text"
          :title="item?.name"
          @click="jumpSongSheetDetail(item?.id)"
        >
          <template
            v-for="(item, index) in handleMatchString(
              item?.name,
              searchDetailText
            )"
            :key="index"
          >
            <span v-if="item.color" :style="{ color: item.color }">
              {{ item.title }}
            </span>
            <span v-else>
              {{ item.title }}
            </span>
          </template>
        </span>
      </div>
      <div class="td td3-sheet">
        <div class="operate-btn">
          <i
            class="icon add"
            title="添加到播放列表"
            @click="songSheetToPlayList(item?.id)"
          ></i>
          <i
            class="icon collect"
            :class="`${item?.subscribed ? 'collectd' : ''}`"
            :title="`${item?.subscribed ? '已收藏' : '收藏'}`"
            @click="handleCollection(item?.id, item?.subscribed)"
          ></i>
          <i class="icon share" title="分享" @click="shareClick"></i>
        </div>
      </div>
      <div class="td4-sheet">101首</div>
      <div class="td5-sheet">
        <div class="name">
          <span class="by">by</span>
          <span
            class="text"
            :title="item?.creator?.nickname"
            @click="jump(item?.userId)"
          >
            {{ item?.creator?.nickname }}
          </span>
        </div>
      </div>
      <div class="td6-sheet">收藏: {{ item?.bookCount }}</div>
      <div class="td6-sheet">
        收听: {{ bigNumberTransform(item?.playCount) }}
      </div>
    </li>
  </ul>
  <Page
    v-if="songSheetData.total > songSheetData.limit"
    :page="songSheetData.offset"
    :pageSize="songSheetData.limit"
    :total="songSheetData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { handleAudioSong } from '@/common/audio.ts';
import { bigNumberTransform, handleMatchString } from '@utils/utils.ts';
import { searchKeywords } from '@api/search';
import { playlistTrack, playlistSubscribe } from '@api/song-sheet-detail';
import type { PlayMusicItem } from '@store/music/state';
import type { ResponseType, LoopType } from '@/types/types';
import Page from '@components/page/Page.vue';

type songSheetData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    searchDetailText: {
      type: String,
      default: ''
    }
  },
  emits: ['searchCountChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );
    // 搜索关键词
    const searchText = computed<string>(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const songSheetData = reactive<songSheetData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    watch(
      () => searchDetailText.value,
      () => {
        getSearchSongSheet();
      }
    );

    // 获取歌单列表
    function getSearchSongSheet(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (songSheetData.offset - 1) * songSheetData.limit,
        limit: isLogin.value ? songSheetData.limit : 20,
        type: 1000
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            const total = isLogin.value
              ? res?.result?.playlistCount
              : res?.result?.playlists.length;

            songSheetData.total = total;
            songSheetData.list = res?.result?.playlists;

            emit('searchCountChange', total || 0);
          }

          songSheetData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSongSheet();

    // 歌单歌曲添加到播放器并播放
    function songSheetToPlayListPlay(id: number): void {
      playlistTrack({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }

            const songList: PlayMusicItem[] = [];

            res?.songs.forEach((item: LoopType) => {
              const musicItem: PlayMusicItem = handleAudioSong(item);

              songList.push(musicItem);
            });

            // 当前播放音乐
            $store.commit('music/setPlayMusicItem', songList[0]);
            // 添加到播放列表
            $store.commit('music/setPlayMusicList', songList);
            // 开始播放
            $store.commit('music/setMusicPlayStatus', {
              look: true,
              refresh: true
            });
          }
        })
        .catch(() => ({}));
    }

    // 歌单歌曲添加到播放器
    function songSheetToPlayList(id: number): void {
      playlistTrack({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }

            const songList: PlayMusicItem[] = [];

            res?.songs.forEach((item: LoopType) => {
              const musicItem: PlayMusicItem = handleAudioSong(item);

              songList.push(musicItem);
            });

            // 当前播放音乐
            $store.commit('music/setPlayMusicItem', songList[0]);
            // 添加到播放列表
            $store.commit('music/setPlayMusicList', songList);
          }
        })
        .catch(() => ({}));
    }

    // 收藏歌单
    function handleCollection(
      id: number,
      subscribed: boolean
    ): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      if (subscribed) {
        return false;
      }

      playlistSubscribe({ id, t: 1 })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            $store.commit('setMessage', {
              type: 'info',
              title: '收藏成功'
            });

            songSheetData.list.forEach((item: unknown) => {
              if (id === (item as { id: number }).id) {
                (item as { subscribed: boolean }).subscribed = true;
              }
            });
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: '收藏失败'
            });
          }
        })
        .catch(() => ({}));
    }

    // 分享
    function shareClick(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分页
    function changPage(current: number): void {
      songSheetData.offset = current;
      getSearchSongSheet();
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      bigNumberTransform,
      handleMatchString,
      playMusicId,
      userInfo,
      songSheetData,
      songSheetToPlayListPlay,
      songSheetToPlayList,
      handleCollection,
      shareClick,
      changPage,
      jumpSongSheetDetail,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song-sheet.less';
</style>
