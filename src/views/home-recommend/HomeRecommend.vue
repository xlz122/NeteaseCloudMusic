<template>
  <div class="home-recommend">
    <div class="home-recommend-container">
      <div class="recommend-content">
        <div class="header-info">
          <div class="item-top">
            <i class="img"></i>
            <span class="head">{{ weekText }}</span>
            <span class="head-text">{{ dateText }}</span>
            <span class="mask"></span>
          </div>
        </div>
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': recommendSong?.length === 0
            }"
            @click="playAllMusic"
          >
            <span class="icon-play">播放全部</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-play-add': recommendSong?.length === 0
            }"
            @click="allMusicToPlayList"
          ></div>
          <div class="other collection" @click="handleCollectAll">
            <span class="icon"> 收藏全部</span>
          </div>
        </div>
        <div class="list-title">
          <h3 class="title-text">歌曲列表</h3>
          <span class="title-text-num">{{ recommendSong?.length }}首歌</span>
        </div>
        <RecommendSong class="music-table" :recommendSong="recommendSong" />
      </div>
      <div class="recommend-side">
        <RecommendSide />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { handleAudioSong } from '@/common/audio.ts';
import { getWeekDate, formatDateTime } from '@utils/utils';
import { recommendSongs } from '@api/home-recommend';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import RecommendSong from './recommend-song/RecommendSong.vue';
import RecommendSide from './recommend-side/RecommendSide.vue';

export default defineComponent({
  components: {
    RecommendSong,
    RecommendSide
  },
  setup() {
    const $store = useStore();

    // 获取当前星期几
    const weekText = ref<string>('');
    weekText.value = getWeekDate();

    // 获取当前日期
    const dateText = ref<string>('');
    dateText.value = formatDateTime(new Date().getTime() / 1000, 'dd').replace(
      /\b(0+)/gi,
      ''
    );

    const recommendSong = ref();

    // 获取每日推荐歌曲列表
    function getRecommendSong(): void {
      recommendSong.value = [];
      recommendSongs()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            recommendSong.value = res.data.dailySongs;
          }
        })
        .catch(() => ({}));
    }
    getRecommendSong();

    // 播放全部 - 默认播放列表第一项
    const playAllMusic = throttle(
      function () {
        if (recommendSong.value?.length === 0) {
          return false;
        }

        const songList: PlayMusicItem[] = [];

        recommendSong.value?.forEach((item: LoopType) => {
          // 无版权过滤
          if (item?.privilege?.cp === 0) {
            return false;
          }

          const musicItem: PlayMusicItem = handleAudioSong(item);

          songList.push(musicItem);
        });

        // 当前播放音乐
        $store.commit('music/setPlayMusicItem', songList[0]);
        // 添加到播放列表
        $store.commit('music/setPlayMusicList', songList);
        // 开始播放
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          refresh: true
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function allMusicToPlayList(): boolean | undefined {
      if (recommendSong.value?.length === 0) {
        return false;
      }

      const songList: PlayMusicItem[] = [];

      recommendSong.value?.forEach((item: LoopType) => {
        // 无版权过滤
        if (item?.privilege?.cp === 0) {
          return false;
        }

        const musicItem: PlayMusicItem = handleAudioSong(item);

        songList.push(musicItem);
      });

      // 添加到播放列表
      $store.commit('music/setPlayMusicList', songList);
    }

    // 收藏全部
    function handleCollectAll(): void {
      let ids = '';
      recommendSong.value.forEach((item: LoopType) => {
        // 无版权过滤
        if (item?.privilege?.cp === 0) {
          return false;
        }

        ids += `${item.id},`;
      });

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: ids
      });
    }

    onMounted(() => {
      $store.commit('setMenuIndex', 0);
      $store.commit('setSubMenuIndex', -1);
    });

    return {
      weekText,
      dateText,
      recommendSong,
      playAllMusic,
      allMusicToPlayList,
      handleCollectAll
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-recommend.less';
</style>
