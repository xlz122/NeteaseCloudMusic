<template>
  <div class="music-table-container">
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table class="play-list-table" v-if="songs.length > 0">
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
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in songs"
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
              <span class="text" @click="jumpSongDetail(item.id)">
                <span class="title" :title="item.name">{{ item.name }}</span>
                <span class="no-click" v-if="item.alia[0]">
                  - {{ item.alia[0] }}
                </span>
              </span>
              <i
                class="icon-mv"
                v-if="item.mv > 0"
                @click="jumpVideoDetail(item.mv)"
              ></i>
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
                  @click="handleCollection(item.id)"
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
              <div class="text" v-for="(i, ind) in item.ar" :key="ind">
                <span
                  class="name"
                  :title="i.name"
                  @click="jumpSingerDetail(i.id)"
                >
                  {{ i.name }}
                </span>
                <span class="line" v-if="ind !== item.ar.length - 1">/</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 音乐列表空时展示 -->
    <div class="no-list-data" v-if="noData">
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
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';
import { LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    noData: {
      type: Boolean,
      default: false
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed(() => $store.getters.isLogin);
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number): void {
      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('setVideo', { id, url: '' });
    }

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Record<string, any>): void {
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
    }

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('music/collectPlayMusic', {
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

    // 播放单个歌曲
    function playSingleMusic(item: Record<string, any>): void {
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
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    return {
      timeStampToDuration,
      playMusicId,
      jumpSongDetail,
      jumpVideoDetail,
      jumpSingerDetail,
      singleMusicToPlayList,
      handleCollection,
      handleShare,
      handleDownload,
      playSingleMusic
    };
  }
});
</script>

<style lang="less" scoped>
@import './album-song.less';
</style>
