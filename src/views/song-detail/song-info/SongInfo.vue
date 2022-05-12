<template>
  <div class="user-info-container">
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
            <span
              class="text"
              :title="item?.name"
              @click="jumpSingerDetail(item.id)"
            >
              {{ item?.name }}
            </span>
            <span
              class="line"
              v-if="index !== songDetailData?.songs[0]?.ar?.length - 1"
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
        <div class="operate-btn">
          <div class="play" @click="playAllMusic">
            <span class="icon-mv" title="播放">播放</span>
          </div>
          <div
            class="play-add"
            title="添加到播放列表"
            @click="singleMusicToPlayList"
          ></div>
          <div
            class="other collection"
            @click="handleCollection(songDetailData?.songs[0]?.id)"
          >
            <span class="icon">收藏</span>
          </div>
          <div class="other share" @click="handleShare">
            <span class="icon">分享</span>
          </div>
          <div class="other download" @click="handleDownload">
            <span class="icon">下载</span>
          </div>
          <div class="other comment" @click="jumpToComments">
            <template v-if="commentTotal > 0">
              <span class="icon"> ({{ commentTotal }}) </span>
            </template>
            <template v-else>
              <span class="icon">评论</span>
            </template>
          </div>
        </div>
        <ul
          class="lyric-list"
          :class="[
            { 'lyric-list-auto': lyric?.list.length < 13 || toggleShow }
          ]"
        >
          <li
            class="lyric-list-item"
            v-for="(item, index) in lyric?.list"
            :key="index"
          >
            {{ item?.lyric }}
          </li>
        </ul>
        <div class="toggle-btn" v-if="lyric?.list.length > 13">
          <span v-if="!toggleShow" @click="toggle">
            <span class="text">展开</span>
            <i class="icon"></i>
          </span>
          <span v-else @click="toggle">
            <span class="text">收起</span>
            <i class="icon hide"></i>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
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
  emits: ['jumpToComments'],
  setup(props, { emit }) {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    // 歌曲id
    const songId = computed(() => $store.getters.songId);

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 播放单个歌曲
    function playAllMusic(): boolean | undefined {
      if (!props?.songDetailData?.songs.length) {
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

      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', musicItem);
      // 添加到播放列表
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(): boolean | undefined {
      if (!props?.songDetailData?.songs.length) {
        return false;
      }

      const item = props?.songDetailData?.songs[0];

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

      $store.commit('music/setPlayMusicList', musicItem);
    }

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function handleDownload(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 跳转至评论
    function jumpToComments(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      emit('jumpToComments');
    }

    // 歌词展开/收缩
    const toggleShow = ref<boolean>(false);
    function toggle(): void {
      toggleShow.value = !toggleShow.value;
    }

    return {
      songId,
      jumpSingerDetail,
      jumpAlbumDetail,
      playAllMusic,
      singleMusicToPlayList,
      handleCollection,
      handleShare,
      handleDownload,
      jumpToComments,
      toggleShow,
      toggle
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-info.less';
</style>
