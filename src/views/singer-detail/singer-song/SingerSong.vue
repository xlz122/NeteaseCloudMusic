<template>
  <div class="singer-song">
    <div class="operate-btn">
      <div
        class="play"
        :class="{
          'disable-play': singerSong?.hotSongs.length === 0
        }"
        title="播放"
        @click="playAllMusic"
      >
        <span class="icon-play">播放</span>
      </div>
      <div
        class="play-add"
        :class="{
          'disable-play-add': singerSong?.hotSongs.length === 0
        }"
        title="添加到播放列表"
        @click="allMusicToPlayList"
      ></div>
      <div class="other collection" @click="handleCollectAll">
        <span class="icon"> 收藏热门{{ singerSong?.hotSongs.length }} </span>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <i class="loading-icon"></i>
      加载中...
    </div>
    <table class="play-list-table" v-if="singerSong?.hotSongs.length > 0">
      <thead>
        <tr>
          <th class="th first-th"></th>
          <th class="th two-th"></th>
          <th class="th three-th"></th>
          <th class="th four-th"></th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr
          v-for="(item, index) in singerSong?.hotSongs"
          :key="index"
          :class="[{ 'even-tr': (index + 1) % 2 }]"
        >
          <td class="tbody-left">
            <div class="hd">
              <span class="text">{{ index + 1 }}</span>
              <i
                class="icon-play"
                :class="{ 'active-play': item.id === playMusicId }"
                @click="playSingleMusic(item)"
              ></i>
            </div>
          </td>
          <td class="tbody-td">
            <div class="hd">
              <span class="text" @click="jumpSongDetail(item?.id)">
                <span class="name" :title="`${item?.name}`">
                  {{ item?.name }}
                </span>
                <span class="no-click" v-if="item?.alia[0]">
                  - {{ item?.alia[0] }}
                </span>
              </span>
              <i
                class="icon-mv"
                v-if="item.mv > 0"
                @click="jumpVideoDetail(item?.mv)"
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
          <td class="tbody-td" @click="jumpAlbumDetail(item?.al?.id)">
            <div class="hd">
              <span class="text" :title="item?.al?.name">
                {{ item?.al?.name }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 音乐列表空时展示 -->
    <div class="no-list-data" v-if="singerSong?.hotSongs.length === 0">
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
import { defineComponent, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { artistSong } from '@api/singer-detail';
import { timeStampToDuration } from '@utils/utils.ts';
import { ResponseType, LoopType } from '@/types/types';
import { PlayMusicItem } from '@store/music/state';
import { throttle } from 'lodash';

export default defineComponent({
  setup() {
    const $router = useRouter();
    const $store = useStore();

    const isLogin = computed<boolean>(() => $store.getters.isLogin);
    // 当前播放音乐id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );
    // 歌手id
    const singerId = computed<number>(() => $store.getters.singerId);

    watch(
      () => singerId.value,
      curVal => {
        if (curVal) {
          getArtistSong();
        }
      }
    );

    const singerSong = ref();

    // 获取歌手歌曲数据
    const loading = ref<boolean>(true);
    function getArtistSong(): void {
      artistSong({ id: singerId.value })
        .then((res: ResponseType) => {
          loading.value = false;
          if (res?.code === 200) {
            singerSong.value = res;
          } else {
            $store.commit('setMessage', {
              type: 'error',
              title: res?.msg
            });
          }
        })
        .catch(() => ({}));
    }
    getArtistSong();

    // 播放全部- 默认播放列表第一项
    const playAllMusic = throttle(
      function () {
        if (singerSong.value?.hotSongs?.length === 0) {
          return false;
        }

        const item = singerSong.value?.hotSongs[0];

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
        // 开始播放
        $store.commit('music/setMusicPlayStatus', {
          look: true,
          refresh: true
        });

        // 添加播放列表
        singerSong.value?.hotSongs.forEach((item: LoopType) => {
          // 播放音乐数据
          $store.commit('music/setPlayMusicList', item);
        });
      },
      800,
      {
        leading: true, // 点击第一下是否执行
        trailing: false // 节流时间内，多次点击，节流结束后，是否执行一次
      }
    );

    // 全部音乐添加到播放列表
    function allMusicToPlayList(): boolean | undefined {
      if (singerSong.value?.hotSongs?.length === 0) {
        return false;
      }

      singerSong.value?.hotSongs?.forEach((item: LoopType) => {
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
      });
    }

    // 收藏全部
    function handleCollectAll(): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      let ids = '';
      singerSong.value?.hotSongs.forEach((item: LoopType) => {
        ids += `${item.id},`;
      });

      $store.commit('music/collectPlayMusic', {
        visible: true,
        songIds: ids
      });
    }

    // 播放单个歌曲
    function playSingleMusic(item: Record<string, any>): void {
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

    // 单个歌曲添加到播放列表
    function singleMusicToPlayList(item: Record<string, any>): void {
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

    // 收藏
    function handleCollection(id: number): boolean | undefined {
      if (!isLogin.value) {
        $store.commit('setLoginDialog', true);
        return false;
      }

      $store.commit('music/collectPlayMusic', {
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

      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 下载
    function handleDownload(): void {
      $store.commit('setMessage', {
        type: 'error',
        title: '该功能暂未开发'
      });
    }

    // 跳转歌曲详情
    function jumpSongDetail(id: number): void {
      $store.commit('jumpSongDetail', id);
    }

    // 跳转视频详情
    function jumpVideoDetail(id: number): void {
      $router.push({ name: 'mv-detail', params: { id } });
      $store.commit('setVideo', { id, url: '' });
    }

    // 跳转专辑详情
    function jumpAlbumDetail(id: number): void {
      $store.commit('jumpAlbumDetail', id);
    }

    return {
      timeStampToDuration,
      singerSong,
      playMusicId,
      loading,
      playAllMusic,
      allMusicToPlayList,
      handleCollectAll,
      playSingleMusic,
      singleMusicToPlayList,
      handleCollection,
      handleShare,
      handleDownload,
      jumpSongDetail,
      jumpVideoDetail,
      jumpAlbumDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './singer-song.less';
</style>
