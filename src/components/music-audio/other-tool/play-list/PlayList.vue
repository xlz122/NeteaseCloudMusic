<template>
  <div class="play-list" v-if="playListShow">
    <div class="play-list-title">
      <h4 class="title">播放列表({{ playMusicList.length }})</h4>
      <div class="add-all" @click="collectAll">
        <i class="icon"></i>
        <span>收藏全部</span>
      </div>
      <span class="line"></span>
      <div class="clear-all" @click="emptyMusicList">
        <i class="icon"></i>
        <span>清除</span>
      </div>
      <div class="song-title">{{ playMusicItem?.name || '' }}</div>
      <i class="clear-icon" @click="closePlayList"></i>
    </div>
    <div class="play-list-content">
      <img
        class="play-list-content-bg"
        v-if="playMusicItem?.picUrl"
        :src="playMusicItem?.picUrl"
        alt=""
      />
      <div class="left-content">
        <ul class="p-list" v-if="playMusicList.length > 0">
          <li
            class="item"
            v-for="(item, index) in playMusicList"
            :key="index"
            :class="{ 'p-active-item': item.id === playMusicId }"
            @click="playlistItem(item?.id, item)"
          >
            <i class="play-icon"></i>
            <span class="text song-title" :title="item?.name">
              {{ item?.name }}
            </span>
            <div class="operate-btn">
              <i
                class="icon collect"
                title="收藏"
                @click.stop="handleCollection(item?.id, $event)"
              ></i>
              <i class="icon share" title="分享" @click.stop="handleShare"></i>
              <i
                class="icon download"
                title="下载"
                @click.stop="handleDownload"
              ></i>
              <i
                class="icon delete"
                title="删除"
                @click="deleteMusic(item?.id, $event)"
              ></i>
            </div>
            <span class="text name" @click.stop>
              <span
                v-for="(i, ind) in item?.singerList"
                :key="ind"
                @click="jumpSingerDetail(i.id)"
              >
                <span class="name-text" :title="i.name">{{ i.name }}</span>
                <span v-if="ind !== item.singerList.length - 1"> / </span>
              </span>
            </span>
            <span class="text time">
              {{ timeStampToDuration(item.time / 1000) }}
            </span>
            <i class="share" @click.stop="jumpSongPosition"></i>
          </li>
        </ul>
        <div class="no-list-data" v-else>
          <div class="title">
            <i class="icon"></i>
            <span class="text">你还没有添加任何歌曲</span>
          </div>
          <p class="desc">
            <span>去首页</span>
            <router-link class="link" to="/">发现音乐</router-link>
            <span>，或在</span>
            <router-link class="link" to="/my-music">我的音乐</router-link>
            <span>收听自己收藏得歌单</span>
          </p>
        </div>
      </div>
      <i class="line" v-if="playMusicList.length === 0"></i>
      <div class="right-content">
        <lyric />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import { timeStampToDuration } from '@utils/utils';
import type { PlayMusicItem } from '@store/music/state';
import Lyric from '../lyric/Lyric.vue';

export default defineComponent({
  components: {
    Lyric
  },
  props: {
    playListShow: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );
    const playMusicItem = computed<number>(
      () => $store.getters['music/playMusicItem']
    );
    const playMusicList = computed(() => $store.getters['music/playMusicList']);

    watch(
      () => props.playListShow,
      () => {
        if (props.playListShow) {
          playSongPosition();
        }
      }
    );

    // 列表播放歌曲定位
    function playSongPosition(): boolean | undefined {
      const isExist = playMusicList.value.find(
        (item: PlayMusicItem) => item.id === playMusicId.value
      );
      if (!isExist) {
        return false;
      }

      nextTick(() => {
        const listDom = document.querySelector('.p-list') as HTMLElement;
        const activeItem = document.querySelector(
          '.p-active-item'
        ) as HTMLElement;

        listDom.scrollTo(0, activeItem.offsetTop - activeItem.clientHeight * 4);
      });
    }

    // 收藏全部歌曲
    function collectAll(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      let ids = '';
      playMusicList.value.forEach((item: PlayMusicItem) => {
        ids += `${item.id},`;
      });

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: ids
      });
    }

    // 清除列表
    function emptyMusicList(): void {
      $store.commit('music/emptyPlayMusicList');
    }

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 下载
    function handleDownload(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 列表项删除
    function deleteMusic(id: number, event: MouseEvent): void {
      event.stopPropagation();
      $store.commit('music/deletePlayMusicList', id);
    }

    // 列表项点击
    function playlistItem(id: number, item: PlayMusicItem): void {
      // 播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
      closePlayList();
    }

    // 跳转歌曲位置
    function jumpSongPosition(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    return {
      timeStampToDuration,
      playMusicId,
      playMusicItem,
      playMusicList,
      collectAll,
      emptyMusicList,
      handleCollection,
      handleShare,
      handleDownload,
      deleteMusic,
      playlistItem,
      closePlayList,
      jumpSingerDetail,
      jumpSongPosition
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
