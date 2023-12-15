<template>
  <div class="home-song-sheet">
    <div class="home-song-sheet-container">
      <div class="title">
        <span class="text">{{ title }}</span>
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
          v-for="(item, index) in songSheet"
          :key="index"
          :class="{ 'last-item': songSheet.length > 2 && !(index % 5) }"
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
              <template v-if="item?.creator?.avatarDetail?.identityIconUrl">
                <img
                  class="desc-img"
                  :src="item?.creator?.avatarDetail?.identityIconUrl"
                  alt=""
                />
              </template>
            </div>
          </div>
        </li>
      </ul>
      <Page
        v-if="params.total > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="params.total"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { bigNumberTransform } from '@/utils/utils';
import { topPlaylist } from '@/api/home-song-sheet';
import { playlistTrack } from '@/api/song-sheet-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';
import ClassifyModal from './classify-modal/ClassifyModal.vue';
import Page from '@/components/page/Page.vue';

type SongSheetItem = {
  id: number;
  name: string;
  coverImgUrl: string;
  playCount: number;
  creator: {
    userId: number;
    nickname: string;
    avatarDetail: {
      identityIconUrl: string;
    };
  };
};

const $route = useRoute();
const $router = useRouter();
const $store = useStore();

// 获取热门歌单
const params = reactive({
  order: 'hot',
  cat: '全部',
  offset: 1,
  limit: 50,
  total: 0
});
const title = ref<string>('全部');
const songSheet = ref<SongSheetItem[]>([]);

function getTopPlaylist(): void {
  topPlaylist({
    order: params.order,
    cat: params.cat,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        params.total = res.total;
        title.value = res.cat;
        // 统计数格式化
        res?.playlists.forEach((item: { playCount: number | string }) => {
          item.playCount = bigNumberTransform(item.playCount);
        });
        songSheet.value = res.playlists;
      }
    })
    .catch(() => ({}));
}

// 热门
function hotSong(): boolean | undefined {
  if (params.cat === '全部') {
    return;
  }

  params.cat = '全部';
  params.offset = 1;
  getTopPlaylist();
}

// 分类弹框
const classifyShow = ref<boolean>(false);

function classifyModal(): void {
  classifyShow.value = !classifyShow.value;
}

// 分类点击
function catChange(name: string): boolean | undefined {
  if (params.cat === '全部' && name === '全部') {
    return;
  }

  params.cat = name;
  params.offset = 1;
  getTopPlaylist();
  classifyShow.value = false;
}

// 歌单歌曲添加到播放器并播放
function songSheetToPlayListPlay(id: number): void {
  playlistTrack({ id: id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        res.songs = res?.songs?.slice(0, 20) || [];

        // 过滤无版权
        const songList: Partial<SongType>[] = res?.songs.filter(
          (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
        );

        usePlaySingleMusic(songList[0]);
        useMusicToPlayList({ music: songList, clear: true });
      }
    })
    .catch(() => ({}));
}

// 分页
function pageChange(current: number): void {
  params.offset = current;
  getTopPlaylist();
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}

// 跳转用户资料
function jumpUserProfile(id: number): void {
  $router.push({ path: '/user-profile', query: { id } });
}

watch(
  () => $route.query,
  (curVal: { name: string }) => {
    if (curVal) {
      params.cat = curVal.name;
    } else {
      params.cat = '全部';
    }

    getTopPlaylist();
  },
  {
    immediate: true
  }
);

onMounted(() => {
  $store.commit('setMenuIndex', 0);
});
</script>

<style lang="less" scoped>
@import url('./home-song-sheet.less');
</style>
