<template>
  <div class="oper">
    <button class="btn collection-btn" title="收藏"></button>
    <button class="btn share-btn" title="分享"></button>
  </div>
  <div class="other">
    <!-- 音量控制 -->
    <button
      class="btn volume-btn"
      title="音量"
      @click="setVolumeProgress"
    ></button>
    <volume-progress-bar v-if="volumeProgressShow" />
    <!-- 模式切换 -->
    <button
      class="btn"
      title="模式"
      :class="[
        { 'mode-single': modeType === 0 },
        { 'mode-loop': modeType === 1 },
        { 'mode-random': modeType === 2 }
      ]"
      @click="modeChange"
    ></button>
    <!-- 模式提示 -->
    <div class="mode-tip" v-if="modeTipShow">
      {{ modeType === 0 ? '单曲循环' : modeType === 1 ? '循环' : '随机' }}
    </div>
    <button class="btn list-btn" title="列表" @click="setPlayListShow"></button>
    <span class="list-text">{{ playMusicList?.length }}</span>
  </div>
  <!-- 播放列表组件 -->
  <play-list
    class="play-list"
    :playListShow="playListShow"
    @closePlayList="closePlayList"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
// 音量
import VolumeProgressBar from '../volume-progress-bar/VolumeProgressBar.vue';
// 播放列表
import PlayList from './play-list/PlayList.vue';

export default defineComponent({
  components: {
    VolumeProgressBar,
    PlayList
  },
  setup() {
    const $store = useStore();

    // 播放列表数据
    const playMusicList = computed(() => $store.getters['music/playMusicList']);

    // 音量条显隐
    const volumeProgressShow = ref<boolean>(false);
    function setVolumeProgress(): void {
      volumeProgressShow.value = !volumeProgressShow.value;
    }

    // 模式切换
    const modeType = ref<number>(0);
    const modeTipShow = ref<boolean>(false);
    function modeChange(): void {
      modeTipShow.value = true;
      if (modeType.value === 2) {
        modeType.value = 0;
      } else {
        modeType.value++;
      }
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

    // 关闭播放列表
    function closePlayList(): void {
      playListShow.value = false;
    }
    return {
      playMusicList,
      volumeProgressShow,
      setVolumeProgress,
      modeType,
      modeTipShow,
      modeChange,
      playListShow,
      setPlayListShow,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './other-tool.less';
</style>
