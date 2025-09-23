<template>
  <div class="side-container">
    <h3 class="title">喜欢这张专辑的人</h3>
    <ul class="like-list"></ul>
    <h3 class="title">
      Ta的其他热门专辑
      <span class="title-all" @click="jumpSingerDetail"> 全部> </span>
    </h3>
    <ul class="song-sheet-list">
      <li class="item" v-for="(item, index) in albumList" :key="index">
        <div class="item-cover" :title="item.name" @click="jumpAlbumDetail(item.id)">
          <img class="cover-img" :src="`${item.picUrl}?param=50y50`" alt="" />
        </div>
        <div class="item-info">
          <p class="info-title" :title="item.name" @click="jumpAlbumDetail(item.id)">
            {{ item.name }}
          </p>
          <div class="info-desc">
            <span class="text">
              {{ formatTimestamp(item.publishTime, 'YYYY-MM-DD') }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatTimestamp } from '@/utils/utils';
import { artistAlbum } from '@/api/album-detail';
import type { ResponseType } from '@/types';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type AlbumItem = {
  id: number;
  name: string;
  picUrl: string;
  publishTime: number;
};

const props = defineProps({
  singerId: {
    type: Number,
    default: () => 0
  }
});

const router = useRouter();

// 获取歌手辑列表
const params = reactive({
  offset: 1,
  limit: 5
});
const albumList = ref<AlbumItem[]>([]);

function getArtistAlbum(): void {
  artistAlbum({
    id: props.singerId,
    offset: params.offset - 1,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      albumList.value = res.hotAlbums ?? [];
    })
    .catch(() => ({}));
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}

function jumpSingerDetail(): void {
  router.push({ path: '/singer-detail', query: { id: props.singerId } });
}

watch(
  () => props.singerId,
  () => {
    if (!props.singerId) {
      return;
    }

    getArtistAlbum();
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import url('./album-side.less');
</style>
