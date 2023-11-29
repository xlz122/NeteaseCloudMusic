<template>
  <div class="song-sheet-side-container">
    <h3 class="title">喜欢这张专辑的人</h3>
    <ul class="like-list">
      <!-- <li
        class="item"
        v-for="(item, index) in []"
        :key="index"
        :class="{ 'first-item': !(index % 4) }"
        @click="jumpUserProfile(item?.userId)"
      >
        <router-link class="item-link" to="" :title="item?.nickname">
          <img class="item-img" :src="`${item?.avatarUrl}?param=40y40`" />
        </router-link>
      </li> -->
    </ul>
    <h3 class="title">
      Ta的其他热门专辑
      <span class="title-all" @click="jumpSingerDetail"> 全部> </span>
    </h3>
    <ul class="song-sheet-list">
      <li class="item" v-for="(item, index) in albumList" :key="index">
        <div
          class="item-cover"
          :title="item?.name"
          @click="jumpAlbumDetail(item?.id)"
        >
          <img class="cover-img" :src="`${item?.picUrl}?param=50y50`" alt="" />
        </div>
        <div class="item-info">
          <p
            class="info-title"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="info-desc">
            <span class="text">
              {{ formatDateTime(item?.publishTime || 0 / 1000, 'yyyy-MM-dd') }}
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
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { formatDateTime } from '@/utils/utils';
import { artistAlbum } from '@/api/album-detail';
import type { ResponseType } from '@/types/types';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type AlbumItem = {
  id: number;
  name: string;
  picUrl: string;
  publishTime: number;
};

defineProps({
  likePeople: {
    type: Array,
    default: () => []
  }
});

const $store = useStore();
const singerId = computed<number>(() => $store.getters.singerId);
const albumId = computed<number>(() => $store.getters.albumId);

// 获取歌手辑列表
const params = reactive({
  offset: 1,
  limit: 5
});
const albumList = ref<AlbumItem[]>([]);

function getArtistAlbum(): void {
  artistAlbum({
    id: singerId.value,
    offset: params.offset - 1,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        albumList.value = res?.hotAlbums || [];
      }
    })
    .catch(() => ({}));
}

// 跳转专辑详情
function jumpAlbumDetail(id: number | undefined): boolean | undefined {
  if (albumId.value === id) {
    return;
  }

  $store.commit('jumpAlbumDetail', id);
}

// 跳转歌手详情
function jumpSingerDetail(): void {
  $store.commit('setSingerTabIndex', 1);
  $store.commit('jumpSingerDetail', singerId.value);
}

watch(
  () => singerId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getArtistAlbum();
  },
  {
    immediate: true
  }
);
</script>

<style lang="less" scoped>
@import url('./album-detail-side.less');
</style>
