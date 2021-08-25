<template>
  <div class="song-user-info-container">
    <template v-if="songDetailData?.songs?.length">
      <div class="cover-warp">
        <div class="cover">
          <img
            class="cover-img"
            :src="`${songDetailData?.songs[0]?.al?.picUrl}?param=130y130`"
            alt=""
          />
          <span class="cover-img-bg"></span>
        </div>
        <div class="out">
          <i class="icon"></i>
          <a
            class="link"
            :href="`https://music.163.com/#/outchain/2/${songId}`"
          >
            生成外链播放器
          </a>
        </div>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">{{ songDetailData?.songs[0]?.name }}</h2>
        </div>
        <div class="info">
          <span>歌手：</span>
          <template
            v-for="(item, index) in songDetailData?.songs[0]?.ar"
            :key="index"
          >
            <span class="text" @click="jumpSingerDetail(item.id)">
              {{ item.name }}
            </span>
            <span
              class="line"
              v-if="index !== songDetailData?.songs[0]?.ar.length - 1"
              >/</span
            >
          </template>
        </div>
        <div class="info">
          <span>所属专辑：</span>
          <span
            class="text"
            @click="jumpAlbumDetail(songDetailData?.songs[0]?.al?.id)"
          >
            {{ songDetailData?.songs[0]?.al?.name }}
          </span>
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div class="play" @click="playTitleMusic">
            <span class="icon-play">播放</span>
          </div>
          <div class="play-add" @click="setAddSinglePlayList"></div>
          <div class="other collection" @click="collectionClick">
            <span class="icon">收藏</span>
          </div>
          <div class="other share" @click="shareClick">
            <span class="icon">分享</span>
          </div>
          <div class="other download" @click="downloadClick">
            <span class="icon">下载</span>
          </div>
          <div class="other comment" @click="commentClick">
            <template v-if="commentTotal > 0">
              <span class="icon"> ({{ commentTotal }}) </span>
            </template>
            <template v-else>
              <span class="icon">评论</span>
            </template>
          </div>
        </div>
        <!-- 歌词列表 -->
        <ul class="lyric-list">
          <li
            class="lyric-list-item"
            v-for="(item, index) in lyric.list"
            :key="index"
          >
            {{ item.lyric }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { PlayMusicItem } from '@store/music/state';
import { LoopType } from '@/types/types';

export default defineComponent({
  props: {
    songDetailData: {
      type: Object,
      default: () => ({})
    },
    lyric: {
      typs: Object,
      default: () => ({})
    },
    commentTotal: {
      typs: Number,
      default: 0
    }
  },
  emits: ['commentClick'],
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    // 歌曲id
    const songId = computed(() => $store.getters.songId);

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 播放列表音乐
    function playTitleMusic(): boolean | undefined {
      if (!props?.songDetailData?.songs?.length) {
        return false;
      }

      const item = props?.songDetailData?.songs[0];

      // 处理播放器所需数据
      const musicItem: PlayMusicItem = {
        id: item.id,
        name: item.name,
        picUrl: item.al.picUrl,
        time: item.dt,
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

      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', musicItem.id);
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

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(): boolean | undefined {
      if (!props?.songDetailData?.songs?.length) {
        return false;
      }

      const item = props?.songDetailData?.songs[0];

      // 处理播放器所需数据
      const musicItem: PlayMusicItem = {
        id: item.id,
        name: item.name,
        picUrl: item.al.picUrl,
        time: item.dt,
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

      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
    }

    // 收藏
    function collectionClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function downloadClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function commentClick(): void {
      emit('commentClick');
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $router.push({ name: 'album-detail', params: { albumId: id } });
    }

    return {
      songId,
      jumpSingerDetail,
      playTitleMusic,
      setAddSinglePlayList,
      collectionClick,
      shareClick,
      downloadClick,
      commentClick,
      jumpAlbumDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-info.less';
</style>
