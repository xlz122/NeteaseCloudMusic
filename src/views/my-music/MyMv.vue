<template>
  <div class="my-mv">
    <div class="title">
      <span class="text">我的视频({{ myMvCount }})</span>
    </div>
    <ul class="list">
      <li
        class="item"
        v-for="(item, index) in myMvList"
        :key="index"
        @click="myMvplay"
      >
        <div class="cover">
          <img class="img" :src="item.coverUrl" alt="" />
          <div class="play-volume">
            <span class="icon-play"></span>
            <span class="text">{{ item.playTime }}</span>
          </div>
          <div class="duration">
            {{ timeStampToDuration(item.durationms / 1000) }}
          </div>
        </div>
        <div class="item-title">{{ item.title }}</div>
        <div class="item-name">
          <span class="text">by</span>
          <span class="name">{{ item.creator[0].userName }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable */
import { defineProps } from 'vue';
import { timeStampToDuration } from '@utils/utils.ts';

defineProps({
  myMvList: {
    type: Array,
    default: []
  },
  myMvCount: {
    type: Number,
    default: 0
  }
});

// 播放
function myMvplay(): void {
  console.log('点击mv播放');
}
</script>

<style lang="less" scopde>
.my-mv {
  width: 100%;
  height: 100%;
  padding-top: 40px;
  padding-bottom: 90px;
  .title {
    height: 40px;
    margin: 0 40px;
    border-bottom: 2px solid #c20c0c;
    text-align: left;
    .text {
      font-size: 24px;
      font-weight: normal;
      font-family: 'Microsoft Yahei', Arial, Helvetica, sans-serif;
    }
  }
  .list {
    padding-top: 11px;
    padding-left: 40px;
    text-align: left;
    .item {
      position: relative;
      display: inline-block;
      width: 159px;
      padding: 0 8px 25px 0;
      .cover {
        position: relative;
        width: 159px;
        height: 90px;
        cursor: pointer;
        .img {
          width: 100%;
          height: 100%;
        }
        .play-volume {
          position: absolute;
          top: 0;
          right: 0;
          padding-right: 5px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          box-sizing: border-box;
          text-align: right;
          text-shadow: -2px 1px rgba(0, 0, 0, 0.4);
          .icon-play {
            display: inline-block;
            vertical-align: middle;
            width: 15px;
            height: 10px;
            margin-right: 3px;
            background: url('../../assets/image/my-music/icon-my-music.png')
              no-repeat;
            background-position: -60px -310px;
          }
          .text {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .duration {
          position: absolute;
          bottom: 0;
          left: 0;
          padding-left: 5px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          text-shadow: -2px 1px rgba(0, 0, 0, 0.4);
        }
      }
    }
    .item-title {
      width: 100%;
      height: auto;
      margin: 7px 0 1px;
      border: none;
      font-size: 14px;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .item-title:hover {
      text-decoration: underline;
    }
    .item-name {
      width: 100%;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      .text {
        margin-right: 5px;
        color: #333;
      }
      .name {
        color: #666;
        cursor: pointer;
      }
      .name:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
