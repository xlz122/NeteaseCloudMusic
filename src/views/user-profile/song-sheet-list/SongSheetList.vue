<template>
  <div class="song-sheet-container">
    <template v-if="songSheetList?.createSongSheet?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === Number($route.query.id)">
            我创建的歌单
          </span>
          <span v-else>
            {{ songSheetList?.createSongSheet[0]?.creator?.nickname }}
            创建的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.createSongSheet?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.createSongSheet"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="songSheetToPlaylistPlay(item?.id)"
              ></i>
            </div>
          </div>
          <p
            class="item-desc"
            :title="item?.name"
            @click="jumpSongSheetDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
        </li>
      </ul>
    </template>
    <template v-if="songSheetList?.collectSongSheet?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === Number($route.query.id)">
            我收藏的歌单
          </span>
          <span v-else>
            {{
              songSheetList?.collectSongSheet[0]?.creator?.nickname
            }}收藏的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.collectSongSheet?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.collectSongSheet"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="songSheetToPlaylistPlay(item?.id)"
              ></i>
            </div>
          </div>
          <p class="item-desc" :title="item?.name">{{ item?.name }}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { bigNumberTransform } from '@/utils/utils';
import { userPlayList } from '@/api/my-music';
import { playlistTrack } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/hooks/songFormat';

type SongSheet = {
  createSongSheet: SongSheetItem[];
  collectSongSheet: SongSheetItem[];
};

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  playCount: string | number;
  subscribed: boolean;
  creator: {
    nickname: string;
  };
};

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const userInfo = computed(() => $store.getters.userInfo);

watch(
  () => $route.query.id,
  curVal => {
    if (!curVal) {
      return;
    }

    getUserPlayList();
  },
  {
    immediate: true
  }
);

// 获取用户歌单列表
const songSheetList = reactive<SongSheet>({
  createSongSheet: [],
  collectSongSheet: []
});

function getUserPlayList(): void {
  userPlayList({ uid: Number($route.query.id) })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        songSheetList.createSongSheet = [];
        songSheetList.collectSongSheet = [];

        res.playlist.forEach((item: SongSheetItem) => {
          if (
            userInfo.value?.profile?.userId === Number($route.query.id) &&
            item?.name?.includes('喜欢的音乐')
          ) {
            item.name = '我喜欢的音乐';
          }

          item.playCount = bigNumberTransform(item?.playCount);
        });

        // 创建/收藏的歌单
        songSheetList.createSongSheet = res?.playlist.filter(
          (item: SongSheetItem) => !item.subscribed
        );
        songSheetList.collectSongSheet = res?.playlist.filter(
          (item: SongSheetItem) => item.subscribed
        );
      }
    })
    .catch(() => ({}));
}

// 歌单添加到播放列表并播放
function songSheetToPlaylistPlay(id: number): void {
  playlistTrack({ id: id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        // 过滤无版权
        const songList: SongType[] = res?.songs.filter(
          (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
        );

        usePlaySong(songList[0]);
        useSongAddPlaylist(songList, { clear: true });
      }
    })
    .catch(() => ({}));
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-sheet-list.less');
</style>
