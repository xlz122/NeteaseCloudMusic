<template>
  <div class="home-album">
    <div class="home-album-container">
      <div class="album-title">热门新碟</div>
      <ul class="album-list">
        <li class="album-item" v-for="(item, index) in hotAlbumList" :key="index">
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item.picUrl}?param=130y130`"
              :title="item.name"
              @click="jumpAlbumDetail(item.id)"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play" title="播放" @click="albumToPlaylistPlay(item.id)"></i>
          </div>
          <p class="desc" :title="item.name" @click="jumpAlbumDetail(item.id)">
            {{ item.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item.artists" :key="ind">
              <span class="name" :title="i.name" @click="jumpSingerDetail(i.id)">
                {{ i.name }}
              </span>
              <span class="line" v-if="ind !== item.artists?.length - 1"> / </span>
            </template>
          </div>
        </li>
      </ul>
      <div class="album-title">
        全部新碟
        <ul class="tab">
          <li class="item first-item" @click="typeChange('ALL')">全部</li>
          <li class="item" @click="typeChange('ZH')">华语</li>
          <li class="item" @click="typeChange('EA')">欧美</li>
          <li class="item" @click="typeChange('KR')">韩国</li>
          <li class="item last-item" @click="typeChange('JP')">日本</li>
        </ul>
      </div>
      <ul class="album-list">
        <li class="album-item" v-for="(item, index) in albumList" :key="index">
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item.picUrl}?param=130y130`"
              :title="item.name"
              @click="jumpAlbumDetail(item.id)"
              alt=""
            />
            <i class="item-cover-bg"></i>
            <i class="item-cover-play" title="播放" @click="albumToPlaylistPlay(item.id)"></i>
          </div>
          <p class="desc" :title="item.name" @click="jumpAlbumDetail(item.id)">
            {{ item.name }}
          </p>
          <div class="singer">
            <template v-for="(i, ind) in item.artists" :key="ind">
              <span class="name" :title="i.name" @click="jumpSingerDetail(i.id)">
                {{ i.name }}
              </span>
              <span class="line" v-if="ind !== item.artists?.length - 1"> / </span>
            </template>
          </div>
        </li>
      </ul>
      <Page
        v-if="albumTotal > params.limit"
        :page="params.offset"
        :pageSize="params.limit"
        :total="albumTotal"
        @onChange="handlePageChange"
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
import { hotAlbum, nweAlbum } from '@/api/home-album';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types';
import type { SongType } from '@/hooks/useFormatSong';
import Page from '@/components/page/Page.vue';

type AlbumItem = {
  picUrl: string;
  artists: {
    id: number;
    name: string;
  }[];
} & SongType;

const router = useRouter();
const store = useStore();

// 获取热门新碟
const hotAlbumList = ref<AlbumItem[]>([]);

function getHotAlbum(): void {
  hotAlbum()
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      hotAlbumList.value = res.albums?.slice?.(0, 10) ?? [];
    })
    .catch(() => ({}));
}
getHotAlbum();

// 获取全部新碟
const params = reactive({
  area: 'ALL',
  offset: 1,
  limit: 35
});
const albumList = ref<AlbumItem[]>([]);
const albumTotal = ref(0);

function getNweAlbum(): void {
  nweAlbum({
    area: params.area,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }

      albumList.value = res.albums ?? [];
      albumTotal.value = res.total ?? 0;
    })
    .catch(() => ({}));
}
getNweAlbum();

// 专辑添加到播放列表并播放
function albumToPlaylistPlay(id: number): void {
  albumDetail({ id })
    .then((res: ResponseType) => {
      if (res?.code !== 200) {
        return;
      }
      if (res.songs?.length === 0) {
        return;
      }

      // 全部无版权
      const allNoCopyright = res.songs?.some?.(
        (item: Record<string, { cp: number }>) => item.privilege?.cp === 1
      );
      if (!allNoCopyright) {
        store.commit('setCopyrightDialog', {
          visible: true,
          message: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
        });
        return;
      }

      // 过滤无版权
      const songList: SongType[] = res.songs?.filter?.(
        (item: Record<string, { cp: number }>) => item.privilege?.cp !== 0
      );

      usePlaySong(songList[0]);
      useSongAddPlaylist(songList, { clear: true });
    })
    .catch(() => ({}));
}

function typeChange(type: string): void {
  params.area = type;
  getNweAlbum();
}

function handlePageChange(current: number): void {
  params.offset = current;
  getNweAlbum();
}

function jumpAlbumDetail(id: number): void {
  router.push({ path: '/album-detail', query: { id } });
}

function jumpSingerDetail(id: number): void {
  router.push({ path: '/singer-detail', query: { id } });
}
</script>

<style lang="less" scoped>
@import url('./home-album.less');
</style>
