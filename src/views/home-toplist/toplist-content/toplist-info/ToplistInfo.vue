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
        <template v-else>
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
          <span class="text">最近更新:</span>
          <span class="time">
            {{
              formatDateTime(
                songSheetDetail?.playlist?.updateTime / 1000,
                'MM月dd日'
              )
            }}
          </span>
          <template v-if="songSheetDetail?.playlist?.updateFrequency">
            <span class="desc">
              （{{ songSheetDetail?.playlist?.updateFrequency }}）
            </span>
          </template>
        </div>
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': songSheetDetail?.playlist?.tracks.length === 0
            }"
            title="播放"
            @click="playAllSong"
          >
            <span class="icon-play">播放</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-add': songSheetDetail?.playlist?.tracks.length === 0
            }"
            title="添加到播放列表"
            @click="allSongToPlaylist"
          ></div>
          <div
            class="other collection"
            :class="`${isLogin ? 'disable-collection' : ''}`"
            @click="handleCollection"
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
            @click="handleShare"
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
            @click="handleDownload"
          >
            <span class="icon">下载</span>
          </div>
          <div
            class="other comment"
            :class="{
              'disable-comment': songSheetDetail?.playlist?.tracks.length === 0
            }"
            @click="jumpToComment"
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

<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatDateTime } from '@/utils/utils';
import type { SongType } from '@/hooks/methods/songFormat';

const props = defineProps({
  songSheetDetail: {
    type: Object,
    default: () => {}
  }
});

const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

const { songSheetDetail } = toRefs(props);

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const privilege = songSheetDetail.value?.privileges.find(
    (item: { id: number }) => item.id === id
  );

  if (privilege?.cp === 0) {
    return true;
  }

  return false;
}

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (songSheetDetail.value?.playlist?.tracks.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = songSheetDetail.value?.playlist?.tracks.filter(
    (item: { id: number }) => !isCopyright(item.id)
  );

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): boolean | undefined {
  if (songSheetDetail.value?.playlist?.tracks.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = songSheetDetail.value?.playlist?.tracks.filter(
    (item: { id: number }) => !isCopyright(item.id)
  );

  useSongAddPlaylist(songList);
}

// 收藏
function handleCollection(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }
}

// 分享
function handleShare(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 下载
function handleDownload(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 跳转至评论
function jumpToComment(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  const commentDom = document.querySelector(
    '.comment-component'
  ) as HTMLDivElement;

  window.scrollTo(0, Number(commentDom.offsetTop) + 120);
}
</script>

<style lang="less">
@import url('./toplist-info.less');
</style>
