<template>
  <div class="song-sheet-side-container">
    <h3 class="title">喜欢这张专辑的人</h3>
    <ul class="like-list">
      <li
        class="item"
        v-for="(item, index) in []"
        :key="index"
        :class="{ 'first-item': !(index % 4) }"
        @click="jumpUserProfile(item.userId)"
      >
        <router-link class="item-link" to="" :title="item.nickname">
          <img class="item-img" :src="`${item.avatarUrl}?param=40y40`" />
        </router-link>
      </li>
    </ul>
    <h3 class="title">
      Ta的其他热门专辑
      <span class="title-all" @click="jumpSingerDetail"> 全部> </span>
    </h3>
    <ul class="song-sheet-list">
      <li class="item" v-for="(item, index) in albumList" :key="index">
        <div class="item-cover" @click="jumpAlbumDetail(item.id)">
          <img class="cover-img" :src="`${item.picUrl}?param=50y50`" alt="" />
        </div>
        <div class="item-info">
          <p
            class="info-title"
            :title="item.name"
            @click="jumpAlbumDetail(item.id)"
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
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistAlbum } from '@api/singer-detail';
import { ResponseType } from '@/types/types';
import { formatDateTime } from '@utils/utils.ts';
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
    const $router = useRouter();
    const $store = useStore();

    // 歌手id
    const singerId = computed(() => $store.getters.singerId);

    // 监听歌手id改变
    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistAlbum();
        }
      }
    );

    // 专辑列表
    const albumList = ref();

    // 获取歌手专辑
    const albumParams = reactive<AlbumParams>({
      offset: 1, // 页数
      limit: 5 // 条数
    });
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
    getArtistAlbum();

    // 专辑id
    const albumId = computed(() => $store.getters.albumId);

    // 跳转专辑
    function jumpAlbumDetail(id: number): boolean | undefined {
      // 当前专辑id和跳转专辑id相同
      if (albumId.value === id) {
        return false;
      }
      $router.push({ name: 'album-detail', params: { albumId: id } });
    }

    // 跳转歌手详情
    function jumpSingerDetail(): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 歌手详情导航选中
      $store.commit('setSingerTabIndex', 1);
      $router.push({ name: 'singer-detail' });
    }

    // 跳转用户资料
    function jumpUserProfile(userId: number): void {
      // 头部导航取消选中
      $store.commit('setHeaderActiveIndex', -1);
      $router.push({ name: 'user-profile', params: { userId } });
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
