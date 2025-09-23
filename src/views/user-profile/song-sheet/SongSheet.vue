<template>
  <div class="song-sheet-container">
    <template v-if="songSheetList.create?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo.profile?.userId === Number(route.query.id)"> 我创建的歌单 </span>
          <span v-else>
            {{ songSheetList.create?.[0]?.creator?.nickname }}
            创建的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">({{ songSheetList.create?.length }})</span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList.create"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item.coverImgUrl}?param=140y140`"
              :title="item.name"
              @click="jumpSongSheetDetail(item.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ formatLargeNumber(item.playCount) }}</span>
              <i class="info-icon-right" title="播放" @click="songSheetToPlaylistPlay(item.id)"></i>
            </div>
          </div>
          <p class="item-desc" :title="item.name" @click="jumpSongSheetDetail(item.id)">
            {{ item.name }}
          </p>
        </li>
      </ul>
    </template>
    <template v-if="songSheetList.collect?.length > 0">
      <div class="title">
        <div class="text">
          <template v-if="userInfo.profile?.userId === Number(route.query.id)">
            <span>我收藏的歌单</span>
          </template>
          <template v-else>
            <span span class="text">
              {{ songSheetList.collect?.[0]?.creator?.nickname }}
            </span>
            <span>收藏的歌单</span>
          </template>
          <i class="icon-r"></i>
        </div>
        <span class="text-length">({{ songSheetList.collect?.length }})</span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList.collect"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item.coverImgUrl}?param=140y140`"
              :title="item.name"
              @click="jumpSongSheetDetail(item.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ formatLargeNumber(item.playCount) }}</span>
              <i class="info-icon-right" title="播放" @click="songSheetToPlaylistPlay(item.id)"></i>
            </div>
          </div>
          <p class="item-desc" :title="item.name" @click="jumpSongSheetDetail(item.id)">
            {{ item.name }}
          </p>
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
import { formatLargeNumber } from '@/utils/utils';
import { userPlayList } from '@/api/my-music';
import { playlistTrack } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type SongSheet = {
  create: SongSheetItem[];
  collect: SongSheetItem[];
};

type SongSheetItem = {
  id: number;
  userId: number;
  name: string;
  coverImgUrl: string;
  playCount: number;
  subscribed: boolean;
  creator: {
    nickname: string;
  };
};

const route = useRoute();
const router = useRouter();
const store = useStore();
const userInfo = computed(() => store.getters.userInfo);

// 获取歌单列表
const songSheetList = reactive<SongSheet>({
  create: [],
  collect: []
});

function getUserPlayList(): void {
  userPlayList({ uid: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      // 登录用户
      if (userInfo.value.profile?.userId === Number(route.query.id)) {
        songSheetList.create = res.playlist?.filter?.((item: SongSheetItem) => !item.subscribed);
        songSheetList.collect = res.playlist?.filter?.((item: SongSheetItem) => item.subscribed);
        return;
      }

      // 其他用户
      songSheetList.create = res.playlist?.filter?.(
        (item: SongSheetItem) => item.userId === Number(route.query.id)
      );
      songSheetList.collect = res.playlist?.filter?.(
        (item: SongSheetItem) => item.userId !== Number(route.query.id)
      );
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getUserPlayList();
  },
  { immediate: true }
);

// 歌单添加到播放列表并播放
function songSheetToPlaylistPlay(id: number): void {
  playlistTrack({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.songs?.length === 0) {
        return;
      }

      // 过滤无版权
      const songList: SongType[] = res.songs?.filter?.(
        (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
      );

      usePlaySong(songList[0]);
      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

function jumpSongSheetDetail(id: number): void {
  router.push({ path: '/song-sheet-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./song-sheet.less');
</style>
