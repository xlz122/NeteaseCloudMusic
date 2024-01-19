<template>
  <div class="content">
    <div class="group">
      <div class="list-title">
        <span class="title" @click="songSheetMore">热门推荐</span>
        <ul class="tab">
          <li class="item first-item" @click="jumpSongSheet('华语')">华语</li>
          <li class="item" @click="jumpSongSheet('流行')">流行</li>
          <li class="item" @click="jumpSongSheet('摇滚')">摇滚</li>
          <li class="item" @click="jumpSongSheet('民谣')">民谣</li>
          <li class="item last-item" @click="jumpSongSheet('电子')">电子</li>
        </ul>
        <span class="more" @click="songSheetMore">更多</span>
      </div>
      <ul class="list-content">
        <!-- 未登录展示5条推荐歌单，登录后，后3条替换未个性化推荐 -->
        <li
          class="item"
          v-for="(item, index) in hotSongSheet"
          :key="index"
          :class="{ 'last-item': hotSongSheet?.length > 2 && index === 3 }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item?.picUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item?.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playCount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="songSheetToPlaylistPlay(item?.id)"
              ></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item?.name"
            @click="jumpSongSheetDetail(item?.id)"
          >
            {{ item?.name }}
          </div>
        </li>
        <!-- 登录后展示个性化推荐 -->
        <template v-if="isLogin">
          <li
            class="item"
            v-for="(item, index) in individualizat.slice(0, 3)"
            :key="index"
            :class="{ 'last-item': index === 1 }"
          >
            <div class="item-top">
              <img
                class="img"
                :src="`${item?.picUrl}?param=140y140`"
                alt=""
                @click="jumpSongSheetDetail(item?.id)"
              />
              <div class="info">
                <i class="info-icon"></i>
                <span class="num">{{ item?.playcount }}</span>
                <i
                  class="info-icon-right"
                  title="播放"
                  @click="songSheetToPlaylistPlay(item?.id)"
                ></i>
              </div>
            </div>
            <div
              class="item-bottom"
              :title="item?.name"
              @click="jumpSongSheetDetail(item?.id)"
            >
              {{ item?.name }}
            </div>
          </li>
        </template>
        <!-- 推荐电台节目 -->
        <li
          class="item"
          v-for="(item, index) in hotDjprogram"
          :key="index"
          :class="{ 'last-item': index === 2 }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item?.picUrl}?param=140y140`"
              alt=""
              @click="jumpProgramDetail(item?.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.program?.adjustedPlayCount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="djprogramToPlaylistPlay(item?.program?.mainSong)"
              ></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item?.name"
            @click="jumpProgramDetail(item?.id)"
          >
            <span class="radio-station"></span>
            {{ item?.name }}
          </div>
        </li>
      </ul>
    </div>
    <div class="group" v-if="isLogin">
      <div class="list-title">
        <span class="title individualization-title">个性化推荐</span>
      </div>
      <ul class="list-content">
        <li class="item individualization">
          <div class="item-top" @click="jumpRecommend">
            <i class="img"></i>
            <span class="head">{{ getWeekDate() }}</span>
            <span class="head-text">{{ dateText }}</span>
            <span class="mask"></span>
          </div>
          <div class="item-bottom" title="每日歌曲推荐" @click="jumpRecommend">
            每日歌曲推荐
          </div>
          <em class="item-like" title="根据你的口味生成,每天6:00更新">
            根据你的口味生成,每天6:00更新
          </em>
        </li>
        <li
          class="item individualization"
          v-for="(item, index) in individualizat?.slice(0, 3)"
          :key="index"
          :class="{
            'last-item': index === individualizat?.slice(0, 3).length - 1
          }"
        >
          <div class="item-top">
            <img
              class="img"
              :src="`${item?.picUrl}?param=140y140`"
              alt=""
              @click="jumpSongSheetDetail(item?.id)"
            />
            <div class="info">
              <i class="info-icon"></i>
              <span class="num">{{ item?.playcount }}</span>
              <i
                class="info-icon-right"
                title="播放"
                @click="songSheetToPlaylistPlay(item?.id)"
              ></i>
            </div>
          </div>
          <div
            class="item-bottom"
            :title="item?.name"
            @click="jumpSongSheetDetail(item?.id)"
          >
            {{ item?.name }}
          </div>
          <div class="like-text">
            <em class="item-like">{{ item?.copywriter || '猜你喜欢' }}</em>
            <button
              class="disable-like"
              :title="item?.copywriter"
              @click="uninterested(index)"
            >
              不感兴趣
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title" @click="albumNewestMore">新碟上架</span>
        <span class="more" @click="albumNewestMore">更多</span>
      </div>
      <AlbumNewest
        @albumToPlaylistPlay="albumToPlaylistPlay"
        @jumpAlbumDetail="jumpAlbumDetail"
        @jumpSingerDetail="jumpSingerDetail"
      />
    </div>
    <div class="group">
      <div class="list-title">
        <span class="title" @click="songListMore">榜单</span>
        <span class="more" @click="songListMore">更多</span>
      </div>
      <SongSheetList />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { getWeekDate, formatDateTime, bigNumberTransform } from '@/utils/utils';
