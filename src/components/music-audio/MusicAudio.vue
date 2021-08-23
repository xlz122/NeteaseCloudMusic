<template>
  <!-- 播放器 -->
  <music-autio-component />
  <div class="music-audio-container">
    <div
      class="music-audio-playbar"
      :class="[
        { 'music-audio-playbar-enter': isMusicAudioEnter },
        { 'music-audio-playbar-leave': !isMusicAudioEnter },
        { 'music-audio-playbar-lock': musicAudioLock }
      ]"
      @mouseenter="musicAudioEnter"
      @mouseleave="musicAudioLeave"
    >
      <!-- 锁定 -->
      <div class="updn">
        <div class="updn-left">
          <i
            class="updn-icon"
            :class="[
              { 'icon-updn-left': !musicAudioLock },
              { 'icon-updn-left-lock': musicAudioLock }
            ]"
            @click="audioLock"
          ></i>
        </div>
        <div class="updn-right"></div>
      </div>
      <!-- 背景 -->
      <div class="playbar-bg"></div>
      <!-- 播放器展示 -->
      <div class="hand" title="展开播放条" @mouseenter="musicAudioEnter"></div>
      <!-- 内容 -->
      <div class="wrap">
        <div class="operate-btn">
          <button
            class="btn prev-btn"
            title="上一首(ctrl+←)"
            @click="prevPlayMusic"
          ></button>
          <button
            class="btn look-btn"
            :class="{ 'look-play-btn': musicPlayStatus.look }"
            title="播放/暂停(p)"
            @click="lookPlayMusic"
          ></button>
          <button
            class="btn down-btn"
            title="下一首(ctrl+→)"
            @click="nextPlayMusic"
          ></button>
        </div>
        <div class="music-img">
          <img
            class="img"
            v-if="playMusicItem?.picUrl"
            :src="playMusicItem?.picUrl"
          />
          <span class="default-img"></span>
        </div>
        <div class="play">
          <div class="play-info">
            <span class="music-name">
              <span class="name">{{ playMusicItem?.name }}</span>
              <span class="icon-mv" v-if="playMusicItem?.mv > 0"></span>
            </span>
            <span class="singer-name">
              <span
                class="text"
                v-for="(item, index) in playMusicItem?.singerList"
                :key="index"
                :title="item?.name"
                @click="jumpSingerDetail(item.id)"
              >
                <span class="name">{{ item?.name }}</span>
                <span
                  class="line"
                  v-if="index !== playMusicItem.singerList.length - 1"
                >
                  /
                </span>
              </span>
            </span>
            <span class="link" v-if="playMusicItem?.name"></span>
          </div>
          <div class="play-progress">
            <play-progress
              :musicPlayStatus="musicPlayStatus"
              :musicPlayProgress="musicPlayProgress"
              @progressChange="progressChange"
            />
          </div>
        </div>
        <other-tool />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
// 播放器
import MusicAutioComponent from './audio/Audio.vue';
// 播放进度条
import PlayProgress from './play-progress/PlayProgress.vue';
// 其他工具
import OtherTool from './other-tool/OtherTool.vue';
import { getPrevMusicId, getNextMusicId } from './audio/methods';

export default defineComponent({
  components: {
    MusicAutioComponent,
    PlayProgress,
    OtherTool
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 播放器锁定在底部
    const musicAudioLock = computed(
      () => $store.getters['music/musicAudioLock']
    );

    function audioLock(): void {
      if (musicAudioLock.value) {
        $store.commit('music/setMsicAudioLock', false);
      } else {
        $store.commit('music/setMsicAudioLock', true);
      }
    }

    // 播放器鼠标移入事件
    const isMusicAudioEnter = ref<boolean>(false);
    function musicAudioEnter(): boolean | undefined {
      // 锁定之后不触发
      if (musicAudioLock.value) {
        return false;
      }
      isMusicAudioEnter.value = true;
    }

    // 播放器鼠标移出事件
    function musicAudioLeave(): boolean | undefined {
      // 锁定之后不触发
      if (musicAudioLock.value) {
        return false;
      }
      isMusicAudioEnter.value = false;
    }

    // 播放/暂停切换
    const musicPlayStatus = computed(
      () => $store.getters['music/musicPlayStatus']
    );

    function lookPlayMusic(): void {
      if (musicPlayStatus.value.look) {
        $store.commit('music/setMusicPlayStatus', {
          look: false,
          loading: false,
          refresh: false
        });
      } else {
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          loading: true,
          refresh: false
        });
      }
    }

    // 当前播放音乐数据
    const playMusicItem = computed<number>(
      () => $store.getters['music/playMusicItem']
    );

    // 上一首
    const prevPlayMusic = throttle(
      function () {
        getPrevMusicId().then(() => {
          // 开始播放
          $store.commit('music/setMusicPlayStatus', {
            look: true,
            loading: true,
            refresh: true
          });
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 下一首
    const nextPlayMusic = throttle(
      function () {
        getNextMusicId().then(() => {
          // 开始播放
          $store.commit('music/setMusicPlayStatus', {
            look: true,
            loading: true,
            refresh: true
          });
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 播放进度数据
    const musicPlayProgress = computed(
      () => $store.getters['music/musicPlayProgress']
    );

    // 音乐进度更改
    function progressChange(value: number): void {
      const currentTime = musicPlayProgress.value.duration * value;
      $store.commit('music/setMusicPlayProgress', {
        progress: value * 100,
        currentTime,
        timeChange: true
      });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    return {
      musicAudioLock,
      audioLock,
      isMusicAudioEnter,
      musicAudioEnter,
      musicAudioLeave,
      musicPlayStatus,
      lookPlayMusic,
      playMusicItem,
      prevPlayMusic,
      nextPlayMusic,
      musicPlayProgress,
      progressChange,
      jumpSingerDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './music-audio.less';
</style>
