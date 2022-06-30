<template>
  <div class="oper">
    <button
      class="btn collection-btn"
      title="收藏"
      @click="handleCollection"
    ></button>
    <button class="btn share-btn" title="分享" @click="handleShare"></button>
  </div>
  <div class="other">
    <button
      class="btn volume-btn"
      :class="{ 'no-volume': Number(musicVolume) === 0 }"
      title="音量"
      @click="setVolumeProgress"
    ></button>
    <VolumeProgress v-if="volumeShow" />
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
    <div class="mode-tip" v-if="modeTip.visible">
      {{
        musicModeType === 0 ? '单曲循环' : musicModeType === 1 ? '循环' : '随机'
      }}
    </div>
    <button class="btn list-btn" title="列表" @click="setPlayListShow"></button>
    <span class="list-text">{{ playMusicList?.length }}</span>
    <!-- 提示 -->
    <div class="play-tip" v-if="playTip.visible">
      <span>{{ playTip.title }}</span>
    </div>
  </div>
  <PlayList
    class="play-list"
    :playListShow="playListShow"
    @closePlayList="closePlayList"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import VolumeProgress from '../volume-progress/VolumeProgress.vue';
import PlayList from './play-list/PlayList.vue';

export default defineComponent({
  components: {
    VolumeProgress,
    PlayList
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );
    const playMusicList = computed(() => $store.getters['music/playMusicList']);
    const musicVolume = computed(() => $store.getters['music/musicVolume']);

    // 收藏
    function handleCollection(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: playMusicId.value
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 音量条显隐
    const volumeShow = ref<boolean>(false);
    function setVolumeProgress(): void {
      volumeShow.value = !volumeShow.value;
    }

    // 模式切换
    const musicModeType = computed(() => $store.getters['music/musicModeType']);
    const modeTip = reactive({
      visible: false,
      timer: 0
    });
    function modeChange(): void {
      modeTip.visible = true;

      if (modeTip.timer) {
        clearTimeout(modeTip.timer);
      }
      modeTip.timer = setTimeout(() => {
        modeTip.visible = false;
      }, 3000);

      let modeType = JSON.parse(JSON.stringify(musicModeType.value));
      if (modeType === 2) {
        modeType = 0;
      } else {
        modeType++;
      }

      $store.commit('music/setMusicModeType', modeType);
    }

    // 播放器提示
    const playTip = reactive({
      visible: false,
      title: '',
      timer: 0
    });
    watch(
      () => playMusicList.value,
      (curVal, oldVal) => {
        if (curVal.length !== oldVal.length && curVal.length > 0) {
          return false;
        }

        playTip.visible = true;
        playTip.title = '已添加到播放列表';

        if (playTip.timer) {
          clearTimeout(playTip.timer);
        }
        playTip.timer = setTimeout(() => {
          playTip.visible = false;
        }, 3000);
      }
    );

    // 显示播放列表
    const playListShow = ref<boolean>(false);
    function setPlayListShow(): void {
      playListShow.value = !playListShow.value;
    }

    // 关闭播放列表
    function closePlayList(): void {
      playListShow.value = false;
    }

    // 路由切换，关闭播放列表
    watch(
      () => $route.params,
      () => {
        playListShow.value = false;
      }
    );

    return {
      playMusicId,
      playMusicList,
      musicVolume,
      handleCollection,
      handleShare,
      volumeShow,
      setVolumeProgress,
      musicModeType,
      modeTip,
      modeChange,
      playTip,
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
