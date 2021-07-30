<template>
  <div class="song-list">
    <dl class="group" v-for="(item, index) in listData" :key="index">
      <dt class="top">
        <div class="top-img">
          <img
            class="img"
            :src="item?.playlist?.coverImgUrl"
            :alt="item?.playlist?.name"
          />
        </div>
        <div class="title">
          <h3 class="t-text">{{ item?.playlist?.name }}</h3>
          <div class="btns">
            <i class="btn-play" title="播放"></i>
            <i class="btn-collection" title="收藏"></i>
          </div>
        </div>
      </dt>
      <dd>
        <ul class="list">
          <li
            class="item"
            v-for="(i, ind) in item?.playlist?.tracks.slice(0, 10)"
            :key="ind"
          >
            <span class="num" :class="{ topThree: ind < 3 }">
              {{ ind + 1 }}
            </span>
            <p class="text" @click="jumpSongDetail(i.id)">{{ i?.name }}</p>
            <div class="operate">
              <i
                class="operate-play"
                title="播放"
                @click="playListMusic(i.id, i)"
              ></i>
              <i
                class="operate-add"
                title="添加到播放列表"
                @click="setAddSinglePlayList(i.id)"
              ></i>
              <i class="operate-collection" title="收藏"></i>
            </div>
          </li>
        </ul>
        <div class="more">查看全部></div>
      </dd>
    </dl>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { soaringList, newSongs, originalList } from '@api/home';
import { ResponseType } from '@/types/types';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const listData = reactive<unknown[]>([]);
    // 获取飙升榜数据
    function getSoaringList(): void {
      soaringList().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getSoaringList();

    // 获取新歌榜数据
    function getNewSongs(): void {
      newSongs().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getNewSongs();

    // 获取原创榜数据
    function getOriginalList(): void {
      originalList().then((res: ResponseType) => {
        if (res.code === 200) {
          listData.push(res);
        }
      });
    }
    getOriginalList();

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌曲id
      $store.commit('setSongId', id);
      $router.push({ name: 'song-detail', params: { songId: id } });
    }

    // 播放列表音乐
    function playListMusic(id: number, item: Record<string, any>): void {
      $store.commit('setMessage', {
        type: 'error',
        title: `该功能需重构播放数据，待更新，id:${id}，item:${item}`
      });
      // // 当前播放音乐id
      // $store.commit('music/setPlayMusicId', id);
      // // 当前播放音乐数据
      // $store.commit('music/setPlayMusicItem', item);
      // // 播放音乐数据
      // $store.commit('music/setPlayMusicList', item);
      // // 开始播放
      // $store.commit('music/setMusicPlayStatus', {
      //   look: true,
      //   loading: true,
      //   refresh: true
      // });
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(id: number): void {
      $store.commit('setMessage', {
        type: 'error',
        title: `该功能需重构播放数据，待更新，id:${id}`
      });
      // if (singerSong.value?.hotSongs?.length > 0) {
      //   const musicItem = singerSong.value?.hotSongs?.find(
      //     (item: LoopType) => item.id === id
      //   );
      //   // 播放音乐数据
      //   $store.commit('music/setPlayMusicList', musicItem);
      // }
    }

    return {
      listData,
      jumpSongDetail,
      playListMusic,
      setAddSinglePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-list.less';
</style>
