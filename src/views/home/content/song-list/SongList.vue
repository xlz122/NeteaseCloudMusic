<template>
  <div class="song-list">
    <dl class="group" v-for="(item, index) in listData" :key="index">
      <dt class="top">
        <div class="top-img" @click="songListMore(item.playlist.id)">
          <img
            class="img"
            :src="item?.playlist?.coverImgUrl"
            :alt="item?.playlist.name"
          />
        </div>
        <div class="title">
          <h3
            class="t-text"
            :title="item?.playlist?.name"
            @click="songListMore(item?.playlist?.id)"
          >
            {{ item?.playlist?.name }}
          </h3>
          <div class="btns">
            <i class="btn-play" title="播放" @click="playAllMusic(index)"></i>
            <template v-if="!item?.playlist?.subscribed">
              <i
                class="btn-collection"
                title="收藏"
                @click="handleCollectAll(item.playlist.id)"
              ></i>
            </template>
            <template v-if="item?.playlist?.subscribed">
              <i class="btn-collection subscribe" title="已收藏"></i>
            </template>
          </div>
        </div>
      </dt>
      <dd>
        <ul class="list">
          <li
            class="item"
            v-for="(i, ind) in item?.playlist?.tracks?.slice(0, 10)"
            :key="ind"
          >
            <span class="num" :class="{ topThree: ind < 3 }">
              {{ ind + 1 }}
            </span>
            <p class="text" :title="i?.name" @click="jumpSongDetail(i.id)">
              {{ i?.name }}
            </p>
            <div class="operate">
              <i
                class="operate-play"
                title="播放"
                @click="playSingleMusic(i)"
              ></i>
              <i
                class="operate-add"
                title="添加到播放列表"
                @click="setAddSinglePlayList(i)"
              ></i>
              <i
                class="operate-collection"
                title="收藏"
                @click="handleCollection(i.id)"
              ></i>
            </div>
          </li>
        </ul>
        <div class="more" @click="songListMore(item.playlist.id)">
          查看全部>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { handleAudioSong } from '@/common/audio.ts';
import { soaringList, newSongs, originalList } from '@api/home';
import { playlistSubscribe } from '@api/song-sheet-detail';
import type { ResponseType } from '@/types/types';
import type { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);

    const listData = reactive<Record<string, any>>([]);
    // 获取飙升榜数据
    function getSoaringList(): void {
      soaringList({ id: 19723756 })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            listData.push(res);
          }
        })
        .catch(() => ({}));
    }
    getSoaringList();

    // 获取新歌榜数据
    function getNewSongs(): void {
      newSongs({ id: 3779629 })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            listData.push(res);
          }
        })
        .catch(() => ({}));
    }
    getNewSongs();

    // 获取原创榜数据
    function getOriginalList(): void {
      originalList({ id: 2884035 })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            listData.push(res);
          }
        })
        .catch(() => ({}));
    }
    getOriginalList();

    // 播放全部 - 默认播放列表第一项
    const playAllMusic = throttle(
      function (index: number) {
        if (listData[index].playlist?.tracks.length === 0) {
          return false;
        }

        const songList: PlayMusicItem[] = [];

        listData[index].playlist?.tracks.forEach((item: unknown) => {
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
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 收藏
    function handleCollectAll(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      // 1:收藏 2:取消收藏
      playlistSubscribe({ id, t: 1 })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            listData.forEach(
              (item: Record<string, { id: number; subscribed: boolean }>) => {
                if (item.playlist.id === id) {
                  item.playlist.subscribed = true;
                }
              }
            );

            $store.commit('setMessage', {
              type: 'info',
              title: '收藏成功'
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

    // 播放单个歌曲
    function playSingleMusic(item: unknown): void {
      const musicItem: PlayMusicItem = handleAudioSong(item);

      // 当前播放音乐
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

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(item: unknown): void {
      const musicItem: PlayMusicItem = handleAudioSong(item);

      // 添加到播放列表
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

    // 查看全部
    function songListMore(id: number): void {
      $store.commit('setSongSheetId', id);
      $router.push({ name: 'home-toplist', params: { id } });
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    return {
      listData,
      playAllMusic,
      playSingleMusic,
      handleCollectAll,
      setAddSinglePlayList,
      handleCollection,
      songListMore,
      jumpSongDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-list.less';
</style>
