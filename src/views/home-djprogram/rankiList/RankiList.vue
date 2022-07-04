<style lang="less" scoped>
@import './rankiList.less';
</style>

<template>
  <div class="recommend">
    <div class="title dis-flex justify-between align-end">
      <router-link to="" class="text-gray3 f24 txt">节目排行榜</router-link>
      <router-link to="" class="text-gray6 f12 more">更多 ></router-link>
    </div>
    <div class="recommend-list">
      <div
        class="item dis-flex align-center"
        v-for="item in rankList"
        :key="item.id"
      >
        <div class="item-lf dis-flex">
          <div class="rank">
            <em>{{ item?.rank < 10 ? `0${item?.rank}` : item?.rank }}</em>
            <div class="rnk rnk-up" v-if="item?.lastRank > item?.rank">
              <i class="rnk-icon"></i>{{ item.lastRank - item.rank }}
            </div>
            <div class="rnk rnk-dn" v-if="item?.lastRank < item?.rank">
              <i class="rnk-icon"></i>{{ item.rank - item.lastRank }}
            </div>
          </div>
          <div
            class="cover-img"
            title="播放"
            @click="playSingleMusic(item?.program?.mainSong)"
          >
            <img :src="item?.program?.coverUrl" alt="" />
            <i class="play"></i>
          </div>
          <div class="item-content">
            <div class="f12 text-gray3 ellipsis" :title="item?.program?.name">
              {{ item?.program?.name }}
            </div>
            <div
              class="f12 text-gray9 ellipsis"
              :title="item?.program?.radio?.name"
            >
              {{ item?.program?.radio?.name }}
            </div>
          </div>
        </div>
        <div class="hot">
          <i style="width: 50%">
            <i></i>
          </i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { programTopList } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import type { SongType } from '@/common/audio';

export default defineComponent({
  setup() {
    const rankList = ref([]);
    function rankListHandle() {
      programTopList({ limit: 10, offset: 1 }).then((res: ResponseType) => {
        if (res.code === 200) {
          rankList.value = res?.toplist || [];
        }
      });
    }
    rankListHandle();

    // 播放单个歌曲
    function playSingleMusic(item: Partial<SongType>): void {
      usePlaySingleMusic(item);
    }

    return {
      rankList,
      playSingleMusic
    };
  }
});
</script>
