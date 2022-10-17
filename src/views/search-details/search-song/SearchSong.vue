<template>
  <div class="loading" v-if="songData?.loading">
    <i class="loading-icon"></i>
    加载中...
  </div>
  <ul class="search-song" v-if="!songData?.loading">
    <li
      class="item"
      v-for="(item, index) in songData?.list"
      :key="index"
      :class="[
        { 'even-item': index % 2 },
        { 'no-copyright': isCopyright(item.id) }
      ]"
    >
      <div
        class="td icon-play"
        :class="{ 'active-play': item.id === playMusicId }"
        @click="playSingleMusic(item)"
      ></div>
      <div class="td td1">
        <div class="text">
          <span
            class="name"
            :title="item?.name"
            @click="jumpSongDetail(item?.id)"
          >
            <span
              v-html="handleMatchString(item?.name, searchDetailText)"
            ></span>
          </span>
          <span class="desc" v-if="item?.tns?.length">
            - ({{ item?.tns[0] }})
          </span>
          <i
            class="icon-mv"
            v-if="item.mv > 0"
            @click="jumpVideoDetail(item?.mv, item?.id)"
          ></i>
        </div>
      </div>
      <div class="td td2">
        <div class="operate-btn">
          <i
            class="icon add"
            title="添加到播放列表"
            @click="singleMusicToPlayList(item)"
          ></i>
          <i
            class="icon collect"
            title="收藏"
            @click="handleCollection(item?.id)"
          ></i>
          <i class="icon share" title="分享" @click="handleShare"></i>
          <i class="icon download" title="下载" @click="handleDownload"></i>
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
          <span class="name" @click="jumpSingerDetail(item?.ar[0]?.id)">
            {{ item?.ar[0]?.name }}
          </span>
        </div>
      </div>
      <div class="td td4">
        <div class="text">
          <span
            class="name"
            :title="item?.al?.name"
            @click="jumpAlbumDetail(item?.al?.id)"
          >
            {{ item?.al?.name }}
          </span>
        </div>
      </div>
      <div class="td">{{ timeStampToDuration(item?.dt / 1000) }}</div>
    </li>
  </ul>
  <Page
    v-if="songData.total > songData.limit"
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
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { timeStampToDuration, handleMatchString } from '@utils/utils';
import { setMessage } from '@/components/message/useMessage';
import { searchKeywords } from '@api/search';
import type { SongType } from '@/common/audio';
import type { ResponseType } from '@/types/types';
import Page from '@components/page/Page.vue';

type SongData = {
  loading: boolean;
  offset: number;
  limit: number;
  total: number;
  list: Record<string, unknown>[];
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

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    const userInfo = computed(() => $store.getters.userInfo);
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );
    // 搜索关键词
    const searchText = computed<string>(() =>
      $store.getters.searchText.replace(/"/g, '')
    );

    const songData = reactive<SongData>({
      loading: true,
      offset: 1,
      limit: 30,
      total: 0,
      list: []
    });

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
        limit: isLogin.value ? songData.limit : 20,
        type: 1
      })
        .then((res: ResponseType) => {
          if (res?.code === 200) {
            const total = isLogin.value
              ? res?.result?.songCount
              : res?.result?.songs.length;

            songData.total = total;
            songData.list = res?.result?.songs;

            emit('searchCountChange', total || 0);
          }

          songData.loading = false;
        })
        .catch(() => ({}));
    }
    getSearchSong();

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Partial<SongType>): void {
      useMusicToPlayList({ music: item });
    }

    // 播放单个歌曲
    function playSingleMusic(item: { id: number }): boolean | undefined {
      // 无版权
      if (isCopyright(item.id)) {
        $store.commit('setCopyright', {
          visible: true,
          message: '由于版权保护，您所在的地区暂时无法使用。'
        });
        return false;
      }

      usePlaySingleMusic(item);
    }

    // 歌曲是否有版权
    function isCopyright(id: number): boolean | undefined {
      const songItem = songData.list.find(item => item.id === id);

      if ((songItem?.privilege as { cp: number })?.cp === 0) {
        return true;
      } else {
        return false;
      }
    }

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('collectPlayMusic', {
        visible: true,
        songIds: id
      });
    }

    // 分享
    function handleShare(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 下载
    function handleDownload(): void {
      setMessage({ type: 'error', title: '该功能暂未开发' });
    }

    // 分页
    function changPage(current: number): void {
      songData.offset = current;
      getSearchSong();
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number, songId: number): boolean | undefined {
      // 无版权
      if (isCopyright(songId)) {
        return false;
      }

      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('video/setVideo', { id, url: '' });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    return {
      timeStampToDuration,
      handleMatchString,
      playMusicId,
      userInfo,
      songData,
      singleMusicToPlayList,
      playSingleMusic,
      isCopyright,
      handleCollection,
      handleShare,
      handleDownload,
      changPage,
      jumpSongDetail,
      jumpVideoDetail,
      jumpSingerDetail,
      jumpAlbumDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./search-song.less');
</style>
