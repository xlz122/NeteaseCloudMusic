<template>
  <div class="recommend">
    <div class="title dis-flex justify-between align-end">
      <router-link to="" class="text-gray3 f24 txt">推荐节目</router-link>
      <router-link to="" class="text-gray6 f12 more">更多 ></router-link>
    </div>
    <div class="recommend-list">
      <div class="item dis-flex align-center" v-for="item in recommendList" :key="item.id">
        <div class="item-lf dis-flex">
          <div class="cover-img" title="播放" @click="playSingleSong(item.mainSong)">
            <img :src="item.coverUrl" alt="" />
            <i class="play"></i>
          </div>
          <div class="item-content">
            <div
              class="f12 text-gray3 ellipsis"
              :title="item.mainSong?.name"
              @click="jumpProgramDetail(item.id)"
            >
              {{ item.mainSong?.name }}
            </div>
            <div
              class="f12 text-gray9 ellipsis"
              :title="item.dj?.brand"
              @click="jumpDjradioDetail(item.radio?.id)"
            >
              {{ item.dj?.brand }}
            </div>
          </div>
        </div>
        <div class="item-ri">
          {{ item.radio?.category }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { programRecommend } from '@/api/home-djprogram';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type RecommendItem = {
  id: number;
  name: string;
  coverUrl: string;
  mainSong: SongType;
  dj: {
    brand: string;
  };
  radio: {
    id: number;
    category: string;
  };
};

const router = useRouter();

// 获取推荐节目
const recommendList = ref<RecommendItem[]>([]);

function getRecommendList(): void {
  programRecommend()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      recommendList.value = res.programs ?? [];
    })
    .catch(() => ({}));
}
getRecommendList();

// 播放单个歌曲
function playSingleSong(item: SongType): void {
  usePlaySong(item);
  useSongAddPlaylist(item);
}

function jumpDjradioDetail(id: number): void {
  router.push({ path: '/djradio-detail', query: { id } });
}

function jumpProgramDetail(id: number): void {
  router.push({ path: '/program-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('@/assets/style/base.less');
@import url('./recommend.less');
</style>
