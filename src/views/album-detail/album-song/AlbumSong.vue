<template>
  <div class="music-table-container">
    <!-- loading -->
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <!-- 歌曲列表部分 -->
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
                @click="playListMusic(item)"
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
              <i class="icon-play" v-if="item.mv > 0"></i>
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
                  @click="setAddSinglePlayList(item)"
                ></i>
                <i class="icon collect" title="收藏"></i>
                <i class="icon share" title="分享"></i>
                <i class="icon download" title="下载"></i>
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
        <span class="link">发现音乐</span>
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

    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌曲id
      $store.commit('setSongId', id);
      $router.push({ name: 'song-detail', params: { songId: id } });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(item: Record<string, any>): void {
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

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 播放列表音乐
    function playListMusic(item: Record<string, any>): void {
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
      jumpSingerDetail,
      setAddSinglePlayList,
      playListMusic
    };
  }
});
</script>

<style lang="less" scoped>
@import './album-song.less';
</style>
