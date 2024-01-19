<template>
  <div class="singer-song">
    <div class="operate-btn">
      <div
        class="play"
        :class="{
          'disable-play': singerSong?.hotSongs.length === 0
        }"
        title="播放"
        @click="playAllSong"
      >
        <span class="icon-play">播放</span>
      </div>
      <div
        class="play-add"
        :class="{
          'disable-add': singerSong?.hotSongs.length === 0
        }"
        title="添加到播放列表"
        @click="allSongToPlaylist"
      ></div>
      <div class="other collection" @click="handleCollectAll">
        <span class="icon"> 收藏热门{{ singerSong?.hotSongs.length }} </span>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table class="play-list-table" v-if="singerSong?.hotSongs.length > 0">
      <thead>
        <tr>
          <th class="th first-th"></th>
          <th class="th two-th"></th>
          <th class="th three-th"></th>
          <th class="th four-th"></th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in singerSong?.hotSongs"
          :key="index"
          :class="[
            { 'even-item': (index + 1) % 2 },
            { 'no-copyright': isCopyright(item.id) }
          ]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playSongId }"
                @click="playSingleSong(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item?.id)">
                <span class="name" :title="`${item?.name}`">
                  {{ item?.name }}
                </span>
                <span class="no-click" v-if="item?.alia && item?.alia[0]">
                  - {{ item?.alia[0] }}
                </span>
              </span>
              <i
                class="icon-mv"
                v-if="item.mv && item.mv > 0"
                @click="jumpVideoDetail(item?.id, item?.mv)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item?.dt || 0 / 1000) }}
              </span>
              <div class="operate-btn">
                <i
                  class="icon add"
                  title="添加到播放列表"
                  @click="singleSongToPlaylist(item)"
                ></i>
                <i
                  class="icon collect"
                  title="收藏"
                  @click="handleCollection(item?.id)"
                ></i>
                <i class="icon share" title="分享" @click="handleShare"></i>
                <i
                  class="icon download"
                  title="下载"
                  @click="handleDownload"
                ></i>
              </div>
            </div>
          </td>
          <td class="tbody-td" @click="jumpAlbumDetail(item?.al?.id)">
            <div class="hd">
              <span class="text" :title="item?.al?.name">
                {{ item?.al?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-data" v-if="!loading && singerSong?.hotSongs.length === 0">
      <div class="title">
        <i class="icon"></i>
        <h3 class="text">暂无音乐！</h3>
      </div>
      <p class="desc">
        <span class="text">点击</span>
        <span class="icon"></span>
        <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
        <span class="text go">马上去</span>
        <router-link class="link" to="/">发现音乐</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { timeStampToDuration } from '@/utils/utils';
import { artistSong } from '@/api/singer-detail';
import type { ResponseType } from '@/types/index';
import type { SongType } from '@/hooks/methods/songFormat';

type SingerSong = {
  hotSongs: {
    id: number;
    name: string;
    al: {
      id: number;
      name: string;
      picUrl: string;
    };
    alia: string[];
    mv: number;
    dt: number;
    privilege: {
      cp: number;
    };
  }[];
};

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);
const playSongId = computed<number>(() => $store.getters['music/playSongId']);

watch(
  () => $route.query.id,
  curVal => {
    if (!curVal) {
      return;
    }

    getArtistSong();
  }
);

// 获取歌手 - 歌曲
const singerSong = ref<SingerSong>({
  hotSongs: []
});
const loading = ref(true);

function getArtistSong(): void {
  artistSong({ id: Number($route.query.id) })
    .then((res: ResponseType) => {
      loading.value = false;
      if (res?.code === 200) {
        singerSong.value.hotSongs = res?.hotSongs || [];
      }
    })
    .catch(() => ({}));
}
getArtistSong();

// 播放全部 - 默认播放列表第一项
function playAllSong(): void {
  if (singerSong.value?.hotSongs?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = singerSong.value?.hotSongs?.filter(
    item => !isCopyright(item.id)
  );

  usePlaySong(songList[0]);
  useSongAddPlaylist(songList, { clear: true });
}

// 全部歌曲添加到播放列表
function allSongToPlaylist(): boolean | undefined {
  if (singerSong.value?.hotSongs?.length === 0) {
    return;
  }

  // 过滤无版权
  const songList: SongType[] = singerSong.value?.hotSongs?.filter(
    item => !isCopyright(item.id)
  );

  useSongAddPlaylist(songList);
}

// 收藏全部
function handleCollectAll(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  let ids = '';
  singerSong.value?.hotSongs.forEach(item => {
    // 无版权
    if (item?.privilege?.cp === 0) {
      return;
    }

    ids += `${item.id},`;
  });

  $store.commit('setSongCollect', {
    visible: true,
    songIds: ids
  });
}

// 播放单个歌曲
function playSingleSong(item: SongType): boolean | undefined {
  // 无版权
  if (isCopyright(item.id)) {
    $store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  usePlaySong(item);
  useSongAddPlaylist(item);
}

// 单个歌曲添加到播放列表
function singleSongToPlaylist(item: SongType): void {
  useSongAddPlaylist(item);
}

// 歌曲是否有版权
function isCopyright(id: number): boolean | undefined {
  const songItem = singerSong.value?.hotSongs.find(item => item.id === id);

  if (songItem?.privilege?.cp === 0) {
    return true;
  }

  return false;
}

// 收藏
function handleCollection(id: number): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  $store.commit('setSongCollect', {
    visible: true,
    songIds: id
  });
}

// 分享
function handleShare(): boolean | undefined {
  if (!isLogin.value) {
    $store.commit('setLoginDialog', true);
    return;
  }

  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 下载
function handleDownload(): void {
  setMessage({ type: 'error', title: '该功能暂未开发' });
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转视频详情
function jumpVideoDetail(songId: number, id: number): boolean | undefined {
  // 无版权
  if (isCopyright(songId)) {
    $store.commit('setCopyrightDialog', {
      visible: true,
      message: '由于版权保护，您所在的地区暂时无法使用。'
    });
    return;
  }

  $router.push({ path: '/mv-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./singer-song.less');
</style>