import {
  recommendSongList,
  recommendDjprogram,
  recommendResource
} from '@/api/home';
import { playlistTrack } from '@/api/song-sheet-detail';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types/index';
import type { SongType } from '@/hooks/methods/songFormat';
import AlbumNewest from './album-newest/AlbumNewest.vue';
import SongSheetList from './song-sheet-list/SongSheetList.vue';

type HotSongSheetItem = {
  id: number;
  name: string;
  picUrl: string;
  playCount: number;
  playcount: number;
  copywriter: string;
};

type HotDjprogramItem = {
  id: number;
  name: string;
  picUrl: string;
  program: {
    adjustedPlayCount: number;
    mainSong: SongType;
  };
};

const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);

watch(
  () => isLogin.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getHotSongSheet();
    getIndividualizat();
  }
);

// 热门推荐 - 跳转歌单
function jumpSongSheet(name: string): void {
  $router.push({ path: '/home-song-sheet', query: { name } });
}

// 热门推荐 - 更多
function songSheetMore(): void {
  $router.push({ path: '/home-song-sheet' });
}

// 歌单添加到播放列表并播放
function songSheetToPlaylistPlay(id: number): void {
  playlistTrack({ id: id! })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        res.songs = res?.songs?.slice(0, 20) || [];

        // 过滤无版权
        const songList: SongType[] = res?.songs.filter(
          (item: { noCopyrightRcmd: unknown }) => !item.noCopyrightRcmd
        );

        usePlaySong(songList[0]);
        useSongAddPlaylist(songList, { clear: true });
      }
    })
    .catch(() => ({}));
}

// 获取热门推荐 - 推荐歌单
const hotSongSheet = ref<HotSongSheetItem[]>([]);

function getHotSongSheet() {
  // 未登录获取5条, 登录获取2条
  let limit = 0;
  if (isLogin.value) {
    limit = 2;
  } else {
    limit = 5;
  }

  recommendSongList({ limit })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        res?.result.forEach((item: { playCount: number | string }) => {
          item.playCount = bigNumberTransform(item?.playCount);
        });
        hotSongSheet.value = res?.result || [];
      }
    })
    .catch(() => ({}));
}
getHotSongSheet();

// 获取热门推荐 - 推荐电台节目
const hotDjprogram = ref<HotDjprogramItem[]>([]);

function getHotDjprogram() {
  recommendDjprogram()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        res?.result.forEach(
          (item: Record<string, { adjustedPlayCount: number | string }>) => {
            item.program.adjustedPlayCount = bigNumberTransform(
              item?.program?.adjustedPlayCount
            );
          }
        );

        hotDjprogram.value = res?.result?.slice(0, 3) || [];
      }
    })
    .catch(() => ({}));
}
getHotDjprogram();

// 电台节目添加到播放列表并播放
function djprogramToPlaylistPlay(item: SongType): void {
  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 获取个性化推荐歌单
const individualizat = ref<HotSongSheetItem[]>([]);

function getIndividualizat(): boolean | undefined {
  if (!isLogin.value) {
    return;
  }

  recommendResource()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        res?.recommend.forEach((item: { playcount: number | string }) => {
          item.playcount = bigNumberTransform(item.playcount);
        });
        individualizat.value = JSON.parse(JSON.stringify(res?.recommend));
      }
    })
    .catch(() => ({}));
}
getIndividualizat();

// 获取当前日期
const dateText = ref('');
dateText.value = formatDateTime(new Date().getTime() / 1000, 'dd').replace(
  /\b(0+)/gi,
  ''
);

// 个性化推荐 - 跳转每日推荐
function jumpRecommend(): void {
  $router.push({ path: '/home-recommend' });
}

// 个性化推荐 - 不感兴趣
function uninterested(index: number): boolean | undefined {
  if (individualizat.value.length <= 3) {
    setMessage({ type: 'info', title: '暂无更多推荐' });
    return;
  }

  individualizat.value.splice(index, 1, individualizat.value[3]);
  individualizat.value.splice(3, 1);
}

// 专辑添加到播放列表并播放
function albumToPlaylistPlay(id: number): void {
  albumDetail({ id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs.length === 0) {
          return;
        }

        // 是否全部无版权
        const allNoCopyright = res?.songs?.some(
          (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
        );
        if (!allNoCopyright) {
          $store.commit('setCopyrightDialog', {
            visible: true,
            message: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
          });
          return;
        }

        // 过滤无版权
        const songList: SongType[] = res?.songs.filter(
          (item: Record<string, { cp: number }>) => item?.privilege?.cp !== 0
        );

        usePlaySong(songList[0]);
        useSongAddPlaylist(songList, { clear: true });
      }
    })
    .catch(() => ({}));
}

// 新碟上架 - 更多
function albumNewestMore(): void {
  $router.push({ path: '/home-new-disc' });
}

// 榜单 - 更多
function songListMore(): void {
  $router.push({ path: '/home-toplist' });
}

// 跳转歌单详情
function jumpSongSheetDetail(id: number): void {
  $router.push({ path: '/song-sheet-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转电台节目详情
function jumpProgramDetail(id: number): void {
  $router.push({ path: '/program-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./content.less');
</style>
