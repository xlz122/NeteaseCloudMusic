<template>
  <div class="song-sheet-info">
    <div class="header-info">
      <div class="info-img">
        <img class="img" :src="`${songSheetDetail.playlist?.coverImgUrl}?param=200y200`" alt="" />
        <i class="high-quality" v-if="songSheetDetail.playlist?.highQuality"></i>
        <i class="icon"></i>
      </div>
      <div class="info-right">
        <div class="title">
          <i class="icon-title"></i>
          <h2 class="title-text">
            <p class="text">{{ songSheetDetail.playlist?.name }}</p>
          </h2>
        </div>
        <div class="info">
          <img
            class="user-avatar"
            :src="songSheetDetail.playlist?.creator?.avatarUrl"
            @click="jumpUserProfile(songSheetDetail.playlist?.creator?.userId)"
            alt=""
          />
          <span
            class="user-name"
            @click="jumpUserProfile(songSheetDetail.playlist?.creator?.userId)"
          >
            {{ songSheetDetail.playlist?.creator?.nickname }}
          </span>
          <template v-if="songSheetDetail.playlist?.creator?.avatarDetail">
            <img
              class="icon-identity"
              :src="songSheetDetail.playlist?.creator?.avatarDetail?.identityIconUrl"
              alt=""
            />
          </template>
          <span class="user-time">
            {{ formatTimestamp(songSheetDetail.playlist?.createTime, 'YYYY-MM-DD') }}
            创建
          </span>
        </div>
        <div class="operate-btn">
          <div
            class="play"
            :class="{
              'disable-play': songSheetDetail.playlist?.tracks?.length === 0
            }"
            title="播放"
            @click="playAllSong"
          >
            <span class="icon-play">播放</span>
          </div>
          <div
            class="play-add"
            :class="{
              'disable-add': songSheetDetail.playlist?.tracks?.length === 0
            }"
            title="添加到播放列表"
            @click="allSongToPlaylist"
          ></div>
          <!-- 自己的歌单，不可收藏/取消收藏 -->
          <template v-if="songSheetDetail.playlist?.userId === userInfo.profile?.userId">
            <div class="other collection disable-collection">
              <span class="icon" v-if="songSheetDetail.playlist?.subscribedCount > 0">
                ({{ songSheetDetail.playlist?.subscribedCount }})
              </span>
              <span class="icon" v-else>收藏</span>
            </div>
          </template>
          <!-- 其他人歌单，可收藏/取消收藏 -->
          <template v-else>
            <div
              class="other collection"
              :class="{
                'disable-collection': songSheetDetail.playlist?.subscribed
              }"
              @click="handleCollection()"
            >
              <template v-if="songSheetDetail.playlist?.subscribedCount > 0">
                <span class="icon"> ({{ songSheetDetail.playlist?.subscribedCount }}) </span>
              </template>
              <template v-else>
                <span class="icon">收藏</span>
              </template>
            </div>
          </template>
          <div
            class="other share"
            :class="{
              'disable-share': songSheetDetail.playlist?.tracks?.length === 0
            }"
            @click="handleShare"
          >
            <template v-if="songSheetDetail.playlist?.shareCount > 0">
              <span class="icon"> ({{ songSheetDetail.playlist?.shareCount }}) </span>
            </template>
            <template v-else>
              <span class="icon">分享</span>
            </template>
          </div>
          <div
            class="other download"
            :class="{
              'disable-download': songSheetDetail.playlist?.tracks?.length === 0
            }"
            @click="handleDownload"
          >
            <span class="icon">下载</span>
          </div>
          <div
            class="other comment"
            :class="{
              'disable-comment': songSheetDetail.playlist?.tracks?.length === 0
            }"
            @click="jumpToComment"
          >
            <template v-if="songSheetDetail.playlist?.commentCount > 0">
              <span class="icon"> ({{ songSheetDetail.playlist?.commentCount }}) </span>
            </template>
            <template v-else>
              <span class="icon">评论</span>
            </template>
          </div>
        </div>
        <div class="tags" v-if="songSheetDetail.playlist?.tags?.length > 0">
          <b class="title">标签：</b>
          <ul class="list">
            <li
              class="item"
              v-for="(item, index) in songSheetDetail.playlist?.tags"
              :key="index"
              @click="jumpSongSheet(item)"
            >
              <span class="text">{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="desc" v-if="songSheetDetail.playlist?.description">
          <div class="content" v-if="songSheetDetail.playlist?.description?.length < 170">
            <pre>介绍：{{ songSheetDetail.playlist?.description }}</pre>
          </div>
          <div class="content" v-else :class="{ 'text-hide': !toggleShow }">
            <pre>介绍：{{ songSheetDetail.playlist?.description }}</pre>
          </div>
        </div>
        <div class="toggle-btn" v-if="songSheetDetail.playlist?.description?.length > 170">
          <span v-if="!toggleShow" @click="toggle">
            <span class="text">展开</span>
            <i class="icon"></i>
          </span>
          <span v-else @click="toggle">
            <span class="text">收起</span>
            <i class="icon hide"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { formatTimestamp } from '@/utils/utils';
import type { SongType } from '@/hooks/useFormatSong';

const props = defineProps({
  songSheetDetail: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['handleCollection', 'jumpToComment']);

const router = useRouter();
const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);

// 展开/收缩简介
const toggleShow = ref(false);

function toggle(): void {
  toggleShow.value = !toggleShow.value;
}

// 歌曲是否有版权
function isCopyright(id: number): boolean {
  const privilege = props.songSheetDetail.privileges?.find?.(
    (item: { id: number }) => item.id === id
  );
  if (privilege.cp === 0) {
    return true;
  }

  return false;
}

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (props.songSheetDetail.playlist?.tracks?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = props.songSheetDetail.playlist?.tracks?.filter?.(
    (item: { id: number }) => !isCopyright(item.id)
  );

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): void {
  if (props.songSheetDetail.playlist?.tracks?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = props.songSheetDetail.playlist?.tracks?.filter?.(
    (item: { id: number }) => !isCopyright(item.id)
  );

  useSongAddPlaylist(songList);
}

function handleCollection(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  emits('handleCollection');
}

function handleShare(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleDownload(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function jumpToComment(): void {
  if (!isLogin.value) {
    store.commit('setLoginDialog', true);
    return;
  }

  emits('jumpToComment');
}

function jumpUserProfile(id: number): void {
  router.push({ path: '/user-profile', query: { id } });
}

function jumpSongSheet(name: string): void {
  router.push({ path: '/home-song-sheet', query: { name } });
}
</script>

<style lang="less" scoped>
@import url('./song-sheet-info.less');
</style>
