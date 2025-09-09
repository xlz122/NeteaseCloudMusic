<template>
  <div class="home-song-sheet">
    <div class="home-song-sheet-container">
      <div class="title">
        <span class="text">{{ title }}</span>
        <div class="classify-btn" @click="classifyModal">
          <i class="icon">
            <span class="text">选择分类</span>
            <span class="arrow"></span>
          </i>
        </div>
        <ClassifyModal v-show="classifyShow" @catChange="catChange" />
        <div class="hot-btn" @click="hotSong">
          <span class="text">热门</span>
        </div>
      </div>
      <ul class="list-content">
        <li
          class="item"
          v-for="(item, index) in songSheet"
          :key="index"
          :class="{ 'last-item': songSheet.length > 2 && !(index % 5) }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item.coverImgUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item.id)"
            />
            <i class="high-quality" v-if="item.highQuality"></i>
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ formatLargeNumber(item.playCount) }}</span>
              <i class="info-icon-right" title="播放" @click="songSheetToPlaylistPlay(item.id)"></i>
            </div>
          </div>
          <div class="item-bottom">
            <span class="text" :title="item.name" @click="jumpSongSheetDetail(item.id)">
              {{ item.name }}
            </span>
            <div class="desc">
              <span class="by">by</span>
              <span
                class="text"
                :title="item.creator?.nickname"
                @click="jumpUserProfile(item.creator?.userId)"
              >
                {{ item.creator?.nickname }}
              </span>
              <template v-if="item.creator?.avatarDetail?.identityIconUrl">
                <img class="desc-img" :src="item.creator?.avatarDetail?.identityIconUrl" alt="" />
              </template>
            </div>
          </div>
        </li>
      </ul>
      <Page
        v-if="params.total > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="params.total"
        @onChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatLargeNumber } from '@/utils/utils';
import { topPlaylist } from '@/api/home-song-sheet';
import { playlistTrack } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';
import ClassifyModal from './classify-modal/ClassifyModal.vue';

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  highQuality: boolean;
  playCount: number;
  creator: {
    userId: number;
    nickname: string;
    avatarDetail: {
      identityIconUrl: string;
    };
  };
};

const route = useRoute();
const router = useRouter();
const store = useStore();

// 获取热门歌单
const params = reactive({
  order: 'hot',
  cat: '全部',
  offset: 1,
  limit: 50,
  total: 0
});
const title = ref('全部');
const songSheet = ref<SongSheetItem[]>([]);

function getTopPlaylist(): void {
  topPlaylist({
    order: params.order,
    cat: params.cat,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      params.total = res.total ?? 0;
      title.value = res.cat ?? '';
      songSheet.value = res.playlists ?? [];
    })
    .catch(() => ({}));
}

watch(
  () => route.query.name,
  () => {
    if (!route.query.name) {
      params.cat = '全部';
    }
    if (route.query.name) {
      params.cat = String(route.query.name);
    }

    getTopPlaylist();
  },
  { immediate: true }
);

// 热门
function hotSong(): void {
  if (params.cat === '全部') {
    return;
  }

  params.cat = '全部';
  params.offset = 1;
  getTopPlaylist();
}

// 分类弹框
const classifyShow = ref(false);

function classifyModal(): void {
  classifyShow.value = !classifyShow.value;
}

// 分类点击
function catChange(name: string): void {
  if (params.cat === '全部' && name === '全部') {
    return;
  }

  params.cat = name;
  params.offset = 1;
  getTopPlaylist();
  classifyShow.value = false;
}

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
      res.songs = res.songs?.slice?.(0, 20) ?? [];
      const songList: SongType[] = res.songs?.filter?.(
        (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
      );

      usePlaySong(songList[0]);
      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

function handlePageChange(current: number): void {
  params.offset = current;
  getTopPlaylist();
}

function jumpSongSheetDetail(id: number): void {
  router.push({ path: '/song-sheet-detail', query: { id } });
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

onMounted(() => {
  store.commit('setMenuIndex', 0);
});
</script>

<style lang="less" scoped>
@import url('./home-song-sheet.less');
</style>
