<template>
  <div class="album-info-container">
    <div class="cover-warp">
      <template v-if="userInfo?.picUrl">
        <img
          class="cover-img"
          :src="`${userInfo?.picUrl}?param=177y177`"
          alt=""
        />
      </template>
      <template v-else>
        <img class="cover-img" src="" alt="" />
      </template>
      <i class="cover-bg"></i>
    </div>
    <div class="info-right">
      <div class="title">
        <i class="icon-title"></i>
        <h2 class="title-text">
          {{ userInfo?.name }}
        </h2>
      </div>
      <div class="info">
        <span>歌手：</span>
        <template v-for="(item, index) in userInfo?.artists" :key="index">
          <span
            class="name"
            :title="item.name"
            @click="jumpSingerDetail(item.id)"
          >
            {{ item?.name }}
          </span>
          <span class="line" v-if="index !== userInfo?.artists.length - 1">
            /
          </span>
        </template>
      </div>
      <div class="info">
        <span>发行时间：</span>
        <span class="text">
          {{ formatDateTime(userInfo?.publishTime / 1000, 'yyyy-MM-dd') }}
        </span>
      </div>
      <div class="info" v-if="userInfo?.company">
        <span>发行公司：</span>
        <span class="text">
          {{ userInfo?.company }}
        </span>
      </div>
      <!-- 操作项 -->
      <div class="operate-btn">
        <div class="play" @click="playTitleMusic">
          <span class="icon-play" title="播放">播放</span>
        </div>
        <div
          class="play-add"
          title="添加到播放列表"
          @click="setAddPlayList"
        ></div>
        <div class="other collection" @click="handleCollectAll">
          <template v-if="userInfo?.info?.likedCount > 0">
            <span class="icon"> ({{ userInfo?.info?.likedCount }}) </span>
          </template>
          <template v-else>
            <span class="icon">收藏</span>
          </template>
        </div>
        <div class="other share" @click="handleShare">
          <template v-if="userInfo?.info?.shareCount > 0">
            <span class="icon">({{ userInfo?.info?.shareCount }})</span>
          </template>
          <template v-else>
            <span class="icon">分享</span>
          </template>
        </div>
        <div class="other download" @click="handleDownload">
          <span class="icon">下载</span>
        </div>
        <div class="other comment" @click="jumpToComments">
          <template v-if="userInfo?.info?.commentCount > 0">
            <span class="icon">({{ userInfo?.info?.commentCount }})</span>
          </template>
          <template v-else>
            <span class="icon">评论</span>
          </template>
        </div>
      </div>
    </div>
    <div class="album-desc">
      <h3 class="album-desc-title">专辑介绍：</h3>
      <div class="album-desc-dot">
        <p class="text">{{ userInfo?.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';
import { useStore } from 'vuex';
import { formatDateTime } from '@utils/utils.ts';
import { LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { throttle } from 'lodash';

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    },
    songs: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['jumpToComments'],
  setup(props, { emit }) {
    const { songs } = toRefs(props);

    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 头部播放 - 默认播放列表第一项
    const playTitleMusic = throttle(
      function () {
        if (songs.value.length === 0) {
          return false;
        }
        // 播放第一项
        const item = songs.value[0];

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
        songs.value.forEach((item: LoopType) => {
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
      if (songs.value.length === 0) {
        return false;
      }
      songs.value.forEach((item: LoopType) => {
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

    // 收藏全部
    function handleCollectAll(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      let ids = '';
      songs.value.forEach((item: LoopType) => {
        ids += `${item.id},`;
      });

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: ids
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function handleDownload(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 评论
    function jumpToComments(): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      emit('jumpToComments');
    }

    return {
      formatDateTime,
      jumpSingerDetail,
      playTitleMusic,
      setAddPlayList,
      handleCollectAll,
      handleShare,
      handleDownload,
      jumpToComments
    };
  }
});
</script>

<style lang="less" scoped>
@import './album-info.less';
</style>
