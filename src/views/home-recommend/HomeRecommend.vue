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
            @click="playTitleMusic"
          >
            <span class="icon-play">播放全部</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-play-add': recommendSong?.length === 0
            }"
            @click="setAddPlayList"
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
import { recommendSongs } from '@api/home-recommend';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { getWeekDate, formatDateTime } from '@utils/utils';
import { throttle } from 'lodash';
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

    // 歌曲列表数据
    const recommendSong = ref();

    // 获取每日推荐歌曲列表
    function getRecommendSong(): void {
      recommendSong.value = [];
      recommendSongs()
        .then((res: ResponseType) => {
          if (res.code === 200) {
            recommendSong.value = res.data.dailySongs;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getRecommendSong();

    // 头部播放 - 默认播放列表第一项
    const playTitleMusic = throttle(
      function () {
        if (recommendSong.value?.length === 0) {
          return false;
        }
        // 播放第一项
        const item = recommendSong.value[0];

        // 处理播放器所需数据
        const musicItem: PlayMusicItem = {
          id: item.id,
          name: item.name,
          picUrl: item.al.picUrl,
          time: item.dt,
          mv: item.mv,
          singerList: []
        };

        item?.ar?.forEach((item: LoopType) => {
          musicItem.singerList.push({
            id: item.id,
            name: item.name
          });
        });

        // 当前播放音乐id
        $store.commit('music/setPlayMusicId', musicItem.id);
        // 当前播放音乐数据
        $store.commit('music/setPlayMusicItem', musicItem);
        // 开始播放
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          refresh: true
        });

        // 添加播放列表
        recommendSong.value?.forEach((item: LoopType) => {
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', item);
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): boolean | undefined {
      if (recommendSong.value?.length === 0) {
        return false;
      }
      recommendSong.value?.forEach((item: LoopType) => {
        // 处理播放器所需数据
        const musicItem: PlayMusicItem = {
          id: item.id,
          name: item.name,
          picUrl: item.al.picUrl,
          time: item.dt,
          mv: item.mv,
          singerList: []
        };

        item?.ar?.forEach((item: LoopType) => {
          musicItem.singerList.push({
            id: item.id,
            name: item.name
          });
        });

        // 播放音乐数据
        $store.commit('music/setPlayMusicList', musicItem);
      });
    }

    // 收藏全部
    function handleCollectAll(): void {
      let ids = '';
      recommendSong.value.forEach((item: LoopType) => {
        ids += `${item.id},`;
      });

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: ids
      });
    }

    onMounted(() => {
      // 头部导航选中
      $store.commit('setHeaderActiveIndex', 0);
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
    });

    return {
      weekText,
      dateText,
      recommendSong,
      playTitleMusic,
      setAddPlayList,
      handleCollectAll
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-recommend.less';
</style>
