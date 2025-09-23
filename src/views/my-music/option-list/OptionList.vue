<template>
  <h2
    v-if="options.mySinger?.count > 0"
    class="music-my-singer"
    :class="{ 'my-singer-active': options.mySinger?.visible }"
    @click="handleMySinger"
  >
    我的歌手({{ options.mySinger?.count }})
  </h2>
  <h2
    v-if="options.myVideo?.count > 0"
    class="music-my-mv"
    :class="{ 'my-mv-active': options.myVideo?.visible }"
    @click="handleMyVideo"
  >
    我的视频({{ options.myVideo?.count }})
  </h2>
  <SongSheetToggle
    :title="'创建的歌单'"
    :count="options.songSheet?.createCount"
    :list="songSheetList.create"
    addBtnShow
    @handleListChange="handleListChange"
    @dialogConfirm="handleConfirm"
  />
  <SongSheetToggle
    v-if="options.songSheet?.collectionCount > 0"
    :visible="options.songSheet?.visible"
    :title="'收藏的歌单'"
    :count="options.songSheet?.collectionCount"
    :list="songSheetList.collect"
    @handleListChange="handleListChange"
    @dialogConfirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { userPlayList, addPlayList, deletePlayList } from '@/api/my-music';
import type { ResponseType } from '@/types';
import SongSheetToggle from './song-sheet-toggle/SongSheetToggle.vue';

type SongSheet = {
  create: SongSheetItem[];
  collect: SongSheetItem[];
};

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
  subscribed: boolean;
  creator: {
    userId: number;
    nickname: string;
  };
};

defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
});
const emits = defineEmits(['handleOptions']);

const store = useStore();
const isLogin = computed(() => store.getters.isLogin);
const userInfo = computed(() => store.getters.userInfo);
const songSheetId = computed(() => store.getters.songSheetId);

// 我的歌手
function handleMySinger(): void {
  emits('handleOptions', { type: 'mySinger', data: { visible: true } });
}

// 我的视频
function handleMyVideo(): void {
  emits('handleOptions', { type: 'myVideo', data: { visible: true } });
}

// 获取歌单列表
const songSheetList = reactive<SongSheet>({
  create: [],
  collect: []
});

function getSongSheetList(): Promise<SongSheetItem[]> {
  return new Promise((resolve) => {
    userPlayList({ uid: userInfo.value.profile?.userId })
      .then((res: ResponseType) => {
        if (res?.code !== 200) {
          return;
        }

        res.playlist?.forEach?.((item: SongSheetItem) => {
          if (!item.name?.includes?.('喜欢的音乐')) {
            return;
          }

          item.name = '我喜欢的音乐';
        });

        // 创建/收藏的歌单
        songSheetList.create = res.playlist?.filter?.((item: SongSheetItem) => !item.subscribed);
        songSheetList.collect = res.playlist?.filter?.((item: SongSheetItem) => item.subscribed);

        resolve(res?.playlist);
      })
      .catch(() => ({}));
  });
}

// 创建/收藏歌单点击
function handleListChange(id: number): void {
  emits('handleOptions', { type: 'songSheet', data: { visible: true } });

  store.commit('setSongSheetId', id);
}

// 添加/删除歌单
function handleConfirm(data: { type: string; name: string; id: number }): void {
  if (data.type === 'add') {
    handleAddConfirm(data.name);
    return;
  }

  handleDeleteConfirm(data.id);
}

// 创建歌单项
function handleAddConfirm(name: string): void {
  addPlayList({ name })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      emits('handleOptions', {
        type: 'songSheet',
        data: {
          visible: true,
          createCount: songSheetList.create.length + 1
        }
      });
      songSheetList.create.splice?.(1, 0, res.playlist);

      store.commit('setSongSheetId', res.id);
    })
    .catch(() => ({}));
}

// 删除歌单项
function handleDeleteConfirm(id: number): void {
  deletePlayList({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      songSheetList.create.forEach?.((item, index) => {
        if (item.id === id) {
          store.commit('setSongSheetId', songSheetList.create[index - 1].id);

          emits('handleOptions', {
            type: 'songSheet',
            data: {
              visible: true,
              createCount: songSheetList.create?.length - 1
            }
          });
          songSheetList.create.splice?.(index, 1);
        }
      });

      songSheetList.collect.forEach?.((item, index) => {
        if (item.id === id) {
          if (songSheetList.collect[index - 1]?.id) {
            store.commit('setSongSheetId', songSheetList.collect[index - 1].id);
          } else {
            store.commit('setSongSheetId', songSheetList.create[0].id);
          }

          emits('handleOptions', {
            type: 'songSheet',
            data: {
              visible: true,
              collectionCount: songSheetList.collect?.length - 1
            }
          });
          songSheetList.collect.splice?.(index, 1);
        }
      });
    })
    .catch(() => ({}));
}

onMounted(async () => {
  if (!isLogin.value) {
    return;
  }

  const playlist = await getSongSheetList();

  if (!songSheetId.value) {
    store.commit('setSongSheetId', playlist[0].id);
  }
});

onUnmounted(() => {
  store.commit('setSongSheetId', 0);
});
</script>

<style lang="less" scoped>
@import url('./option-list.less');
</style>
