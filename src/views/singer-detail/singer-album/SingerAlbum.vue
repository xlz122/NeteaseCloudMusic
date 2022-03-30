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
              @click="jumpAlbumDetail(item.id)"
            ></i>
            <i class="item-cover-play" title="播放"></i>
          </div>
          <p class="desc" :title="item?.name" @click="jumpAlbumDetail(item.id)">
            {{ item?.name }}
          </p>
          <p class="name">
            {{ formatDateTime(item.publishTime / 1000, 'yyyy.MM.dd') }}
          </p>
        </li>
      </ul>
      <!-- 参数从0开始，分页需从1开始 -->
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
import { formatDateTime } from '@utils/utils.ts';
import { ResponseType } from '@/types/types';
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
      limit: 12, // 条数
      total: 0 // 总数
    });
    function getArtistAlbum(): void {
      artistAlbum({
        id: singerId.value,
        offset: (albumParams.offset - 1) * albumParams.limit,
        limit: albumParams.limit
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            albumList.value = res;
            albumParams.total = res.artist.albumSize;
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
      jumpAlbumDetail,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-album.less';
</style>
