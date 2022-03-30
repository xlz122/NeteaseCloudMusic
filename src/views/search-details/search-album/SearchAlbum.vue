<template>
  <!-- loading -->
  <div class="loading" v-if="albumData.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-album-list" v-if="!albumData.loading">
    <li
      class="search-album-item"
      v-for="(item, index) in albumData.list"
      :key="index"
    >
      <div class="item-cover" @click="jumpAlbumDetail(item.id)">
        <img
          class="item-cover-img"
          :src="`${item?.picUrl}?param=130y130`"
          alt=""
        />
        <i class="item-cover-bg"></i>
        <i class="item-cover-play"></i>
      </div>
      <p class="desc" @click="jumpAlbumDetail(item.id)">
        {{ item?.name }}
      </p>
      <p class="name" @click="jumpSingerDetail(item?.artist?.id)">
        {{ item?.artist?.name }}
      </p>
    </li>
  </ul>
  <Page
    v-if="albumData.total > albumData.limit"
    :page="albumData.offset"
    :pageSize="albumData.limit"
    :total="albumData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type AlbumData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    searchDetailText: {
      type: String,
      default: ''
    }
  },
  emits: ['searchCountChange'],
  setup(props, { emit }) {
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    const userInfo = computed(() => $store.getters.userInfo);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const albumData = reactive<AlbumData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    // 详情搜索回车
    watch(
      () => searchDetailText.value,
      () => {
        getSearchAlbum();
      }
    );

    // 获取专辑列表
    function getSearchAlbum(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (albumData.offset - 1) * albumData.limit,
        limit: albumData.limit,
        type: 10
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            albumData.total = res?.result?.albumCount;
            albumData.list = res?.result?.albums;
            emit('searchCountChange', res?.result?.albumCount);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
          albumData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchAlbum();

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 分页
    function changPage(current: number): void {
      albumData.offset = current;
      getSearchAlbum();
    }

    return {
      timeStampToDuration,
      userInfo,
      albumData,
      jumpAlbumDetail,
      jumpSingerDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-album.less';
</style>
