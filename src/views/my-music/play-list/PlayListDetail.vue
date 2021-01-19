<template>
  <div class="play-list-main">
    <div class="main-header">
      <div class="header-info">
        <div class="info-img">
          <img class="img" :src="playDetailData?.playlist?.coverImgUrl" />
          <i class="icon"></i>
        </div>
        <div class="info-right">
          <div class="title">
            <i class="icon-title"></i>
            <h2 class="title-text">{{ playDetailData?.playlist?.name }}</h2>
          </div>
          <div class="user-info">
            <img
              class="user-avatar"
              :src="playDetailData?.playlist?.creator?.avatarUrl"
            />
            <span class="user-name">{{
              playDetailData?.playlist?.creator?.nickname
            }}</span>
            <span class="user-time">
              {{
                formatDateTime(
                  playDetailData?.playlist?.createTime / 1000,
                  'yyyy-MM-dd'
                )
              }}
              创建
            </span>
          </div>
          <div class="operate-btn">
            <div class="play">
              <span class="icon-play">播放</span>
            </div>
            <div class="play-add"></div>
            <div class="other">
              <span class="icon">收藏</span>
            </div>
            <div class="other share">
              <span class="icon">分享</span>
            </div>
            <div class="other download">
              <span class="icon">下载</span>
            </div>
            <div class="other comment">
              <span class="icon">评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-title">
      <h3 class="title-text">歌曲列表</h3>
      <span class="title-text-num">
        {{ playDetailData?.playlist?.trackCount }}首歌
      </span>
      <div class="title-play-num">
        播放:
        <span class="eye-catching">{{
          playDetailData?.playlist?.playCount
        }}</span>
        次
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { formatDateTime } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 详情数据
    const playDetailData = computed(() => $store.getters.playDetailData);
    return {
      formatDateTime,
      playDetailData
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
