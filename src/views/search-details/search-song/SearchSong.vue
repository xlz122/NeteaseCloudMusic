<template>
  <div class="loading" v-if="songData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-song" v-if="!songData?.loading">
    <li
      class="item"
      v-for="(item, index) in songData?.list"
      :key="index"
      :class="[
        { 'even-item': index % 2 },
        { 'no-copyright': isCopyright(item.id) }
      ]"
    >
      <div
        class="td icon-play"
        :class="{ 'active-play': item.id === playSongId }"
        @click="playSingleSong(item)"
      ></div>
      <div class="td td1">
        <div class="text">
          <span
            class="name"
            :title="item?.name"
            @click="jumpSongDetail(item?.id)"
          >
            <span
              v-html="
                handleMatchString(
                  item?.name || '',
                  String($route.query.keyword)
                )
              "
            ></span>
          </span>
          <span class="desc" v-if="item?.tns?.length">
            - ({{ item?.tns[0] }})
          </span>
          <i
            class="icon-mv"
            v-if="item.mv && item.mv > 0"
            @click="jumpVideoDetail(item?.id, item?.mv)"
          ></i>
        </div>
      </div>
      <div class="td td2">
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
          <i class="icon download" title="下载" @click="handleDownload"></i>
          <!-- 用户自己才有删除按钮 -->
          <i
            class="icon delete"
            v-if="item?.ar && item?.ar[0]?.id === userInfo?.profile?.userId"
            title="删除"
          ></i>
        </div>
      </div>
      <div class="td td3">
        <div class="text">
          <span
            class="name"
            @click="jumpSingerDetail(item?.ar && item?.ar[0]?.id)"
          >
            {{ item?.ar && item?.ar[0]?.name }}
          </span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span
            class="name"
            :title="item?.al?.name"
            @click="jumpAlbumDetail(item?.al?.id)"
          >
            {{ item?.al?.name }}
          </span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item?.dt || 0 / 1000) }}</div>
    </li>
  </ul>
  <Page
    v-if="songData.total > songData.limit"
    :page="songData.offset"
    :pageSize="songData.limit"
    :total="songData.total"
    @pageChange="pageChange"
  />
</template>

<script lang="ts" setup>
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/hooks/useMessage';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { timeStampToDuration, handleMatchString } from '@/utils/utils';
import { searchKeywords } from '@/api/search';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/hooks/songFormat';
import Page from '@/components/page/Page.vue';

type SongData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: Required<
    {
      tns: string[];
      al: {
        id: number;
        name: string;
      };
      privilege: {
        cp: number;
      };
    } & SongType
  >[];
};

const emits = defineEmits(['searchCountChange']);

const $route = useRoute();
const $router = useRouter();
const $store = useStore();
const isLogin = computed<boolean>(() => $store.getters.isLogin);
const userInfo = computed(() => $store.getters.userInfo);
const playSongId = computed<number>(() => $store.getters['music/playSongId']);

// 获取单曲列表
const songData = reactive<SongData>({
  loading: true,
  offset: 1,
  limit: 30,
  total: 0,
  list: []
});

watch(
  () => $route.query.keyword,
  () => {
    songData.offset = 1;

    getSearchSong();
  },
  {
    immediate: true
  }
);

function getSearchSong(): void {
  searchKeywords({
    keywords: String($route.query.keyword),
    type: Number($route.query.type),
    offset: (songData.offset - 1) * songData.limit,
    limit: isLogin.value ? songData.limit : 20
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        const total = isLogin.value
          ? res?.result?.songCount
          : res?.result?.songs.length;

        songData.total = total || 0;
        songData.list = res?.result?.songs || [];

        emits('searchCountChange', total || 0);
      }

      songData.loading = false;
    })
    .catch(() => ({}));
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
  const songItem = songData.list.find(item => item.id === id);

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

// 分页
function pageChange(current: number): void {
  songData.offset = current;
  getSearchSong();
}

// 跳转歌曲详情
function jumpSongDetail(id: number): void {
  $router.push({ path: '/song-detail', query: { id } });
}

// 跳转视频详情
function jumpVideoDetail(songId: number, id: number): boolean | undefined {
  // 无版权
  if (isCopyright(songId)) {
    return;
  }

  $router.push({ path: '/mv-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./search-song.less');
</style>
