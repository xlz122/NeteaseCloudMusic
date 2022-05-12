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
      >用户wiki任务中心></a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { simiPlaylist, simiSong } from '@api/song-detail';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  setup() {
    const $store = useStore();

    // 歌曲id
    const songId = computed<number>(() => $store.getters.songId);

    const songSheetList = ref<unknown[]>([]);
    // 获取歌曲的歌单
    function getSimiPlaylist(): void {
      simiPlaylist({ id: songId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            songSheetList.value = res?.playlists;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSimiPlaylist();

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    const simiSongList = ref<Record<string, any>>([]);
    // 获取歌曲的相似歌曲
    function getSimiSong(): void {
      simiSong({ id: songId.value })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            simiSongList.value = res?.songs;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSimiSong();

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

    // 播放单个歌曲
    function playSingleMusic(item: Record<string, any>): void {
      // 处理播放器所需数据
      const musicItem: PlayMusicItem = {
        id: item.id,
        name: item.name,
        picUrl: item.album.picUrl,
        time: item.duration,
        mv: item.mv,
        singerList: [],
        targetType: 'song'
      };

      item?.ar?.forEach((item: LoopType) => {
        musicItem.singerList.push({
          id: item.id,
          name: item.name
        });
      });

      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', musicItem);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Record<string, any>): void {
      const musicItem: PlayMusicItem = {
        id: item.id,
        name: item.name,
        picUrl: item.album.picUrl,
        time: item.duration,
        mv: item.mv,
        singerList: [],
        targetType: 'song'
      };

      item?.ar?.forEach((item: LoopType) => {
        musicItem.singerList.push({
          id: item.id,
          name: item.name
        });
      });

      $store.commit('music/setPlayMusicList', musicItem);
    }

    return {
      songSheetList,
      jumpSongSheetDetail,
      jumpUserProfile,
      simiSongList,
      jumpSongDetail,
      jumpSingerDetail,
      playSingleMusic,
      singleMusicToPlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-detail-side.less';
</style>
