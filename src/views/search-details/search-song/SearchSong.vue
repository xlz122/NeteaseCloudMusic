<template>
  <ul class="search-song">
    <li
      class="item"
      v-for="(item, index) in list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div class="td play-icon" @click="playListMusic(item.id, item)"></div>
      <div class="td td1">
        <div class="text">
          <span class="name">{{ item?.name }}</span>
          <span class="desc"></span>
        </div>
      </div>
      <div class="td td2"></div>
      <!-- 操作项 -->
      <div class="td td3">
        <div class="text">
          <span class="name">{{ item?.ar[0]?.name }}</span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span class="name">{{ item?.al?.name }}</span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item.dt / 1000) }}</div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration } from '@utils/utils.ts';

export default defineComponent({
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const $store = useStore();

    // 播放列表音乐
    function playListMusic(id: number, item: Record<string, any>): void {
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }
    return {
      timeStampToDuration,
      playListMusic
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song.less';
</style>
