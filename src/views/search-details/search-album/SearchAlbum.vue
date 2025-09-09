<template>
  <div class="loading" v-if="albumData.loading">
    <i class="loading-icon"></i>
    <span>加载中...</span>
  </div>
  <ul class="search-album-list" v-if="!albumData.loading">
    <li class="search-album-item" v-for="(item, index) in albumData.list" :key="index">
      <div class="item-cover">
        <img
          class="item-cover-img"
          :src="`${item.picUrl}?param=130y130`"
          :title="item.name"
          @click="jumpAlbumDetail(item.id)"
          alt=""
        />
        <i class="item-cover-bg"></i>
        <i class="item-cover-play" title="播放" @click="albumToPlaylistPlay(item.id)"></i>
      </div>
      <p class="desc" :title="item.name" @click="jumpAlbumDetail(item.id)">
        <span v-html="handleMatchString(item.name, String(route.query.keyword))"></span>
      </p>
      <p class="name" :title="item.artist?.name" @click="jumpSingerDetail(item.artist?.id)">
        {{ item.artist?.name }}
      </p>
    </li>
  </ul>
  <Page
    v-if="albumData.total > albumData.limit"
    :page="albumData.offset"
    :pageSize="albumData.limit"
    :total="albumData.total"
    @onChange="handlePageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';

type AlbumData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: {
    id: number;
    name: string;
    picUrl: string;
    artist: {
      id: number;
      name: string;
    };
  }[];
};

const emits = defineEmits(['searchCountChange']);

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);

// 获取专辑列表
const albumData = reactive<AlbumData>({
  loading: false,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

function getSearchAlbum(): void {
  albumData.loading = true;

  searchKeywords({
    keywords: String(route.query.keyword),
    type: Number(route.query.type),
    offset: (albumData.offset - 1) * albumData.limit,
    limit: isLogin.value ? albumData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      if (!isLogin.value) {
        albumData.total = res.result?.albums?.length ?? 0;
      }
      if (isLogin.value) {
        albumData.total = res.result?.albumCount ?? 0;
      }
      albumData.list = res.result?.albums ?? [];
      albumData.loading = false;

      emits('searchCountChange', albumData.total);
    })
    .catch(() => ({}));
}

watch(
  () => route.query.keyword,
  () => {
    albumData.offset = 1;
    getSearchAlbum();
  },
  { immediate: true }
);

// 专辑添加到播放列表并播放
function albumToPlaylistPlay(id: number): void {
  albumDetail({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.songs?.length === 0) {
        return;
      }

      // 全部无版权
      const allNoCopyright = res.songs?.some?.(
        (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
      );
      if (!allNoCopyright) {
        store.commit('setCopyrightDialog', {
          visible: true,
          message: '由于版权保护，您所在的地区暂时无法使用。'
        });
        return;
      }

      // 过滤无版权
      const songList: SongType[] = res.songs?.filter?.(
        (item: Record<string, { cp: number }>) => item.privilege?.cp !== 0
      );

      usePlaySong(songList[0]);
      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

function handlePageChange(current: number): void {
  albumData.offset = current;
  getSearchAlbum();
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-album.less');
</style>
