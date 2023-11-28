<template>
  <div class="recommend">
    <div class="title dis-flex justify-between align-end">
      <router-link to="" class="text-gray3 f24 txt">推荐节目</router-link>
      <router-link to="" class="text-gray6 f12 more">更多 ></router-link>
    </div>
    <div class="recommend-list">
      <div
        class="item dis-flex align-center"
        v-for="item in recommendList"
        :key="item.id"
      >
        <div class="item-lf dis-flex">
          <div
            class="cover-img"
            title="播放"
            @click="playSingleMusic(item?.mainSong!)"
          >
            <img :src="item?.coverUrl" alt="" />
            <i class="play"></i>
          </div>
          <div class="item-content">
            <div class="f12 text-gray3 ellipsis" :title="item?.mainSong?.name">
              {{ item?.mainSong?.name }}
            </div>
            <div class="f12 text-gray9 ellipsis" :title="item?.dj?.brand">
              {{ item?.dj?.brand }}
            </div>
          </div>
        </div>
        <div class="item-ri">
          {{ item?.radio?.category }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { programRecommend } from '@/api/home-djprogram';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';

type RecommendItem = {
  id: number;
  name: string;
  coverUrl: string;
  mainSong: SongType;
  dj: {
    brand: string;
  };
  radio: {
    category: string;
  };
};

const recommendList = ref<RecommendItem[]>([]);

function getRecommendList() {
  programRecommend()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        recommendList.value = res?.programs || [];
      }
    })
    .catch(() => ({}));
}
getRecommendList();

// 播放单个歌曲
function playSingleMusic(item: SongType): void {
  usePlaySingleMusic(item);
}
</script>

<style lang="less" scoped>
@import url('./recommend.less');
</style>
