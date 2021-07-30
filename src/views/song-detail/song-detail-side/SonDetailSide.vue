<template>
  <div class="song-detail-side-container">
    <template v-if="songSheetList.length > 0">
      <h3 class="title">包含这首歌的歌单</h3>
      <ul class="song-sheet-list">
        <li class="item" v-for="(item, index) in songSheetList" :key="index">
          <div class="item-cover" @click="jumpSongSheetDetail(item.id)">
            <img
              class="cover-img"
              :src="`${item.coverImgUrl}?param=50y50`"
              alt=""
            />
          </div>
          <div class="item-info">
            <p
              class="info-title"
              :title="item.name"
              @click="jumpSongSheetDetail(item.id)"
            >
              {{ item?.name }}
            </p>
            <div class="info-desc">
              <span class="by">by</span>
              <span
                class="text"
                :title="item?.creator?.nickname"
                @click="jumpUserProfile(item?.creator?.userId)"
              >
                {{ item?.creator?.nickname }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template v-if="simiSongList.length > 0">
      <h3 class="title">相似歌曲</h3>
      <ul class="simi-song-list">
        <li class="item" v-for="(item, index) in simiSongList" :key="index">
          <div class="item-info">
            <p
              class="info-title"
              :title="item.name"
              @click="jumpSongDetail(item.id)"
            >
              <span class="text">{{ item?.name }}</span>
            </p>
            <div
              class="info-desc"
              :title="item?.artists[0]?.name"
              @click="jumpSingerDetail(item?.artists[0]?.id)"
            >
              <span class="text">{{ item?.artists[0]?.name }}</span>
            </div>
          </div>
          <div class="item-operate">
            <i
              class="icon-operate play"
              @click="playListMusic(item.id, item)"
            ></i>
            <i
              class="icon-operate add"
              @click="setAddSinglePlayList(item.id)"
            ></i>
          </div>
        </li>
      </ul>
    </template>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { simiPlaylist, simiSong } from '@api/song-detail';
import { ResponseType, LoopType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

export default defineComponent({
  components: {
    SideDownload
  },
  setup() {
    const $router = useRouter();
    const $store = useStore();

    // 歌曲id
    const songId = computed(() => $store.getters.songId);

    const songSheetList = ref<unknown[]>([]);
    // 获取这首歌的歌单
    function getSimiPlaylist(): void {
      simiPlaylist({ id: songId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetList.value = res.playlists;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSimiPlaylist();

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { songSheetId: id } });
    }

    // 跳转用户资料
    function jumpUserProfile(userId: number): void {
      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);
      $router.push({ name: 'user-profile', params: { userId } });
    }

    // 相似歌曲
    const simiSongList = ref<Record<string, any>>([]);
    // 获取这首歌的歌单
    function getSimiSong(): void {
      simiSong({ id: songId.value })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            simiSongList.value = res.songs;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSimiSong();

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      // 存储歌曲id
      $store.commit('setSongId', id);
      getSimiPlaylist();
      getSimiSong();
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 播放列表音乐(有bug)
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
      // if (simiSongList.value?.length > 0) {
      //   const musicItem = simiSongList.value?.find(
      //     (item: LoopType) => item.id === id
      //   );
      //   // 播放音乐数据
      //   $store.commit('music/setPlayMusicList', musicItem);
      // }
    }

    return {
      songSheetList,
      jumpSongSheetDetail,
      jumpUserProfile,
      simiSongList,
      jumpSongDetail,
      jumpSingerDetail,
      playListMusic,
      setAddSinglePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-detail-side.less';
</style>
