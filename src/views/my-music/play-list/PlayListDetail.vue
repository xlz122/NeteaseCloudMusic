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
    <table class="play-list-table">
      <thead>
        <tr>
          <th class="th first-th">
            <i class="icon"></i>
          </th>
          <th class="th two-th">
            <i class="icon"></i>
          </th>
          <th class="th three-th">
            <i class="icon"></i>
          </th>
          <th class="th four-th">
            <i class="icon"></i>
          </th>
          <th class="th five-th">
            <i class="icon"></i>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in playDetailData?.playlist?.tracks"
          :key="index"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i class="icon-play"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">
                <span class="title">{{ item.name }}</span>
                <span class="no-click"> - {{ item.alia[0] }}</span>
              </span>
              <i class="icon-play" v-if="item.mv > 0"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">
                {{
                  timeStampToDuration(item.dt / 1000)
                }}
              </span>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <span
                class="text"
                v-for="(i, ind) in item.ar" :key="ind"
              >
                {{ i.name }}
                <span class="line" v-if="ind !== item.ar.length - 1">/</span>
              </span>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">{{ item.al.name }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration, formatDateTime } from '@utils/utils.ts';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 详情数据
    const playDetailData = computed(() => $store.getters.playDetailData);
    console.log(playDetailData);
    return {
      timeStampToDuration,
      formatDateTime,
      playDetailData
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
