<template>
  <div class="recommend">
    <div class="title dis-flex justify-between align-end">
      <router-link to="" class="text-gray3 f24 txt">节目排行榜</router-link>
      <router-link to="" class="text-gray6 f12 more">更多 ></router-link>
    </div>
    <div class="recommend-list">
      <div class="item dis-flex align-center" v-for="(item, index) in recommendList" :key="index">
        <div class="item-lf dis-flex">
          <div class="rank">
            <em>
              {{ item.rank < 10 ? `0${index + 1}` : item.rank }}
            </em>
            <template v-if="item.rank && item.lastRank">
              <div class="rnk rnk-up" v-if="item.lastRank > item.rank">
                <i class="rnk-icon"></i>{{ item.lastRank - item.rank }}
              </div>
              <div class="rnk rnk-dn" v-if="item.lastRank < item.rank">
                <i class="rnk-icon"></i>{{ item.rank - item.lastRank }}
              </div>
            </template>
          </div>
          <div class="cover-img" title="播放" @click="playSingleSong(item.program?.mainSong)">
            <img :src="item.program?.coverUrl" alt="" />
            <i class="play"></i>
          </div>
          <div class="item-content">
            <div
              class="f12 text-gray3 ellipsis"
              :title="item.program?.name"
              @click="jumpProgramDetail(item.program?.id)"
            >
              {{ item.program?.name }}
            </div>
            <div
              class="f12 text-gray9 ellipsis"
              :title="item.program?.radio?.name"
              @click="jumpDjradioDetail(item.program?.radio?.id)"
            >
              {{ item.program?.radio?.name }}
            </div>
          </div>
        </div>
        <div class="hot">
          <i class="hot-icon">
            <i></i>
          </i>
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
import { programTopList } from '@/api/home-djprogram';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';

type RecommendItem = {
  rank: number;
  lastRank: number;
  program: {
    id: number;
    name: string;
    coverUrl: string;
    mainSong: SongType;
    radio: {
      id: number;
      name: string;
    };
  };
};

const router = useRouter();

// 获取节目排行榜
const recommendList = ref<RecommendItem[]>([]);

function getRecommendList(): void {
  programTopList({ offset: 1, limit: 10 })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      recommendList.value = res.toplist ?? [];
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
@import url('../recommend/recommend.less');
@import url('./ranki-list.less');
</style>
