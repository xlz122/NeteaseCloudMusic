<template>
  <div class="singer-song">
    <div class="operate-btn">
      <div
        class="play"
        :class="{
          'disable-play': singerSong?.hotSongs.length === 0
        }"
        @click="playTitleMusic"
      >
        <span class="icon-play">播放</span>
      </div>
      <div
        class="play-add"
        :class="{
          'disable-play-add': singerSong?.hotSongs.length === 0
        }"
        @click="setAddPlayList"
      ></div>
    </div>
    <!-- loading -->
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <!-- 歌曲列表部分 -->
    <table class="play-list-table" v-if="singerSong?.hotSongs.length > 0">
      <thead>
        <tr>
          <th class="th first-th"></th>
          <th class="th two-th"></th>
          <th class="th three-th"></th>
          <th class="th four-th"></th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in singerSong?.hotSongs"
          :key="index"
          :class="[{ 'even-tr': (index + 1) % 2 }]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playListMusic(item.id, item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item.id)">
                <span class="name">{{ item.name }}</span>
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
                <i class="icon add" @click="setAddSinglePlayList(item.id)"></i>
                <i class="icon collect"></i>
                <i class="icon share"></i>
                <i class="icon download"></i>
              </div>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">{{ item.al.name }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 音乐列表空时展示 -->
    <div class="no-list-data" v-if="singerSong?.hotSongs.length === 0">
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
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistSong } from '@api/singer-detail';
import { timeStampToDuration } from '@utils/utils.ts';
import { ResponseType, LoopType } from '@/types/types';
import { throttle } from 'lodash';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);

    // 监听歌手id改变
    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistSong();
        }
      }
    );

    // 歌曲数据
    const singerSong = ref();

    // 获取歌手单曲
    const loading = ref<boolean>(true);
    function getArtistSong(): void {
      artistSong({ id: singerId.value })
        .then((res: ResponseType) => {
          loading.value = false;
          if (res.code === 200) {
            singerSong.value = res;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistSong();

    // 头部播放 - 默认播放列表第一项
    const playTitleMusic = throttle(
      function () {
        if (singerSong.value?.hotSongs?.length === 0) {
          return false;
        }
        // 播放第一项
        const musicItem = singerSong.value?.hotSongs[0];
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
        singerSong.value?.hotSongs.forEach((item: LoopType) => {
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', item);
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): boolean | undefined {
      if (singerSong.value?.hotSongs?.length === 0) {
        return false;
      }
      singerSong.value?.hotSongs?.forEach((item: LoopType) => {
        // 播放音乐数据
        $store.commit('music/setPlayMusicList', item);
      });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(id: number): void {
      if (singerSong.value?.hotSongs?.length > 0) {
        const musicItem = singerSong.value?.hotSongs?.find(
          (item: LoopType) => item.id === id
        );
        // 播放音乐数据
        $store.commit('music/setPlayMusicList', musicItem);
      }
    }

    // 播放列表音乐
    function playListMusic(id: number, item: Record<string, any>): void {
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌曲id
      $store.commit('setSongId', id);
      $router.push({ name: 'song-detail', params: { songId: id } });
    }

    return {
      timeStampToDuration,
      singerSong,
      playMusicId,
      loading,
      playTitleMusic,
      setAddPlayList,
      setAddSinglePlayList,
      playListMusic,
      jumpSongDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-song.less';
</style>
