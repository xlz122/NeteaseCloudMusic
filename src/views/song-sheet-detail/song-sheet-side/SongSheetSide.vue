<template>
  <div class="song-sheet-side-container">
    <h3 class="title">喜欢这个歌单的人</h3>
    <ul class="like-list">
      <li
        class="item"
        v-for="(item, index) in songListDetailData.playlist?.subscribers"
        :key="index"
        :class="{ 'first-item': !(index % 4) }"
      >
        <router-link class="item-link" to="" :title="item.nickname">
          <img class="item-img" :src="`${item.avatarUrl}?param=40y40`" />
        </router-link>
      </li>
    </ul>
    <h3 class="title">热门歌单</h3>
    <ul class="song-sheet-list">
      <li
        class="item"
        v-for="(item, index) in songSheetList"
        :key="index"
        @click="jumpSongSheetDetail(item.id)"
      >
        <div class="item-cover">
          <img
            class="cover-img"
            :src="`${item.coverImgUrl}?param=50y50`"
            alt=""
          />
        </div>
        <div class="item-info">
          <p class="info-title" :title="item.name">{{ item?.name }}</p>
          <div class="info-desc">
            <span class="by">by</span>
            <span class="text" :title="item?.creator?.nickname">{{
              item?.creator?.nickname
            }}</span>
          </div>
        </div>
      </li>
    </ul>
    <h3 class="title">网易云音乐多端下载</h3>
    <SideDownload />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { topPlaylist } from '@api/home-song-sheet';
import { ResponseType } from '@/types/types';
import SideDownload from '@views/song-sheet-detail/side-downlod/SideDownload.vue';

type SongParams = {
  order: string;
  cat: string;
  page: number;
  pageSize: number;
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

    // 歌单详情数据
    const songListDetailData = computed(
      () => $store.getters['music/songListDetailData']
    );

    const songSheetList = ref<unknown[]>([]);
    const songParams = reactive<SongParams>({
      order: 'hot',
      cat: '全部',
      page: 1,
      pageSize: 5
    });
    // 获取热门歌单数据
    function getTopPlaylist(): void {
      topPlaylist({
        order: songParams.order,
        cat: songParams.cat,
        offset: songParams.page - 1,
        limit: songParams.pageSize
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songSheetList.value = res.playlists;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getTopPlaylist();

    // 跳转歌单详情
    function jumpSongSheetDetail(id: number): void {
      $router.push({ name: 'song-sheet-detail', params: { id } });
      // 重新获取热门歌单
      getTopPlaylist();
    }

    return {
      songListDetailData,
      songSheetList,
      jumpSongSheetDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './song-sheet-side.less';
</style>
