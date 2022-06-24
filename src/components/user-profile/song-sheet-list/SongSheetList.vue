<template>
  <div class="song-sheet-container">
    <template v-if="songSheetList?.createSongList?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === userId">我创建的歌单</span>
          <span v-else>
            {{ songSheetList?.createSongList[0]?.creator?.nickname }}创建的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.createSongList?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.createSongList"
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
          <p class="item-desc" :title="item?.name">{{ item?.name }}</p>
        </li>
      </ul>
    </template>
    <template v-if="songSheetList?.collectionSongList?.length > 0">
      <div class="title">
        <span class="text">
          <span v-if="userInfo?.profile?.userId === userId">我收藏的歌单</span>
          <span v-else>
            {{
              songSheetList?.collectionSongList[0]?.creator?.nickname
            }}收藏的歌单
          </span>
          <i class="icon-r"></i>
        </span>
        <span class="text-length">
          ({{ songSheetList?.collectionSongList?.length }})
        </span>
      </div>
      <ul class="song-sheet-list">
        <li
          class="list-item"
          v-for="(item, index) in songSheetList?.collectionSongList"
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

<script lang="ts">
import { defineComponent, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { bigNumberTransform } from '@utils/utils';
import { userPlayList } from '@api/my-music';
import { SongList, ResponseType, LoopType } from '@/types/types';

export default defineComponent({
  setup() {
    const $store = useStore();

    const userInfo = computed(() => $store.getters.userInfo);
    const userId = computed<number>(() => $store.getters.userId);

    watch(
      () => userId.value,
      curVal => {
        if (curVal) {
          getUserPlayList();
        }
      },
      {
        immediate: true
      }
    );

    const songSheetList = reactive<SongList>({
      createSongList: [],
      collectionSongList: []
    });

    // 获取用户歌单列表
    function getUserPlayList(): void {
      userPlayList({
        uid: userId.value
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetList.createSongList = [];
            songSheetList.collectionSongList = [];

            res.playlist.forEach((item: LoopType) => {
              if (
                userInfo.value?.profile?.userId === userId.value &&
                item?.name?.includes('喜欢的音乐')
              ) {
                item.name = '我喜欢的音乐';
              }

              // 收藏列表判断
              if (!item.subscribed) {
                songSheetList.createSongList.push(item);
              } else {
                songSheetList.collectionSongList.push(item);
              }

              item.playCount = bigNumberTransform(item?.playCount);
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    return {
      userInfo,
      userId,
      songSheetList,
      jumpSongSheetDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-list.less';
</style>
