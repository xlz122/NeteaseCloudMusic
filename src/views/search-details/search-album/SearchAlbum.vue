<template>
  <ul class="search-album-list">
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
    v-if="albumData.total"
    :page="albumData.page"
    :pageSize="albumData.pageSize"
    :total="albumData.total"
    @changPage="changPage"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, computed, watch, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { searchKeywords } from '@api/search';
import { timeStampToDuration } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';
import { ResponseType } from '@/types/types';

type albumData = {
  page: number;
  pageSize: number;
  total: number;
  list: unknown[];
};

export default defineComponent({
  components: {
    Page
  },
  props: {
    searchTitleText: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const $router = useRouter();
    const $store = useStore();

    const { searchTitleText } = toRefs(props);

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const albumData = reactive<albumData>({
      page: 1,
      pageSize: 30,
      total: 0,
      list: []
    });

    // 详情搜索回车
    watch(
      () => searchTitleText.value,
      () => {
        getSearchAlbum();
      }
    );

    // 获取专辑列表
    function getSearchAlbum(): void {
      searchKeywords({
        keywords: searchTitleText.value || searchText.value,
        offset: albumData.page - 1,
        limit: albumData.pageSize,
        type: 10
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            albumData.total = res?.result?.albumCount;
            albumData.list = res?.result?.albums;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getSearchAlbum();

    // 跳转专辑
    function jumpAlbumDetail(id: number): void {
      $router.push({ name: 'album-detail', params: { albumId: id } });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
    }

    // 分页
    function changPage(current: number): void {
      albumData.page = current;
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
