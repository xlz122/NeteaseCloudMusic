<template>
  <div class="toplist-user-info">
    <div class="header-info">
      <div class="info-img">
        <template v-if="songSheetDetail?.playlist?.coverImgUrl">
          <img
            class="img"
            :src="`${songSheetDetail?.playlist?.coverImgUrl}?param=200y200`"
            alt=""
          />
        </template>
        <template>
          <img class="img" src="" alt="" />
        </template>
        <i class="icon"></i>
      </div>
      <div class="info-right">
        <div class="title">
          <h2 class="title-text">{{ songSheetDetail?.playlist?.name }}</h2>
        </div>
        <div class="info">
          <i class="icon"></i>
          <span class="time">
            最近更新：{{
              formatDateTime(
                songSheetDetail?.playlist?.updateTime / 1000,
                'MM月dd日'
              )
            }}
          </span>
          <span class="desc">（{{ updateFrequency }}）</span>
        </div>
        <!-- 操作项 -->
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="playTitleMusic"
          >
            <span class="icon-play">播放</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-play-add': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="setAddPlayList"
          ></div>
          <div
            class="other collection"
            :class="{
              'disable-collection': songSheetDetail?.playlist?.subscribed
            }"
            @click="collectionClick(songSheetDetail?.playlist?.subscribed)"
          >
            <template v-if="songSheetDetail?.playlist?.subscribedCount > 0">
              <span class="icon">
                ({{ songSheetDetail?.playlist?.subscribedCount }})
              </span>
            </template>
            <template v-else>
              <span class="icon">收藏</span>
            </template>
          </div>
          <div
            class="other share"
            :class="{
              'disable-share': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="shareClick"
          >
            <template v-if="songSheetDetail?.playlist?.shareCount > 0">
              <span class="icon">
                ({{ songSheetDetail?.playlist?.shareCount }})
              </span>
            </template>
            <template v-else>
              <span class="icon">分享</span>
            </template>
          </div>
          <div
            class="other download"
            :class="{
              'disable-download': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="downloadClick"
          >
            <span class="icon">下载</span>
          </div>
          <div
            class="other comment"
            :class="{
              'disable-comment': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="commentClick"
          >
            <template v-if="songSheetDetail?.playlist?.commentCount > 0">
              <span class="icon">
                ({{ songSheetDetail?.playlist?.commentCount }})
              </span>
            </template>
            <template v-else>
              <span class="icon">评论</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
import { throttle } from 'lodash';
import { formatDateTime } from '@utils/utils.ts';
import { PlayMusicItem } from '@store/music/state';
import { LoopType } from '@/types/types';

export default defineComponent({
  props: {
    updateFrequency: {
      type: String,
      default: ''
    },
    songSheetDetail: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['changPage'],
  setup(props) {
    const { songSheetDetail } = toRefs(props);

    const $store = useStore();

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = songSheetDetail.value?.privileges.find(
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
        if (songSheetDetail.value?.playlist?.tracks.length === 0) {
          return false;
        }
        // 播放第一项
        const item = songSheetDetail.value?.playlist?.tracks[0];

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
        songSheetDetail.value?.playlist?.tracks.forEach((item: LoopType) => {
          // 无版权歌曲不添加到播放列表
          if (isCopyright(item.id)) {
            return false;
          }
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
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function setAddPlayList(): boolean | undefined {
      if (songSheetDetail.value?.playlist?.tracks.length === 0) {
        return false;
      }
      songSheetDetail.value?.playlist?.tracks.forEach((item: LoopType) => {
        // 无版权歌曲不添加到播放列表
        if (isCopyright(item.id)) {
          return false;
        }

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
      const commentDom = document.querySelector(
        '.comment-component'
      ) as HTMLElement;
      // 标题高度
      window.scrollTo(0, Number(commentDom.offsetTop) + 120);
    }

    return {
      formatDateTime,
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

<style lang="less">
@import './toplist-info.less';
</style>
