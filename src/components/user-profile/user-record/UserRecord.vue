<template>
  <div class="user-record-container" v-if="recordList.length > 0">
    <div class="title">
      <span class="title-text">听歌排行</span>
      <h4 class="title-desc">累积听歌0首</h4>
      <i class="title-desc-icon"></i>
      <div class="title-operate">
        <span
          class="song-week"
          :class="{ 'song-active': type === 1 }"
          @click="typeChange(1)"
        >
          最近一周
        </span>
        <i class="song-icon"></i>
        <span
          class="song-all"
          :class="{ 'song-active': type === 0 }"
          @click="typeChange(0)"
        >
          所有时间
        </span>
      </div>
    </div>
    <!-- loading -->
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <ul class="list" v-if="!loading">
      <li class="item" v-for="(item, index) in recordList" :key="index">
        <div class="hd">
          <span class="text">{{ index + 1 }}.</span>
          <i
            class="icon-play"
            :class="{ 'active-play': item?.song?.id === playMusicId }"
            @click="playListMusic(item.song)"
          ></i>
        </div>
        <div class="song">
          <div class="song-text">
            <span
              class="name"
              :title="item?.song?.name"
              @click="jumpSongDetail(item.song.id)"
            >
              <b>{{ item?.song?.name }}</b>
            </span>
            <span class="desc">
              <em class="em">-</em>
              <span class="text" @click="jumpSingerDetail(item.song.ar[0].id)">
                {{ item?.song?.ar[0]?.name }}
              </span>
            </span>
          </div>
          <div class="operate-btn">
            <i
              class="icon add"
              title="添加到播放列表"
              @click="setAddSinglePlayList(item.song)"
            ></i>
            <i
              class="icon collect"
              title="收藏"
              @click="collectMusic(item.song.id)"
            ></i>
            <i class="icon share" title="分享" @click="shareClick"></i>
            <i class="icon download" title="下载" @click="downloadClick"></i>
          </div>
        </div>
        <div class="tops">
          <span class="bg" :style="{ width: `${item.score}%` }"></span>
          <span class="times">{{ item?.playCount }}次</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { userRecord } from '@api/user';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';

export default defineComponent({
  setup() {
    const $store = useStore();

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);
    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);
    // 用户uid
    const uid = computed(() => $store.getters.userId);

    const loading = ref<boolean>(false);

    const type = ref<number>(1);
    function typeChange(t: number): void {
      type.value = t;
    }

    watch(
      () => type.value,
      () => {
        loading.value = true;
        getUserRecord();
      },
      {
        immediate: true
      }
    );

    const recordList = ref<unknown[]>([]);
    function getUserRecord(): void {
      userRecord({ uid: uid.value, type: type.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            if (type.value === 0) {
              recordList.value = res.allData?.slice(0, 10);
            } else {
              recordList.value = res.weekData?.slice(0, 10);
            }
            loading.value = false;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 播放列表音乐
    function playListMusic(item: Record<string, any>): void {
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
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(item: Record<string, any>): void {
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
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 收藏歌曲
    function collectMusic(id: number): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 分享
    function shareClick(): boolean | undefined {
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
    function downloadClick(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    return {
      playMusicId,
      type,
      typeChange,
      loading,
      recordList,
      playListMusic,
      setAddSinglePlayList,
      jumpSongDetail,
      jumpSingerDetail,
      collectMusic,
      shareClick,
      downloadClick
    };
  }
});
</script>

<style lang="less" scoped>
@import './user-record.less';
</style>
