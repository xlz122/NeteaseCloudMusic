<template>
  <div class="song-user-info-container">
    <template v-if="songDetailData?.songs?.length">
      <div class="cover-warp">
        <div class="cover">
          <img
            class="cover-img"
            :src="`${songDetailData?.songs[0]?.al?.picUrl}?param=130y130`"
            alt=""
          />
          <span class="cover-img-bg"></span>
        </div>
        <div class="out">
          <i class="icon"></i>
          <a
            class="link"
            :href="`https://music.163.com/#/outchain/2/${songId}`"
          >
            生成外链播放器
          </a>
        </div>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">{{ songDetailData?.songs[0]?.name }}</h2>
        </div>
        <div class="info">
          <span>歌手：</span>
          <span class="text" title="真瑞">
            {{ songDetailData?.songs[0]?.ar[0]?.name }}
          </span>
        </div>
        <div class="info">
          <span>所属专辑：</span>
          <span class="text">
            {{ songDetailData?.songs[0]?.al?.name }}
          </span>
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div class="play" @click="playTitleMusic">
            <span class="icon-play">播放</span>
          </div>
          <div class="play-add" @click="setAddPlayList"></div>
          <div class="other collection">
            <span class="icon">收藏</span>
          </div>
          <div class="other share" @click="shareClick">
            <span class="icon">分享</span>
          </div>
          <div class="other download" @click="downloadClick">
            <span class="icon">下载</span>
          </div>
          <div class="other comment" @click="commentClick">
            <span class="icon"> (1234) </span>
            <!-- <span class="icon">评论</span> -->
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    songDetailData: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const $store = useStore();

    // 歌曲id
    const songId = computed(() => $store.getters.songId);

    return {
      songId
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-info.less';
</style>
