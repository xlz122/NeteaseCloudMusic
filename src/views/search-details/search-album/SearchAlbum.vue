<template>
  <div class="loading" v-if="albumData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-album-list" v-if="!albumData?.loading">
    <li
      class="search-album-item"
      v-for="(item, index) in albumData?.list"
      :key="index"
    >
      <div class="item-cover">
        <img
          class="item-cover-img"
          :src="`${item?.picUrl}?param=130y130`"
          :title="item?.name"
          @click="jumpAlbumDetail(item?.id)"
          alt=""
        />
        <i class="item-cover-bg"></i>
        <i
          class="item-cover-play"
          title="播放"
          @click="albumToPlayListPlay(item?.id)"
        ></i>
      </div>
      <p class="desc" :title="item?.name" @click="jumpAlbumDetail(item?.id)">
        <template
          v-for="(item, index) in handleMatchString(
            item?.name,
            searchDetailText
          )"
          :key="index"
        >
          <span v-if="item.color" :style="{ color: item.color }">
            {{ item.title }}
          </span>
          <span v-else>
            {{ item.title }}
          </span>
        </template>
      </p>
      <p
        class="name"
        :title="item?.artist?.name"
        @click="jumpSingerDetail(item?.artist?.id)"
      >
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
import { albumDetail } from '@api/album-detail';
import { LoopType, ResponseType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { timeStampToDuration, handleMatchString } from '@utils/utils.ts';
import Page from '@components/page/Page.vue';

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

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    // 搜索关键词
    const searchText = computed<string>(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    watch(
      () => searchDetailText.value,
      () => {
        getSearchAlbum();
      }
    );

    const albumData = reactive<AlbumData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

    // 获取专辑列表
    function getSearchAlbum(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (albumData.offset - 1) * albumData.limit,
        limit: isLogin.value ? albumData.limit : 20,
        type: 10
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            const total = isLogin.value
              ? res?.result?.albumCount
              : res?.result?.albums.length;

            albumData.total = total;
            albumData.list = res?.result?.albums;

            emit('searchCountChange', total || 0);
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
      handleMatchString,
      userInfo,
      albumData,
      albumToPlayListPlay,
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
