<template>
  <div class="home-new-disc">
    <div class="home-new-disc-container">
      <div class="new-disc-title">热门新碟</div>
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in hotAlbum"
          :key="index"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item?.picUrl}?param=130y130`"
              :title="item?.name"
              alt=""
              @click="jumpAlbumDetail(item?.id)"
            />
            <i class="item-cover-bg"></i>
            <i
              class="item-cover-play"
              title="播放"
              @click="albumToPlaylistPlay(item?.id)"
            ></i>
          </div>
          <p
            class="desc"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item?.artists" :key="ind">
              <span
                class="name"
                :title="i?.name"
                @click="jumpSingerDetail(i?.id)"
              >
                {{ i?.name }}
              </span>
              <span class="line" v-if="ind !== item?.artists.length - 1">
                /
              </span>
            </template>
          </div>
        </li>
      </ul>
      <div class="new-disc-title">
        全部新碟
        <ul class="tab">
          <li class="item first-item" @click="newDiscType('ALL')">全部</li>
          <li class="item" @click="newDiscType('ZH')">华语</li>
          <li class="item" @click="newDiscType('EA')">欧美</li>
          <li class="item" @click="newDiscType('KR')">韩国</li>
          <li class="item last-item" @click="newDiscType('JP')">日本</li>
        </ul>
      </div>
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in albumList"
          :key="index"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item?.picUrl}?param=130y130`"
              :title="item?.name"
              alt=""
              @click="jumpAlbumDetail(item?.id)"
            />
            <i class="item-cover-bg"></i>
            <i
              class="item-cover-play"
              title="播放"
              @click="albumToPlaylistPlay(item?.id)"
            ></i>
          </div>
          <p
            class="desc"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item?.artists" :key="ind">
              <span
                class="name"
                :title="i?.name"
                @click="jumpSingerDetail(i?.id)"
              >
                {{ i?.name }}
              </span>
              <span class="line" v-if="ind !== item?.artists?.length - 1">
                /
              </span>
            </template>
          </div>
        </li>
      </ul>
      <Page
        v-if="albumTotal > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="albumTotal"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import usePlaySong from '@/hooks/usePlaySong';
import useSongAddPlaylist from '@/hooks/useSongAddPlaylist';
import { hotNewDisc, nweDiscAlbum } from '@/api/home-new-disc';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/hooks/songFormat';
import Page from '@/components/page/Page.vue';

type AlbumItem = {
  picUrl: string;
  artists: {
    id: number;
    name: string;
  }[];
} & SongType;

const $router = useRouter();
const $store = useStore();

// 获取热门新碟
const hotAlbum = ref<AlbumItem[]>([]);

function getHotAlbum(): void {
  hotNewDisc()
    .then((res: ResponseType) => {
      if (res.code === 200) {
        hotAlbum.value = res?.albums?.slice(0, 10) || [];
      }
    })
    .catch(() => ({}));
}
getHotAlbum();

// 专辑添加到播放列表并播放
function albumToPlaylistPlay(id: number): void {
  albumDetail({ id })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        if (res?.songs?.length === 0) {
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

// 跳转专辑详情
function jumpAlbumDetail(id: number): void {
  $router.push({ path: '/album-detail', query: { id } });
}

// 跳转歌手详情
function jumpSingerDetail(id: number): void {
  $router.push({ path: '/singer-detail', query: { id } });
}

// 全部新碟
const params = reactive({
  area: 'ALL',
  offset: 1,
  limit: 35
});
const albumList = ref<AlbumItem[]>([]);
const albumTotal = ref(0);

function getAlbumList(): void {
  nweDiscAlbum({
    area: params.area,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res.code === 200) {
        albumList.value = res?.albums || [];
        albumTotal.value = res?.total || 0;
      }
    })
    .catch(() => ({}));
}
getAlbumList();

// 全部新碟 - 类型切换
function newDiscType(type: string): void {
  params.area = type;
  getAlbumList();
}

// 分页
function pageChange(current: number): void {
  params.offset = current;
  getAlbumList();
}
</script>

<style lang="less" scoped>
@import url('./home-new-disc.less');
</style>
