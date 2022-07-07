<template>
  <h2
    v-if="options?.mySinger?.count > 0"
    class="music-my-singer"
    :class="{ 'my-singer-active': options?.mySinger?.visible }"
    @click="handleMySinger"
  >
    我的歌手({{ options?.mySinger?.count }})
  </h2>
  <h2
    v-if="options?.myVideo?.count > 0"
    class="music-my-mv"
    :class="{ 'my-mv-active': options?.myVideo?.visible }"
    @click="handleMyVideo"
  >
    我的视频({{ options?.myVideo?.count }})
  </h2>
  <SongSheetToggle
    :title="'创建的歌单'"
    :list="songSheetList.createSongSheet"
    :listCount="options?.songSheet?.createCount"
    addBtnShow
    @handleListChange="handleListChange"
    @dialogConfirm="handleConfirm"
  />
  <SongSheetToggle
    v-if="options?.songSheet?.collectionCount > 0"
    :visible="options?.songSheet?.visible"
    :title="'收藏的歌单'"
    :list="songSheetList.collectSongSheet"
    :listCount="options?.songSheet?.collectionCount"
    @handleListChange="handleListChange"
    @dialogConfirm="handleConfirm"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { userPlayList, addPlayList, deletePlayList } from '@api/my-music';
import type { ResponseType } from '@/types/types';
import SongSheetToggle from './song-sheet-toggle/SongSheetToggle.vue';

type SongSheetList = {
  createSongSheet: Record<string, any>;
  collectSongSheet: Record<string, any>;
};

export default defineComponent({
  components: {
    SongSheetToggle
  },
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['handleOptions'],
  setup(props, { emit }) {
    const $route = useRoute();
    const $store = useStore();

    const isLogin = computed(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    const songSheetId = computed(() => $store.getters.songSheetId);

    // 我的歌手
    function handleMySinger(): void {
      emit('handleOptions', {
        type: 'mySinger',
        data: {
          visible: true
        }
      });
    }

    // 我的视频
    function handleMyVideo(): void {
      emit('handleOptions', {
        type: 'myVideo',
        data: {
          visible: true
        }
      });
    }

    const songSheetList = reactive<SongSheetList>({
      createSongSheet: [],
      collectSongSheet: []
    });

    // 获取用户歌单列表
    function getUserPlayList(): Promise<Record<string, any>> {
      songSheetList.createSongSheet = [];
      songSheetList.collectSongSheet = [];

      return new Promise(resolve => {
        userPlayList({
          uid: userInfo.value?.profile?.userId
        })
          .then((res: ResponseType) => {
            if (res.code === 200) {
              res?.playlist.forEach(
                (item: {
                  name: string;
                  cannotEdit: boolean;
                  cannotDelete: boolean;
                  subscribed: boolean;
                }) => {
                  if (item?.name?.includes('喜欢的音乐')) {
                    item.name = '我喜欢的音乐';
                    item.cannotEdit = true;
                    item.cannotDelete = true;
                  }

                  // 收藏列表判断
                  if (!item.subscribed) {
                    songSheetList.createSongSheet.push(item);
                  } else {
                    item.cannotEdit = true;
                    songSheetList.collectSongSheet.push(item);
                  }

                  resolve(res?.playlist);
                }
              );
            }
          })
          .catch(() => ({}));
      });
    }

    watch(
      () => $route.path,
      (to, from) => {
        if (!isLogin.value) {
          return false;
        }

        (async () => {
          // 刷新
          if (to && !from) {
            const playlist = await getUserPlayList();
            const isExist = playlist.find(
              (item: { id: number }) => item.id === songSheetId.value
            );

            if (isExist) {
              $store.commit('setSongSheetId', songSheetId.value);
            } else {
              $store.commit('setSongSheetId', playlist[0].id);
            }
          }

          // 离开当前路由
          if (to && from) {
            $store.commit(
              'setSongSheetId',
              songSheetList.createSongSheet[0]?.id || 0
            );
          }
        })();
      },
      {
        immediate: true
      }
    );

    // 创建/收藏歌单点击
    function handleListChange(id: number): void {
      emit('handleOptions', {
        type: 'songSheet',
        data: {
          visible: true
        }
      });

      $store.commit('setSongSheetId', id);
    }

    // 添加/删除歌单
    function handleConfirm(data: {
      type: string;
      name: string;
      id: number;
    }): boolean | undefined {
      if (data.type === 'add') {
        handleAddConfirm(data.name);
        return false;
      }

      handleDeleteConfirm(data.id);
    }

    // 创建歌单项
    function handleAddConfirm(name: string): void {
      addPlayList({ name })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            emit('handleOptions', {
              type: 'songSheet',
              data: {
                visible: true,
                createCount: songSheetList.createSongSheet.length + 1
              }
            });
            songSheetList.createSongSheet.splice(1, 0, res.playlist);

            $store.commit('setSongSheetId', res.id);
          }
        })
        .catch(() => ({}));
    }

    // 删除歌单项
    function handleDeleteConfirm(id: number): void {
      deletePlayList({ id })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetList.createSongSheet.forEach(
              (item: unknown, index: number) => {
                const itemId = (item as { id: number }).id;

                if (id === itemId) {
                  $store.commit(
                    'setSongSheetId',
                    songSheetList.createSongSheet[index - 1].id
                  );

                  emit('handleOptions', {
                    type: 'songSheet',
                    data: {
                      visible: true,
                      createCount: songSheetList.createSongSheet.length - 1
                    }
                  });
                  songSheetList.createSongSheet.splice(index, 1);
                }
              }
            );
            songSheetList.collectSongSheet.forEach(
              (item: { id: number }, index: number) => {
                if (id === item.id) {
                  if (songSheetList.collectSongSheet[index - 1]?.id) {
                    $store.commit(
                      'setSongSheetId',
                      songSheetList.collectSongSheet[index - 1].id
                    );
                  } else {
                    $store.commit(
                      'setSongSheetId',
                      songSheetList.createSongSheet[0].id
                    );
                  }

                  emit('handleOptions', {
                    type: 'songSheet',
                    data: {
                      visible: true,
                      collectionCount: songSheetList.collectSongSheet.length - 1
                    }
                  });
                  songSheetList.collectSongSheet.splice(index, 1);
                }
              }
            );
          }
        })
        .catch(() => ({}));
    }

    return {
      handleMySinger,
      handleMyVideo,
      songSheetList,
      handleListChange,
      handleConfirm
    };
  }
});
</script>

<style lang="less" scoped>
@import './option-list.less';
</style>
