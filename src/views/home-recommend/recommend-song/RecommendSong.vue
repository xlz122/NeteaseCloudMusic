<template>
  <div class="music-table-container">
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table class="play-list-table" v-if="recommendSong?.length > 0">
      <thead>
        <tr>
          <th class="th first-th">
            <i class="icon"></i>
          </th>
          <th class="th two-th">
            <i class="icon"></i>
          </th>
          <th class="th three-th">
            <i class="icon"></i>
          </th>
          <th class="th four-th">
            <i class="icon"></i>
          </th>
          <th class="th five-th">
            <i class="icon"></i>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in recommendSong"
          :key="index"
          :class="[{ 'even-tr': (index + 1) % 2 }]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playSingleMusic(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item?.id)">
                <span class="title" :title="`${item?.name}`">
                  {{ item?.name }}
                </span>
                <span class="no-click" v-if="item?.alia[0]">
                  - {{ item?.alia[0] }}
                </span>
              </span>
              <i class="icon-play" v-if="item?.mv > 0"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item.dt / 1000) }}
              </span>
              <div class="operate-btn">
                <i
                  class="icon add"
                  title="添加到播放列表"
                  @click="singleMusicToPlayList(item)"
                ></i>
                <i
                  class="icon collect"
                  title="收藏"
                  @click="handleCollection(item?.id)"
                ></i>
                <i class="icon share" title="分享" @click="handleShare"></i>
                <i
                  class="icon download"
                  title="下载"
                  @click="handleDownload"
                ></i>
              </div>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <div class="text" v-for="(i, ind) in item?.ar" :key="ind">
                <span
                  class="name"
                  :title="i?.name"
                  @click="jumpSingerDetail(i?.id)"
                >
                  {{ i?.name }}
                </span>
                <span class="line" v-if="ind !== item?.ar?.length - 1">/</span>
              </div>
            </div>
          </td>
          <td class="tbody-td" @click="jumpAlbumDetail(item?.al?.id)">
            <div class="hd">
              <span class="text" :title="item?.al?.name">
                {{ item?.al?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-list-data" v-if="!loading && recommendSong?.length === 0">
      <div class="title">
        <i class="icon"></i>
        <h3 class="text">暂无音乐！</h3>
      </div>
      <p class="desc">
        <span class="text">点击</span>
        <span class="icon"></span>
        <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
        <span class="text go">马上去</span>
        <router-link class="link" to="/">发现音乐</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { handleAudioSong } from '@/common/audio.ts';
import { timeStampToDuration } from '@utils/utils.ts';
import { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  props: {
    recommendSong: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { recommendSong } = toRefs(props);

    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    const loading = ref<boolean>(true);
    watch(
      () => recommendSong.value,
      () => {
        loading.value = false;
      }
    );

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Record<string, any>): void {
      const musicItem: PlayMusicItem = handleAudioSong(item);

      $store.commit('music/setPlayMusicList', musicItem);
    }

    // 播放单个歌曲
    function playSingleMusic(item: Record<string, any>): void {
      const musicItem: PlayMusicItem = handleAudioSong(item);

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

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    return {
      timeStampToDuration,
      playMusicId,
      loading,
      jumpSongDetail,
      playSingleMusic,
      singleMusicToPlayList,
      handleCollection,
      handleShare,
      handleDownload,
      jumpSingerDetail,
      jumpAlbumDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './recommend-song.less';
</style>
