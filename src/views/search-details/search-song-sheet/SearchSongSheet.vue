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
        @click="songSheetToPlayList(item?.id)"
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
          {{ item?.name }}
        </span>
      </div>
      <!-- 操作项 -->
      <div class="td td3-sheet">
        <div class="operate-btn">
          <i
            class="icon add"
            title="添加到播放列表"
            @click="singleMusicToPlayList(item?.id)"
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
    v-if="songSheetData.total"
    :page="songSheetData.offset"
    :pageSize="songSheetData.limit"
    :total="songSheetData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { playlistTrack, playlistSubscribe } from '@api/song-sheet-detail';
import { PlayMusicItem } from '@store/music/state';
import { bigNumberTransform } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType, LoopType } from '@/types/types';

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
    // 当前播放音乐id
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

    // 获取单曲列表
    function getSearchSongSheet(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (songSheetData.offset - 1) * songSheetData.limit,
        limit: songSheetData.limit,
        type: 1000
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            songSheetData.total = res?.result?.playlistCount;
            songSheetData.list = res?.result?.playlists;
            emit('searchCountChange', res?.result?.playlistCount);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
          songSheetData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSongSheet();

    // 歌单歌曲添加到播放器
    function songSheetToPlayList(id: number): void {
      playlistTrack({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }
            // 播放第一项
            const item = res?.songs[0];

            // 处理播放器所需数据
            const musicItem: PlayMusicItem = {
              id: item.id,
              name: item.name,
              picUrl: item.al.picUrl,
              time: item.dt,
              mv: item.mv,
              singerList: []
            };

            item?.ar?.forEach((item: LoopType) => {
              musicItem.singerList.push({
                id: item.id,
                name: item.name
              });
            });

            // 当前播放音乐id
            $store.commit('music/setPlayMusicId', musicItem.id);
            // 当前播放音乐数据
            $store.commit('music/setPlayMusicItem', musicItem);
            // 开始播放
            $store.commit('music/setMusicPlayStatus', {
              look: true,
              refresh: true
            });

            // 添加播放列表
            res?.songs.forEach((item: LoopType) => {
              // 处理播放器所需数据
              const musicItem: PlayMusicItem = {
                id: item.id,
                name: item.name,
                picUrl: item.al.picUrl,
                time: item.dt,
                mv: item.mv,
                singerList: []
              };

              item?.ar?.forEach((item: LoopType) => {
                musicItem.singerList.push({
                  id: item.id,
                  name: item.name
                });
              });
              // 播放音乐数据
              $store.commit('music/setPlayMusicList', musicItem);
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(id: number): void {
      playlistTrack({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }
            // 播放第一项
            const item = res?.songs[0];

            // 处理播放器所需数据
            const musicItem: PlayMusicItem = {
              id: item.id,
              name: item.name,
              picUrl: item.al.picUrl,
              time: item.dt,
              mv: item.mv,
              singerList: []
            };

            item?.ar?.forEach((item: LoopType) => {
              musicItem.singerList.push({
                id: item.id,
                name: item.name
              });
            });

            // 当前播放音乐id
            $store.commit('music/setPlayMusicId', musicItem.id);
            // 当前播放音乐数据
            $store.commit('music/setPlayMusicItem', musicItem);

            // 添加播放列表
            res?.songs.forEach((item: LoopType) => {
              // 处理播放器所需数据
              const musicItem: PlayMusicItem = {
                id: item.id,
                name: item.name,
                picUrl: item.al.picUrl,
                time: item.dt,
                mv: item.mv,
                singerList: []
              };

              item?.ar?.forEach((item: LoopType) => {
                musicItem.singerList.push({
                  id: item.id,
                  name: item.name
                });
              });
              // 播放音乐数据
              $store.commit('music/setPlayMusicList', musicItem);
            });
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
              title: res?.msg
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

    return {
      bigNumberTransform,
      playMusicId,
      userInfo,
      songSheetData,
      songSheetToPlayList,
      jumpSongSheetDetail,
      jumpUserProfile,
      singleMusicToPlayList,
      handleCollection,
      shareClick,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song-sheet.less';
</style>
