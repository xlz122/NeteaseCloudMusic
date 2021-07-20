<template>
  <div class="user-info-container">
    <div class="header-info">
      <div class="info-img">
        <img
          class="img"
          :src="`${songListDetailData?.playlist?.coverImgUrl}?param=200y200`"
        />
        <i class="icon"></i>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">{{ songListDetailData?.playlist?.name }}</h2>
        </div>
        <div class="info">
          <img
            class="user-avatar"
            :src="songListDetailData?.playlist?.creator?.avatarUrl"
          />
          <span class="user-name">
            {{ songListDetailData?.playlist?.creator?.nickname }}
          </span>
          <span class="user-time">
            {{
              formatDateTime(
                songListDetailData?.playlist?.createTime / 1000,
                'yyyy-MM-dd'
              )
            }}
            创建
          </span>
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': songListDetailData?.playlist?.tracks.length === 0
            }"
            @click="playTitleMusic"
          >
            <span class="icon-play">播放</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-play-add':
                songListDetailData?.playlist?.tracks.length === 0
            }"
            @click="setAddPlayList"
          ></div>
          <div
            class="other collection"
            :class="{
              'disable-collection':
                songListDetailData?.playlist?.subscribedCount > 0
            }"
            @click="collectionClick"
          >
            <span
              class="icon"
              v-if="songListDetailData?.playlist?.subscribedCount > 0"
            >
              ({{ songListDetailData?.playlist?.subscribedCount }})
            </span>
            <span class="icon" v-else>收藏</span>
          </div>
          <div
            class="other share"
            :class="{
              'disable-share': songListDetailData?.playlist?.tracks.length === 0
            }"
            @click="shareClick"
          >
            <span
              class="icon"
              v-if="songListDetailData?.playlist?.shareCount > 0"
            >
              ({{ songListDetailData?.playlist?.shareCount }})
            </span>
            <span class="icon" v-else>分享</span>
          </div>
          <div
            class="other download"
            :class="{
              'disable-download':
                songListDetailData?.playlist?.tracks.length === 0
            }"
            @click="downloadClick"
          >
            <span class="icon">下载</span>
          </div>
          <div
            class="other comment"
            :class="{
              'disable-comment':
                songListDetailData?.playlist?.tracks.length === 0
            }"
            @click="commentClick"
          >
            <span
              class="icon"
              v-if="songListDetailData?.playlist?.commentCount > 0"
            >
              ({{ songListDetailData?.playlist?.commentCount }})
            </span>
            <span class="icon" v-else>评论</span>
          </div>
        </div>
        <div class="tags" v-if="songListDetailData?.playlist?.tags.length > 0">
          <b class="title">标签：</b>
          <ul class="list">
            <li
              class="item"
              v-for="(t, tind) in songListDetailData?.playlist?.tags"
              :key="tind"
            >
              <span class="text">{{ t }}</span>
            </li>
          </ul>
        </div>
        <div class="desc" v-if="songListDetailData?.playlist?.description">
          <b class="title">介绍：</b>
          <p class="content">{{ songListDetailData?.playlist?.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { formatDateTime } from '@utils/utils.ts';
import { LoopType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 歌单详情数据
    const songListDetailData = computed(
      () => $store.getters['music/songListDetailData']
    );
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = songListDetailData.value?.privileges.find(
        (item: LoopType) => item.id === id
      );
      if (privilege?.cp === 0) {
        return true;
      } else {
        return false;
      }
    }

    // 头部播放 - 默认播放列表第一项
    const playTitleMusic = throttle(
      function () {
        if (songListDetailData.value?.playlist?.tracks.length > 0) {
          const musicItem = songListDetailData.value?.playlist?.tracks[0];
          // 当前播放音乐id
          $store.commit('music/setPlayMusicId', musicItem.id);
          // 当前播放音乐数据
          $store.commit('music/setPlayMusicItem', musicItem);
          // 开始播放
          $store.commit('music/setMusicPlayStatus', {
            look: true,
            refresh: true
          });
        }
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): void {
      if (songListDetailData.value?.playlist?.tracks.length > 0) {
        songListDetailData.value?.playlist?.tracks.forEach((item: LoopType) => {
          // 无版权歌曲不添加到播放列表
          if (isCopyright(item.id)) {
            return false;
          }
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', item);
        });
      }
    }

    // 收藏
    function collectionClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 分享
    function shareClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function downloadClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function commentClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    return {
      formatDateTime,
      songListDetailData,
      playMusicId,
      isCopyright,
      playTitleMusic,
      setAddPlayList,
      collectionClick,
      shareClick,
      downloadClick,
      commentClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-info.less';
</style>
