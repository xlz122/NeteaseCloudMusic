<template>
  <!-- loading -->
  <div class="loading" v-if="songData.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-song" v-if="!songData.loading">
    <li
      class="item"
      v-for="(item, index) in songData.list"
      :key="index"
      :class="{ 'even-item': index % 2 }"
    >
      <div
        class="td play-icon"
        :class="{ 'active-play': item.id === playMusicId }"
        @click="playListMusic(item)"
      ></div>
      <div class="td td1">
        <div class="text">
          <span
            class="name"
            :title="item?.name"
            @click="jumpSongDetail(item.id)"
          >
            {{ item?.name }}
          </span>
          <span class="desc" v-if="item?.tns?.length">
            - ({{ item.tns[0] }})
          </span>
          <i
            class="icon-mv"
            v-if="item.mv > 0"
            @click="jumpVideoDetail(item.mv)"
          ></i>
        </div>
      </div>
      <!-- 操作项 -->
      <div class="td td2">
        <div class="operate-btn">
          <i
            class="icon add"
            title="添加到播放列表"
            @click="setAddSinglePlayList(item)"
          ></i>
          <i
            class="icon collect"
            title="收藏"
            @click="collectMusic(item.id)"
          ></i>
          <i class="icon share" title="分享"></i>
          <i class="icon download" title="下载"></i>
          <!-- 用户自己才有删除按钮 -->
          <i
            class="icon delete"
            v-if="item?.ar[0]?.id === userInfo?.profile?.userId"
            title="删除"
            @click="deleteMusicShow(item.id)"
          ></i>
        </div>
      </div>
      <div class="td td3">
        <div class="text">
          <span
            class="name"
            :title="item?.ar[0]?.name"
            @click="jumpSingerDetail(item?.ar[0]?.id)"
          >
            {{ item?.ar[0]?.name }}
          </span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span class="name" :title="item?.al?.name">{{ item?.al?.name }}</span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item.dt / 1000) }}</div>
    </li>
  </ul>
  <Page
    v-if="songData.total"
    :page="songData.offset"
    :pageSize="songData.limit"
    :total="songData.total"
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
import { LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { ResponseType } from '@/types/types';

type SongData = {
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
    const $router = useRouter();
    const $store = useStore();

    const { searchDetailText } = toRefs(props);

    // 是否登录
    const isLogin = computed(() => $store.getters.isLogin);

    // 当前播放音乐id
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 用户信息
    const userInfo = computed(() => $store.getters.userInfo);

    // 搜索关键词
    const searchText = computed(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const songData = reactive<SongData>({
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
        getSearchSong();
      }
    );

    // 获取单曲列表
    function getSearchSong(): void {
      searchKeywords({
        keywords: searchDetailText.value || searchText.value,
        offset: (songData.offset - 1) * songData.limit,
        limit: songData.limit,
        type: 1
      })
        .then((res: ResponseType) => {
          if (res.code === 200) {
            songData.total = res?.result?.songCount;
            songData.list = res?.result?.songs;
            emit('searchCountChange', res?.result?.songCount);
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
          songData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSong();

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number): void {
      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('setVideo', { id, url: '' });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 单个音乐添加到播放列表
    function setAddSinglePlayList(item: Record<string, any>): void {
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

      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
    }

    // 播放列表音乐
    function playListMusic(item: Record<string, any>): void {
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

      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', musicItem.id);
      // 当前播放音乐数据
      $store.commit('music/setPlayMusicItem', musicItem);
      // 播放音乐数据
      $store.commit('music/setPlayMusicList', musicItem);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 收藏歌曲
    function collectMusic(id: number): boolean | undefined {
      // 未登录打开登录框
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 分页
    function changPage(current: number): void {
      songData.offset = current;
      getSearchSong();
    }

    return {
      timeStampToDuration,
      playMusicId,
      userInfo,
      songData,
      jumpSongDetail,
      jumpVideoDetail,
      jumpSingerDetail,
      setAddSinglePlayList,
      playListMusic,
      collectMusic,
      changPage
    };
  }
});
</script>

<style lang="less" scoped>
@import './search-song.less';
</style>
