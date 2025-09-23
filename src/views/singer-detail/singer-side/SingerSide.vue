<template>
  <div class="side-container">
    <template v-if="hotSinger.length > 0">
      <h3 class="title">热门歌手</h3>
      <ul class="like-list">
        <li
          class="item"
          v-for="(item, index) in hotSinger"
          :key="index"
          :class="{ 'first-item': !(index % 3) }"
          @click="jumpSingerDetail(item.id)"
        >
          <router-link class="item-link" to="" :title="item.name">
            <img class="item-img" :src="`${item.picUrl}?param=50y50`" />
          </router-link>
          <p class="desc">{{ item.name }}</p>
        </li>
      </ul>
    </template>
    <template v-if="similarSinger.length > 0">
      <h3 class="title">相似歌手</h3>
      <ul class="like-list">
        <li
          class="item"
          v-for="(item, index) in similarSinger"
          :key="index"
          :class="{ 'first-item': !(index % 3) }"
          @click="jumpSingerDetail(item.id)"
        >
          <router-link class="item-link" to="" :title="item.name">
            <img class="item-img" :src="`${item.picUrl}?param=50y50`" />
          </router-link>
          <p class="desc">{{ item.name }}</p>
        </li>
      </ul>
    </template>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
    <a class="supplement" href="#" target="_blank">补充或修改艺人资料></a>
    <a
      class="supplement"
      href="https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/recommend"
      target="_blank"
      >用户wiki任务中心></a
    >
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { topArtists, simiArtist } from '@/api/singer-detail';
import type { ResponseType } from '@/types';
import SideDownload from '@/views/song-sheet-detail/side-download/SideDownload.vue';

type HotSingerItem = {
  id: number;
  name: string;
  picUrl: string;
};

type SimilarSingerItem = {
  id: number;
  name: string;
  picUrl: string;
};

defineProps({
  likePeople: {
    type: Array,
    default: () => []
  }
});

const route = useRoute();
const router = useRouter();

// 获取热门歌手
const hotSinger = ref<HotSingerItem[]>([]);

function getTopArtists(): void {
  topArtists({ offset: 0, limit: 6 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      // 热门歌手为空时, 获取相似歌手
      if (res.artists?.length === 0) {
        getSimiArtist();
        return;
      }

      hotSinger.value = res.artists?.slice?.(0, 6) ?? [];
    })
    .catch(() => ({}));
}

// 获取相似歌手
const similarSinger = ref<SimilarSingerItem[]>([]);

function getSimiArtist(): void {
  simiArtist({ id: Number(route.query.id) })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      similarSinger.value = res.artists?.slice?.(0, 6) ?? [];
    })
    .catch(() => ({}));
}

watch(
  () => route.query.id,
  () => {
    getTopArtists();
  },
  { immediate: true }
);

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./singer-side.less');
</style>
