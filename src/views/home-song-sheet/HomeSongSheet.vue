<template>
  <div class="home-song-sheet">
    <div class="home-song-sheet-container">
      <div class="title">
        <span class="text">{{ songTitle }}</span>
        <div class="classify-btn" @click="classifyModal">
          <i class="icon">
            <span class="text">选择分类</span>
            <span class="arrow"></span>
          </i>
        </div>
        <ClassifyModal v-show="classifyShow" @catChange="catChange" />
        <div class="hot-btn" @click="hotSong">
          <span class="text">热门</span>
        </div>
      </div>
      <ul class="list-content">
        <li
          class="item"
          v-for="(item, index) in songSheetList"
          :key="index"
          :class="{ 'last-item': songSheetList.length > 2 && !(index % 5) }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item?.coverImgUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item?.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="songSheetToPlayListPlay(item?.id)"
              ></i>
            </div>
          </div>
          <div class="item-bottom">
            <span
              class="text"
              :title="item.name"
              @click="jumpSongSheetDetail(item?.id)"
            >
              {{ item?.name }}
            </span>
            <div class="desc">
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
      <Page
        v-if="songParams.total > songParams.limit"
        :page="songParams.offset"
        :pageSize="songParams.limit"
        :total="songParams.total"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { topPlaylist } from '@api/home-song-sheet';
import { playlistTrack } from '@api/song-sheet-detail';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { handleAudioSong } from '@/common/audio.ts';
import { bigNumberTransform } from '@utils/utils';
import ClassifyModal from './classify-modal/ClassifyModal.vue';
import Page from '@components/page/Page.vue';

type SongParams = {
  order: string;
  cat: string;
  offset: number;
  limit: number;
  total: number;
};

export default defineComponent({
  name: 'home-song-sheet',
  components: {
    ClassifyModal,
    Page
  },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const songTitle = ref<string>('全部');
    const songSheetList = ref<unknown[]>([]);
    const songParams = reactive<SongParams>({
      order: 'hot',
      cat: '全部',
      offset: 1,
      limit: 50,
      total: 0
    });
    // 获取热门歌单数据
    function getTopPlaylist(): void {
      topPlaylist({
        order: songParams.order,
        cat: songParams.cat,
        offset: (songParams.offset - 1) * songParams.limit,
        limit: songParams.limit
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songTitle.value = res.cat;
            // 统计数格式化
            res?.playlists.forEach((item: LoopType) => {
              item.playCount = bigNumberTransform(item.playCount);
            });
            songSheetList.value = res.playlists;
            songParams.total = res.total;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    watch(
      () => $route.params,
      (curVal: { name: string }) => {
        songParams.cat = '全部';
        if (curVal) {
          songParams.cat = curVal.name;
        }
        getTopPlaylist();
      },
      {
        immediate: true
      }
    );

    // 热门
    function hotSong(): boolean | undefined {
      if (songParams.cat === '全部') {
        return false;
      }

      songParams.cat = '全部';
      songParams.offset = 1;
      getTopPlaylist();
    }

    // 分类弹框
    const classifyShow = ref<boolean>(false);
    function classifyModal(): void {
      classifyShow.value = !classifyShow.value;
    }

    // 分类点击
    function catChange(name: string): boolean | undefined {
      if (songParams.cat === '全部' && name === '全部') {
        return false;
      }
      songParams.cat = name;
      songParams.offset = 1;
      getTopPlaylist();
      classifyShow.value = false;
    }

    // 歌单歌曲添加到播放器
    function songSheetToPlayListPlay(id: number): void {
      playlistTrack({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }

            const songList: PlayMusicItem[] = [];

            res?.songs.forEach((item: LoopType) => {
              const musicItem: PlayMusicItem = handleAudioSong(item);

              songList.push(musicItem);
            });

            // 当前播放音乐数据
            $store.commit('music/setPlayMusicItem', songList[0]);
            // 添加到播放列表
            $store.commit('music/setPlayMusicList', songList);
            // 开始播放
            $store.commit('music/setMusicPlayStatus', {
              look: true,
              refresh: true
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $store.commit('jumpSongSheetDetail', id);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    // 分页
    function changPage(current: number): void {
      songParams.offset = current;
      getTopPlaylist();
    }

    onMounted(() => {
      $store.commit('setHeaderActiveIndex', 0);
    });

    return {
      songTitle,
      songSheetList,
      songParams,
      hotSong,
      classifyShow,
      classifyModal,
      catChange,
      songSheetToPlayListPlay,
      jumpSongSheetDetail,
      jumpUserProfile,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './home-song-sheet.less';
</style>
