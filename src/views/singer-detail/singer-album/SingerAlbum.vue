<template>
  <div class="singer-album">
    <div class="singer-album-container">
      <ul class="new-disc-list">
        <li class="new-disc-item" v-for="(item, index) in singerAlbum.hotAlbums" :key="index">
          <div class="item-cover">
            <img class="item-cover-img" :src="`${item.picUrl}?param=120y120`" alt="" />
            <i class="item-cover-bg" :title="item.name" @click="jumpAlbumDetail(item.id)"></i>
            <i class="item-cover-play" title="播放" @click="albumToPlaylistPlay(item.id)"></i>
          </div>
          <p class="desc" :title="item.name" @click="jumpAlbumDetail(item.id)">
            {{ item.name }}
          </p>
          <p class="name">
            {{ formatTimestamp(item.publishTime, 'YYYY.MM.DD') }}
          </p>
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
import { ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatTimestamp } from '@/utils/utils';
import { artistAlbum } from '@/api/album-detail';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';

type SingerAlbum = {
  hotAlbums: {
    id: number;
    name: string;
    picUrl: string;
    publishTime: number;
  }[];
};

const route = useRoute();
const router = useRouter();
const store = useStore();

// 获取歌手 - 专辑
const params = reactive({
  offset: 1,
  limit: 12,
  total: 0
});
const singerAlbum = ref<SingerAlbum>({
  hotAlbums: []
});

function getArtistAlbum(): void {
  artistAlbum({
    id: Number(route.query.id),
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      singerAlbum.value.hotAlbums = res.hotAlbums ?? [];
      params.total = res.artist?.albumSize ?? 0;
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getArtistAlbum();
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
          message: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
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
  params.offset = current;
  getArtistAlbum();
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./singer-album.less');
</style>
