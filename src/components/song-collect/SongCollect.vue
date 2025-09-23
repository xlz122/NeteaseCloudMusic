<template>
  <div class="song-collect">
    <Dialog
      class="collect-dialog"
      :visible="songCollect.visible"
      :title="'添加到歌单'"
      @cancel="collectCancel"
    >
      <div class="song-collect-sheet" @click="addSongSheet">
        <i class="icon"></i>
        新歌单
      </div>
      <ul class="song-sheet-list">
        <li
          class="item"
          v-for="(item, index) in songSheetList"
          :key="index"
          @click="handleCollection(item.id)"
        >
          <div class="item-cover">
            <img class="item-cover-img" :src="item.coverImgUrl" alt="" />
          </div>
          <div class="item-info">
            <span class="item-info-name" :title="item.name">
              {{ item.name }}
            </span>
            <span class="item-info-count">{{ item.trackCount }}首</span>
          </div>
        </li>
      </ul>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import { userPlayList, collectSong } from '@/api/my-music';
import type { ResponseType } from '@/types';
import Dialog from '@/components/Dialog.vue';

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  subscribed: boolean;
};

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);
const songCollect = computed(() => store.getters.songCollect);

watch(
  () => songCollect.value.visible,
  () => {
    if (!isLogin.value) {
      return;
    }
    if (!songCollect.value.visible) {
      return;
    }

    getUserPlayList();
  },
  { immediate: true }
);

// 获取歌单列表
const songSheetList = ref<SongSheetItem[]>([]);

function getUserPlayList(): void {
  userPlayList({ uid: userInfo.value.profile?.userId })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songSheetList.value = [];

      res.playlist?.forEach?.((item: SongSheetItem) => {
        if (item.name?.includes?.('喜欢的音乐')) {
          item.name = '我喜欢的音乐';
        }

        // 非收藏歌单
        if (!item.subscribed) {
          songSheetList.value.push(item);
        }
      });
    })
    .catch(() => ({}));
}

// 新歌单
function addSongSheet(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

function handleCollection(id: number): void {
  collectSong({ pid: id, tracks: songCollect.value.songIds })
    .then((res: ResponseType) => {
      if (res?.body?.code !== 200) {
        setMessage({ type: 'error', title: res.body?.message });
        return;
      }

      store.commit('setSongCollect', { visible: false, songIds: '' });
      setMessage({ type: 'info', title: '收藏成功' });
    })
    .catch(() => ({}));
}

function collectCancel(): void {
  store.commit('setSongCollect', {
    visible: false,
    songIds: ''
  });

  store.commit('setSongCollect', { visible: false, songIds: '' });
}
</script>

<style lang="less" scoped>
@import url('./song-collect.less');
</style>
