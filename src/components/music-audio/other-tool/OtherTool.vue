<template>
  <div class="oper">
    <button
      class="btn collection-btn"
      title="收藏"
      @click="collectMusic"
    ></button>
    <button class="btn share-btn" title="分享" @click="shareClick"></button>
  </div>
  <div class="other">
    <!-- 音量控制 -->
    <button
      class="btn volume-btn"
      title="音量"
      @click="setVolumeProgress"
    ></button>
    <volume-progress v-if="volumeProgressShow" />
    <!-- 模式切换 -->
    <button
      class="btn"
      title="模式"
      :class="[
        { 'mode-single': musicModeType === 0 },
        { 'mode-loop': musicModeType === 1 },
        { 'mode-random': musicModeType === 2 }
      ]"
      @click="modeChange"
    ></button>
    <!-- 模式提示 -->
    <div class="mode-tip" v-if="modeTipShow">
      {{
        musicModeType === 0 ? '单曲循环' : musicModeType === 1 ? '循环' : '随机'
      }}
    </div>
    <button class="btn list-btn" title="列表" @click="setPlayListShow"></button>
    <span class="list-text">{{ playMusicList?.length }}</span>
    <!-- 播放列表添加提示 -->
    <div class="add-play-tip" v-if="addPlayTipShow">
      <span>已添加到播放列表</span>
    </div>
  </div>
  <!-- 播放列表组件 -->
  <play-list
    class="play-list"
    :playListShow="playListShow"
    @closePlayList="closePlayList"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
// 音量
import VolumeProgress from '../volume-progress/VolumeProgress.vue';
// 播放列表
import PlayList from './play-list/PlayList.vue';

export default defineComponent({
  components: {
    VolumeProgress,
    PlayList
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    // 是否登录
    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    // 播放列表数据
    const playMusicList = computed(() => $store.getters['music/playMusicList']);
    // 当前播放id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 收藏歌曲
    function collectMusic(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: playMusicId.value
      });
    }

    // 分享
    function shareClick(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 音量条显隐
    const volumeProgressShow = ref<boolean>(false);
    function setVolumeProgress(): void {
      volumeProgressShow.value = !volumeProgressShow.value;
    }

    // 模式切换
    const musicModeType = computed(() => $store.getters['music/musicModeType']);
    const modeTipShow = ref<boolean>(false);
    function modeChange(): void {
      modeTipShow.value = true;

      let modeType = JSON.parse(JSON.stringify(musicModeType.value));
      if (modeType === 2) {
        modeType = 0;
      } else {
        modeType++;
      }
      // 存储音乐模式
      $store.commit('music/setMusicModeType', modeType);
      // 提示在3秒后隐藏
      let timer = 0;
      timer = setTimeout(() => {
        modeTipShow.value = false;
      }, 3000);
      // 3秒内继续切换，清除定时器，重新设置
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          modeTipShow.value = false;
        }, 3000);
      }
    }

    // 显示播放列表
    const playListShow = ref<boolean>(false);
    function setPlayListShow(): void {
      playListShow.value = !playListShow.value;
    }

    // 添加播放列表提示
    const addPlayTipShow = ref<boolean>(false);
    watch(
      () => playMusicList.value,
      (curVal, oldVal) => {
        if (curVal.length > oldVal.length) {
          addPlayTipShow.value = true;
          // 提示在3秒后隐藏
          let timer = 0;
          timer = setTimeout(() => {
            addPlayTipShow.value = false;
          }, 3000);
          // 3秒内继续切换，清除定时器，重新设置
          if (timer) {
            clearTimeout(timer);
            timer = setTimeout(() => {
              addPlayTipShow.value = false;
            }, 3000);
          }
        }
      }
    );

    // 监听路由切换，关闭播放列表
    watch(
      () => $route.params,
      () => {
        playListShow.value = false;
      }
    );

    // 关闭播放列表
    function closePlayList(): void {
      playListShow.value = false;
    }
    return {
      playMusicList,
      playMusicId,
      collectMusic,
      shareClick,
      volumeProgressShow,
      setVolumeProgress,
      musicModeType,
      modeTipShow,
      modeChange,
      playListShow,
      setPlayListShow,
      addPlayTipShow,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './other-tool.less';
</style>
