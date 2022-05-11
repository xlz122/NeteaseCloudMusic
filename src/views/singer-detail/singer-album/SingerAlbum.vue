<template>
  <div class="singer-album">
    <div class="singer-album-container">
      <ul class="new-disc-list">
        <li
          class="new-disc-item"
          v-for="(item, index) in albumList?.hotAlbums"
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
            {{ formatDateTime(item?.publishTime / 1000, 'yyyy.MM.dd') }}
          </p>
        </li>
      </ul>
      <Page
        v-if="albumParams.total > albumParams.limit"
        :page="albumParams.offset"
        :pageSize="albumParams.limit"
        :total="albumParams.total"
        @changPage="changPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { artistAlbum } from '@api/album-detail';
import { albumDetail } from '@api/album-detail';
import { formatDateTime } from '@utils/utils.ts';
import { LoopType, ResponseType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import Page from '@components/page/Page.vue';

type AlbumParams = {
  offset: number;
  limit: number;
  total: number;
};

export default defineComponent({
  components: {
    Page
  },
  setup() {
    const $store = useStore();

    // 歌手id
    const singerId = computed<number>(() => $store.getters.singerId);

    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistAlbum();
        }
      }
    );

    const albumList = ref();
    const albumParams = reactive<AlbumParams>({
      offset: 1, // 页数
      limit: 12, // 条数
      total: 0 // 总数
    });

    // 获取歌手专辑
    function getArtistAlbum(): void {
      artistAlbum({
        id: singerId.value,
        offset: (albumParams.offset - 1) * albumParams.limit,
        limit: albumParams.limit
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            albumList.value = res;
            albumParams.total = res?.artist?.albumSize;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistAlbum();

    // 专辑歌曲添加到播放器
    function albumToPlayListPlay(id: number): void {
      albumDetail({ id })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            if (res?.songs.length === 0) {
              return false;
            }

            // 无版权
            if (res?.songs[0].privilege.cp === 0) {
              $store.commit('setMessage', {
                type: 'info',
                title: '该专辑需单独付费'
              });
              return false;
            }

            const songList: Record<string, any> = [];

            res?.songs.forEach((item: LoopType) => {
              // 处理播放器所需数据
              const musicItem: PlayMusicItem = {
                id: item.id,
                name: item.name,
                picUrl: item.al.picUrl,
                time: item.dt,
                mv: item.mv,
                singerList: []
              };

              item?.ar?.forEach((item: LoopType) => {
                musicItem.singerList.push({
                  id: item.id,
                  name: item.name
                });
              });

              songList.push(musicItem);

              // 添加播放列表
              $store.commit('music/setPlayMusicList', musicItem);
            });

            // 当前播放音乐id
            $store.commit('music/setPlayMusicId', songList[0].id);
            // 当前播放音乐数据
            $store.commit('music/setPlayMusicItem', songList[0]);
            // 开始播放
            $store.commit('music/setMusicPlayStatus', {
              look: true,
              refresh: true
            });
          }
        })
        .catch(() => ({}));
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 分页
    function changPage(current: number): void {
      albumParams.offset = current;
      getArtistAlbum();
    }

    return {
      formatDateTime,
      albumList,
      albumParams,
      albumToPlayListPlay,
      jumpAlbumDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-album.less';
</style>
