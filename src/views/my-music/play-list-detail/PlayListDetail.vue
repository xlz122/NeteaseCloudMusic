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
            <div
              class="play"
              :class="{
                'disable-play': playDetailData?.playlist?.tracks.length === 0
              }"
              @click="playTitleMusic"
            >
              <span class="icon-play">播放</span>
            </div>
            <div
              class="play-add"
              :class="{
                'disable-play-add':
                  playDetailData?.playlist?.tracks.length === 0
              }"
            ></div>
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
          :class="[
            { 'even-tr': (index + 1) % 2 },
            { 'no-copyright': isCopyright(item.id) }
          ]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playListMusic(item.id, item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">
                <span class="title">{{ item.name }}</span>
                <span class="no-click" v-if="item.alia[0]">
                  - {{ item.alia[0] }}
                </span>
              </span>
              <i class="icon-play" v-if="item.mv > 0"></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text">
                {{ timeStampToDuration(item.dt / 1000) }}
              </span>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <span class="text" v-for="(i, ind) in item.ar" :key="ind">
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
import { defineComponent, computed,ref } from 'vue';
import { useStore } from 'vuex';
import { timeStampToDuration, formatDateTime } from '@utils/utils.ts';
import { LoopType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 详情数据
    const playDetailData = computed(() => $store.getters.playDetailData);
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters.playMusicId);

    // 计算歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const privilege = playDetailData.value?.privileges.find(
        (item: LoopType) => item.id === id
      );
      if (privilege?.cp === 0) {
        return true;
      } else {
        return false;
      }
    }

    // 头部播放 - 默认播放列表第一项
    function playTitleMusic() {
      if (playDetailData.value?.playlist?.tracks.length > 0) {
        // 当前播放音乐id
        $store.commit(
          'setPlayMusicId',
          playDetailData.value?.playlist?.tracks[0].id
        );
        // 播放音乐数据
        $store.commit(
          'setPlayMusicList',
          playDetailData.value?.playlist?.tracks[0]
        );
      }
    }

    // 播放列表音乐
    const noCopyrightDialog = ref<boolean>(false);
    function playListMusic(id: number, item: Record<string, any>): boolean | undefined {
      // 无版权处理
      if (item.mv === 0) {
        noCopyrightDialog.value = true;
        return false;
      }
      // 当前播放音乐id
      $store.commit('setPlayMusicId', id);
      // 播放音乐数据
      $store.commit('setPlayMusicList', item);
    }

    // 无版权弹框 - 确定
    function noCopyrightConfirm(): void {
      noCopyrightDialog.value = false;
    }

    return {
      timeStampToDuration,
      formatDateTime,
      playDetailData,
      playMusicId,
      isCopyright,
      playTitleMusic,
      noCopyrightDialog,
      noCopyrightConfirm,
      playListMusic
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list-detail.less';
</style>
