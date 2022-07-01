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
            @click="playSingleMusic(item?.mainSong)"
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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { programRecommend } from '@api/home-djprogram';
import type { ResponseType } from '@/types/types';
import { useStore } from 'vuex';
import { handleAudioSong } from '@/common/audio';
import type { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  setup() {
    const $store = useStore();

    const recommendList = ref([]);
    function recommendHandle() {
      programRecommend().then((res: ResponseType) => {
        if (res.code === 200) {
          recommendList.value = res?.programs || [];
        }
      });
    }
    recommendHandle();

    // 播放单个歌曲
    function playSingleMusic(item: object) {
      const musicItem: PlayMusicItem = handleAudioSong(item);

      // 当前播放音乐
      $store.commit('music/setPlayMusicItem', musicItem);
      // 添加到播放列表
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    return {
      recommendList,
      playSingleMusic
    };
  }
});
</script>
<style lang="less" scoped>
@import './recommend.less';
</style>
