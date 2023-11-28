<template>
  <div class="singer-album">
    <div class="singer-album-container">
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in singerAlbum?.hotAlbums"
          :key="index"
        >
          <div class="item-cover">
            <img
              class="item-cover-img"
              :src="`${item?.picUrl}?param=120y120`"
              alt=""
            />
            <i
              class="item-cover-bg"
              :title="item.name"
              @click="jumpAlbumDetail(item?.id)"
            ></i>
            <i
              class="item-cover-play"
              title="播放"
              @click="albumToPlayListPlay(item?.id)"
            ></i>
          </div>
          <p
            class="desc"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <p class="name">
            {{ formatDateTime(item?.publishTime || 0 / 1000, 'yyyy.MM.dd') }}
          </p>
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
import { ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { formatDateTime } from '@/utils/utils';
import { artistAlbum } from '@/api/album-detail';
import { albumDetail } from '@/api/album-detail';
import type { ResponseType } from '@/types/types';
import type { SongType } from '@/common/audio';
import Page from '@/components/page/Page.vue';

type SingerAlbum = {
  hotAlbums: {
    id?: number;
    name?: string;
    picUrl?: string;
    publishTime?: number;
  }[];
};

const $store = useStore();
const singerId = computed<number>(() => $store.getters.singerId);

watch(
  () => singerId.value,
  curVal => {
    if (!curVal) {
      return;
    }

    getArtistAlbum();
  }
);

// 获取歌手专辑
const params = reactive({
  offset: 1,
  limit: 12,
  total: 0
});
const singerAlbum = ref<SingerAlbum>({
  hotAlbums: []
});

function getArtistAlbum(): void {
  artistAlbum({
    id: singerId.value,
    offset: (params.offset - 1) * params.limit,
    limit: params.limit
  })
    .then((res: ResponseType) => {
      if (res?.code === 200) {
        singerAlbum.value.hotAlbums = res?.hotAlbums || [];
        params.total = res?.artist?.albumSize || 0;
      }
    })
    .catch(() => ({}));
}
getArtistAlbum();

// 专辑歌曲添加到播放器
function albumToPlayListPlay(id: number | undefined): void {
  albumDetail({ id: id! })
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
          $store.commit('setCopyright', {
            visible: true,
            message: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
          });
          return;
        }

        // 过滤无版权
        const songList: Partial<SongType>[] = res?.songs.filter(
          (item: Record<string, { cp: number }>) => item?.privilege?.cp !== 0
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
  getArtistAlbum();
}

// 跳转专辑详情
function jumpAlbumDetail(id: number | undefined): void {
  $store.commit('jumpAlbumDetail', id);
}
</script>

<style lang="less" scoped>
@import url('./singer-album.less');
</style>
