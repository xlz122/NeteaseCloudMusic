<template>
  <div class="song-sheet-container">
    <template v-if="songSheetList?.createSongSheet?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === userId">我创建的歌单</span>
          <span v-else>
            {{ songSheetList?.createSongSheet[0]?.creator?.nickname }}创建的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.createSongSheet?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.createSongSheet"
          :key="index"
          :class="{ 'first-list-item': !(index % 5) }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i class="info-icon-right" title="播放"></i>
            </div>
          </div>
          <p
            class="item-desc"
            :title="item?.name"
            @click="jumpSongSheetDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
        </li>
      </ul>
    </template>
    <template v-if="songSheetList?.collectSongSheet?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === userId">我收藏的歌单</span>
          <span v-else>
            {{
              songSheetList?.collectSongSheet[0]?.creator?.nickname
            }}收藏的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.collectSongSheet?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.collectSongSheet"
          :key="index"
          :class="{ 'first-list-item': index === 0 }"
        >
          <div class="item-cover">
            <img
              class="cover-img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
              alt="cover-img"
            />
            <div class="cover-bottom">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i class="info-icon-right" title="播放"></i>
            </div>
          </div>
          <p class="item-desc" :title="item?.name">{{ item?.name }}</p>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { bigNumberTransform } from '@/utils/utils';
import { userPlayList } from '@/api/my-music';
import type { ResponseType } from '@/types/types';

type SongSheet = {
  createSongSheet: SongSheetItem[];
  collectSongSheet: SongSheetItem[];
};

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  playCount: string | number;
  subscribed: boolean;
  creator: {
    nickname: string;
  };
};

const $store = useStore();
const userInfo = computed(() => $store.getters.userInfo);
const userId = computed<number>(() => $store.getters.userId);

watch(
  () => userId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getUserPlayList();
  },
  {
    immediate: true
  }
);

const songSheetList = reactive<SongSheet>({
  createSongSheet: [],
  collectSongSheet: []
});

// 获取用户歌单列表
function getUserPlayList(): void {
  userPlayList({ uid: userId.value })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        songSheetList.createSongSheet = [];
        songSheetList.collectSongSheet = [];

        res.playlist.forEach((item: SongSheetItem) => {
          if (
            userInfo.value?.profile?.userId === userId.value &&
            item?.name?.includes('喜欢的音乐')
          ) {
            item.name = '我喜欢的音乐';
          }

          item.playCount = bigNumberTransform(item?.playCount);
        });

        // 创建/收藏的歌单
        songSheetList.createSongSheet = res?.playlist.filter(
          (item: SongSheetItem) => !item.subscribed
        );
        songSheetList.collectSongSheet = res?.playlist.filter(
          (item: SongSheetItem) => item.subscribed
        );
      }
    })
    .catch(() => ({}));
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $store.commit('jumpSongSheetDetail', id);
}
</script>

<style lang="less" scoped>
@import url('./song-sheet-list.less');
</style>
