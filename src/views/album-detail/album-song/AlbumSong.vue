<template>
  <div class="music-table-container">
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table class="play-list-table" v-if="!loading && songs?.length > 0">
      <thead>
        <tr>
          <th class="th first-th">
            <i class="icon"></i>
          </th>
          <th class="th two-th">
            <i class="icon"></i>
          </th>
          <th class="th three-th">
            <i class="icon"></i>
          </th>
          <th class="th four-th">
            <i class="icon"></i>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in songs"
          :key="index"
          :class="[
            { 'even-item': (index + 1) % 2 },
            { 'no-copyright': isCopyright(item.id) }
          ]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item?.id === playMusicId }"
                @click="playSingleMusic(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item?.id)">
                <span class="title" :title="item.name">{{ item?.name }}</span>
                <span class="no-click" v-if="item?.alia[0]">
                  - {{ item?.alia[0] }}
                </span>
              </span>
              <i
                class="icon-mv"
                v-if="item?.mv > 0"
                @click="jumpVideoDetail(item?.mv, item?.id)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text time">
                {{ timeStampToDuration(item?.dt / 1000) }}
              </span>
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
                <i
                  class="icon download"
                  title="下载"
                  @click="handleDownload"
                ></i>
              </div>
            </div>
          </td>
          <td class="tbody-td singer">
            <div class="hd">
              <div class="text" v-for="(i, ind) in item?.ar" :key="ind">
                <span
                  class="name"
                  :title="i?.name"
                  @click="jumpSingerDetail(i?.id)"
                >
                  {{ i?.name }}
                </span>
                <span class="line" v-if="ind !== item?.ar?.length - 1">/</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="no-data" v-if="!loading && songs.length === 0">
      <div class="title">
        <i class="icon"></i>
        <h3 class="text">暂无音乐！</h3>
      </div>
      <p class="desc">
        <span class="text">点击</span>
        <span class="icon"></span>
        <span class="text">即可将你喜欢的音乐收藏到“我的音乐”</span>
        <span class="text go">马上去</span>
        <router-link class="link" to="/">发现音乐</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { setMessage } from '@/components/message/useMessage';
import useMusicToPlayList from '@/common/useMusicToPlayList';
import usePlaySingleMusic from '@/common/usePlaySingleMusic';
import { timeStampToDuration } from '@utils/utils';
import type { SongType } from '@/common/audio';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    songs: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed(() => $store.getters.isLogin);
    const playMusicId = computed(() => $store.getters['music/playMusicId']);

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Partial<SongType>): void {
      useMusicToPlayList({ music: item });
    }

    // 播放单个歌曲
    function playSingleMusic(item: Partial<SongType>): boolean | undefined {
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
    function isCopyright(id?: number): boolean | undefined {
      const songItem = props.songs.find(
        item => (item as { id: number }).id === id
      );

      if ((songItem as Record<string, { cp: number }>)?.privilege?.cp === 0) {
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

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      $store.commit('jumpSingerDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number, songId: number): boolean | undefined {
      // 无版权
      if (isCopyright(songId)) {
        $store.commit('setCopyright', {
          visible: true,
          message: '由于版权保护，您所在的地区暂时无法使用。'
        });
        return false;
      }

      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('video/setVideo', { id, url: '' });
    }

    return {
      timeStampToDuration,
      playMusicId,
      singleMusicToPlayList,
      playSingleMusic,
      isCopyright,
      handleCollection,
      handleShare,
      handleDownload,
      jumpSongDetail,
      jumpSingerDetail,
      jumpVideoDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import url('./album-song.less');
</style>
