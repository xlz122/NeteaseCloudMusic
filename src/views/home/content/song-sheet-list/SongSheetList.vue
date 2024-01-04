<template>
  <div class="song-sheet-list">
    <dl class="group" v-for="(item, index) in songSheet" :key="index">
      <dt class="top">
        <div class="top-img" @click="songListMore(item?.playlist?.id)">
          <img class="img" :src="item?.playlist?.coverImgUrl" alt="" />
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
            <i class="btn-play" title="播放" @click="playAllSong(index)"></i>
            <template v-if="!item?.playlist?.subscribed">
              <i
                class="btn-collection"
                title="收藏"
                @click="handleCollectAll(item?.playlist?.id)"
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
            <span class="num" :class="{ 'top-three': ind < 3 }">
              {{ ind + 1 }}
            </span>
            <p class="text" :title="i?.name" @click="jumpSongDetail(i.id)">
              {{ i?.name }}
            </p>
            <div class="operate">
              <i
                class="operate-play"
                title="播放"
                @click="playSingleSong(i)"
              ></i>
              <i
                class="operate-add"
                title="添加到播放列表"
                @click="singleSongToPlaylist(i)"
              ></i>
              <i
                class="operate-collection"
                title="收藏"
                @click="handleCollection(i.id)"
              ></i>
            </div>
          </li>
        </ul>
        <div class="more" @click="songListMore(item?.playlist?.id)">
          查看全部>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongToPlaylist from '@/hooks/useSongToPlaylist';
import { topList } from '@/api/home-toplist';
import { playlistDetail } from '@/api/song-sheet-detail';
import { playlistSubscribe } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/hooks/songFormat';

type SongSheetItem = {
  id?: number;
  playlist?: {
    id: number;
    name: string;
    coverImgUrl: string;
    subscribed: boolean;
    tracks: {
      id: number;
      name: string;
      noCopyrightRcmd: unknown;
    }[];
  };
};

const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

// 获取歌单榜单
const songSheet = ref<SongSheetItem[]>([]);

function getTopList(): void {
  topList()
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        const toplist = res?.list?.slice(0, 3) || [];

        Promise.allSettled(
          toplist.map((item: { id: number }) => getSongSheetDetail(item.id))
        )
          .then(res => {
            [].forEach.call(
              res,
              function (e: { status: string; value: SongSheetItem }) {
                if (e.status === 'fulfilled') {
                  songSheet.value.push(e.value);
                } else {
                  songSheet.value.push({});
                }
              }
            );
          })
          .catch(() => ({}));
      }
    })
    .catch(() => ({}));
}
getTopList();

// 获取歌单详情
function getSongSheetDetail(id: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    playlistDetail({ id })
      .then((res: ResponseType) => {
        if (res?.code === 200) {
          resolve(res);
        }

        reject();
      })
      .catch(() => reject());
  });
}

// 播放全部 - 默认播放列表第一项
function playAllSong(index: number): void {
  if (songSheet.value[index].playlist?.tracks?.length === 0) {
    return;
  }

  // 过滤无版权
  const tracks = songSheet.value[index].playlist?.tracks || [];
  const songList = tracks?.filter(item => !item.noCopyrightRcmd);

  usePlaySong(songList[0]);
  useSongToPlaylist(songList, { clear: true });
}

// 收藏
function handleCollectAll(id: number | undefined): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  // 1: 收藏 2: 取消收藏
  playlistSubscribe({ id: id!, t: 1 })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        songSheet.value.forEach(item => {
          if (item?.playlist && item?.playlist?.id === id) {
            item.playlist.subscribed = true;
          }
        });

        setMessage({ type: 'info', title: '收藏成功' });
        return;
      }

      setMessage({ type: 'error', title: '收藏失败' });
    })
    .catch(() => ({}));
}

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  usePlaySong(item);
  useSongToPlaylist(item);
}

// 单个音乐添加到播放列表
function singleSongToPlaylist(item: SongType): void {
  useSongToPlaylist(item);
}

// 收藏
function handleCollection(id: number): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  $store.commit('collectPlayMusic', {
    visible: true,
    songIds: id
  });
}

// 查看全部
function songListMore(id: number | undefined): void {
  $router.push({ path: '/home-toplist', query: { id } });
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-sheet-list.less');
</style>
