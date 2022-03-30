<template>
  <div class="collect-song">
    <my-dialog
      class="collect-song-dialog"
      :visible="collectSong.visible"
      :title="'添加到歌单'"
      @cancel="collectCancel"
    >
      <div class="collect-song-sheet" @click="addSongSheet">
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
    </my-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { userPlayList, collectMusic } from '@api/my-music';
import { ResponseType, LoopType } from '@/types/types';
import MyDialog from '@/components/MyDialog.vue';

export default defineComponent({
  name: 'AddSongSheet',
  components: {
    MyDialog
  },
  setup() {
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    const collectSong = computed(() => $store.getters['music/collectSong']);

    watch(
      () => collectSong.value.visible,
      () => {
        if (collectSong.value.visible) {
          getUserPlayList();
        } else if (isLogin.value) {
          getUserPlayList();
        }
      },
      {
        immediate: true
      }
    );

    // 获取歌单列表
    const songSheetList = ref<Record<string, any>[]>([]);

    function getUserPlayList(): void {
      userPlayList({
        uid: userInfo.value?.profile?.userId
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetList.value = [];

            // 处理列表数据
            res.playlist.forEach((item: LoopType) => {
              // 喜欢的音乐处理
              if (item.name.includes('喜欢的音乐')) {
                item.name = '我喜欢的音乐';
              }
              // 收藏列表判断
              if (!item.subscribed) {
                songSheetList.value.push(item);
              }
            });
          }
        })
        .catch(() => ({}));
    }

    // 新歌单
    function addSongSheet(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能未开发'
      });
    }

    // 收藏歌曲
    function handleCollection(id: number): void {
      collectMusic({
        pid: id,
        tracks: collectSong.value.songIds
      })
        .then((res: ResponseType) => {
          if (res.body.code === 200) {
            $store.commit('music/collectPlayMusic', {
              visible: false,
              songIds: ''
            });
            $store.commit('setMessage', {
              type: 'info',
              title: '收藏成功'
            });
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res.body.message
            });
          }
        })
        .catch(() => ({}));
    }

    // 关闭弹框
    function collectCancel(): void {
      $store.commit('music/collectPlayMusic', {
        visible: false,
        songIds: ''
      });
    }

    return {
      collectSong,
      songSheetList,
      addSongSheet,
      handleCollection,
      collectCancel
    };
  }
});
</script>

<style lang="less" scoped>
@import './collect-song.less';
</style>
