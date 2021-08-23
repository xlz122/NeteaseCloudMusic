<template>
  <div class="play-list" v-if="playListShow">
    <!-- 头部部分 -->
    <div class="play-list-title">
      <h4 class="title">播放列表({{ playMusicList.length }})</h4>
      <div class="add-all">
        <i class="icon"></i>
        <span>收藏全部</span>
      </div>
      <span class="line"></span>
      <div class="clear-all" @click="emptyMusicList">
        <i class="icon"></i>
        <span>清除</span>
      </div>
      <div class="song-title">{{ playMusicItem?.name || '' }}</div>
      <i class="clear-icon" @click="closePlayList"></i>
    </div>
    <!-- 内容部分 -->
    <div class="play-list-content">
      <img
        class="play-list-content-bg"
        v-if="playMusicItem?.picUrl"
        :src="playMusicItem?.picUrl"
        alt=""
      />
      <div class="left-content">
        <ul class="list" v-if="playMusicList.length > 0">
          <li
            class="item"
            v-for="(item, index) in playMusicList"
            :key="index"
            :class="{ 'active-item': item.id === playMusicId }"
            @click="playlistItem(item.id, item)"
          >
            <i class="play-icon"></i>
            <span class="text song-title">{{ item.name }}</span>
            <div class="operate-btn">
              <i class="icon collect"></i>
              <i class="icon share"></i>
              <i class="icon download"></i>
              <i
                class="icon delete"
                @click="deleteMusicList(item.id, $event)"
              ></i>
            </div>
            <span class="text name" @click.stop>
              <span
                v-for="(i, ind) in item?.singerList"
                :key="ind"
                @click="jumpSingerDetail(i.id)"
              >
                <span class="name-text">{{ i.name }}</span>
                <span v-if="ind !== item.singerList.length - 1"> / </span>
              </span>
            </span>
            <span class="text time">
              {{ timeStampToDuration(item.time / 1000) }}
            </span>
            <i class="share"></i>
          </li>
        </ul>
        <!-- 列表空时展示 -->
        <div class="no-list-data" v-else>
          <div class="title">
            <i class="icon"></i>
            <span class="text">你还没有添加任何歌曲</span>
          </div>
          <p class="desc">
            <span>去首页</span>
            <router-link class="link" to="/">发现音乐</router-link>
            <span>，或在</span>
            <router-link class="link" to="/my-music">我的音乐</router-link>
            <span>收听自己收藏得歌单</span>
          </p>
        </div>
      </div>
      <i class="line" v-if="playMusicList.length === 0"></i>
      <div class="right-content">
        <lyric />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
// 歌词组件
import Lyric from '../lyric/Lyric.vue';
import { timeStampToDuration } from '@utils/utils';

export default defineComponent({
  components: {
    Lyric
  },
  props: {
    playListShow: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const $router = useRouter();
    const $store = useStore();

    // 播放列表数据
    const playMusicList = computed(() => $store.getters['music/playMusicList']);

    // 当前播放音乐id
    const playMusicId = computed<number>(
      () => $store.getters['music/playMusicId']
    );

    // 当前播放音乐数据
    const playMusicItem = computed<number>(
      () => $store.getters['music/playMusicItem']
    );

    // 清除列表
    function emptyMusicList(): void {
      $store.commit('music/emptyPlayMusicList');
    }

    // 列表项删除
    function deleteMusicList(id: number, event: MouseEvent): void {
      event.stopPropagation();
      $store.commit('music/deletePlayMusicList', id);
    }

    // 列表项点击
    function playlistItem(id: number, item: unknown): void {
      // 当前播放音乐id
      $store.commit('music/setPlayMusicId', id);
      // 播放音乐数据
      $store.commit('music/setPlayMusicItem', item);
      // 开始播放
      $store.commit('music/setMusicPlayStatus', {
        look: true,
        loading: true,
        refresh: true
      });
    }

    // 跳转歌手详情
    function jumpSingerDetail(id: number): void {
      // 取消二级导航选中
      $store.commit('setSubActiveIndex', -1);
      // 存储歌手id
      $store.commit('setSingerId', id);
      $router.push({ name: 'singer-detail', params: { singerId: id } });
      closePlayList();
    }

    // 关闭列表
    function closePlayList(): void {
      emit('closePlayList');
    }
    return {
      playMusicList,
      playMusicId,
      playMusicItem,
      timeStampToDuration,
      emptyMusicList,
      deleteMusicList,
      playlistItem,
      jumpSingerDetail,
      closePlayList
    };
  }
});
</script>

<style lang="less" scoped>
@import './play-list.less';
</style>
