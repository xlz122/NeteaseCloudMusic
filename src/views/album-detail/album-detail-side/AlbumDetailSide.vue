<template>
  <div class="song-sheet-side-container">
    <h3 class="title">喜欢这张专辑的人</h3>
    <ul class="like-list">
      <li
        class="item"
        v-for="(item, index) in []"
        :key="index"
        :class="{ 'first-item': !(index % 4) }"
        @click="jumpUserProfile(item?.userId)"
      >
        <router-link class="item-link" to="" :title="item?.nickname">
          <img class="item-img" :src="`${item?.avatarUrl}?param=40y40`" />
        </router-link>
      </li>
    </ul>
    <h3 class="title">
      Ta的其他热门专辑
      <span class="title-all" @click="jumpSingerDetail"> 全部> </span>
    </h3>
    <ul class="song-sheet-list">
      <li class="item" v-for="(item, index) in albumList" :key="index">
        <div
          class="item-cover"
          :title="item?.name"
          @click="jumpAlbumDetail(item?.id)"
        >
          <img class="cover-img" :src="`${item?.picUrl}?param=50y50`" alt="" />
        </div>
        <div class="item-info">
          <p
            class="info-title"
            :title="item?.name"
            @click="jumpAlbumDetail(item?.id)"
          >
            {{ item?.name }}
          </p>
          <div class="info-desc">
            <span class="text">
              {{ formatDateTime(item?.publishTime / 1000, 'yyyy-MM-dd') }}
            </span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import { formatDateTime } from '@utils/utils.ts';
import { artistAlbum } from '@api/album-detail';
import { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

type AlbumParams = {
  offset: number;
  limit: number;
};

export default defineComponent({
  components: {
    SideDownload
  },
  props: {
    likePeople: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const $store = useStore();

    // 歌手id
    const singerId = computed<number>(() => $store.getters.singerId);

    watch(
      () => singerId.value,
      curVal => {
        if (curVal && Number(curVal) > 0) {
          nextTick(() => {
            getArtistAlbum();
          });
        }
      },
      {
        immediate: true
      }
    );

    const albumList = ref();
    const albumParams = reactive<AlbumParams>({
      offset: 1, // 页数
      limit: 5 // 条数
    });

    // 获取歌手辑列表
    function getArtistAlbum(): void {
      artistAlbum({
        id: singerId.value,
        offset: albumParams.offset - 1,
        limit: albumParams.limit
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            albumList.value = res.hotAlbums;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }

    // 专辑id
    const albumId = computed(() => $store.getters.albumId);

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): boolean | undefined {
      if (albumId.value === id) {
        return false;
      }

      $store.commit('jumpAlbumDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(): void {
      // 歌手详情导航选中
      $store.commit('setSingerTabIndex', 1);
      $store.commit('jumpSingerDetail', singerId.value);
    }

    // 跳转用户资料
    function jumpUserProfile(id: number): void {
      $store.commit('jumpUserProfile', id);
    }

    return {
      formatDateTime,
      albumList,
      jumpAlbumDetail,
      jumpSingerDetail,
      jumpUserProfile
    };
  }
});
</script>

<style lang="less" scoped>
@import './album-detail-side.less';
</style>
